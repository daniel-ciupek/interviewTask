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
      <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin text-primary dark:[filter:drop-shadow(0_0_6px_rgba(52,211,153,0.6))]" />
        <span className="text-sm">Ładowanie...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center py-16 text-destructive text-sm px-4 text-center">
        Błąd podczas ładowania wiadomości.
      </div>
    );
  }

  return (
    <>
      {/* overflow-x-auto pozwala tabeli scrollować się poziomo na wąskich ekranach */}
      <div className="w-full overflow-x-auto">
        <Table className="min-w-[320px]">
          <TableHeader>
            <TableRow className="hover:bg-transparent border-border">
              <TableHead className="w-12 sm:w-16 pl-3 sm:pl-6 text-xs font-medium text-muted-foreground uppercase tracking-widest">
                ID
              </TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
                Wiadomość
              </TableHead>
              <TableHead className="w-12 sm:w-16 pr-3 sm:pr-6 text-right text-xs font-medium text-muted-foreground uppercase tracking-widest">
                Akcje
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {messages && messages.length > 0 ? (
              messages.map((msg, i) => (
                <TableRow
                  key={msg.id}
                  className="border-border group
                    hover:bg-muted/40
                    dark:hover:bg-primary/5
                    dark:hover:shadow-[inset_3px_0_0_rgba(52,211,153,0.6)]
                    hover:shadow-[inset_3px_0_0_rgba(16,185,129,0.5)]
                    transition-all duration-150 animate-float-in"
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  <TableCell className="pl-3 sm:pl-6 font-mono text-xs text-muted-foreground group-hover:text-primary transition-colors duration-150">
                    {msg.id}
                  </TableCell>
                  <TableCell className="text-sm text-foreground py-3">
                    <span className="block break-words max-w-[200px] sm:max-w-none">
                      {msg.message}
                    </span>
                  </TableCell>
                  <TableCell className="pr-3 sm:pr-6 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors duration-150"
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
                  <div className="flex flex-col items-center gap-3 py-12 sm:py-14 text-muted-foreground animate-float-in px-4">
                    <div className="rounded-full bg-muted p-4 dark:shadow-[0_0_20px_rgba(52,211,153,0.1)]">
                      <MessageSquare className="h-6 w-6" />
                    </div>
                    <p className="font-medium">Brak wiadomości</p>
                    <p className="text-sm opacity-70 text-center">Dodaj pierwszą wiadomość używając formularza</p>
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
