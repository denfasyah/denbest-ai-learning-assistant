import { create } from 'zustand';
import { historyApi } from '../service/historyApi';

const useHistoryStore = create((set, get) => ({
  // State
  histories: [],
  isLoading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  total: 0,
  activeFilter: 'all',

  // Actions
  fetchHistory: async (page = 1, filter = 'all') => {
    set({ isLoading: true, error: null });
    try {
      const res = await historyApi.getHistory({ page, limit: 6, type: filter });
      const { data, pagination } = res.data;
      set({
        histories: data,
        currentPage: pagination.page,
        totalPages: pagination.totalPages,
        total: pagination.total,
        isLoading: false,
      });
    } catch (err) {
      set({
        error: err.response?.data?.message || 'Gagal memuat riwayat aktivitas.',
        isLoading: false,
        histories: [],
      });
    }
  },

  setFilter: (type) => {
    set({ activeFilter: type, currentPage: 1 });
    get().fetchHistory(1, type);
  },

  setPage: (page) => {
    set({ currentPage: page });
    get().fetchHistory(page, get().activeFilter);
  },

  reset: () => set({
    histories: [],
    isLoading: false,
    error: null,
    currentPage: 1,
    totalPages: 1,
    total: 0,
    activeFilter: 'all',
  }),
}));

export default useHistoryStore;