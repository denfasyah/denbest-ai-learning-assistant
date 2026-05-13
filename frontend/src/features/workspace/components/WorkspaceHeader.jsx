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
    <Card variant="glass" className="p-4 md:p-6">
      <div className="flex flex-col gap-4">
        <Link
          to="/learning"
          className="inline-flex items-center gap-2 text-[10px] text-slate-500 transition hover:text-indigo-400 font-black uppercase tracking-widest"
        >
          <ArrowLeft className="h-3 w-3" />
          Back to Learning
        </Link>

        <div className="flex items-start md:items-center gap-3 md:gap-4">
          <div className="relative h-10 w-10 md:h-12 md:w-12 shrink-0 mt-1 md:mt-0">
            {isLoading ? (
              <div className="absolute inset-0 rounded-xl md:rounded-2xl bg-white/5 animate-pulse" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center rounded-xl md:rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                <FileText className="h-5 w-5 md:h-6 md:w-6" />
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1 space-y-1">
            <div className="relative min-h-[1.5rem] md:h-7 flex items-center">
              {isLoading ? (
                <div className="w-48 h-5 bg-white/5 rounded animate-pulse" />
              ) : (
                <h1 
                  title={workspace?.title}
                  className="text-base md:text-xl font-black text-white tracking-tight truncate leading-tight"
                >
                  {workspace?.title}
                </h1>
              )}
            </div>

            <div className="relative min-h-[1rem] md:h-5 flex items-center">
              {isLoading ? (
                <div className="w-64 h-3 bg-white/5 rounded-full animate-pulse" />
              ) : (
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[9px] md:text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  <div className="flex items-center gap-1 shrink-0">
                    <Clock3 className="h-3 w-3" />
                    {formatTime(workspace?.createdAt)}
                  </div>
                  <span className="hidden md:inline text-slate-800">·</span>
                  <span className="text-indigo-400 shrink-0">{document?.fileType?.toUpperCase() || "PDF"}</span>
                  <span className="text-slate-800">·</span>
                  <div className="flex items-center gap-1 shrink-0">
                    <HardDrive className="h-3 w-3" />
                    {formatFileSize(document?.sizeBytes)}
                  </div>
                  <span className="hidden md:inline text-slate-800">·</span>
                  <span 
                    title={document?.originalName || document?.fileName}
                    className="truncate max-w-[120px] md:max-w-[300px] italic normal-case font-medium text-slate-600 block md:inline"
                  >
                    {document?.originalName || document?.fileName}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default WorkspaceHeader;
