import { Link } from 'react-router-dom';
import { ArrowLeft, FileText, Clock3 } from 'lucide-react';
import Card from '../../../components/ui/Card';

const WorkspaceHeader = ({ title, uploadTime, size }) => {
  return (
    <Card className="p-6 mb-8 bg-white/5 backdrop-blur-xl border-white/10">
      <Link
        to="/learning"
        className="mb-5 inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-indigo-400 font-bold uppercase tracking-widest"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Learning
      </Link>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-5">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-linear-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-500/30">
            <FileText className="h-8 w-8 text-indigo-400" />
          </div>

          <div>
            <h1 className="text-2xl font-black text-white tracking-tight leading-tight">
              {title}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">
              <div className="flex items-center gap-1.5">
                <Clock3 className="h-3.5 w-3.5 text-indigo-400" />
                Uploaded {uploadTime}
              </div>
              <span className="h-1 w-1 rounded-full bg-slate-800" />
              <span className="rounded-full bg-white/5 border border-white/5 px-3 py-1 text-slate-400">PDF</span>
              <span className="h-1 w-1 rounded-full bg-slate-800" />
              <span className="text-slate-400">{size}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default WorkspaceHeader;
