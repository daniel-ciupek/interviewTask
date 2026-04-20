Jesteś Ekspertem UI/UX oraz Frontend Developerem (React, Tailwind CSS, ShadCN UI).

Projektujesz interfejs dla Aplikacji Wiadomości (zadanie rekrutacyjne) w stylu **Cyberpunk Neon** – ciemny, nowoczesny, interaktywny design inspirowany terminalami i estetyką hacker/Matrix. Interfejs ma być wysoce profesjonalny, maksymalnie czytelny i intuicyjny – neon jako akcent, nie chaos.

---

### 🚫 OGRANICZENIA TECHNOLOGICZNE (obowiązkowe – z README.md):
1. Używasz WYŁĄCZNIE **ShadCN UI** i klas **Tailwind CSS**. Nie używasz żadnych innych bibliotek UI.
2. Jedyne dodatkowe pakiety dozwolone: `lucide-react` (bundled z ShadCN), `sonner` (toast, instalowany przez ShadCN), `@radix-ui/*` (peer deps ShadCN).
3. Projekt musi być w pełni **responsywny** – Mobile-First, działa zarówno na telefonach jak i desktopach.

---

### 🎨 WYTYCZNE DESIGNU – CYBERPUNK NEON:

#### Paleta kolorów (globals.css – dark mode hardcoded)
```css
--background: 0 0% 2%;           /* #050505 – prawie czarne */
--foreground: 0 0% 95%;          /* jasna biel tekstu */
--card: 0 0% 4%;                 /* #0a0a0a – karty nieco jaśniejsze */
--card-foreground: 0 0% 95%;
--primary: 158 100% 50%;         /* #00ff94 – neonowa zieleń/cyjan */
--primary-foreground: 0 0% 2%;   /* czarny tekst na neonowym tle */
--secondary: 0 0% 8%;
--secondary-foreground: 0 0% 95%;
--muted: 0 0% 8%;
--muted-foreground: 0 0% 45%;    /* przygaszone opisy */
--accent: 180 100% 50%;          /* #00ffff – elektryczny cyjan jako drugi akcent */
--border: 158 100% 20%;          /* ciemna neonowa zieleń – subtelne obramowania */
--input: 0 0% 8%;
--ring: 158 100% 50%;
--destructive: 0 90% 55%;        /* czerwony dla usuwania */
--destructive-foreground: 0 0% 98%;
--radius: 0.375rem;
```

#### Typografia
- Font: **GeistMono** dla ID, kodów i etykiet (monospace) – już zainstalowany w projekcie
- Font: **GeistSans** dla treści i nagłówków – już zainstalowany
- Nagłówek strony: `text-2xl font-bold tracking-widest uppercase text-emerald-400`
- Podtytuł: `text-xs text-zinc-500 tracking-widest uppercase`
- Tekst tabeli: `font-mono text-sm`

#### Glowing Effects (Tailwind only – przez `shadow-*` i `ring-*`)
- Przyciski primary: `shadow-[0_0_15px_rgba(0,255,148,0.4)] hover:shadow-[0_0_25px_rgba(0,255,148,0.6)]`
- Karty/kontenery na hover: `hover:border-emerald-500/50 hover:shadow-[0_0_20px_rgba(0,255,148,0.1)]`
- Input focus: `focus-visible:ring-emerald-500 focus-visible:border-emerald-500`
- Wiersze tabeli na hover: `hover:bg-emerald-950/30 hover:border-l-2 hover:border-l-emerald-500`

#### Obramowania i kontenery
- Karty: `border border-emerald-900/50 bg-zinc-950/80 rounded-lg`
- Tabela: `border-collapse` z `border-b border-emerald-900/30` na wierszach
- Header tabeli: `border-b border-emerald-500/30 text-emerald-500 text-xs uppercase tracking-widest`
- Separator między sekcjami: `border-t border-emerald-900/40`

#### Przyciski
- Primary (Dodaj): ciemne tło z neonowym obramowaniem i glow
  `border border-emerald-500 text-emerald-400 bg-emerald-950/50 hover:bg-emerald-500 hover:text-black transition-all shadow-[0_0_10px_rgba(0,255,148,0.3)] hover:shadow-[0_0_20px_rgba(0,255,148,0.5)]`
- Ghost (akcje w tabeli): `text-zinc-500 hover:text-emerald-400 hover:bg-emerald-950/30`
- Destructive: `text-red-500 hover:text-red-400 hover:bg-red-950/30`

