import { cookies } from 'next/headers';
import { nextApi } from './api';
import { User } from '@/types/user';
import { Note, NoteTag } from '@/types/note';

interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

interface FetchNotesParams {
  search?: string;
  tag?: NoteTag;
  page?: number;
  perPage?: number;
  sortBy?: 'title' | 'createdAt' | 'updatedAt';
}

export async function fetchNotesServer(
  params?: FetchNotesParams
): Promise<FetchNotesResponse> {
  const cookieStore = cookies();
  const { data } = await nextApi.get<FetchNotesResponse>('/notes', {
    params,
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return data;
}

export async function fetchNoteByIdServer(id: string): Promise<Note> {
  const cookieStore = cookies();
  const { data } = await nextApi.get<Note>(`/notes/${id}`, {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return data;
}

export async function checkServerSession(): Promise<boolean> {
  const cookieStore = cookies();

  try {
    const { data } = await nextApi.get('/auth/session', {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });
    return !!data?.success;
  } catch {
    return false;
  }
}

export async function getMeServer(): Promise<User> {
  const cookieStore = cookies();
  const { data } = await nextApi.get('/users/me', {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return data;
}
