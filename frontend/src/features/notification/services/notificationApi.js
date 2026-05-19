import axiosInstance from '../../../services/axiosInstance';

export const notificationApi = {
  getNotifications: (params) => axiosInstance.get('/notifications', { params }),
  getUnreadCount: () => axiosInstance.get('/notifications/unread-count'),
  markAsRead: (id) => axiosInstance.patch(`/notifications/${id}/read`),
  markAllAsRead: () => axiosInstance.patch('/notifications/read-all'),
  deleteNotification: (id) => axiosInstance.delete(`/notifications/${id}`),
};
