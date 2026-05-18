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
        await get().selectConversation(data[0].id);
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
      const content = assistantMsg?.message || assistantMsg?.content || '';
      
      // Transform response to match local messages structure
      const finalMsg = { role: 'assistant', content, text: content };
      
      set((state) => ({
        messages: [...state.messages, finalMsg]
      }));

      // Background refresh conversation list (agar last message terupdate)
      get().fetchConversations();
    } catch (err) {
      set({ 
        error: err.response?.data?.message || err.message,
        // Rollback last optimistic message
        messages: get().messages.slice(0, -1)
      });
    } finally {
      set({ isSendingMessage: false });
    }
  },

  clearError: () => set({ error: null })
}));

export default useAssistantStore;
