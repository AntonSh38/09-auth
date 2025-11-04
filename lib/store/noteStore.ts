import { NoteTag } from '@/types/note';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Draft {
  title: string;
  content: string;
  tag: NoteTag;
}

interface NoteStore {
  draft: Draft;
  setDraft: (note: Partial<Draft>) => void;
  clearDraft: () => void;
}

const initialDraft: Draft = Object.freeze({
  title: '',
  content: '',
  tag: 'Todo',
});

export const useNoteStore = create<NoteStore>()(
  persist(
    set => ({
      draft: initialDraft,
      setDraft: note => set(state => ({ draft: { ...state.draft, ...note } })),
      clearDraft: () => set({ draft: initialDraft }),
    }),
    {
      name: 'note-draft',
    }
  )
);
