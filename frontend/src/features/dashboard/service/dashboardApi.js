import axiosInstance from '../../../services/axiosInstance';

export const dashboardApi = {
  getStats: () => axiosInstance.get('/dashboard/stats'),
  getRecentActivity: () => axiosInstance.get('/history', { 
    params: { page: 1, limit: 5 } 
  }),
};