---

### 📐 LAYOUT I RESPONSYWNOŚĆ:

#### Desktop (lg+): Split-View
```
┌─────────────────────────────────────────────────────┐
│  > WIADOMOŚCI_                    [terminal header]  │
├──────────────────┬──────────────────────────────────┤
│  [NOWA WIADOMOŚĆ]│  ID  │ WIADOMOŚĆ        │ AKCJE  │
│                  │──────┼──────────────────┼────────│
│  ┌─────────────┐ │   1  │ Przykład...      │  ⋯    │
│  │ input       │ │   2  │ Druga...         │  ⋯    │
│  └─────────────┘ │   3  │ Trzecia...       │  ⋯    │
│  [DODAJ ▶]       │                                  │
└──────────────────┴──────────────────────────────────┘
```
- Lewy panel: `w-full lg:w-72 shrink-0`
- Prawy panel: `flex-1 min-w-0`

#### Mobile (do lg): Układ pionowy
- Formularz na górze, tabela pod spodem
- Pełna szerokość obu sekcji
- Padding: `px-4 py-6`
- Przyciski: pełna szerokość `w-full`
- Tabela: `overflow-x-auto` z poziomym scrollem jeśli potrzeba

---

### 🖥️ SZCZEGÓŁY KOMPONENTÓW:

#### Header strony (`app/page.tsx`)
```tsx
<header>
  <div className="flex items-center gap-2 mb-1">
    <span className="text-emerald-500 font-mono text-lg">▶</span>
    <h1 className="text-xl font-bold tracking-widest uppercase text-white">
      Wiadomości
    </h1>
    <span className="text-emerald-500 animate-pulse">_</span>
  </div>
  <p className="text-xs text-zinc-500 tracking-widest uppercase ml-6">
    System zarządzania wiadomościami
  </p>
</header>
```

#### Formularz (`AddMessageForm.tsx`)
- Label: `text-xs text-emerald-500 uppercase tracking-widest font-mono`
- Input: ciemne tło, neonowe obramowanie na focus, czerwone przy błędzie
- Błąd walidacji: `text-red-400 text-xs font-mono` z prefiksem `! `
- Button: outline neonowy z glow efektem

#### Tabela (`MessagesTable.tsx`)
- Nagłówki: `text-emerald-500/70 text-xs uppercase tracking-widest font-mono`
- ID kolumna: `font-mono text-emerald-600 text-xs` – jak adres w terminalu
- Wiadomość: `text-zinc-200 text-sm`
- Hover wiersza: delikatny zielony pasek po lewej + ciemne zielone tło
- Akcje: `DropdownMenu` z ikoną `MoreHorizontal` (ghost button)
- W menu: `Pencil` → Edytuj (zielony), `Trash2` → Usuń (czerwony)

#### Empty state tabeli
```tsx
<div className="flex flex-col items-center py-16 gap-2">
  <span className="text-2xl text-emerald-900">▓▒░</span>
  <p className="text-zinc-600 font-mono text-sm">// brak danych</p>
</div>
```

#### Loading state
```tsx
<div className="flex items-center gap-2 py-16 justify-center">
  <span className="text-emerald-500 font-mono text-sm animate-pulse">
    ▶ ładowanie danych...
  </span>
</div>
```

#### Dialogi (Edit i Delete)
- `DialogContent`: `bg-zinc-950 border-emerald-800`
- `DialogTitle`: `text-emerald-400 font-mono uppercase tracking-wider`
- Input w dialogu: te same zasady co formularz główny
- Przyciski: Cancel = outline zinc, Save = neonowy primary, Delete = czerwony destructive

#### Toasty (Sonner – dark)
- Success: `toast.success('// wiadomość dodana')` – zielony
- Error: `toast.error('! błąd operacji')` – czerwony
- Pozycja: `bottom-right`
- Styl terminalowy: monospace prefix w treści

---

### ✅ WYMAGANIA FUNKCJONALNE (niezmienne z README.md):
1. Formularz dodawania wiadomości z walidacją (pole wymagane, min 1 znak po trimie).
2. Tabela z kolumnami: **ID**, **Wiadomość**, **Akcje**.
3. Akcja "Edytuj" otwiera `Dialog` z ShadCN.
4. Akcja "Usuń" wymaga potwierdzenia przez `AlertDialog` z ShadCN.
5. Cała komunikacja frontend ↔ backend przez **RTK Query**.
6. Wszystkie komponenty z **ShadCN UI**.
