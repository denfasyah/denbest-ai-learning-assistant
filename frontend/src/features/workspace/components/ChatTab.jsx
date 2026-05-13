import { Bot, User, Send } from 'lucide-react';
import Card from '../../../components/ui/Card';
import useWorkspace from '../hooks/useWorkspace';

const ChatTab = () => {
  const { workspace } = useWorkspace();
  
  const messages = [
    {
      role: "assistant",
      text: `Halo 👋 Saya sudah memahami isi dokumen ${workspace?.title || "ini"}. Ada bagian yang ingin kamu tanyakan atau diskusikan?`,
    }
  ];

  return (
    <div className="w-full max-w-5xl mx-auto pb-12">
      <Card className="flex flex-col p-0 border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden">
        {/* CHAT HEADER */}
        <div className="border-b border-white/3 p-5 flex items-center gap-3 bg-white/2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/20">
            <Bot className="h-5 w-5 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-base font-black text-white tracking-tight leading-none">AI Context Chat</h2>
            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-1">Full Width Knowledge Exchange</p>
          </div>
        </div>

        {/* CHAT BODY - No internal scroll, flows with page */}
        <div className="p-6 space-y-8 min-h-[400px]">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex items-start gap-4 ${message.role === "user" ? "flex-row-reverse" : "flex-row"} animate-in fade-in slide-in-from-bottom-2 duration-500`}
            >
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-all ${
                message.role === "assistant" 
                  ? "bg-indigo-500/10 border-indigo-500/20 shadow-lg shadow-indigo-500/5" 
                  : "bg-white/2 border-white/5"
              }`}>
                {message.role === "assistant" 
                  ? <Bot className="h-5 w-5 text-indigo-400" /> 
                  : <User className="h-5 w-5 text-slate-500" />
                }
              </div>

              <div className={`max-w-[85%] rounded-3xl border px-6 py-4 ${
                message.role === "assistant"
                  ? "border-white/5 bg-white/2 text-slate-200"
                  : "border-indigo-500/10 bg-indigo-500/5 text-white"
              }`}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap font-medium">
                  {message.text}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* INPUT - Fixed at bottom but flows with container */}
        <div className="p-6 border-t border-white/3 bg-white/2">
          <div className="flex items-center gap-4 rounded-3xl border border-white/5 bg-[#050816]/60 p-2 focus-within:border-indigo-500/30 transition-all">
            <input
              type="text"
              placeholder="Ask anything about the material..."
              className="flex-1 bg-transparent px-4 py-3 text-sm text-white outline-none placeholder:text-slate-700 font-medium"
            />

            <button className="h-10 w-10 rounded-full flex items-center justify-center bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 hover:scale-105 active:scale-95 transition-all shrink-0">
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ChatTab;
