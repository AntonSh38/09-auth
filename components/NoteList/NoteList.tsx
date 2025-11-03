'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import css from './NoteList.module.css';
import { Note } from '@/types/note';

import toast from 'react-hot-toast';
import Link from 'next/link';
import { deleteNote } from '@/lib/api/clientApi';

interface NoteListProps {
  notes: Note[];
}

export default function NoteList({ notes }: NoteListProps) {
  const queryClient = useQueryClient();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const deleteNoteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      toast.success('Note successfully deleted!!');
      setDeletingId(null);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Could not delete note.');
      setDeletingId(null);
    },
  });

  if (notes.length === 0) {
    return null;
  }

  const handleDeleteClick =
    (noteId: string) => (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      setDeletingId(noteId);
      deleteNoteMutation.mutate(noteId);
    };

  return (
    <ul className={css.list}>
      {notes.map(note => (
        <li key={note.id} className={css.listItem}>
          <h2 className={css.title}>{note.title}</h2>
          <p className={css.content}>{note.content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span>

            <Link className={css.link} href={`/notes/${note.id}`}>
              View details
            </Link>

            <button
              className={css.button}
              onClick={handleDeleteClick(note.id)}
              type="button"
              disabled={deleteNoteMutation.isPending && deletingId === note.id}
            >
              {deleteNoteMutation.isPending && deletingId === note.id
                ? 'Deleting....'
                : 'Delete'}
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
