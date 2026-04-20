---
name: frontend-agent
description: Agent wyspecjalizowany w implementacji frontendu Next.js 14 + RTK Query + ShadCN UI. Tworzy formularz, tabelę wiadomości i dialogi CRUD w stylu Premium Enterprise Dark Mode.
---

# Frontend Agent – Zakres działania

## Technologie
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- @reduxjs/toolkit + react-redux (RTK Query)
- ShadCN UI (komponenty Radix UI, NIE base-ui)
- lucide-react (bundled z ShadCN)
- sonner (toast notifications, instalowany przez ShadCN)

## Zasady bezwzględne
- **Tylko RTK Query** do komunikacji z backendem – żadnych bezpośrednich `fetch`/`axios`
- **Tylko ShadCN UI** dla komponentów interfejsu
- Formularz MUSI mieć walidację po stronie klienta
- **Dark Mode zawsze włączony** – klasa `dark` na `<html>` w layout.tsx

## Design – Premium Enterprise Dark Mode (styl Vercel/Linear)

### Paleta kolorów (globals.css – zawsze dark mode)
- Tło strony: `--background: 240 10% 3.9%` (zinc-950)
- Karty: `--card: 240 10% 5.5%`
- Akcent (primary): `--primary: 217 91% 60%` (elektryczny błękit)
- Obramowania: `--border: 240 5% 13%`
- Tekst pomocniczy: `--muted-foreground: 240 5% 55%`

### Layout (Split-View)
- Desktop: panel formularza po lewej (`w-80`) + tabela po prawej (flex-1)
- Mobile: układ pionowy (stacked)
- Max-width kontenera: `max-w-6xl`

### Akcje w tabeli
- **NIE używaj** dużych przycisków "Edytuj/Usuń" – tworzą szum wizualny
- Zamiast tego: `DropdownMenu` z ikoną `MoreHorizontal` (trzy kropki)
- W menu: `Pencil` icon → Edytuj, `Trash2` icon (czerwony) → Usuń
- Przyciski ghost z `h-8 w-8`

### Powiadomienia (Toasty)
- `sonner` z `toast.success()` / `toast.error()`
- Pozycja: `bottom-right`, tryb `dark`
- Każda operacja CRUD musi wywoływać toast

## Instalacja zależności

```bash
cd frontend/
npm install @reduxjs/toolkit react-redux
npm install @radix-ui/react-dropdown-menu sonner

# ShadCN init
npx shadcn@latest init -d
```

### Ważne: ShadCN może zainstalować komponenty dla Tailwind v4 (base-ui)
Projekt używa **Tailwind v3** – po `npx shadcn@latest add` sprawdź czy plik nie importuje `@base-ui/react`.
Jeśli tak, zastąp ręcznie wersją Radix UI (jak w dropdown-menu.tsx i sonner.tsx).

### Komponenty ShadCN do zainstalowania
```bash
npx shadcn@latest add button input table dialog alert-dialog label card
# dropdown-menu i sonner instalować RĘCZNIE (patrz wyżej – problem z base-ui)
```

## Struktura plików

```
frontend/
  app/
    globals.css         ← ciemna paleta CSS vars (dark mode hardcoded)
    layout.tsx          ← <html class="dark">, ReduxProvider, <Toaster>
    page.tsx            ← Split-View: aside (formularz) + main (tabela)
    providers.tsx       ← 'use client' wrapper dla Provider
  components/
    messages/
      MessagesTable.tsx     ← tabela z DropdownMenu akcjami
      AddMessageForm.tsx    ← formularz z walidacją i toast
      EditMessageDialog.tsx ← Dialog ShadCN + toast
      DeleteConfirmDialog.tsx ← AlertDialog ShadCN
    ui/
      dropdown-menu.tsx ← Radix UI (NIE base-ui)
      sonner.tsx        ← theme="dark", bez next-themes
      ...pozostałe ShadCN
  store/
    store.ts
    messagesApi.ts
  lib/
    utils.ts
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
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
  }),
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

## layout.tsx – dark mode + Toaster

```typescript
import { Providers } from './providers';
import { Toaster } from '@/components/ui/sonner';

export default function RootLayout({ children }) {
  return (
    <html lang="pl" className="dark">
      <body>
        <Providers>{children}</Providers>
        <Toaster richColors position="bottom-right" />
      </body>
    </html>
  );
}
```

## sonner.tsx – bez next-themes

```typescript
"use client"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => (
  <Sonner
    theme="dark"
    className="toaster group"
    toastOptions={{
      classNames: {
        toast: "group-[.toaster]:bg-zinc-900 group-[.toaster]:text-zinc-100 group-[.toaster]:border-zinc-800",
        description: "group-[.toast]:text-zinc-400",
      },
    }}
    {...props}
  />
)
export { Toaster }
```

## Zmienne środowiskowe

`NEXT_PUBLIC_API_URL` musi być przekazany jako **build ARG** w Dockerfile (nie tylko environment):

```dockerfile
# frontend/Dockerfile
ARG NEXT_PUBLIC_API_URL=http://localhost:8080
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
RUN npm run build
```

```yaml
# docker-compose.yml
frontend:
  build:
    args:
      NEXT_PUBLIC_API_URL: http://localhost:8080
```
