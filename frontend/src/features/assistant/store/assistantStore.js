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

  createNewConversation: async () => {
    set({ isLoadingConversations: true, error: null });
    try {
      const res = await assistantApi.createConversation();
      const newConv = res.data?.data || res.data;
      
      // Prepend to conversations list
      set((state) => ({
        conversations: [newConv, ...state.conversations],
        activeConversationId: newConv.id,
        messages: [],
        error: null
      }));
    } catch (err) {
      set({ error: err.response?.data?.message || err.message });
    } finally {
      set({ isLoadingConversations: false });
    }
  },

  selectConversation: async (convId) => {
    set({ activeConversationId: convId, isLoadingMessages: true, error: null, messages: [] });
    
    try {
      // Ambil message history menggunakan conversationId secara langsung (Unifikasi global & workspace)
      const res = await assistantApi.getChatHistory(convId);
      const msgs = res.data?.data?.messages || res.data?.messages || [];
      set({ messages: msgs });
    } catch (err) {
      set({ error: err.response?.data?.message || err.message });
    } finally {
      set({ isLoadingMessages: false });
    }
  },

  sendMessage: async (text, file = null) => {
    const { activeConversationId, messages } = get();
    if (!activeConversationId) return;

    // Optimistic Update UI (User Message)
    const displayContent = text || (file ? `Mengirim file: ${file.name}` : '');
    const isImage = file && (file.type.startsWith('image/') || ['.png', '.jpg', '.jpeg', '.webp'].some(ext => file.name.toLowerCase().endsWith(ext)));
    const newUserMsg = { 
      role: 'user', 
      content: displayContent, 
      text: displayContent,
      attachment: file ? {
        fileUrl: URL.createObjectURL(file),
        fileName: file.name,
        fileType: isImage ? 'image' : 'document',
        mimeType: file.type
      } : null
    }; 
    set({ 
      messages: [...messages, newUserMsg],
      isSendingMessage: true 
    });

    try {
      const res = await assistantApi.sendMessage(activeConversationId, text, file);
      const assistantMsg = res.data?.data || res.data;
      const content = assistantMsg?.message || assistantMsg?.content || '';
      
      // Transform response to match local messages structure
      const finalMsg = { role: 'assistant', content, text: content };
      
      set((state) => ({
        messages: [...state.messages, finalMsg]
      }));

      // Auto-update conversation title if returned
      const updatedConv = res.data?.data?.conversation || res.data?.conversation;
      if (updatedConv) {
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === updatedConv.id || c.id === updatedConv._id ? { ...c, title: updatedConv.title } : c
          )
        }));
      }

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

  renameConversation: async (id, title) => {
    // Optimistically update title locally
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === id ? { ...c, title } : c
      )
    }));

    try {
      await assistantApi.renameConversation(id, title);
    } catch (err) {
      set({ error: err.response?.data?.message || err.message });
      // Revert if error
      get().fetchConversations();
    }
  },

  deleteConversation: async (id) => {
    const { activeConversationId, conversations } = get();
    
    // Find next conversation to select if the deleted one was active
    let nextActiveId = activeConversationId;
    if (activeConversationId === id) {
      const remaining = conversations.filter((c) => c.id !== id);
      nextActiveId = remaining.length > 0 ? remaining[0].id : null;
    }

    // Optimistically update conversations list
    set((state) => ({
      conversations: state.conversations.filter((c) => c.id !== id),
      activeConversationId: nextActiveId,
      error: null
    }));

    // If next conversation is selected, fetch its messages, otherwise clear messages
    if (nextActiveId) {
      get().selectConversation(nextActiveId);
    } else {
      set({ messages: [] });
    }

    try {
      await assistantApi.deleteConversation(id);
    } catch (err) {
      set({ error: err.response?.data?.message || err.message });
      // Revert if error
      get().fetchConversations();
    }
  },

  clearError: () => set({ error: null })
}));

export default useAssistantStore;
