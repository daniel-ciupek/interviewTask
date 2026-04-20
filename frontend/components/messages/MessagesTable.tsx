'use client';
import { useState } from 'react';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { useGetMessagesQuery } from '@/store/messagesApi';
import type { Message } from '@/store/messagesApi';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { EditMessageDialog } from './EditMessageDialog';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';

export function MessagesTable() {
  const { data: messages, isLoading, isError } = useGetMessagesQuery();
  const [editMessage, setEditMessage] = useState<Message | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16 text-muted-foreground text-sm">
        Ładowanie wiadomości...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center py-16 text-destructive text-sm">
        Błąd podczas ładowania wiadomości.
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-border">
              <TableHead className="w-16 pl-6 text-muted-foreground font-medium">ID</TableHead>
              <TableHead className="text-muted-foreground font-medium">Wiadomość</TableHead>
              <TableHead className="w-16 pr-6 text-right text-muted-foreground font-medium">Akcje</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {messages && messages.length > 0 ? (
              messages.map((msg) => (
                <TableRow key={msg.id} className="border-border hover:bg-muted/30 transition-colors">
                  <TableCell className="pl-6 font-mono text-xs text-muted-foreground">{msg.id}</TableCell>
                  <TableCell className="text-sm text-foreground">{msg.message}</TableCell>
                  <TableCell className="pr-6 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Akcje</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-36">
                        <DropdownMenuItem
                          onClick={() => setEditMessage(msg)}
                          className="gap-2 cursor-pointer"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          Edytuj
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => setDeleteId(msg.id)}
                          className="gap-2 cursor-pointer text-destructive focus:text-destructive"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Usuń
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground py-16 text-sm">
                  Brak wiadomości. Dodaj pierwszą po lewej stronie.
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
