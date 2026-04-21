'use client';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useUpdateMessageMutation } from '@/store/messagesApi';
import type { Message } from '@/store/messagesApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

interface Props {
  message: Message | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditMessageDialog({ message, open, onOpenChange }: Props) {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [updateMessage, { isLoading }] = useUpdateMessageMutation();

  useEffect(() => {
    if (message) setValue(message.message);
  }, [message]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) { setError('Wiadomość nie może być pusta'); return; }
    try {
      await updateMessage({ id: message!.id, message: value.trim() }).unwrap();
      onOpenChange(false);
      setError('');
      toast.success('Wiadomość została zaktualizowana');
    } catch {
      toast.error('Wystąpił błąd podczas edycji');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-semibold text-foreground">Edytuj wiadomość</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="edit-message" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Treść wiadomości
            </Label>
            <Input
              id="edit-message"
              value={value}
              onChange={(e) => { setValue(e.target.value); setError(''); }}
              disabled={isLoading}
              className={error ? 'border-destructive focus-visible:ring-destructive' : ''}
              autoFocus
            />
            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" size="sm" onClick={() => onOpenChange(false)}>
              Anuluj
            </Button>
            <Button type="submit" variant="default" size="sm" disabled={isLoading}>
              {isLoading ? 'Zapisywanie...' : 'Zapisz zmiany'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
