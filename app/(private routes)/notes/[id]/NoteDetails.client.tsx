'use client';

import { useQuery } from '@tanstack/react-query';
import css from '../../../components/NoteDetails/NoteDetails.module.css';

import { useParams } from 'next/navigation';
import { Note } from '@/types/note';
import { fetchNoteById } from '@/lib/api/clientApi';

export default function NoteDetailsClient() {
  const params = useParams();
  const id = params.id as string;

  const {
    data: note,
    isLoading,
    error,
  } = useQuery<Note>({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  if (isLoading) {
    return <p>Loading, please wait...</p>;
  }

  if (error || !note) {
    return <p>Something went wrong.</p>;
  }

  return (
    <div className={css.container}>
      <div className={css.item}>
        <div className={css.header}>
          <h2>{note.title}</h2>
        </div>
        <p className={css.content}>{note.content}</p>
        <p className={css.date}>{new Date(note.createdAt).toLocaleString()}</p>
      </div>
    </div>
  );
}
