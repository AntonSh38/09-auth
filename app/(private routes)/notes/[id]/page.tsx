import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';

import NoteDetailsClient from './NoteDetails.client';
import { Metadata } from 'next';
import { fetchNoteById } from '@/lib/api/clientApi';

interface NoteDetailsPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: NoteDetailsPageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const note = await fetchNoteById(id);

    const title = `${note.title} - NoteHub`;
    const description =
      note.content?.slice(0, 150) ||
      'View note details on NoteHub - your personal note management platform.';

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: `https://08-zustand-six-blue.vercel.app/notes/${note.id}`,
        images: [
          {
            url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
            width: 1200,
            height: 630,
            alt: `Note titled ${note.title}`,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: ['https://ac.goit.global/fullstack/react/notehub-og-meta.jpg'],
      },
    };
  } catch {
    return {
      title: 'Note not found - NoteHub',
      description: 'This note could not be found on NoteHub',
    };
  }
}

export default async function NoteDetailsPage({
  params,
}: NoteDetailsPageProps) {
  const { id } = await params;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <NoteDetailsClient />
    </HydrationBoundary>
  );
}
