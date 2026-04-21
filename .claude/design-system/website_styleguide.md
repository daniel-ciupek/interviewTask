Jesteś Ekspertem UI/UX oraz Frontend Developerem (React, Tailwind CSS, ShadCN UI).


### 🚫 OGRANICZENIA TECHNOLOGICZNE (obowiązkowe – z README.md):
1. Używasz WYŁĄCZNIE **ShadCN UI** i klas **Tailwind CSS**. Nie używasz żadnych innych bibliotek UI.
2. Jedyne dodatkowe pakiety dozwolone: `lucide-react` (bundled z ShadCN), `sonner` (toast, instalowany przez ShadCN), `@radix-ui/*` (peer deps ShadCN).
3. Projekt musi być w pełni **responsywny** – Mobile-First, działa zarówno na telefonach jak i desktopach.

---


Lista zmian do wprowadzenia
1. frontend/app/globals.css
Zastąp obecne zmienne CSS nowymi z sekcji „PALETA KOLORÓW" ze styleguide. Muszą istnieć dwa zestawy: :root (dark, domyślny) i .light (jasny). Zachowaj istniejące klasy @layer base dla body itp.
2. frontend/tailwind.config.ts
Upewnij się, że jest ustawione darkMode: 'class'.
3. frontend/app/layout.tsx

Dodaj inline <script> w <head> eliminujący FOUC (flash of unstyled content) – odczytuje localStorage.getItem('theme') i dodaje klasę do <html> zanim React się załaduje. Domyślna wartość: 'dark'.
Dodaj <Toaster richColors position="bottom-right" /> jeśli jeszcze nie ma.

4. frontend/components/ui/ThemeToggle.tsx (NOWY PLIK)
Stwórz komponent zgodnie z kodem z sekcji „PRZEŁĄCZNIK MOTYWU" w styleguide. Komponent:

Odczytuje motyw z localStorage przy montowaniu
Przełącza klasę dark/light na document.documentElement
Wyświetla ikonę Sun w dark mode i Moon w light mode
Ma płynną animację (transition-all duration-300)

5. frontend/app/page.tsx
Przepisz layout strony:

Header z tytułem „Wiadomości", podtytułem i <ThemeToggle /> wyrównanym do prawej
Split-view: lewy panel z formularzem (lg:w-80), prawy panel z tabelą (flex-1)
Na mobile: układ pionowy
Karty z klasami: rounded-xl border border-border bg-card
Hover na karcie formularza: hover:border-primary/30 transition-colors duration-300

6. frontend/components/messages/AddMessageForm.tsx
Zaktualizuj stylowanie:

Label: text-xs font-medium text-muted-foreground uppercase tracking-wide
Input z ring-primary na focus, czerwone obramowanie przy błędzie
Button w-full z dark-mode glow: dark:shadow-[0_0_12px_rgba(52,211,153,0.2)] dark:hover:shadow-[0_0_20px_rgba(52,211,153,0.35)]
Wszystkie stany (loading, error) zachowane

7. frontend/components/messages/MessagesTable.tsx
Zaktualizuj stylowanie tabeli:

Nagłówki: text-xs font-medium text-muted-foreground uppercase tracking-wider
Kolumna ID: font-mono text-xs text-muted-foreground
Hover wiersza: hover:bg-muted/50 transition-colors duration-150
Empty state: ikona MessageSquare w okrągłym bg-muted kontenerze + dwa teksty
Loading state: Loader2 animate-spin text-primary + tekst „Ładowanie..."
Zachowaj istniejącą logikę editMessage / deleteId i dialogi

8. frontend/components/messages/EditMessageDialog.tsx
Zaktualizuj stylowanie dialogu:

DialogContent używa bg-card border-border przez ShadCN (zmienne CSS – bez hardcode)
DialogTitle: font-semibold text-foreground
Przyciski: Cancel = variant="outline", Save = variant="default"
Zachowaj całą logikę formularza i walidacji

9. frontend/components/messages/DeleteConfirmDialog.tsx
Zaktualizuj stylowanie:

Używaj zmiennych ShadCN przez variant="destructive" na przycisku usuwania
Zachowaj całą logikę


Wymagania jakościowe

