import { create } from 'zustand';
import { notificationApi } from '../services/notificationApi';

const useNotificationStore = create((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  currentPage: 1,
  totalPages: 1,
  filter: 'all',

  fetchNotifications: async (page = 1, filterVal) => {
    const currentFilter = filterVal !== undefined ? filterVal : get().filter;
    set({ isLoading: true });
    try {
      const response = await notificationApi.getNotifications({
        page,
        limit: 10,
        filter: currentFilter,
      });
      if (response.data?.success) {
        set({
          notifications: response.data.data,
          currentPage: response.data.pagination.page,
          totalPages: response.data.pagination.totalPages,
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      set({ isLoading: false });
    }
  },

  fetchUnreadCount: async () => {
    try {
      const response = await notificationApi.getUnreadCount();
      if (response.data?.success) {
        set({ unreadCount: response.data.data.count });
      }
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
    }
  },

  markAsRead: async (id) => {
    try {
      // Optimistic update
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === id ? { ...n, read: true } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      }));

      await notificationApi.markAsRead(id);
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      // Re-fetch to sync
      get().fetchNotifications(get().currentPage);
      get().fetchUnreadCount();
    }
  },

  markAllAsRead: async () => {
    try {
      // Optimistic update
      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, read: true })),
        unreadCount: 0,
      }));

      await notificationApi.markAllAsRead();
    } catch (error) {
      console.error('Failed to mark all as read:', error);
      // Re-fetch to sync
      get().fetchNotifications(get().currentPage);
      get().fetchUnreadCount();
    }
  },

  deleteNotification: async (id) => {
    try {
      const wasUnread = get().notifications.find((n) => n.id === id && !n.read);

      // Optimistic update
      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id),
        unreadCount: wasUnread ? Math.max(0, state.unreadCount - 1) : state.unreadCount,
      }));

      await notificationApi.deleteNotification(id);
      
      // If list is empty after deletion and there are more pages, go back a page or refetch
      if (get().notifications.length === 0 && get().currentPage > 1) {
        get().setPage(get().currentPage - 1);
      } else {
        get().fetchNotifications(get().currentPage);
      }
    } catch (error) {
      console.error('Failed to delete notification:', error);
      // Re-fetch to sync
      get().fetchNotifications(get().currentPage);
      get().fetchUnreadCount();
    }
  },

  setFilter: (val) => {
    set({ filter: val, currentPage: 1 });
    get().fetchNotifications(1, val);
  },

  setPage: (page) => {
    set({ currentPage: page });
    get().fetchNotifications(page);
  },
}));

export default useNotificationStore;
