import NoteForm from '@/components/NoteForm/NoteForm';
import css from '../../../../../components/CreateNote/CreateNote.module.css';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create New Note - NoteNub',
  description:
    'Create a new note on NoteHub to organize your thoughts, ideas, and tasks efficiently.',
  openGraph: {
    title: 'Create New Note - NoteNub',
    description:
      'Easily create and manage your notes on NoteHub - a simple, fast, and modern note-taking app.',
    url: 'https://08-zustand-six-blue.vercel.app/notes/action/create',
    images: [
      {
        url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
        width: 1200,
        height: 630,
        alt: 'Create a new note in NoteHub',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Create New Note - NoteNub',
    description:
      'Create a new note on NoteHub to capture and organize your ideas easily.',
    images: ['https://ac.goit.global/fullstack/react/notehub-og-meta.jpg'],
  },
};

export default function CreateNote() {
  return (
    <main className={css.main}>
      <div className={css.container}>
        <h1 className={css.title}>Create note</h1>
        <NoteForm />
      </div>
    </main>
  );
}
