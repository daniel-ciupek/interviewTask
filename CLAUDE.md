# CLAUDE.md – Plan implementacji zadania rekrutacyjnego

## Kontekst projektu

Aplikacja składa się z:
- **Backend**: Express.js + Sequelize + MySQL (ESM modules, port 8080)
- **Frontend**: Next.js 14 + TypeScript + Tailwind (port 3000)
- **DB**: MySQL 8.0 w Docker, baza `interview`, user `root`, hasło `interview123`
- **phpMyAdmin**: port 8081

Całość uruchamiana przez `docker compose up`.

---

## Zasady commitów

- Commity nie mogą zawierać żadnych wzmianek o Claude ani Anthropic (brak `Co-Authored-By` lub podobnych linii)
- Każdy commit musi wyglądać jak zwykły commit dewelopera

---

## ZASADY BEZWZGLĘDNE (z README.md)

1. **Nigdy nie używaj `sequelize.sync()`** – tylko migracje sequelize-cli
2. **RTK Query** – jedyna metoda komunikacji frontend ↔ backend
3. **ShadCN UI** – wszystkie komponenty UI
4. **Seeder** – minimum 3 przykładowe wiadomości, uruchamiane przez `npx sequelize-cli db:seed:all`
5. **`docker compose up`** – musi automatycznie uruchomić migracje

---

## Plan działania krok po kroku

### FAZA 1 – Backend: migracje i model

**Cel**: Zastąpić brakujące `sequelize.sync()` poprawną migracją.

- [ ] Zainstalować `sequelize-cli` jako devDependency w backendzie
- [ ] Dodać `.sequelizerc` wskazujący ścieżki config/models/migrations/seeders
- [ ] Stworzyć `config/config.json` dla sequelize-cli z danymi połączenia (czyta z ENV)
- [ ] Stworzyć migrację tworzącą tabelę `messages` (kolumny: `id`, `message` STRING NOT NULL, `createdAt`, `updatedAt`)
- [ ] Stworzyć model `Message` zgodny z migracją
- [ ] Stworzyć seeder z min. 3 wiadomościami

**Uwaga do `database.js`**: Obecny kod w `app.js` wywołuje `sequelize.then()` na instancji Sequelize (nie na Promise) – to błąd. Naprawić przez export funkcji `connectDB()` zwracającej `sequelize.authenticate()`.

### FAZA 2 – Backend: API routes (CRUD)

**Cel**: Endpointy REST dla wiadomości.

- [ ] `GET    /api/messages`     – pobierz wszystkie wiadomości
- [ ] `POST   /api/messages`     – dodaj wiadomość (walidacja: message nie może być pusty)
- [ ] `PUT    /api/messages/:id` – edytuj wiadomość (walidacja: message nie może być pusty)
- [ ] `DELETE /api/messages/:id` – usuń wiadomość

Struktura plików:
```
backend/
  models/
    message.js
  migrations/
    YYYYMMDDHHMMSS-create-messages.js
  seeders/
    YYYYMMDDHHMMSS-demo-messages.js
  routes/
    messages.js
  config/
    config.js       ← czyta z process.env dla Docker
  .sequelizerc
```

### FAZA 3 – Docker: automatyczne migracje

**Cel**: `docker compose up` musi automatycznie uruchomić migracje.

- [ ] Dodać `wait-for-it.sh` lub healthcheck na DB w docker-compose.yml
- [ ] Zmienić `CMD` w backendowym Dockerfile na skrypt startowy:
  ```bash
  npx sequelize-cli db:migrate && node app.js
  ```
- [ ] Dodać `healthcheck` dla serwisu `db` w `docker-compose.yml`
- [ ] Dodać `depends_on.db.condition: service_healthy` w serwisie `backend`
- [ ] Poprawić backend Dockerfile z `node:16` na `node:18` (wymóg Node.js v18.17.0+)

### FAZA 4 – Frontend: konfiguracja Redux + RTK Query

**Cel**: Skonfigurować store i API slice.

- [ ] Zainstalować: `@reduxjs/toolkit react-redux`
- [ ] Stworzyć `store/store.ts` z configureStore
- [ ] Stworzyć `store/messagesApi.ts` – RTK Query API slice z endpointami:
  - `getMessages` (GET /api/messages)
  - `addMessage` (POST /api/messages)
  - `updateMessage` (PUT /api/messages/:id)
  - `deleteMessage` (DELETE /api/messages/:id)
- [ ] Owinąć aplikację `<Provider store={store}>` w `app/layout.tsx`
- [ ] Dodać `NEXT_PUBLIC_API_URL` do konfiguracji (adres backendu)

