import axiosInstance from '../../../services/axiosInstance';

export const assistantApi = {
  // Fetch daftar percakapan untuk sidebar
  getConversations: () => {
    return axiosInstance.get('/assistant/conversations');
  },

  // Mengambil history chat dari sebuah workspace
  // (Menggunakan endpoint workspace/chat yang sudah ada)
  getChatHistory: (workspaceId) => {
    return axiosInstance.get(`/workspaces/${workspaceId}/chat/history`);
  },

  // Mengirim pesan ke AI
  // (Menggunakan endpoint workspace/chat yang sudah ada)
  sendMessage: (workspaceId, message) => {
    return axiosInstance.post(`/workspaces/${workspaceId}/chat`, { message });
  }
};
