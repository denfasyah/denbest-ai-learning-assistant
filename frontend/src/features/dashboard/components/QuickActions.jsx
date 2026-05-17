import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import Card from '../../../components/ui/Card';

const QuickActions = ({ actions }) => {
  const navigate = useNavigate();

  const handleAction = (title) => {
    switch (title) {
      case "Upload Document":
      case "Generate Summary":
      case "Create Flashcards":
        navigate("/learning");
        break;
      case "Open AI Assistant":
        navigate("/assistant");
        break;
      default:
        break;
    }
  };
  return (
    <Card className="p-7">
      <div className="flex items-center justify-between gap-5 mb-8">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">Quick Actions</h2>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">AI-Powered Tools</p>
        </div>

      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {actions.map((item) => (
          <button
            key={item.id}
            onClick={() => handleAction(item.title)}
            className="group flex items-center justify-between rounded-3xl border border-white/3 bg-white/2 p-5 text-left transition-all duration-300 hover:border-indigo-500/30 hover:bg-white/5 shadow-2xl"
          >
            <div className="flex items-center gap-4">
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-${item.color || 'indigo'}-500/10 text-${item.color || 'indigo'}-400 group-hover:scale-110 transition-transform`}>
                <item.icon className="h-6 w-6" />
              </div>

              <div>
                <h3 className="font-bold text-white group-hover:text-indigo-400 transition-colors">{item.title}</h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter mt-0.5">{item.description}</p>
              </div>
            </div>

            <ChevronRight className="h-5 w-5 text-slate-700 transition-all duration-300 group-hover:translate-x-1 group-hover:text-indigo-400" />
          </button>
        ))}
      </div>
    </Card>
  );
};


export default QuickActions;
