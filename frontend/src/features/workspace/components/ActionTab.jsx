import React from 'react';
import { 
  Sparkles, 
  BrainCircuit, 
  RefreshCw, 
  Copy, 
  Save, 
  Loader2,
  FileText,
  AlertCircle
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import Swal from 'sweetalert2';
import useWorkspace from '../hooks/useWorkspace';
import useSummary from '../hooks/useSummary';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';

const ActionTab = () => {
  const { workspaceId } = useWorkspace();
  const { 
    summary, 
    isLoading, 
    isGenerating, 
    error, 
    hasExisting, 
    generateSummary, 
    regenerateSummary 
  } = useSummary(workspaceId);

  const handleRegenerate = async () => {
    const result = await Swal.fire({
      title: 'Regenerate Summary?',
      text: 'Ini akan menghapus ringkasan lama dan membuat yang baru menggunakan AI.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, Regenerate!',
      cancelButtonText: 'Batal',
      background: '#0f172a',
      color: '#fff',
      confirmButtonColor: '#6366f1',
      cancelButtonColor: '#334155',
      customClass: {
        popup: 'rounded-3xl border border-white/10 shadow-2xl',
        title: 'font-black tracking-tight',
        htmlContainer: 'text-slate-400 font-medium',
        confirmButton: 'rounded-xl font-bold px-6 py-3',
        cancelButton: 'rounded-xl font-bold px-6 py-3'
      }
    });

    if (result.isConfirmed) {
      regenerateSummary();
    }
  };

  const handleCopy = () => {
    if (summary?.content) {
      navigator.clipboard.writeText(summary.content);
      Swal.fire({
        icon: 'success',
        title: 'Copied!',
        text: 'Ringkasan berhasil di-copy ke clipboard.',
        timer: 1500,
        showConfirmButton: false,
        background: '#1e293b',
        color: '#fff',
        toast: true,
        position: 'top-end'
      });
    }
  };

  // State 1 — Loading awal (fetch existing)
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-pulse">
        <Loader2 className="h-10 w-10 text-indigo-500 animate-spin mb-4" />
        <p className="text-slate-400 font-medium">Memeriksa ringkasan...</p>
      </div>
    );
  }

  // State 3 — isGenerating
  if (isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white/5 border border-white/10 rounded-3xl">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full animate-pulse"></div>
          <Loader2 className="h-16 w-16 text-indigo-400 animate-spin relative z-10" />
        </div>
        <h2 className="text-xl font-black text-white tracking-tight mb-2">AI sedang membaca dokumen...</h2>
        <p className="text-slate-500 font-medium mb-6">Estimasi: 10–30 detik</p>
        <div className="w-64 h-2 bg-white/5 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 w-1/3 animate-progress"></div>
        </div>
      </div>
    );
  }

  // State 4 — Summary ready
  if (hasExisting && summary) {
    return (
      <div className="space-y-6 pb-12">
        <Card className="overflow-hidden border-white/10 bg-white/5 rounded-3xl">
          {/* Header */}
          <div className="p-6 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/[0.02]">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <FileText className="h-5 w-5 text-indigo-400" />
                <h2 className="text-xl font-black text-white tracking-tight">📋 Ringkasan Dokumen</h2>
              </div>
              <p className="text-xs font-medium text-slate-500">
                Terakhir diperbarui: {new Date(summary.generatedAt).toLocaleString('id-ID', { 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            <Button 
              variant="secondary" 
              size="sm"
              icon={RefreshCw}
              onClick={handleRegenerate}
              className="text-xs font-bold rounded-xl"
            >
              Regenerate
            </Button>
          </div>

          {/* Content */}
          <div className="p-8 prose prose-invert prose-slate max-w-none prose-headings:font-black prose-headings:tracking-tight prose-p:text-slate-300 prose-p:leading-relaxed prose-li:text-slate-300">
            <ReactMarkdown>
              {summary.content}
            </ReactMarkdown>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-white/10 flex gap-4 bg-white/[0.02]">
            <Button 
              variant="secondary" 
              icon={Copy}
              onClick={handleCopy}
              className="flex-1 rounded-xl font-black italic tracking-tight text-xs"
            >
              Copy to Clipboard
            </Button>
            <div className="flex-1 group relative">
              <Button 
                variant="secondary" 
                icon={Save}
                disabled
                className="w-full rounded-xl font-black italic tracking-tight text-xs opacity-50"
              >
                Save to Notes
              </Button>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-slate-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                Coming soon
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // State 2 — Belum ada summary / Error
  return (
    <div className="w-full pb-12">
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Summary Card */}
        <Card hover className="p-8 group bg-white/5 border-white/10 rounded-3xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Sparkles className="h-24 w-24 text-indigo-400" />
          </div>
          
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 border border-indigo-500/20 group-hover:scale-110 transition-transform relative z-10">
            <Sparkles className="h-7 w-7 text-indigo-400" />
          </div>

          <div className="relative z-10">
            <h2 className="text-xl font-black text-white tracking-tight">Generate Summary</h2>
            <p className="mt-3 text-sm font-medium leading-relaxed text-slate-500">
              Belum ada ringkasan untuk dokumen ini. AI akan mengekstrak konsep kunci dan membuat tinjauan komprehensif.
            </p>

            <Button 
              variant="primary" 
              className="mt-8 w-full rounded-xl h-12 font-black italic tracking-tight text-xs"
              icon={Sparkles}
              onClick={generateSummary}
            >
              ✨ Generate Summary
            </Button>
          </div>
        </Card>

        {/* Explain Material (Mock) */}
        <Card hover className="p-8 group bg-white/5 border-white/10 rounded-3xl opacity-60">
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/10 border border-violet-500/20">
            <BrainCircuit className="h-7 w-7 text-violet-400" />
          </div>

          <h2 className="text-xl font-black text-white tracking-tight">Explain Material</h2>
          <p className="mt-3 text-sm font-medium leading-relaxed text-slate-500">
            Penjelasan sederhana untuk topik kompleks yang ditemukan dalam materi pembelajaran Anda.
          </p>

          <Button 
            variant="secondary" 
            disabled
            className="mt-8 w-full rounded-xl h-12 font-black italic tracking-tight text-xs"
          >
            Coming Soon
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default ActionTab;

