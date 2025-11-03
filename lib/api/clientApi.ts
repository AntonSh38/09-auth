import { User } from '@/types/user';
import { nextApi } from './api';
import { Note, NoteTag } from '@/types/note';

export async function fetchNotes(params: {
  page?: number;
  perPage?: number;
  search?: string;
  tag?: NoteTag | string;
}) {
  const res = await nextApi.get('/notes', { params });
  return res.data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const res = await nextApi.get(`/notes/${id}`);
  return res.data;
}

export async function createNote(noteData: {
  title: string;
  content: string;
  tag: NoteTag;
}): Promise<Note> {
  const res = await nextApi.post('/notes', noteData);
  return res.data;
}

export async function deleteNote(noteId: string): Promise<Note> {
  const res = await nextApi.delete(`/notes/${noteId}`);
  return res.data;
}

export async function register(data: {
  email: string;
  password: string;
}): Promise<User> {
  const res = await nextApi.post('/auth/register', data);
  return res.data;
}

export async function login(data: {
  email: string;
  password: string;
}): Promise<User> {
  const res = await nextApi.post('/auth/login', data);
  return res.data;
}

export async function logout(): Promise<void> {
  await nextApi.post('/auth/logout');
}

export async function checkSession(): Promise<boolean> {
  const res = await nextApi.get('/auth/session');
  return res.data.success;
}

export async function getMe(): Promise<User> {
  const res = await nextApi.get('/users/me');
  return res.data;
}

export async function updateMe(data: Partial<User>): Promise<User> {
  const res = await nextApi.patch('/users/me', data);
  return res.data;
}
