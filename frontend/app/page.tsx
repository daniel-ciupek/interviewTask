import { AddMessageForm } from '@/components/messages/AddMessageForm';
import { MessagesTable } from '@/components/messages/MessagesTable';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-10 sm:px-8">

        <header className="mb-8 border-b border-border pb-6">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Wiadomości</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Zarządzaj wiadomościami w systemie.
          </p>
        </header>

        <div className="flex flex-col lg:flex-row gap-6 items-start">

          <aside className="w-full lg:w-80 lg:shrink-0">
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="text-sm font-medium text-foreground mb-1">Nowa wiadomość</h2>
              <p className="text-xs text-muted-foreground mb-4">Dodaj wiadomość do systemu.</p>
              <AddMessageForm />
            </div>
          </aside>

          <main className="flex-1 min-w-0">
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="px-6 py-4 border-b border-border">
                <h2 className="text-sm font-medium text-foreground">Lista wiadomości</h2>
              </div>
              <MessagesTable />
            </div>
          </main>

        </div>
      </div>
    </div>
  );
}
