import { AddMessageForm } from '@/components/messages/AddMessageForm';
import { MessagesTable } from '@/components/messages/MessagesTable';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="min-h-screen bg-muted/40">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 sm:py-12 flex flex-col gap-6">

        <div className="flex flex-col gap-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Wiadomości</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Zarządzaj wiadomościami w systemie.
          </p>
        </div>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Dodaj wiadomość</CardTitle>
            <CardDescription>Wpisz treść wiadomości i kliknij Dodaj.</CardDescription>
          </CardHeader>
          <CardContent>
            <AddMessageForm />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Lista wiadomości</CardTitle>
            <CardDescription>Wszystkie wiadomości zapisane w systemie.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <MessagesTable />
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
