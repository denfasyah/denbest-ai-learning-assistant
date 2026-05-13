import { FileText, AlertTriangle, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';

const ProcessingState = () => (
  <div className="flex flex-col items-center justify-center py-32 gap-6 bg-white/5 border border-white/10 rounded-[32px] animate-in fade-in duration-500">
    <div className="h-16 w-16 flex items-center justify-center rounded-3xl bg-indigo-500/10 border border-indigo-500/20 shadow-lg shadow-indigo-500/5">
      <Loader2 className="h-8 w-8 text-indigo-400 animate-spin" />
    </div>
    <div className="text-center space-y-2">
      <h3 className="text-xl font-black text-white tracking-tight leading-tight">Mengekstraksi Pengetahuan...</h3>
      <p className="text-slate-500 text-sm font-medium max-w-xs mx-auto">
        AI sedang memproses dokumenmu. Ini mungkin memakan waktu beberapa saat.
      </p>
    </div>
  </div>
);

const FailedState = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center py-32 gap-8 bg-white/5 border border-white/10 rounded-[32px] animate-in zoom-in duration-500">
      <div className="h-20 w-20 flex items-center justify-center rounded-3xl bg-rose-500/10 border border-rose-500/20 text-rose-400 shadow-lg shadow-rose-500/5">
        <AlertTriangle className="h-10 w-10" />
      </div>
      <div className="text-center space-y-3 px-6">
        <h3 className="text-2xl font-black text-white tracking-tight leading-tight">Dokumen Tidak Dapat Dibaca</h3>
        <p className="text-slate-500 text-[13px] font-medium max-w-sm mx-auto leading-relaxed">
          PDF mungkin hanya berisi gambar/scan. Coba upload PDF yang berisi teks digital agar AI dapat memprosesnya.
        </p>
      </div>
      <Button 
        variant="primary" 
        onClick={() => navigate('/learning')}
        className="rounded-2xl h-12 px-8 font-black italic tracking-tight text-xs"
      >
        UPLOAD DOKUMEN BARU
      </Button>
    </div>
  );
};

const DocumentViewer = ({ fileUrl, fileType, title, processingStatus }) => {
  if (processingStatus === 'pending' || processingStatus === 'processing') {
    return <ProcessingState />;
  }

  if (processingStatus === 'failed') {
    return <FailedState />;
  }

  if (processingStatus === 'completed') {
    return (
      <div className="w-full min-w-0">
        <div className="rounded-[32px] bg-[#050816]/40 border border-white/5 backdrop-blur-xl overflow-hidden relative group w-full min-w-0 shadow-2xl">
          {/* Viewer Header */}
          <div className="h-12 bg-white/5 border-b border-white/5 flex items-center px-6 justify-between w-full">
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">
                Interactive View Engine — {fileType?.toUpperCase()} Mode
              </span>
            </div>
          </div>

          <div className="w-full min-h-[600px] flex">
            {fileType === 'pdf' ? (
              <iframe
                src={fileUrl}
                title={title}
                className="w-full h-full min-h-[700px] border-none"
              />
            ) : (
              <div className="w-full p-8 md:p-12 overflow-y-auto max-h-[800px] custom-scrollbar bg-[#050816]/20">
                <pre className="text-slate-300 text-sm md:text-base leading-relaxed whitespace-pre-wrap font-medium font-sans break-words">
                  {/* Content would be fetched separately if it's text, but for now we show the viewer wrapper */}
                  <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
                    <FileText className="h-12 w-12 text-indigo-500/40" />
                    <p className="text-slate-500">Text content rendering will be implemented with AI context extraction.</p>
                  </div>
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default DocumentViewer;
