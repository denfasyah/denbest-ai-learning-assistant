import axiosInstance from '../../../services/axiosInstance';

export const historyApi = {
  getHistory: ({ page = 1, limit = 20, type, workspaceId } = {}) => {
    const params = { page, limit };
    if (type && type !== 'all') params.type = type;
    if (workspaceId) params.workspaceId = workspaceId;
    return axiosInstance.get('/history', { params });
  }
};