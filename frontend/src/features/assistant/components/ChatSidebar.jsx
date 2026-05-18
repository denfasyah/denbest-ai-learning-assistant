import { Plus, Search, MoreHorizontal, Clock3, Pencil, Trash2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const formatTime = (timeStr) => {
  if (!timeStr) return '';
  try {
    const date = new Date(timeStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
  } catch (e) {
    return timeStr;
  }
};

const SidebarContent = ({
  conversations,
  onSelect,
  onNewChat,
  openMenuId,
  setOpenMenuId,
  onMobileClose,
  showClose,
  activeConversationId,
}) => (
  <div className="flex h-full flex-col gap-6">
    <div className="flex items-center gap-3">
      <Button variant="primary" icon={Plus} onClick={onNewChat} className="w-full">
        New Conversation
      </Button>
      {showClose && (
        <button
          onClick={onMobileClose}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-400 hover:bg-white/10 hover:text-white transition-all"
        >
          <X className="h-5 w-5" />
        </button>
      )}
    </div>

    <div className="relative">
      <Input placeholder="Search chat..." icon={Search} className="bg-slate-900/40" />
    </div>

    <div className="flex-1 overflow-y-auto space-y-4">
      <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2">
        Recent Conversations
      </h3>

      <div className="space-y-2">
        {conversations.map((chat) => (
          <div
            key={chat.id}
            onClick={() => {
              onSelect(chat.id);
              onMobileClose();
            }}
            className={`group relative rounded-2xl border p-4 transition-all duration-300 cursor-pointer ${
              chat.id === activeConversationId
                ? 'border-indigo-500/30 bg-indigo-500/10'
                : 'border-white/5 bg-white/2 hover:bg-white/5 hover:border-white/10'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-sm text-white line-clamp-1 group-hover:text-indigo-400 transition-colors">
                  {chat.title}
                </h4>
                <p className="mt-1 text-xs text-slate-500 line-clamp-1">{chat.lastMessage}</p>
              </div>

              <div className="relative shrink-0">
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
              {formatTime(chat.time)}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const ChatSidebar = ({
  conversations,
  onSelect,
  onNewChat,
  openMenuId,
  setOpenMenuId,
  mobileOpen,
  onMobileClose,
  mobileOnly,
  desktopOnly,
  activeConversationId,
}) => {
  const contentProps = {
    conversations,
    onSelect,
    onNewChat,
    openMenuId,
    setOpenMenuId,
    onMobileClose,
    activeConversationId,
  };

  // Desktop mode — render konten langsung, tanpa drawer
  if (desktopOnly) {
    return <SidebarContent {...contentProps} showClose={false} />;
  }

  // Mobile mode — hanya render drawer overlay
  if (mobileOnly) {
    return (
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
              onClick={onMobileClose}
            />
            <motion.div
              key="drawer"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed left-0 top-0 z-50 h-full w-75 overflow-y-auto p-5"
              style={{
                background: 'rgba(10,10,30,0.97)',
                backdropFilter: 'blur(24px)',
                borderRight: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <SidebarContent {...contentProps} showClose={true} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }

  return null;
};

export default ChatSidebar;