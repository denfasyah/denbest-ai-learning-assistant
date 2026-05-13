import { FileText } from 'lucide-react';
import useWorkspace from '../hooks/useWorkspace';

const ContentTab = () => {
  const { document } = useWorkspace();

  return (
    <div className="w-full">
      {/* Document Viewer - Full width */}
      <div className="rounded-[32px] bg-[#050816]/40 border border-white/5 backdrop-blur-xl overflow-hidden relative group">
        {/* Viewer Header */}
        <div className="h-12 bg-white/5 border-b border-white/5 flex items-center px-6 justify-between">
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Interactive View Engine</span>
          </div>
        </div>

        <div className="min-h-[400px] md:min-h-[600px] flex items-center justify-center p-8 md:p-12">
          <div className="text-center space-y-4">
            <div className="h-20 w-20 mx-auto rounded-3xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 group-hover:scale-110 transition-transform duration-500">
              <FileText className="h-10 w-10 text-indigo-400" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-black text-white tracking-tight">Quantum View Engine</h3>
              <p className="text-slate-500 text-[13px] font-medium max-w-sm mx-auto">
                High-fidelity document rendering and text extraction initialized for <span className="text-slate-300 italic">"{document?.originalName || "document"}"</span>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentTab;
