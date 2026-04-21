'use client';
import { useState } from 'react';
import { toast } from 'sonner';
import { useAddMessageMutation } from '@/store/messagesApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function AddMessageForm() {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [addMessage, { isLoading }] = useAddMessageMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      setError('Wiadomość nie może być pusta');
      return;
    }
    try {
      await addMessage({ message: message.trim() }).unwrap();
      setMessage('');
      setError('');
      toast.success('Wiadomość została dodana');
    } catch {
      toast.error('Wystąpił błąd podczas dodawania');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label
          htmlFor="add-message"
          className="text-xs font-medium text-muted-foreground uppercase tracking-widest"
        >
          Treść wiadomości
        </Label>
        <Input
          id="add-message"
          value={message}
          onChange={(e) => { setMessage(e.target.value); setError(''); }}
          placeholder="Wpisz treść wiadomości..."
          disabled={isLoading}
          className={
            error
              ? 'border-destructive focus-visible:ring-destructive'
              : 'focus-visible:ring-primary dark:focus-visible:shadow-[0_0_12px_rgba(52,211,153,0.25)] transition-shadow duration-200'
          }
        />
        {error && (
          <p className="text-xs text-destructive animate-float-in">{error}</p>
        )}
      </div>
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full
          dark:animate-neon-pulse
          animate-neon-pulse-light
          hover:scale-[1.02] active:scale-[0.98]
          transition-transform duration-150"
      >
        {isLoading ? 'Dodawanie...' : 'Dodaj wiadomość'}
      </Button>
    </form>
  );
}
