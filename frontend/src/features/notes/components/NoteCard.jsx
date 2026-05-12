import { Pin, MoreHorizontal, Pencil, Trash2, Clock3 } from 'lucide-react';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';

const NoteCard = ({ 
  note, 
  onSelect, 
  onEdit, 
  onDelete, 
  onPin,
  openMenuId,
  setOpenMenuId
}) => {
  const isMenuOpen = openMenuId === note.id;

  return (
    <Card 
      hover 
      className="p-8 cursor-pointer relative group h-full flex flex-col border-white/3 transition-all duration-500"
      onClick={() => onSelect(note)}
    >
      {/* PIN & MENU */}
      <div className="absolute right-6 top-6 flex items-center gap-2">
        {note.pinned && (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/20">
            <Pin className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          </div>
        )}

        <div className="relative">
          <button 
            className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-white/5 text-slate-500 hover:text-white transition-all"
            onClick={(e) => {
              e.stopPropagation();
              setOpenMenuId(isMenuOpen ? null : note.id);
            }}
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-2xl border border-white/10 bg-[#0f111a] p-2 shadow-2xl z-20 animate-in fade-in zoom-in duration-200">
              <button 
                onClick={(e) => { e.stopPropagation(); onEdit(note); setOpenMenuId(null); }}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-slate-300 hover:bg-white/5 hover:text-indigo-400 transition-all"
              >
                <Pencil className="h-4 w-4" /> Edit Note
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); onPin(note.id); setOpenMenuId(null); }}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-slate-300 hover:bg-white/5 hover:text-amber-400 transition-all"
              >
                <Pin className="h-4 w-4" /> {note.pinned ? 'Unpin' : 'Pin Note'}
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); onDelete(note.id); setOpenMenuId(null); }}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-rose-500/80 hover:bg-rose-500/10 transition-all"
              >
                <Trash2 className="h-4 w-4" /> Delete Note
              </button>
            </div>
          )}
        </div>
      </div>

      {/* TAG */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Badge variant="indigo">{note.tag}</Badge>
        <div className="h-1 w-1 rounded-full bg-slate-700" />
        <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Personal Cloud</span>
      </div>

      <h3 className="text-xl font-black text-white leading-tight group-hover:text-indigo-400 transition-colors pr-12">
        {note.title}
      </h3>

      <p className="mt-4 text-sm text-slate-500 line-clamp-4 leading-relaxed flex-1 font-medium italic">
        {note.content}
      </p>

      <div className="mt-8 flex items-center gap-2 text-[10px] font-bold text-slate-600 uppercase tracking-widest pt-4 border-t border-white/2">
        <Clock3 className="h-3.5 w-3.5" />
        {note.updatedAt}
      </div>
    </Card>
  );
};

export default NoteCard;

