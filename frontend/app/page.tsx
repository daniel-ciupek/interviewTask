import { AddMessageForm } from '@/components/messages/AddMessageForm';
import { MessagesTable } from '@/components/messages/MessagesTable';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { CursorGlow } from '@/components/ui/CursorGlow';

export default function Home() {
  return (
    <div className="relative min-h-screen bg-background overflow-x-hidden">

      {/* Cursor glow */}
      <CursorGlow />

      {/* Dot grid background */}
      <div className="bg-dot-grid pointer-events-none absolute inset-0 z-0" aria-hidden />

      {/* Radial vignette */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, transparent 40%, hsl(var(--background)) 100%)' }}
        aria-hidden
      />

      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 py-6 sm:px-6 sm:py-10">

        {/* Header */}
        <header className="mb-6 sm:mb-10 flex justify-between items-start gap-3">
          <div className="min-w-0 animate-float-in">
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-block h-2 w-2 shrink-0 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-mono text-primary uppercase tracking-widest truncate">System online</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-primary via-emerald-300 to-teal-400 bg-clip-text text-transparent text-neon-glow">
              Wiadomości
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Zarządzaj wiadomościami w systemie.
            </p>
          </div>
          <div className="shrink-0 animate-float-in" style={{ animationDelay: '100ms' }}>
            <ThemeToggle />
          </div>
        </header>

        {/* Split-view */}
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 items-start">

          {/* Form panel */}
          <aside
            className="w-full lg:w-80 lg:shrink-0 animate-float-in"
            style={{ animationDelay: '150ms' }}
          >
            <div className="rounded-xl border border-border bg-card p-4 sm:p-6
              dark:animate-border-flow
              dark:hover:shadow-[0_0_30px_rgba(52,211,153,0.12)]
              hover:border-primary/40
              transition-all duration-500">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <h2 className="text-xs font-semibold text-foreground uppercase tracking-widest">Nowa wiadomość</h2>
              </div>
              <p className="text-xs text-muted-foreground mb-4 sm:mb-5">
                Dodaj wiadomość do systemu.
              </p>
              <AddMessageForm />
            </div>
          </aside>

          {/* Table panel */}
          <main
            className="w-full min-w-0 flex-1 animate-float-in"
            style={{ animationDelay: '200ms' }}
          >
            <div className="rounded-xl border border-border bg-card overflow-hidden
              dark:hover:shadow-[0_0_30px_rgba(52,211,153,0.08)]
              hover:border-primary/20
              transition-all duration-500">
              <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-border flex items-center gap-2">
                <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <h2 className="text-xs font-semibold text-foreground uppercase tracking-widest">Lista wiadomości</h2>
              </div>
              <MessagesTable />
            </div>
          </main>

        </div>
      </div>
    </div>
  );
}
