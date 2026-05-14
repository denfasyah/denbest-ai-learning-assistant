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
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-3 sm:flex items-center gap-5 p-1  rounded-2xl border border-white/5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = location.pathname.endsWith(tab.path);

          return (
            <button
              key={tab.id}
              onClick={() => navigate(tab.path)}
              className={`
                flex items-center gap-2 rounded-xl px-5 py-2.5 text-[10px] font-black uppercase bg-white/2 tracking-widest transition-all duration-300 shrink-0
                ${isActive
                  ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                  : "text-slate-500 hover:bg-white/5 hover:text-slate-300"
                }
              `}
            >
              <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-white' : 'text-slate-600'}`} />
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default WorkspaceTabs;
