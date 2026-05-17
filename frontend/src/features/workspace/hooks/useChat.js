import { useState, useEffect, useCallback } from 'react';
import * as chatApi from '../services/chatApi';
import Swal from 'sweetalert2';

const swalConfig = {
  background: "#050816",
  color: "#fff",
  confirmButtonColor: "#3b82f6",
  backdrop: `rgba(0,0,0,0.45) blur(80px)`,
  customClass: {
    popup: "rounded-3xl border border-white/10 shadow-2xl",
    title: "text-white",
    htmlContainer: "text-slate-300",
  },
};

const useChat = (workspaceId) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadHistory = useCallback(async () => {
    if (!workspaceId) return;
    setIsLoading(true);
    try {
      const res = await chatApi.getChatHistory(workspaceId);
      if (res.data?.success) {
        setMessages(res.data.data.messages || []);
      }
    } catch (err) {
      console.error('Failed to load chat history:', err);
      setError('Gagal memuat riwayat percakapan.');
    } finally {
      setIsLoading(false);
    }
  }, [workspaceId]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const sendMessage = async (customMessage = null) => {
    const textToSend = customMessage || inputValue;
    if (!textToSend.trim() || isLoading) return;
    
    setError(null);
    const userMsg = { 
      id: Date.now(), 
      role: 'user', 
      content: textToSend, 
      createdAt: new Date() 
    };
    
    const placeholderMsg = { 
      id: 'thinking', 
      role: 'assistant', 
      content: 'thinking', 
      createdAt: new Date() 
    };
    
    // 1. Optimistic Update: Add user message + thinking placeholder
    setMessages(prev => [...prev, userMsg, placeholderMsg]);
    setInputValue('');
    setIsLoading(true);
    
    try {
      const res = await chatApi.sendMessage(workspaceId, textToSend);
      const aiMsg = res.data.data;
      
      // 2. Replace placeholder with real response
      setMessages(prev => prev.map(m => 
        m.id === 'thinking' 
          ? { 
              id: aiMsg.createdAt, 
              role: 'assistant', 
              content: aiMsg.message, 
              createdAt: aiMsg.createdAt 
            }
          : m
      ));
    } catch (err) {
      console.error('Failed to send message:', err);
      // 3. Remove placeholder on error
      setMessages(prev => prev.filter(m => m.id !== 'thinking'));
      
      const status = err.response?.status;
      let errorMessage = err.response?.data?.message || 'Maaf, terjadi kesalahan saat menghubungi AI.';
      if (status === 429) {
        errorMessage = 'Oops! Kuota harian aplikasi sedang habis. Silakan coba lagi nanti atau besok.';
        Swal.fire({
          ...swalConfig,
          icon: 'error',
          title: 'Oops! Rate Limit',
          text: 'Kuota harian aplikasi sedang habis. Silakan coba lagi nanti atau besok ya!',
        });
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    inputValue,
    setInputValue,
    isLoading,
    error,
    sendMessage,
    loadHistory
  };
};

export default useChat;
