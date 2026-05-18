# Task 02 - Assistant API & Store

**Tujuan:**
Menyiapkan *layer data* di frontend (API service dan Zustand Store) untuk mengelola state global dari halaman Assistant, termasuk state percakapan, pesan, input draft, dll.

## 1. Buat API Service (`frontend/src/features/assistant/services/assistantApi.js`)

Buat file baru untuk membungkus panggilan axios:

```javascript
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
```

## 2. Buat Store (`frontend/src/features/assistant/store/assistantStore.js`)

Gunakan Zustand untuk mengatur state Assistant agar reaktif dan terpusat:

```javascript
import { create } from 'zustand';
import { assistantApi } from '../services/assistantApi';

const useAssistantStore = create((set, get) => ({
  conversations: [],
  activeConversationId: null,
  messages: [],
  isLoadingConversations: false,
  isLoadingMessages: false,
  isSendingMessage: false,
  error: null,

  // Actions
  fetchConversations: async () => {
    set({ isLoadingConversations: true, error: null });
    try {
      const res = await assistantApi.getConversations();
      const data = res.data?.data || res.data || [];
      set({ conversations: data });
      
      // Auto select the first conversation if activeConversationId is null
      if (data.length > 0 && !get().activeConversationId) {
        get().selectConversation(data[0].id);
      }
    } catch (err) {
      set({ error: err.response?.data?.message || err.message });
    } finally {
      set({ isLoadingConversations: false });
    }
  },

  selectConversation: async (convId) => {
    const { conversations } = get();
    const targetConv = conversations.find(c => c.id === convId);
    
    if (!targetConv) return;
    
    set({ activeConversationId: convId, isLoadingMessages: true, error: null, messages: [] });
    
    try {
      // Ambil message history menggunakan workspaceId
      const res = await assistantApi.getChatHistory(targetConv.workspaceId);
      // Backend chatHistory mengembalikan array of messages
      const msgs = res.data?.data?.messages || res.data?.messages || [];
      set({ messages: msgs });
    } catch (err) {
      set({ error: err.response?.data?.message || err.message });
    } finally {
      set({ isLoadingMessages: false });
    }
  },

  sendMessage: async (text) => {
    const { activeConversationId, conversations, messages } = get();
    if (!activeConversationId) return;

    const targetConv = conversations.find(c => c.id === activeConversationId);
    if (!targetConv) return;

    // Optimistic Update UI (User Message)
    const newUserMsg = { role: 'user', content: text, text: text }; 
    set({ 
      messages: [...messages, newUserMsg],
      isSendingMessage: true 
    });

    try {
      const res = await assistantApi.sendMessage(targetConv.workspaceId, text);
      const assistantMsg = res.data?.data || res.data;
      
      // Transform response to match local messages structure
      const finalMsg = { role: 'assistant', content: assistantMsg.message, text: assistantMsg.message };
      
      set((state) => ({
        messages: [...state.messages, finalMsg]
      }));

      // Background refresh conversation list (agar last message terupdate)
      get().fetchConversations();
    } catch (err) {
      set({ error: err.response?.data?.message || err.message });
      // Remove optimistic user message on fail or show error
    } finally {
      set({ isSendingMessage: false });
    }
  },

  clearError: () => set({ error: null })
}));

export default useAssistantStore;
```

## 3. Acceptance Criteria
- [ ] Tersedia `assistantApi.js` untuk call axios (getConversations, getChatHistory, sendMessage).
- [ ] Tersedia `assistantStore.js` dengan state & actions (fetchConversations, selectConversation, sendMessage).
- [ ] Store mampu melakukan Optimistic Update untuk chat yang baru dikirim.
