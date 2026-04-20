'use client';
import { useState } from 'react';
import { useGetMessagesQuery } from '@/store/messagesApi';
import type { Message } from '@/store/messagesApi';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { EditMessageDialog } from './EditMessageDialog';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';

export function MessagesTable() {
  const { data: messages, isLoading, isError } = useGetMessagesQuery();
  const [editMessage, setEditMessage] = useState<Message | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  if (isLoading) return <p className="text-muted-foreground">Ładowanie wiadomości...</p>;
  if (isError) return <p className="text-destructive">Błąd podczas ładowania wiadomości.</p>;

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">ID</TableHead>
            <TableHead>Wiadomość</TableHead>
            <TableHead className="w-36 text-right">Akcje</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {messages && messages.length > 0 ? (
            messages.map((msg) => (
              <TableRow key={msg.id}>
                <TableCell className="font-mono text-muted-foreground">{msg.id}</TableCell>
                <TableCell>{msg.message}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => setEditMessage(msg)}>Edytuj</Button>
                    <Button variant="destructive" size="sm" onClick={() => setDeleteId(msg.id)}>Usuń</Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={3} className="text-center text-muted-foreground">Brak wiadomości</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <EditMessageDialog
        message={editMessage}
        open={editMessage !== null}
        onOpenChange={(open) => { if (!open) setEditMessage(null); }}
      />
      <DeleteConfirmDialog
        messageId={deleteId}
        open={deleteId !== null}
        onOpenChange={(open) => { if (!open) setDeleteId(null); }}
      />
    </>
  );
}
