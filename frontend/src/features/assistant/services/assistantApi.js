import axiosInstance from '../../../services/axiosInstance';

export const assistantApi = {
  // Fetch daftar percakapan untuk sidebar
  getConversations: () => {
    return axiosInstance.get('/assistant/conversations');
  },

  // Membuat global conversation baru
  createConversation: () => {
    return axiosInstance.post('/assistant/conversations');
  },

  // Mengambil history chat dari sebuah conversationId (Unifikasi global & workspace)
  getChatHistory: (conversationId) => {
    return axiosInstance.get(`/assistant/conversations/${conversationId}/messages`);
  },

  // Mengirim pesan ke AI berdasarkan conversationId (Unifikasi global & workspace)
  sendMessage: (conversationId, message) => {
    return axiosInstance.post(`/assistant/conversations/${conversationId}/messages`, { message });
  },

  // Mengubah nama percakapan
  renameConversation: (id, title) => {
    return axiosInstance.patch(`/assistant/conversations/${id}`, { title });
  },

  // Menghapus percakapan
  deleteConversation: (id) => {
    return axiosInstance.delete(`/assistant/conversations/${id}`);
  }
};