### FAZA 5 – Frontend: ShadCN UI setup

**Cel**: Zainstalować i skonfigurować ShadCN.

- [ ] `npx shadcn-ui@latest init` (New York style, domyślne kolory)
- [ ] Zainstalować komponenty ShadCN potrzebne do zadania:
  - `button`, `input`, `form`, `table`, `dialog`, `alert-dialog`, `label`, `toast`

### FAZA 6 – Frontend: komponenty

**Cel**: Zbudować UI zgodnie z wymaganiami.

Struktura:
```
frontend/
  app/
    page.tsx              ← główna strona z tabelą i formularzem
  components/
    messages/
      MessagesTable.tsx   ← tabela: ID | Wiadomość | Akcje
      AddMessageForm.tsx  ← formularz z walidacją
      EditMessageDialog.tsx ← popup/dialog do edycji
      DeleteConfirmDialog.tsx ← dialog potwierdzenia usunięcia
  store/
    store.ts
    messagesApi.ts
  lib/
    utils.ts              ← shadcn utils (auto-generowany)
```

**Tabela** (`MessagesTable.tsx`):
- Kolumny: ID | Wiadomość | Akcje
- Akcje: przycisk Edytuj (otwiera `EditMessageDialog`) + przycisk Usuń (otwiera `DeleteConfirmDialog`)
- Dane pobierane przez RTK Query hook `useGetMessagesQuery()`

**Formularz** (`AddMessageForm.tsx`):
- Pole tekstowe dla treści wiadomości
- Walidacja: pole wymagane, min. 1 znak
- Przycisk "Dodaj wiadomość"
- Używa `useAddMessageMutation()`

**Dialog edycji** (`EditMessageDialog.tsx`):
- Otwiera się po kliknięciu "Edytuj"
- Formularz z aktualną treścią wiadomości
- Walidacja analogiczna do formularza dodawania
- Używa `useUpdateMessageMutation()`

**Dialog usunięcia** (`DeleteConfirmDialog.tsx`):
- Alert Dialog z potwierdzeniem
- Używa `useDeleteMessageMutation()`

---

## Kolejność implementacji (zależności)

```
1. Backend: .sequelizerc + config + migracja + seeder + model
2. Backend: naprawić database.js + app.js
3. Backend: routes/messages.js + podpięcie w app.js
4. Docker: healthcheck + Dockerfile CMD z migracją
5. Frontend: zainstalować RTK Query + ShadCN
6. Frontend: store + messagesApi.ts
7. Frontend: komponenty UI
8. Frontend: layout.tsx z Provider
9. Test: docker compose up + weryfikacja całości
```

---

## Automatyczne uruchamianie agentów

Przy pracy nad zadaniem uruchamiaj agentów z `.claude/agents/` gdy zaczynasz daną fazę. Każdy agent zawiera gotowe wzorce kodu i szczegółowe instrukcje.

| Faza | Agent do uruchomienia | Kiedy |
|------|-----------------------|-------|
| 1–2  | `backend-agent`       | Przed implementacją migracji, modelu, seedera, routes |
| 3    | `docker-agent`        | Przed zmianami w docker-compose.yml i Dockerfile |
| 4–6  | `frontend-agent`      | Przed instalacją RTK Query, ShadCN i budowaniem komponentów |

Agenci są uruchamiani przez narzędzie `Agent` z parametrem `subagent_type: general-purpose` i promptem wskazującym na plik agenta. Uruchamiaj agentów **równolegle** gdy fazy są niezależne (np. backend i Docker jednocześnie), **sekwencyjnie** gdy frontend zależy od działającego API.

Przykład uruchomienia agentów backend + docker równolegle (fazy 1–3):
```
Agent(backend-agent) || Agent(docker-agent)
→ dopiero potem:
Agent(frontend-agent)
```

---

## Weryfikacja przed oddaniem

- [ ] `docker compose up` – kontenery startują, migracje lecą automatycznie
- [ ] Brak `sequelize.sync()` w kodzie (`grep -r "sequelize.sync" backend/`)
- [ ] Seeder działa: `npx sequelize-cli db:seed:all`
- [ ] Formularz dodaje wiadomości do DB
- [ ] Edycja przez popup działa
- [ ] Usuwanie z potwierdzeniem działa
- [ ] Frontend używa wyłącznie RTK Query do komunikacji
- [ ] UI zbudowane z komponentów ShadCN
- [ ] Branch `dev` + Pull Request `dev → main`
- [ ] `@BiznesportTech` jako reviewer