Żadnych nowych zależności – tylko ShadCN UI, Tailwind CSS, lucide-react, sonner, @radix-ui/*
Wszystkie klasy przez Tailwind – bez inline styles, bez CSS Modules
Każdy komponent musi poprawnie wyglądać w obu motywach – przetestuj mentalnie dark i light
Dark-mode specyficzne efekty (glow, shadow) przez prefix dark: w Tailwind
Pełna responsywność: mobile (< lg) i desktop (lg+)
Bez regrесji funkcjonalnych – RTK Query, walidacja, dialogi muszą działać bez zmian


Kolejność pracy

globals.css → zmienne CSS
tailwind.config.ts → darkMode: 'class'
ThemeToggle.tsx → nowy komponent
layout.tsx → script FOUC + ThemeToggle import
page.tsx → layout + header
AddMessageForm.tsx → style
MessagesTable.tsx → style + empty/loading state
EditMessageDialog.tsx → style
DeleteConfirmDialog.tsx → style

Po każdej zmianie upewnij się, że TypeScript nie zgłasza błędów typów w zmienionym pliku.

---

## PALETA KOLORÓW

### Dark mode (domyślny) – Cyberpunk Neon

```css
:root {
  --background: 160 15% 4%;
  --foreground: 160 20% 95%;
  --card: 160 12% 7%;
  --card-foreground: 160 20% 95%;
  --popover: 160 12% 7%;
  --popover-foreground: 160 20% 95%;
  --primary: 160 75% 51%;
  --primary-foreground: 160 15% 4%;
  --secondary: 160 10% 12%;
  --secondary-foreground: 160 20% 90%;
  --muted: 160 10% 12%;
  --muted-foreground: 160 8% 50%;
  --accent: 160 20% 15%;
  --accent-foreground: 160 20% 95%;
  --destructive: 0 72% 51%;
  --destructive-foreground: 0 0% 98%;
  --border: 160 15% 15%;
  --input: 160 15% 15%;
  --ring: 160 75% 51%;
  --radius: 0.5rem;
}
```

### Light mode

```css
.light {
  --background: 0 0% 98%;
  --foreground: 220 13% 10%;
  --card: 0 0% 100%;
  --card-foreground: 220 13% 10%;
  --popover: 0 0% 100%;
  --popover-foreground: 220 13% 10%;
  --primary: 160 75% 35%;
  --primary-foreground: 0 0% 98%;
  --secondary: 220 13% 93%;
  --secondary-foreground: 220 13% 20%;
  --muted: 220 13% 93%;
  --muted-foreground: 220 9% 45%;
  --accent: 160 30% 90%;
  --accent-foreground: 160 75% 25%;
  --destructive: 0 72% 51%;
  --destructive-foreground: 0 0% 98%;
  --border: 220 13% 88%;
  --input: 220 13% 88%;
  --ring: 160 75% 35%;
  --radius: 0.5rem;
}
```

---

## PRZEŁĄCZNIK MOTYWU

### frontend/components/ui/ThemeToggle.tsx

```tsx
"use client";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const saved = localStorage.getItem("theme") as "dark" | "light" | null;
    const initial = saved ?? "dark";
    setTheme(initial);
    document.documentElement.classList.toggle("light", initial === "light");
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.classList.toggle("light", next === "light");
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggle}
      className="transition-all duration-300"
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </Button>
  );
}
```

### FOUC prevention script (do layout.tsx w sekcji `<head>`):

```html
<script dangerouslySetInnerHTML={{ __html: `(function(){var t=localStorage.getItem('theme')||'dark';if(t==='light')document.documentElement.classList.add('light');})();` }} />
```

---

### ✅ WYMAGANIA FUNKCJONALNE (niezmienne z README.md):
1. Formularz dodawania wiadomości z walidacją (pole wymagane, min 1 znak po trimie).
2. Tabela z kolumnami: **ID**, **Wiadomość**, **Akcje**.
3. Akcja "Edytuj" otwiera `Dialog` z ShadCN.
4. Akcja "Usuń" wymaga potwierdzenia przez `AlertDialog` z ShadCN.
5. Cała komunikacja frontend ↔ backend przez **RTK Query**.
6. Wszystkie komponenty z **ShadCN UI**.
