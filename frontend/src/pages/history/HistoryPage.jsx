import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock3 } from 'lucide-react';
import useHistoryStore from '../../features/history/store/historyStore';
import HistoryCard from '../../features/history/components/HistoryCard';
import HistoryToolbar from '../../features/history/components/HistoryToolbar';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Pagination from '../../features/learning/components/Pagination';

// Skeleton loader
const HistorySkeleton = () => (
  <div className="space-y-6">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="rounded-3xl border border-white/5 bg-white/2 p-8 animate-pulse">
        <div className="flex gap-6">
          <div className="h-16 w-16 rounded-4xl bg-white/5 shrink-0" />
          <div className="flex-1 space-y-4">
            <div className="h-3 w-32 rounded-full bg-white/5" />
            <div className="h-6 w-64 rounded-full bg-white/5" />
            <div className="h-3 w-48 rounded-full bg-white/5" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

// Empty state
const EmptyHistory = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center space-y-6">
      <div className="text-6xl">📭</div>
      <div className="space-y-2">
        <h3 className="text-xl font-black text-white">Belum ada aktivitas</h3>
        <p className="text-slate-400 font-medium">
          Mulai dengan upload dokumen dan berlatih!
        </p>
      </div>
      <button
        onClick={() => navigate('/learning')}
        className="h-12 px-8 rounded-2xl bg-indigo-500 text-white text-sm font-black hover:scale-105 active:scale-95 transition-all duration-300"
      >
        Upload Dokumen →
      </button>
    </div>
  );
};

// Error state
const ErrorState = ({ message, onRetry }) => (
  <div className="flex flex-col items-center justify-center py-24 text-center space-y-6">
    <div className="text-6xl">⚠️</div>
    <div className="space-y-2">
      <h3 className="text-xl font-black text-white">Gagal memuat riwayat</h3>
      <p className="text-slate-400 font-medium">{message}</p>
    </div>
    <button
      onClick={onRetry}
      className="h-12 px-8 rounded-2xl bg-indigo-500 text-white text-sm font-black hover:scale-105 active:scale-95 transition-all duration-300"
    >
      Coba Lagi
    </button>
  </div>
);

const HistoryPage = () => {
  const {
    histories,
    isLoading,
    error,
    currentPage,
    totalPages,
    activeFilter,
    fetchHistory,
    setFilter,
    setPage,
  } = useHistoryStore();

  useEffect(() => {
    fetchHistory(1, 'all');
  }, [fetchHistory]);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* HERO */}
      <Card variant="glass" className="p-7">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-linear-to-br from-indigo-500 to-violet-500 shadow-lg shadow-indigo-500/20">
            <Clock3 className="h-8 w-8 text-white" />
          </div>
          <div className="max-w-3xl">
            <Badge variant="indigo" className="mb-3">Audit Logs</Badge>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white">
              Learning Activity Center
            </h1>
            <p className="mt-4 leading-relaxed text-slate-400 font-medium">
              Track semua interaksi AI, summary, flashcard, dan sesi belajar kamu dalam satu timeline.
            </p>
          </div>
        </div>
      </Card>

      {/* TOOLBAR */}
      <HistoryToolbar
        activeFilter={activeFilter}
        onFilterChange={setFilter}
      />

      {/* CONTENT */}
      {isLoading ? (
        <HistorySkeleton />
      ) : error ? (
        <ErrorState
          message={error}
          onRetry={() => fetchHistory(currentPage, activeFilter)}
        />
      ) : histories.length === 0 ? (
        <EmptyHistory />
      ) : (
        <div className="space-y-6">
          {histories.map((item) => (
            <HistoryCard
              key={item.id}
              actionType={item.actionType}
              workspaceTitle={item.workspaceTitle}
              workspaceId={item.workspaceId}
              metadata={item.metadata}
              createdAt={item.createdAt}
            />
          ))}

          {totalPages > 1 && (
            <div className="flex justify-center pt-8">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HistoryPage;