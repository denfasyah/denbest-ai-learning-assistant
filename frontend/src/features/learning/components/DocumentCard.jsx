import { FileText, MoreVertical, Star, Trash2, Edit2, Play, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';

const DocumentCard = ({
  document,
  onFavorite,
  onRename,
  onDelete,
  formatTime,
  openMenuId,
  setOpenMenuId
}) => {
  const navigate = useNavigate();
  const isMenuOpen = openMenuId === document.id;

  return (
    <Card hover className="p-8 flex flex-col group h-full transition-all duration-500">
      {/* TOP HEADER */}
      <div className="flex items-start justify-between mb-5">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 border border-indigo-500/20 group-hover:bg-indigo-500/20 transition-all shrink-0">
          <FileText className="h-7 w-7 text-indigo-400" />
        </div>

         <h3 className="text-lg line-clamp-2 mr-8 font-black text-white leading-snug transition-colors">
          {document.title}
        </h3>


        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setOpenMenuId(isMenuOpen ? null : document.id);
            }}
            className="p-2 hover:bg-white/5 rounded-xl transition-colors text-slate-500 hover:text-white"
          >
            <MoreVertical className="h-5 w-5" />
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 mt-3 w-52 rounded-2xl border border-white/10 bg-[#0f111a] p-2 shadow-2xl z-20 animate-in fade-in zoom-in duration-200">
              <button
                onClick={(e) => { e.stopPropagation(); onRename(document.id, document.title); setOpenMenuId(null); }}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-slate-300 hover:bg-white/5 hover:text-indigo-400 transition-all"
              >
                <Edit2 className="h-4 w-4" /> Rename File
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(document.id); setOpenMenuId(null); }}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-rose-500/80 hover:bg-rose-500/10 transition-all"
              >
                <Trash2 className="h-4 w-4" /> Delete File
              </button>
            </div>
          )}
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="flex-1 space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant={document.favorite ? "amber" : "indigo"}>
            {document.favorite ? "Favorite" : "Workspace"}
          </Badge>
          <span className="text-[10px] text-slate-600 uppercase tracking-widest font-black">PDF Document</span>
        </div>

        {/* <h3 className="text-xl font-black text-white leading-snug group-hover:text-indigo-400 transition-colors">
          {document.title}
        </h3> */}

        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-600 uppercase tracking-widest">
          <Calendar className="h-3 w-3" />
          Added {formatTime(document.uploadTime)}
        </div>
      </div>

      {/* ACTIONS */}
      <div className="mt-8 flex items-center gap-3">
        <Button
          variant="primary"
          className="flex-1 h-12 rounded-2xl font-black italic tracking-tight"
          onClick={() => navigate(`/learning/workspace/${document.id}`)}
          icon={Play}
        >
          Start Learning
        </Button>
        <button
          onClick={(e) => { e.stopPropagation(); onFavorite(document.id); }}
          className={`h-12 w-12 flex items-center justify-center rounded-2xl border transition-all duration-300 ${document.favorite
              ? "bg-amber-500/10 border-amber-500/30 text-amber-500"
              : "bg-white/5 border-white/5 text-slate-500 hover:text-white hover:border-white/10"
            }`}
        >
          <Star className={`h-5 w-5 ${document.favorite ? "fill-amber-500" : ""}`} />
        </button>
      </div>
    </Card>
  );
};

export default DocumentCard;

