'use client';

import ErrorMessage from '@/app/error';
import Loader from '@/app/loading';

import { NoteTag } from '@/types/note';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import NoteList from '@/components/NoteList/NoteList';
import { useState } from 'react';
import { useDebounce } from 'use-debounce';
import css from '../../../../../components/NotesPage/NotesPage.module.css';
import SearchBox from '@/components/SearchBox/SearchBox';
import Pagination from '@/components/Pagination/Pagination';
import Link from 'next/link';
import { fetchNotes } from '@/lib/api/clientApi';

interface Props {
  tag: NoteTag | 'all';
}

export default function FilteredNotesClient({ tag }: Props) {
  const [page, setPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [debouncedSearch] = useDebounce(searchQuery, 500);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['notes', page, debouncedSearch, tag],
    queryFn: () =>
      fetchNotes({
        page: page,
        perPage: 12,
        search: debouncedSearch,
        tag: tag === 'all' ? undefined : tag,
      }),
    placeholderData: keepPreviousData,
    refetchOnMount: true,
  });

  const handleSearchChange = (value: string): void => {
    setSearchQuery(value);
    setPage(1);
  };

  const handlePageChange = (newPage: number): void => {
    setPage(newPage);
  };

  const notes = data?.notes || [];
  const totalPages = data?.totalPages || 0;

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <ErrorMessage error={error as Error} />;
  }

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={searchQuery} onChange={handleSearchChange} />

        {totalPages > 1 && (
          <Pagination
            totalPages={totalPages}
            currentPage={page}
            onPageChange={handlePageChange}
          />
        )}

        <Link href="/notes/action/create" className={css.button}>
          Create note +
        </Link>
      </header>

      {notes.length > 0 ? (
        <NoteList notes={notes} />
      ) : (
        <p className={css.emptyMessage}>
          {searchQuery ? 'No notes found for your search' : null}
        </p>
      )}
    </div>
  );
}
