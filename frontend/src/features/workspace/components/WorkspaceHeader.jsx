import { Link } from 'react-router-dom';
import { ArrowLeft, FileText, Clock3, HardDrive } from 'lucide-react';
import Card from '../../../components/ui/Card';
import useWorkspace from '../hooks/useWorkspace';

const WorkspaceHeader = () => {
  const { workspace, document } = useWorkspace();

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 KB";
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    const mb = kb / 1024;
    return `${mb.toFixed(1)} MB`;
  };

  const formatTime = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card className="p-6 bg-white/5 backdrop-blur-xl border-white/10 rounded-[2.5rem]">
      <Link
        to="/learning"
        className="mb-5 inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-indigo-400 font-bold uppercase tracking-widest group"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Back to Learning
      </Link>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-5">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-linear-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.1)]">
            <FileText className="h-8 w-8 text-indigo-400" />
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl font-black text-white tracking-tight leading-tight">
              {workspace?.title || "Loading Workspace..."}
            </h1>

            <div className="flex flex-wrap items-center gap-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">
              <div className="flex items-center gap-1.5">
                <Clock3 className="h-3.5 w-3.5 text-indigo-400" />
                Uploaded {formatTime(workspace?.createdAt)}
              </div>
              <span className="h-1 w-1 rounded-full bg-slate-800" />
              <div className="flex items-center gap-1.5">
                <span className="rounded-full bg-white/5 border border-white/5 px-3 py-1 text-indigo-400">
                  {document?.fileType?.toUpperCase() || "PDF"}
                </span>
              </div>
              <span className="h-1 w-1 rounded-full bg-slate-800" />
              <div className="flex items-center gap-1.5">
                <HardDrive className="h-3.5 w-3.5 text-indigo-400" />
                {formatFileSize(document?.sizeBytes)}
              </div>
               <span className="h-1 w-1 rounded-full bg-slate-800" />
               <span className="text-slate-400 normal-case font-medium italic">{document?.originalName || document?.fileName}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default WorkspaceHeader;
