import { create } from 'zustand';
import { notesApi } from '../services/notesApi';

const useNotesStore = create((set, get) => ({
  // State
  notes: [],
  isLoading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  search: '',
  filter: 'newest', // 'newest' | 'oldest'

  // Actions
  fetchNotes: async () => {
    set({ isLoading: true, error: null });
    try {
      const { currentPage, search, filter } = get();
      const res = await notesApi.getNotes({
        page: currentPage,
        limit: 6,
        search,
        filter
      });
      const { data, pagination } = res.data;
      const mappedNotes = data.map((n) => ({
        ...n,
        id: n._id || n.id
      }));
      set({
        notes: mappedNotes, // mapped to include id property
        currentPage: pagination.page,
        totalPages: pagination.totalPages,
        isLoading: false
      });
    } catch (err) {
      set({
        error: err.response?.data?.message || 'Gagal memuat notes.',
        isLoading: false,
        notes: []
      });
    }
  },

  createNote: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const res = await notesApi.createNote(data);
      const newNote = {
        ...res.data.data,
        id: res.data.data._id || res.data.data.id
      };
      set((state) => {
        const newNotes = [newNote, ...state.notes];
        // Sort pinned notes to be always on top
        const sortedNotes = [...newNotes].sort((a, b) => {
          if (a.pinned && !b.pinned) return -1;
          if (!a.pinned && b.pinned) return 1;
          return 0;
        });
        return { notes: sortedNotes };
      });
      await get().fetchNotes();
      return newNote;
    } catch (err) {
      set({ error: err.response?.data?.message || 'Gagal membuat note.', isLoading: false });
      throw err;
    }
  },

  updateNote: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const res = await notesApi.updateNote(id, data);
      const updatedNote = {
        ...res.data.data,
        id: res.data.data._id || res.data.data.id
      };
      set((state) => {
        const updatedNotes = state.notes.map((n) => (n.id === id || n._id === id ? updatedNote : n));
        const sortedNotes = [...updatedNotes].sort((a, b) => {
          if (a.pinned && !b.pinned) return -1;
          if (!a.pinned && b.pinned) return 1;
          return 0;
        });
        return { notes: sortedNotes };
      });
      await get().fetchNotes();
      return updatedNote;
    } catch (err) {
      set({ error: err.response?.data?.message || 'Gagal memperbarui note.', isLoading: false });
      throw err;
    }
  },

  togglePin: async (id) => {
    try {
      const res = await notesApi.togglePin(id);
      const updatedNote = {
        ...res.data.data,
        id: res.data.data._id || res.data.data.id
      };
      set((state) => {
        const updatedNotes = state.notes.map((n) => (n.id === id || n._id === id ? updatedNote : n));
        const sortedNotes = [...updatedNotes].sort((a, b) => {
          if (a.pinned && !b.pinned) return -1;
          if (!a.pinned && b.pinned) return 1;
          return 0;
        });
        return { notes: sortedNotes };
      });
      await get().fetchNotes();
      return updatedNote;
    } catch (err) {
      set({ error: err.response?.data?.message || 'Gagal mem-pin note.' });
      throw err;
    }
  },

  deleteNote: async (id) => {
    try {
      await notesApi.deleteNote(id);
      set((state) => ({
        notes: state.notes.filter((n) => n.id !== id && n._id !== id)
      }));
      await get().fetchNotes();
    } catch (err) {
      set({ error: err.response?.data?.message || 'Gagal menghapus note.' });
      throw err;
    }
  },

  setSearch: (val) => {
    set({ search: val, currentPage: 1 });
    get().fetchNotes();
  },

  setFilter: (val) => {
    set({ filter: val, currentPage: 1 });
    get().fetchNotes();
  },

  setPage: (page) => {
    set({ currentPage: page });
    get().fetchNotes();
  }
}));

export default useNotesStore;
