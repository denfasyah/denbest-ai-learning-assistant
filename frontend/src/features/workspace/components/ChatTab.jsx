import { useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, MessageSquarePlus } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import useWorkspace from '../hooks/useWorkspace';
import useChat from '../hooks/useChat';
import Card from '../../../components/ui/Card';

const ChatTab = () => {
  const { workspaceId } = useWorkspace();
  const { 
    messages, 
    inputValue, 
    setInputValue, 
    isLoading, 
    error, 
    sendMessage 
  } = useChat(workspaceId);

  const bottomRef = useRef(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const suggestedPrompts = [
    "Jelaskan konsep utama dalam dokumen ini",
    "Buat 3 poin ringkasan dari materi ini",
    "Apa istilah penting yang harus saya pahami?"
  ];

  const handleSuggestedClick = (prompt) => {
    sendMessage(prompt);
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto pb-12 h-[calc(100vh-280px)] min-h-150">
      <Card className="flex-1 flex flex-col p-0 border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden relative shadow-2xl">
        {/* CHAT HEADER */}
        <div className="border-b border-white/3 p-4 md:p-5 flex items-center justify-between bg-white/2 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-wider">Aiden Assistant</h3>
              <div className="flex items-center gap-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Document Context Active</span>
              </div>
            </div>
          </div>
          {isLoading && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5">
              <Sparkles className="h-3 w-3 text-indigo-400 animate-pulse" />
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Aiden is thinking</span>
            </div>
          )}
        </div>

        {/* MESSAGE LIST */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 custom-scrollbar">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-8 animate-in fade-in duration-700">
              <div className="h-20 w-20 rounded-3xl bg-indigo-500/5 border border-indigo-500/10 flex items-center justify-center">
                <MessageSquarePlus className="h-10 w-10 text-indigo-500/30" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black text-white tracking-tight">Belum ada percakapan</h3>
                <p className="text-slate-500 text-sm font-medium max-w-xs mx-auto">
                  Mulai tanya jawab dengan Aiden tentang isi dokumen ini untuk belajar lebih cepat.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full max-w-2xl px-4">
                {suggestedPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSuggestedClick(prompt)}
                    className="p-4 text-xs font-bold text-slate-400 border border-white/5 bg-white/2 rounded-2xl hover:bg-indigo-500/10 hover:border-indigo-500/20 hover:text-indigo-400 transition-all text-center leading-relaxed active:scale-95"
                  >
                    "{prompt}"
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg) => (
                <div 
                  key={msg.id || msg.createdAt}
                  className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
                >
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${
                    msg.role === 'user' 
                      ? 'bg-indigo-500 border-indigo-400 text-white shadow-lg shadow-indigo-500/20' 
                      : 'bg-white/5 border-white/10 text-slate-400'
                  }`}>
                    {msg.role === 'user' ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
                  </div>
                  
                  <div className={`flex flex-col gap-2 max-w-[85%] md:max-w-[70%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`px-5 py-4 rounded-3xl text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-indigo-500 text-white rounded-tr-none'
                        : 'bg-white/5 text-slate-200 border border-white/5 rounded-tl-none backdrop-blur-md'
                    }`}>
                      {msg.content === 'thinking' ? (
                        <div className="flex gap-1.5 py-1 items-center">
                          <span className="text-xs font-bold text-slate-400 mr-2 italic">AiDen sedang mengetik</span>
                          <div className="h-1.5 w-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                          <div className="h-1.5 w-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                          <div className="h-1.5 w-1.5 bg-indigo-400 rounded-full animate-bounce" />
                        </div>
                      ) : (
                        <div className="prose prose-invert prose-sm max-w-none prose-headings:text-white prose-strong:text-white prose-code:text-indigo-300 prose-pre:bg-black/30">
                          <ReactMarkdown>{msg.content}</ReactMarkdown>
                        </div>
                      )}
                    </div>
                    <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest px-1">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </>
          )}
        </div>

        {/* INPUT AREA */}
        <div className="p-4 md:p-6 bg-white/2 border-t border-white/3 shrink-0">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold text-center animate-in fade-in duration-300">
              {error}
            </div>
          )}
          
          <div className="relative flex items-end gap-3 max-w-4xl mx-auto">
            <div className="relative flex-1 group">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Tanya sesuatu tentang dokumen ini..."
                disabled={isLoading}
                rows={1}
                className="w-full bg-white/5 border border-white/10 rounded-2xl md:rounded-3xl py-4 pl-6 pr-14 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/50 transition-all resize-none min-h-14 max-h-32 custom-scrollbar disabled:opacity-50"
              />
              <div className="absolute right-3 bottom-2 md:bottom-2.5">
                <button
                  onClick={() => sendMessage()}
                  disabled={isLoading || !inputValue.trim()}
                  className={`flex h-10 w-10 items-center justify-center rounded-xl md:rounded-2xl transition-all duration-300 ${
                    isLoading || !inputValue.trim()
                      ? 'bg-white/5 text-slate-700 cursor-not-allowed'
                      : 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 hover:scale-105 active:scale-95'
                  }`}
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
          <p className="mt-3 text-center text-[9px] font-black text-slate-600 uppercase tracking-widest">
            Aiden can make mistakes. Check important info.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default ChatTab;
