import { useNavigate } from 'react-router-dom';
import { 
  Clock3, Sparkles, Brain, Layers3, FileText, 
  Bot, CalendarDays, AlertTriangle, ExternalLink 
} from 'lucide-react';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';

const getActivityConfig = (type) => {
  const configs = {
    summary: { icon: Sparkles, color: "text-indigo-400" },
    quiz: { icon: Brain, color: "text-violet-400" },
    flashcard: { icon: Layers3, color: "text-pink-400" },
    document: { icon: FileText, color: "text-blue-400" },
    assistant: { icon: Bot, color: "text-emerald-400" },
    notes: { icon: FileText, color: "text-amber-400" },
  };
  return configs[type] || { icon: Clock3, color: "text-slate-400" };
};

const HistoryCard = ({ activity }) => {
  const navigate = useNavigate();
  const { icon: Icon, color } = getActivityConfig(activity.type);

  return (
    <Card hover className="p-8 group border-white/[0.03] transition-all duration-500 overflow-hidden relative">
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
         <Icon className={`h-24 w-24 ${color}`} />
      </div>

      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 relative z-10">
        <div className="flex flex-1 gap-6">
          {/* ICON */}
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[2rem] bg-white/[0.02] border border-white/5 group-hover:border-indigo-500/20 transition-all duration-500 shadow-2xl">
            <Icon className={`h-7 w-7 ${color}`} />
          </div>

          {/* CONTENT */}
          <div className="flex-1 space-y-4">
            <div className="flex flex-wrap items-center gap-4">
               <div className="flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${
                    activity.status === 'failed' ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]' : 
                    activity.status === 'active' ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]' : 
                    'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]'
                  }`} />
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{activity.status}</span>
               </div>
               <div className="h-1 w-1 rounded-full bg-slate-700" />
               <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  <CalendarDays className="h-3 w-3" />
                  {activity.time}
               </div>
            </div>

            <h2 className="text-2xl font-black text-white tracking-tight leading-none group-hover:text-indigo-400 transition-colors">
              {activity.title}
            </h2>

            <p className="text-sm leading-relaxed text-slate-500 max-w-4xl font-medium">
              {activity.description}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-4">
              <div className="inline-flex items-center gap-3 rounded-2xl border border-white/[0.05] bg-white/[0.02] px-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <FileText className="h-4 w-4 text-indigo-500" />
                {activity.file}
              </div>

              {!activity.resourceAvailable && (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-[9px] font-black text-rose-500 uppercase tracking-widest">
                   <AlertTriangle className="h-3 w-3" />
                   Legacy Archive
                </div>
              )}
            </div>

            {!activity.resourceAvailable && (
              <div className="mt-6 rounded-2xl bg-rose-500/[0.02] border border-rose-500/10 p-5 animate-in slide-in-from-top-2 duration-700">
                <p className="text-[11px] text-rose-500/60 leading-loose font-bold uppercase tracking-widest">
                  NOTE: Target resource has been archived or removed from active workspace. 
                  Reference record preserved for learning audit.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex items-center shrink-0">
          <button
            onClick={() => navigate(activity.route)}
            disabled={!activity.resourceAvailable}
            className={`h-14 px-8 rounded-2xl flex items-center gap-3 text-xs font-black italic tracking-tighter transition-all duration-500 ${
               activity.resourceAvailable 
               ? 'bg-indigo-500 text-white shadow-xl shadow-indigo-500/20 hover:scale-105 active:scale-95' 
               : 'bg-white/[0.03] border border-white/5 text-slate-700 cursor-not-allowed opacity-50'
            }`}
          >
            {activity.resourceAvailable ? 'RESTORE CONTEXT' : 'ARCHIVED'}
            {activity.resourceAvailable && <ExternalLink className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </Card>
  );
};

export default HistoryCard;

