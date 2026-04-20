import { AddMessageForm } from '@/components/messages/AddMessageForm';
import { MessagesTable } from '@/components/messages/MessagesTable';

export default function Home() {
  return (
    <main className="container mx-auto py-10 px-4 flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Wiadomości</h1>
        <p className="text-muted-foreground">Zarządzaj wiadomościami w systemie.</p>
      </div>
      <AddMessageForm />
      <MessagesTable />
    </main>
  );
}
