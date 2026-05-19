import { useNavigate } from "react-router-dom";
import {
  Upload,
  MessageCircle,
  Sparkles,
  Layers3,
  BrainCircuit,
  ExternalLink,
  AlertTriangle,
  CalendarDays,
  FileText,
  Bot,
  NotebookPen,
  UserCircle,
  Settings
} from "lucide-react";
import Card from "../../../components/ui/Card";

const ACTION_CONFIG = {
  workspace_created: {
    icon: Upload,
    label: "Dokumen Diupload",
    color: "text-blue-400",
  },
  document_uploaded: {
    icon: Upload,
    label: "Dokumen Diupload",
    color: "text-blue-400",
  },
  chat_sent: {
    icon: MessageCircle,
    label: "Chat AI",
    color: "text-violet-400",
  },
  summary_generated: {
    icon: Sparkles,
    label: "Summary Dibuat",
    color: "text-amber-400",
  },
  flashcard_generated: {
    icon: Layers3,
    label: "Flashcard Dibuat",
    color: "text-emerald-400",
  },
  quiz_completed: {
    icon: BrainCircuit,
    label: "Quiz Selesai",
    color: "text-rose-400",
  },
  assistant_chat: {
    icon: Bot,
    label: "Assistant Chat",
    color: "text-indigo-400",
  },
  note_created: {
    icon: NotebookPen,
    label: "Note Dibuat",
    color: "text-teal-400",
  },
  profile: {
    icon: UserCircle,
    label: "Profil",
    color: "text-blue-500",
  },
  setting: {
    icon: Settings,
    label: "Pengaturan",
    color: "text-slate-400",
  },
};

const getCTA = (actionType, workspaceId, metadata) => {
  if (actionType === "assistant_chat") {
    return {
      label: "Buka Assistant",
      path: `/assistant?conversationId=${metadata?.conversationId}`
    };
  }
  if (actionType === "profile") {
    return { label: "Lihat Profil", path: "/profile" };
  }
  if (actionType === "setting") {
    return { label: "Lihat Pengaturan", path: "/setting" };
  }
  if (!workspaceId && actionType !== "note_created") return null;
  const base = workspaceId ? `/learning/workspace/${workspaceId}` : "";
  switch (actionType) {
    case "note_created":
      if (metadata?.noteDeleted) return null;
      return { label: "Lihat Notes", path: "/notes" };
    case "workspace_created":
    case "document_uploaded":
      return { label: "Buka Workspace", path: `${base}/content` };
    case "quiz_completed":
      return { label: "Lihat Hasil", path: `${base}/quiz` };
    case "summary_generated":
      return { label: "Lihat Summary", path: `${base}/summary` };
    case "flashcard_generated":
      return { label: "Latihan Flashcard", path: `${base}/flashcards` };
    case "chat_sent":
      return { label: "Lanjutkan Chat", path: `${base}/chat` };
    default:
      return { label: "Buka Workspace", path: base };
  }
};

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const HistoryCard = ({
  actionType,
  workspaceTitle,
  workspaceId,
  metadata,
  createdAt,
}) => {
  const navigate = useNavigate();
  const config =
    ACTION_CONFIG[actionType] || ACTION_CONFIG["workspace_created"];
  const Icon = config.icon;
  const cta = getCTA(actionType, workspaceId, metadata);
  const isNoteDeleted = actionType === 'note_created' && metadata?.noteDeleted === true;
  const isDeleted = (!workspaceId && actionType !== 'assistant_chat' && actionType !== 'note_created') || isNoteDeleted;

  return (
    <Card
      hover
      className="p-8 group border-white/3 transition-all duration-500 overflow-hidden relative"
    >
      {/* Background icon */}
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
        <Icon className={`h-24 w-24 ${config.color}`} />
      </div>

      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 relative z-10">
        <div className="flex flex-1 gap-6">
          {/* Icon */}
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-4xl bg-white/2 border border-white/5 group-hover:border-indigo-500/20 transition-all duration-500 shadow-2xl">
            <Icon className={`h-7 w-7 ${config.color}`} />
          </div>

          {/* Content */}
          <div className="flex-1 space-y-4">
            <div className="flex flex-wrap items-center gap-4">
              <span
                className={`text-[10px] font-black uppercase tracking-widest ${config.color}`}
              >
                {config.label}
              </span>
              <div className="h-1 w-1 rounded-full bg-slate-700" />
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                <CalendarDays className="h-3 w-3" />
                {formatDate(createdAt)}
              </div>
            </div>

            <h2 className="text-2xl font-black text-white tracking-tight leading-none group-hover:text-indigo-400 transition-colors">
              {metadata?.action || workspaceTitle || "Workspace Tidak Diketahui"}
            </h2>

            {/* Score badge untuk quiz */}
            {/* {actionType === 'quiz_completed' && metadata?.score !== undefined && (
              <p className="text-sm text-slate-400 font-medium">
                Score: <span className="text-white font-black">{metadata.score}/{metadata.totalQuestions}</span>
              </p>
            )} */}

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <div className="inline-flex items-center gap-3 rounded-2xl border border-white/5 bg-white/2 px-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <FileText className="h-4 w-4 text-indigo-500" />
                {metadata?.action || workspaceTitle}
              </div>

              {isDeleted && !isNoteDeleted && (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-[9px] font-black text-rose-500 uppercase tracking-widest">
                  <AlertTriangle className="h-3 w-3" />
                  Workspace Dihapus
                </div>
              )}

              {isNoteDeleted && (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-[9px] font-black text-rose-500 uppercase tracking-widest">
                  <AlertTriangle className="h-3 w-3" />
                  Note Dihapus
                </div>
              )}
            </div>

            {isDeleted && !isNoteDeleted && (
              <div className="mt-4 rounded-2xl bg-rose-500/2 border border-rose-500/10 p-5">
                <p className="text-[11px] text-rose-500/60 leading-loose font-bold uppercase tracking-widest">
                  Workspace telah dihapus. Riwayat aktivitas tetap tersimpan
                  sebagai referensi.
                </p>
              </div>
            )}

            {isNoteDeleted && (
              <div className="mt-4 rounded-2xl bg-rose-500/2 border border-rose-500/10 p-5">
                <p className="text-[11px] text-rose-500/60 leading-loose font-bold uppercase tracking-widest">
                  Note telah dihapus. Riwayat aktivitas tetap tersimpan sebagai referensi.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* CTA Button */}
        <div className="flex items-center shrink-0">
          <button
            onClick={() => cta && navigate(cta.path)}
            disabled={isDeleted || !cta}
            title={isDeleted ? "Workspace telah dihapus" : ""}
            className={`h-14 px-8 rounded-2xl flex items-center gap-3 text-xs font-black italic tracking-tighter transition-all duration-500 ${
              !isDeleted && cta
                ? "bg-indigo-500 text-white shadow-xl shadow-indigo-500/20 hover:scale-105 active:scale-95"
                : "bg-white/3 border border-white/5 text-slate-700 cursor-not-allowed opacity-50"
            }`}
          >
            {!isDeleted && cta ? cta.label : "Tidak Tersedia"}
            {!isDeleted && cta && <ExternalLink className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </Card>
  );
};

export default HistoryCard;
