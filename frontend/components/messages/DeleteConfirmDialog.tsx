'use client';
import { toast } from 'sonner';
import { useDeleteMessageMutation } from '@/store/messagesApi';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface Props {
  messageId: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteConfirmDialog({ messageId, open, onOpenChange }: Props) {
  const [deleteMessage, { isLoading }] = useDeleteMessageMutation();

  const handleDelete = async () => {
    if (!messageId) return;
    try {
      await deleteMessage(messageId).unwrap();
      toast.success('Wiadomość została usunięta');
      onOpenChange(false);
    } catch {
      toast.error('Wystąpił błąd podczas usuwania');
      onOpenChange(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="w-[calc(100vw-2rem)] max-w-md rounded-xl mx-auto">
        <AlertDialogHeader>
          <AlertDialogTitle>Usuń wiadomość</AlertDialogTitle>
          <AlertDialogDescription>
            Czy na pewno chcesz usunąć tę wiadomość? Tej operacji nie można cofnąć.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-0">
          <AlertDialogCancel className="w-full sm:w-auto mt-0">Anuluj</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isLoading}
            className="w-full sm:w-auto bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isLoading ? 'Usuwanie...' : 'Usuń'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
