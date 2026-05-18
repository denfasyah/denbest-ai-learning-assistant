import { useRef, useEffect } from 'react';
import { Bot, User, Send, Paperclip, Mic, Sparkles, FileText, Menu } from 'lucide-react';

const ChatArea = ({ messages, activeContext, onMobileMenuOpen }) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-1 flex-col h-full overflow-hidden">
      {/* CHAT HEADER */}
      <div className="border-b border-white/3 p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-indigo-500/2 backdrop-blur-md">
        <div className="flex items-center gap-3 md:gap-4">
          {/* Hamburger — muncul di bawah xl */}
          <button
            onClick={onMobileMenuOpen}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-400 hover:bg-white/10 hover:text-white transition-all xl:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex h-10 w-10 md:h-12 md:w-12 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-500/30">
            <Sparkles className="h-4 w-4 md:h-5 md:w-5 text-indigo-400" />
          </div>

          <div>
            <h2 className="text-lg md:text-xl font-black text-white tracking-tight">AI Assistant</h2>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Quantum Engine Active</p>
          </div>
        </div>

        {activeContext && (
          <div className="flex items-center gap-3 rounded-2xl border border-indigo-500/10 bg-indigo-500/2 px-4 py-2 animate-in fade-in slide-in-from-right-4 duration-700">
            <FileText className="h-4 w-4 text-indigo-400 shrink-0" />
            <div className="min-w-0">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">Current Context</p>
              <h3 className="text-[11px] font-bold text-white truncate">{activeContext}</h3>
            </div>
          </div>
        )}
      </div>

      {/* CHAT MESSAGES */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-10 scrollbar-hide">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex items-start gap-5 ${
              message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
            } animate-in fade-in slide-in-from-bottom-4 duration-500`}
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

            <div
              className={`group relative max-w-[80%] rounded-4xl border px-7 py-5 transition-all ${
                message.role === 'assistant'
                  ? 'border-white/3 bg-white/2 text-slate-200'
                  : 'border-indigo-500/10 bg-indigo-500/3 text-white'
              }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap font-medium">
                {message.text}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* CHAT INPUT */}
      <div className="p-4 md:p-8 bg-white/1 border-t border-white/3">
        <div className="max-w-4xl mx-auto">
          <div className="relative flex items-end gap-3 rounded-[2.5rem] border border-white/5 bg-white/1 p-3 focus-within:border-indigo-500/30 transition-all shadow-2xl">
            <button className="h-12 w-12 rounded-full flex items-center justify-center text-slate-500 hover:text-indigo-400 hover:bg-white/5 transition-all shrink-0">
              <Paperclip className="h-5 w-5" />
            </button>

            <textarea
              rows={1}
              placeholder="Ask AiDen anything..."
              className="max-h-40 min-h-12 flex-1 resize-none bg-transparent px-2 py-3 text-sm text-white outline-none placeholder:text-slate-500 font-medium"
            />

            <div className="flex items-center gap-2">
              <button className="h-12 w-12 rounded-full hidden sm:flex items-center justify-center text-slate-500 hover:text-indigo-400 hover:bg-white/5 transition-all shrink-0">
                <Mic className="h-5 w-5" />
              </button>
              <button className="h-12 w-12 rounded-full flex items-center justify-center bg-indigo-500 text-white shadow-xl shadow-indigo-500/20 hover:scale-105 active:scale-95 transition-all shrink-0">
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
          <p className="mt-4 text-center text-[9px] text-slate-500 font-black uppercase tracking-[0.2em]">
            AiDen Intelligence Engine • Version 2.0.4
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatArea;