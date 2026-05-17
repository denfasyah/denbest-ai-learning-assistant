import { useEffect } from 'react';
import useWorkspace from '../hooks/useWorkspace';
import { useAuth } from '../../../context/AuthContext';
import DocumentViewer from './DocumentViewer';

const ContentTab = () => {
  const { document, isLoading, refetch } = useWorkspace();
  // eslint-disable-next-line no-unused-vars
  const { user } = useAuth();
  const token = localStorage.getItem('token');

  // Polling implementation for processing status
  useEffect(() => {
    if (!document) return;
    if (['completed', 'failed'].includes(document.processingStatus)) return;

    let attempts = 0;
    const interval = setInterval(() => {
      attempts++;
      refetch();
      // Stop polling after 10 attempts (30 seconds)
      if (attempts >= 10) clearInterval(interval);
    }, 3000);

    return () => clearInterval(interval);
  }, [document?.processingStatus, refetch, document]);

  if (isLoading && !document) {
    return (
      <div className="w-full space-y-6 animate-pulse">
        <div className="h-12 w-full max-w-2xl rounded-2xl bg-white/5 border border-white/10" />
        <div className="h-150 w-full rounded-4xl bg-white/5 border border-white/10" />
      </div>
    );
  }

  if (!document) return null;

  // Construct authenticated file URL
  const fileUrl = `${import.meta.env.VITE_API_URL}${document.fileUrl}?token=${token}`;

  return (
    <div className="w-full min-w-0 animate-in fade-in duration-500">
      <DocumentViewer
        fileUrl={fileUrl}
        fileType={document.fileType}
        title={document.originalName || document.fileName}
        processingStatus={document.processingStatus}
      />
    </div>
  );
};

export default ContentTab;
