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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground text-sm">
        Ładowanie wiadomości...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center py-12 text-destructive text-sm">
        Błąd podczas ładowania wiadomości.
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-16 pl-6">ID</TableHead>
              <TableHead>Wiadomość</TableHead>
              <TableHead className="w-40 pr-6 text-right">Akcje</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {messages && messages.length > 0 ? (
              messages.map((msg) => (
                <TableRow key={msg.id}>
                  <TableCell className="font-mono text-muted-foreground pl-6">{msg.id}</TableCell>
                  <TableCell className="max-w-xs sm:max-w-none break-words">{msg.message}</TableCell>
                  <TableCell className="pr-6">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditMessage(msg)}
                      >
                        Edytuj
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setDeleteId(msg.id)}
                      >
                        Usuń
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground py-12">
                  Brak wiadomości. Dodaj pierwszą wiadomość powyżej.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

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
