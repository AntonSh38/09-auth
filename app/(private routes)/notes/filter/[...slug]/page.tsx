import { NoteTag } from '@/types/note';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import FilteredNotesClient from './Notes.client';
import { Metadata } from 'next';
import { fetchNotes } from '@/lib/api/clientApi';

interface Props {
  params: Promise<{ slug: string[] }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = slug[0] || 'all';

  const title =
    category === 'all'
      ? 'All Notes - NoteHub'
      : `Notes tagged with ${category} - NoteHub`;

  const description =
    category === 'all'
      ? 'Browse and search all notes on NoteHub, your fast and modern note-taking platform.'
      : `View all notes categorized under the ${category} tag on NoteHub. Organize and manage your ideas efficiently.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://08-zustand-six-blue.vercel.app/notes/filter/${category}`,
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
          width: 1200,
          height: 630,
          alt: `Notes tagged with ${category}`,
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
}

export default async function FilteredNotesPage({ params }: Props) {
  const { slug } = await params;
  const category = slug[0];

  const tag: NoteTag | undefined =
    category && category !== 'all' ? (category as NoteTag) : undefined;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['notes', 1, '', tag ?? 'all'],
    queryFn: () =>
      fetchNotes({
        page: 1,
        perPage: 12,
        search: '',
        ...(tag ? { tag } : {}),
      }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <FilteredNotesClient tag={tag ?? 'all'} />
    </HydrationBoundary>
  );
}
