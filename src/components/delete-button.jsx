'use client';

import { useTransition } from 'react';
import { deleteNote } from '@/app/actions/notes';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

export function DeleteButton({ noteId }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this note?')) {
      startTransition(async () => {
        const result = await deleteNote(noteId);
        if (!result.success) {
          alert(result.error || 'Failed to delete note.');
        }
      });
    }
  };

  return (
    <Button
      variant="pink"
      size="sm"
      className="flex-1 text-xs py-1 flex items-center justify-center gap-1.5"
      onClick={handleDelete}
      loading={isPending}
    >
      {!isPending && <Trash2 className="h-3.5 w-3.5" />}
      Delete
    </Button>
  );
}
