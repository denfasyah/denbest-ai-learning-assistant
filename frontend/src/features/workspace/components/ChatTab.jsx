import { Bot, User, Send, Paperclip } from 'lucide-react';
import Card from '../../../components/ui/Card';
import useWorkspace from '../hooks/useWorkspace';

const ChatTab = () => {
  const { workspace } = useWorkspace();
  
  // Placeholder messages for now
  const messages = [
    {
      role: "assistant",
      text: `Halo 👋 Saya sudah memahami isi dokumen ${workspace?.title || "ini"}. Ada bagian yang ingin dipelajari?`,
    }
  ];

  return (
    <Card className="flex flex-col h-full overflow-hidden p-0 border-white/10 bg-white/5 backdrop-blur-xl">
      {/* CHAT HEADER */}
      <div className="border-b border-white/3 p-6 flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
          <Bot className="h-6 w-6 text-indigo-400" />
        </div>
        <div>
          <h2 className="text-lg font-black text-white tracking-tight leading-none">AI Context Chat</h2>
          <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-1.5">Connected to Knowledge Base</p>
        </div>
      </div>

      {/* CHAT BODY */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 min-h-100">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex items-start gap-4 ${message.role === "user" ? "flex-row-reverse" : "flex-row"} animate-in fade-in slide-in-from-bottom-4 duration-500`}
          >
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-all ${
              message.role === "assistant" 
                ? "bg-indigo-500/10 border-indigo-500/20" 
                : "bg-white/2 border-white/5"
            }`}>
              {message.role === "assistant" 
                ? <Bot className="h-5 w-5 text-indigo-400" /> 
                : <User className="h-5 w-5 text-slate-500" />
              }
            </div>

            <div className={`max-w-[80%] rounded-4xl border px-6 py-4 ${
              message.role === "assistant"
                ? "border-white/3 bg-white/2 text-slate-200"
                : "border-indigo-500/10 bg-indigo-500/3 text-white"
            }`}>
              <p className="text-sm leading-relaxed whitespace-pre-wrap font-medium">
                {message.text}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* INPUT */}
      <div className="p-6 border-t border-white/3">
        <div className="flex items-end gap-3 rounded-[2.5rem] border border-white/5 bg-white/1 p-2.5 focus-within:border-indigo-500/30 transition-all">
          <button className="h-11 w-11 rounded-full flex items-center justify-center text-slate-600 hover:text-indigo-400 hover:bg-white/5 transition-all shrink-0">
            <Paperclip className="h-5 w-5" />
          </button>
          
          <textarea
            rows={1}
            placeholder="Ask AI about this document..."
            className="max-h-32 min-h-11 flex-1 resize-none bg-transparent px-2 py-2.5 text-sm text-white outline-none placeholder:text-slate-700 font-medium"
          />

          <button className="h-11 w-11 rounded-full flex items-center justify-center bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 hover:scale-105 active:scale-95 transition-all shrink-0">
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </Card>
  );
};

export default ChatTab;
