import { create } from 'zustand';
import { dashboardApi } from '../service/dashboardApi';

const useDashboardStore = create((set) => ({
  // State
  stats: {
    totalDocuments: 0,
    totalFlashcards: 0,
    totalQuizzes: 0,
    totalSummaries: 0,
  },
  favoriteWorkspaces: [],
  recentActivities: [],
  isLoading: false,
  error: null,

  // Actions
  fetchDashboard: async () => {
    set({ isLoading: true, error: null });
    try {
      const [statsRes, activityRes] = await Promise.all([
        dashboardApi.getStats(),
        dashboardApi.getRecentActivity(),
      ]);

      set({
        stats: statsRes.data.data.stats,
        favoriteWorkspaces: statsRes.data.data.favoriteWorkspaces,
        recentActivities: activityRes.data.data,
        isLoading: false,
      });
    } catch (err) {
      set({
        error: err.response?.data?.message || 'Gagal memuat dashboard.',
        isLoading: false,
      });
    }
  },
}));

export default useDashboardStore;