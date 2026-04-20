'use client';
import { useState } from 'react';
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
    } catch {
      setError('Wystąpił błąd podczas dodawania wiadomości');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="message">Treść wiadomości</Label>
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            id="message"
            value={message}
            onChange={(e) => { setMessage(e.target.value); setError(''); }}
            placeholder="Wpisz treść wiadomości..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading} className="sm:w-auto w-full">
            {isLoading ? 'Dodawanie...' : 'Dodaj wiadomość'}
          </Button>
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    </form>
  );
}
