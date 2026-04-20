'use client';
import { useState } from 'react';
import { toast } from 'sonner';
import { useAddMessageMutation } from '@/store/messagesApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        <Input
          value={message}
          onChange={(e) => { setMessage(e.target.value); setError(''); }}
          placeholder="Wpisz treść wiadomości..."
          disabled={isLoading}
          className={error ? 'border-destructive focus-visible:ring-destructive' : ''}
        />
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? 'Dodawanie...' : 'Dodaj wiadomość'}
      </Button>
    </form>
  );
}
