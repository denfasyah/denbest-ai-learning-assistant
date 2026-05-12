import React from 'react';
import { Plus, Search, MoreHorizontal, Clock3, Pencil, Trash2 } from 'lucide-react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Card from '../../../components/ui/Card';

const ChatSidebar = ({ 
  conversations, 
  onSelect, 
  onNewChat, 
  openMenuId, 
  setOpenMenuId 
}) => {
  return (
    <div className="flex h-full flex-col gap-6">
      <Button 
        variant="primary" 
        icon={Plus} 
        onClick={onNewChat}
        className="w-full"
      >
        New Conversation
      </Button>

      <div className="relative">
        <Input 
          placeholder="Search chat..." 
          icon={Search} 
          className="bg-slate-900/40"
        />
      </div>

      <div className="flex-1 overflow-y-auto space-y-4">
        <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2">
          Recent Conversations
        </h3>

        <div className="space-y-2">
          {conversations.map((chat) => (
            <div
              key={chat.id}
              className={`
                group relative rounded-2xl border p-4 transition-all duration-300 cursor-pointer
                ${chat.active 
                  ? 'border-indigo-500/30 bg-indigo-500/10' 
                  : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/10'}
              `}
              onClick={() => onSelect(chat.id)}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <h4 className="font-bold text-sm text-white line-clamp-1 group-hover:text-indigo-400 transition-colors">
                    {chat.title}
                  </h4>
                  <p className="mt-1 text-xs text-slate-500 line-clamp-1">
                    {chat.lastMessage}
                  </p>
                </div>

                <div className="relative">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenuId(openMenuId === chat.id ? null : chat.id);
                    }}
                    className="p-1 rounded-lg hover:bg-white/10 text-slate-500 transition-colors"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                  
                  {openMenuId === chat.id && (
                    <div className="absolute right-0 mt-2 w-36 rounded-xl border border-white/10 bg-slate-900 p-1.5 shadow-2xl z-20 animate-in fade-in zoom-in duration-200">
                      <button className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 hover:bg-white/5">
                        <Pencil className="h-3.5 w-3.5" /> Rename
                      </button>
                      <button className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-rose-400 hover:bg-rose-500/10">
                        <Trash2 className="h-3.5 w-3.5" /> Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-3 flex items-center gap-1.5 text-[10px] text-slate-600 font-bold uppercase tracking-tighter">
                <Clock3 className="h-3 w-3" />
                {chat.time}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatSidebar;
