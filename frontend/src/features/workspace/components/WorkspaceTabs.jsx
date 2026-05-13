import { useNavigate, useLocation } from "react-router-dom";
import { FileText, MessagesSquare, Sparkles, Layers3, BrainCircuit } from "lucide-react";

const WorkspaceTabs = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const tabs = [
    { id: 'content', label: 'Content', path: 'content', icon: FileText },
    { id: 'chat', label: 'Chat AI', path: 'chat', icon: MessagesSquare },
    { id: 'action', label: 'AI Action', path: 'action', icon: Sparkles },
    { id: 'flashcards', label: 'Flashcard', path: 'flashcards', icon: Layers3 },
    { id: 'quiz', label: 'Quiz', path: 'quiz', icon: BrainCircuit },
  ];

  return (
    <div className="mb-6 flex flex-wrap gap-2 p-1 bg-white/2 rounded-2xl border border-white/5 w-fit">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = location.pathname.endsWith(tab.path);

        return (
          <button
            key={tab.id}
            onClick={() => navigate(tab.path)}
            className={`
              flex items-center gap-2.5 rounded-xl px-5 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all duration-300
              ${isActive
                ? "bg-linear-to-r from-indigo-500 to-violet-500 text-white shadow-xl shadow-indigo-500/20 scale-105"
                : "text-slate-500 hover:bg-white/5 hover:text-white"
              }
            `}
          >
            <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-slate-600'}`} />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

export default WorkspaceTabs;
