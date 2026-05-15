import { Link } from 'react-router-dom';
import { ArrowLeft, FileText, Clock3, HardDrive } from 'lucide-react';
import Card from '../../../components/ui/Card';
import useWorkspace from '../hooks/useWorkspace';

const WorkspaceHeader = () => {
  const { workspace, document, isLoading } = useWorkspace();

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
    });
  };

  return (
    <Card variant="glass" className="p-6 md:p-8">
      <div className="flex flex-col gap-6">
        <Link
          to="/learning"
          className="inline-flex items-center gap-2 text-[10px] text-slate-500 transition hover:text-indigo-400 font-black uppercase tracking-widest"
        >
          <ArrowLeft className="h-3 w-3" />
          Back to Learning Center
        </Link>

        <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-8">
          <div className="relative h-16 w-16 shrink-0">
            {isLoading ? (
              <div className="absolute inset-0 rounded-3xl bg-white/5 animate-pulse" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center rounded-3xl bg-linear-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-500/30 shadow-lg shadow-indigo-500/10 text-indigo-400">
                <FileText className="h-8 w-8" />
              </div>
            )}
          </div>

          <div className="flex-1 space-y-4">
            <div className="space-y-1">
              {isLoading ? (
                <div className="w-full max-w-md h-8 bg-white/5 rounded-lg animate-pulse" />
              ) : (
                <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight leading-tight">
                  {workspace?.title}
                </h1>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
              <div className="flex items-center gap-2">
                <Clock3 className="h-4 w-4 text-indigo-500/60" />
                <span>{formatTime(workspace?.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-1 w-1 rounded-full bg-slate-800" />
                <span className="text-indigo-400">{document?.fileType?.toUpperCase() || "PDF"}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-1 w-1 rounded-full bg-slate-800" />
                <HardDrive className="h-4 w-4 text-indigo-500/60" />
                <span>{formatFileSize(document?.sizeBytes)}</span>
              </div>
              <div className="flex items-center gap-2 min-w-0">
                <div className="h-1 w-1 rounded-full bg-slate-800" />
                <span
                  title={document?.originalName || document?.fileName}
                  className="truncate italic normal-case font-medium text-slate-400 max-w-50 md:max-w-100"
                >
                  {document?.originalName || document?.fileName}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default WorkspaceHeader;
