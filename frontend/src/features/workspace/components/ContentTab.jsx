import React from 'react';
import { BookOpen, FileText } from 'lucide-react';
import Card from '../../../components/ui/Card';

const ContentTab = ({ title }) => {
  return (
    <Card className="overflow-hidden border-white/10 bg-white/5 backdrop-blur-xl p-0">
      <div className="border-b border-white/[0.03] p-6 flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
          <BookOpen className="h-6 w-6 text-indigo-400" />
        </div>
        <div>
          <h2 className="text-lg font-black text-white tracking-tight leading-none">Document Preview</h2>
          <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-1.5">Interactive Viewer</p>
        </div>
      </div>

      <div className="p-8">
        <div className="flex h-[600px] items-center justify-center rounded-[2.5rem] border border-dashed border-white/10 bg-[#020204] group hover:border-indigo-500/30 transition-all cursor-default">
          <div className="text-center animate-in fade-in zoom-in duration-700">
            <div className="relative mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-[2rem] bg-indigo-500/5 group-hover:scale-110 transition-transform">
              <FileText className="h-12 w-12 text-indigo-500/50" />
            </div>
            <h3 className="text-2xl font-black text-white tracking-tight">Quantum View Engine</h3>
            <p className="mt-3 text-sm text-slate-500 font-medium max-w-[250px] mx-auto">
              Dynamic PDF rendering and text extraction will be initialized here.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ContentTab;
