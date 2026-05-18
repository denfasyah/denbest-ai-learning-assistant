import { useRef, useEffect, useState } from 'react';
import { Bot, User, Send, Paperclip, FileText, Menu, X } from 'lucide-react';

const getAuthenticatedUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('blob:') || url.startsWith('data:')) return url;
  
  const token = localStorage.getItem('token');
  if (!token) return url;
  
  let fullUrl = url;
  if (url.startsWith('/')) {
    const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
    const parsedBase = apiBase.replace('/api/v1', '');
    fullUrl = `${parsedBase}${url}`;
  }
  
  const separator = fullUrl.includes('?') ? '&' : '?';
  return `${fullUrl}${separator}token=${token}`;
};

const ChatArea = ({ messages, activeContext, onMobileMenuOpen, onSendMessage, isSendingMessage, isLoading }) => {
  const scrollRef = useRef(null);
  const fileInputRef = useRef(null);
  const [inputValue, setInputValue] = useState('');
  const [attachedFile, setAttachedFile] = useState(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isSendingMessage]);

  const handleFileClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAttachedFile(file);
    }
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if ((!inputValue.trim() && !attachedFile) || isSendingMessage) return;
    onSendMessage(inputValue.trim(), attachedFile);
    setInputValue('');
    setAttachedFile(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const renderMessageContent = (message) => {
    const isImage = (url, type) => {
      if (!url) return false;
      if (type && type.startsWith('image/')) return true;
      if (type === 'image') return true;
      const lowerUrl = url.toLowerCase();
      return ['.png', '.jpg', '.jpeg', '.webp'].some(ext => lowerUrl.endsWith(ext));
    };

    // Support nested attachment format AND legacy fields
    const attachment = message.attachment || {
      fileUrl: message.fileUrl,
      fileName: message.fileName,
      fileType: message.fileType,
      mimeType: message.fileType
    };

    const hasAttachment = attachment && attachment.fileUrl;
    const authenticatedUrl = hasAttachment ? getAuthenticatedUrl(attachment.fileUrl) : '';

    return (
      <div
        className={`group relative max-w-[80%] rounded-4xl border px-7 py-5 transition-all ${
          message.role === 'assistant'
            ? 'border-white/3 bg-white/2 text-slate-200'
            : 'border-indigo-500/10 bg-indigo-500/3 text-white'
        }`}
      >
        {/* Render Attachment inline if exists */}
        {hasAttachment && (
          <div 
            onClick={() => window.open(authenticatedUrl, '_blank')}
            className="mb-3 max-w-sm rounded-2xl overflow-hidden border border-white/5 bg-slate-900/40 cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            title="Klik untuk membuka file"
          >
            {attachment.fileType === 'image' || isImage(attachment.fileUrl, attachment.mimeType) ? (
              <img 
                src={authenticatedUrl} 
                alt={attachment.fileName || "Uploaded Image"} 
                className="w-full h-auto object-cover max-h-60 rounded-xl"
              />
            ) : (
              <div className="flex items-center gap-3 p-4">
                <FileText className="h-8 w-8 text-indigo-400 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-white truncate">{attachment.fileName || 'Document'}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                    {attachment.mimeType ? attachment.mimeType.split('/')[1] || 'FILE' : 'FILE'}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        <p className="text-sm leading-relaxed whitespace-pre-wrap font-medium">
          {message.content || message.text}
        </p>
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 overflow-hidden">
      {/* HEADER */}
      <div className="flex h-16 md:h-20 items-center justify-between border-b border-white/3 bg-slate-900/30 px-6 backdrop-blur-xl shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={onMobileMenuOpen}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 hover:bg-white/5 hover:text-white transition-all md:hidden cursor-pointer"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              AiDen Global Assistant
            </h2>
            <p className="text-[10px] text-slate-400 font-semibold tracking-wide">
              {activeContext ? `Context: ${activeContext}` : 'Global Mode'}
            </p>
          </div>
        </div>
      </div>

      {/* MESSAGES */}
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="flex gap-2 items-center">
            <span className="h-3 w-3 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="h-3 w-3 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="h-3 w-3 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      ) : (
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 md:space-y-8">
          {messages.map((message, i) => (
            <div
              key={i}
              className={`flex items-start gap-5 animate-in fade-in slide-in-from-bottom-4 duration-500 ${
                message.role === 'assistant' ? 'flex-row' : 'flex-row-reverse'
              }`}
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-all ${
                  message.role === 'assistant'
                    ? 'bg-indigo-500/10 border-indigo-500/20 shadow-lg shadow-indigo-500/10'
                    : 'bg-white/2 border-white/5'
                }`}
              >
                {message.role === 'assistant' ? (
                  <Bot className="h-5 w-5 text-indigo-400" />
                ) : (
                  <User className="h-5 w-5 text-slate-500" />
                )}
              </div>

              {renderMessageContent(message)}
            </div>
          ))}
          {isSendingMessage && (
            <div className="flex items-start gap-5 flex-row animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border bg-indigo-500/10 border-indigo-500/20 shadow-lg shadow-indigo-500/10">
                <Bot className="h-5 w-5 text-indigo-400" />
              </div>
              <div className="group relative max-w-[80%] rounded-4xl border px-7 py-5 transition-all border-white/3 bg-white/2 text-slate-200 flex items-center gap-3">
                <span className="text-sm font-semibold text-slate-350">AiDen sedang mengetik</span>
                <div className="flex gap-1 items-center pt-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* CHAT INPUT */}
      <div className="p-4 md:p-8 bg-white/1 border-t border-white/3 bg-slate-950 shrink-0">
        <div className="max-w-4xl mx-auto space-y-4">
          {/* File Attachment Preview */}
          {attachedFile && (
            <div className="flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-4 py-2 rounded-2xl w-fit animate-in fade-in slide-in-from-bottom-2 duration-300">
              <FileText className="h-4 w-4 text-indigo-400 shrink-0" />
              <span className="text-xs text-slate-200 font-semibold truncate max-w-xs">{attachedFile.name}</span>
              <button 
                type="button" 
                onClick={() => setAttachedFile(null)}
                className="h-5 w-5 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all shrink-0 ml-1 cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="relative flex items-end gap-3 rounded-[2.5rem] border border-white/5 bg-white/1 p-3 focus-within:border-indigo-500/30 transition-all shadow-2xl">
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.webp" 
              className="hidden" 
            />
            <button 
              type="button" 
              onClick={handleFileClick} 
              className="h-12 w-12 rounded-full flex items-center justify-center text-slate-500 hover:text-indigo-400 hover:bg-white/5 transition-all shrink-0 cursor-pointer"
            >
              <Paperclip className="h-5 w-5" />
            </button>

            <textarea
              rows={1}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isSendingMessage}
              placeholder="Ask AiDen anything..."
              className="max-h-40 min-h-12 flex-1 resize-none bg-transparent px-2 py-3 text-sm text-white outline-none placeholder:text-slate-500 font-medium"
            />

            <div className="flex items-center gap-2">
              <button
                type="submit"
                disabled={isSendingMessage || (!inputValue.trim() && !attachedFile)}
                className={`h-12 w-12 rounded-full flex items-center justify-center text-white shadow-xl transition-all shrink-0 ${
                  isSendingMessage || (!inputValue.trim() && !attachedFile)
                    ? 'bg-white/5 border border-white/5 text-slate-700 cursor-not-allowed opacity-50 shadow-none'
                    : 'bg-indigo-500 shadow-indigo-500/20 hover:scale-105 active:scale-95 cursor-pointer'
                }`}
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </form>
          <p className="mt-4 text-center text-[9px] text-slate-500 font-black uppercase tracking-[0.2em]">
            AiDen Intelligence Engine • Version 2.0.4
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatArea;