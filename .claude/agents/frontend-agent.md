---
name: frontend-agent
description: Agent wyspecjalizowany w implementacji frontendu Next.js 14 + RTK Query + ShadCN UI. Tworzy formularz, tabelę wiadomości i dialogi CRUD.
---

# Frontend Agent – Zakres działania

## Technologie
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- @reduxjs/toolkit + react-redux (RTK Query)
- ShadCN UI

## Zasady bezwzględne
- **Tylko RTK Query** do komunikacji z backendem – żadnych bezpośrednich `fetch`/`axios`
- **Tylko ShadCN UI** dla komponentów interfejsu
- Formularz MUSI mieć walidację po stronie klienta

## Instalacja zależności

```bash
# W katalogu frontend/
npm install @reduxjs/toolkit react-redux

# ShadCN init (New York style)
npx shadcn-ui@latest init

# Komponenty ShadCN
npx shadcn-ui@latest add button input form table dialog alert-dialog label toast
```

## Struktura plików

```
frontend/
  app/
    layout.tsx          ← dodać ReduxProvider
    page.tsx            ← główna strona
    providers.tsx       ← 'use client' wrapper dla Provider
  components/
    messages/
      MessagesTable.tsx
      AddMessageForm.tsx
      EditMessageDialog.tsx
      DeleteConfirmDialog.tsx
  store/
    store.ts
    messagesApi.ts
  lib/
    utils.ts            ← auto-generowany przez ShadCN
```

## Store i RTK Query

### store/messagesApi.ts
```typescript
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Message {
  id: number;
  message: string;
  createdAt: string;
  updatedAt: string;
}

export const messagesApi = createApi({
  reducerPath: 'messagesApi',
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_URL }),
  tagTypes: ['Messages'],
  endpoints: (builder) => ({
    getMessages: builder.query<Message[], void>({
      query: () => '/api/messages',
      providesTags: ['Messages'],
    }),
    addMessage: builder.mutation<Message, { message: string }>({
      query: (body) => ({ url: '/api/messages', method: 'POST', body }),
      invalidatesTags: ['Messages'],
    }),
    updateMessage: builder.mutation<Message, { id: number; message: string }>({
      query: ({ id, ...body }) => ({ url: `/api/messages/${id}`, method: 'PUT', body }),
      invalidatesTags: ['Messages'],
    }),
    deleteMessage: builder.mutation<void, number>({
      query: (id) => ({ url: `/api/messages/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Messages'],
    }),
  }),
});

export const {
  useGetMessagesQuery,
  useAddMessageMutation,
  useUpdateMessageMutation,
  useDeleteMessageMutation,
} = messagesApi;
```

### store/store.ts
```typescript
import { configureStore } from '@reduxjs/toolkit';
import { messagesApi } from './messagesApi';

export const store = configureStore({
  reducer: {
    [messagesApi.reducerPath]: messagesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(messagesApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

## Komponenty UI

### MessagesTable.tsx
- `useGetMessagesQuery()` – pobieranie danych
- Tabela ShadCN z kolumnami: ID | Wiadomość | Akcje
- Akcje: `<Button variant="outline">Edytuj</Button>` + `<Button variant="destructive">Usuń</Button>`
- Stan loading i błędu obsługiwany

### AddMessageForm.tsx
- Kontrolowany input ShadCN `<Input>`
- Walidacja: pole wymagane, min 1 znak (trim)
- `useAddMessageMutation()` – wysyłanie
- Po sukcesie: wyczyść pole
- Błędy walidacji wyświetlone inline

### EditMessageDialog.tsx
- Przyjmuje props: `message: Message`, `open: boolean`, `onOpenChange`
- ShadCN `<Dialog>` z formularzem wewnątrz
- `useUpdateMessageMutation()` – zapis
- Po sukcesie: zamknij dialog

### DeleteConfirmDialog.tsx
- Przyjmuje props: `messageId: number`, `open: boolean`, `onOpenChange`
- ShadCN `<AlertDialog>` z pytaniem o potwierdzenie
- `useDeleteMessageMutation()` – usunięcie
- Po sukcesie: zamknij dialog

## Providers – layout.tsx

```typescript
// app/providers.tsx ('use client')
'use client';
import { Provider } from 'react-redux';
import { store } from '@/store/store';

export function Providers({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}
```

```typescript
// app/layout.tsx
import { Providers } from './providers';
// ...
export default function RootLayout({ children }) {
  return (
    <html lang="pl">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

## Zmienne środowiskowe

W `frontend/` dodaj `.env.local` (lokalnie) i skonfiguruj w docker-compose:
```
NEXT_PUBLIC_API_URL=http://backend_api:8080
```

W `docker-compose.yml` dla serwisu `frontend`:
```yaml
environment:
  - NEXT_PUBLIC_API_URL=http://localhost:8080
```

**Uwaga**: W Next.js zmienne `NEXT_PUBLIC_*` są wbudowywane w czasie budowania (build time), więc adres musi być dostępny z przeglądarki użytkownika, nie z kontenera. Użyj `http://localhost:8080` jeśli backend jest na porcie 8080 hosta.
