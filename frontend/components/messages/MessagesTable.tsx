'use client';
import { useState } from 'react';
import { Loader2, MessageSquare, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
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
      <div className="flex items-center justify-center gap-2 py-12 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
        <span>Ładowanie...</span>
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
              <TableHead className="w-16 pl-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">ID</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Wiadomość</TableHead>
              <TableHead className="w-16 pr-6 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Akcje</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {messages && messages.length > 0 ? (
              messages.map((msg) => (
                <TableRow key={msg.id} className="border-border hover:bg-muted/50 transition-colors duration-150">
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
                <TableCell colSpan={3} className="text-center py-2">
                  <div className="flex flex-col items-center gap-3 py-12 text-muted-foreground">
                    <div className="rounded-full bg-muted p-4">
                      <MessageSquare className="h-6 w-6" />
                    </div>
                    <p className="font-medium">Brak wiadomości</p>
                    <p className="text-sm">Dodaj pierwszą wiadomość używając formularza</p>
                  </div>
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
