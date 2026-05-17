import { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FileText, Sparkles, Layers3, BrainCircuit, MessageCircle, Upload, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useDashboardStore from '../../features/dashboard/store/dashboardStore';
import WelcomeCard from '../../features/dashboard/components/WelcomeCard';
import StatCard from '../../features/dashboard/components/StatCard';
import QuickActions from '../../features/dashboard/components/QuickActions';
import Card from '../../components/ui/Card';
import { Star, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { QUICK_ACTIONS } from '../../features/dashboard/constants/dashboardData';

const ACTION_CONFIG = {
  document_uploaded:   { icon: Upload,        label: 'Dokumen Diupload' },
  chat_sent:           { icon: MessageCircle, label: 'Chat AI' },
  summary_generated:   { icon: Sparkles,      label: 'Summary Dibuat' },
  flashcard_generated: { icon: Layers3,       label: 'Flashcard Dibuat' },
  quiz_completed:      { icon: BrainCircuit,  label: 'Quiz Selesai' },
};

const formatTimeAgo = (dateStr) => {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Baru saja';
  if (diffMins < 60) return `${diffMins} menit lalu`;
  if (diffHours < 24) return `${diffHours} jam lalu`;
  if (diffDays === 1) return 'Kemarin';
  return `${diffDays} hari lalu`;
};

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { stats, favoriteWorkspaces, recentActivities, isLoading, fetchDashboard } = useDashboardStore();

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const DASHBOARD_STATS = [
    { id: 1, title: 'Documents', value: isLoading ? '...' : stats.totalDocuments, icon: FileText, color: 'blue', growth: null },
    { id: 2, title: 'AI Summary', value: isLoading ? '...' : stats.totalSummaries, icon: Sparkles, color: 'indigo', growth: null },
    { id: 3, title: 'Flashcards', value: isLoading ? '...' : stats.totalFlashcards, icon: Layers3, color: 'pink', growth: null },
    { id: 4, title: 'Quiz Completed', value: isLoading ? '...' : stats.totalQuizzes, icon: BrainCircuit, color: 'violet', growth: null },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* HERO */}
      <WelcomeCard user={user} />

      {/* STATS */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {DASHBOARD_STATS.map((stat) => (
          <StatCard
            key={stat.id}
            title={stat.title}
            value={stat.value}
            growth={stat.growth}
            icon={stat.icon}
            color={stat.color}
          />
        ))}
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
        {/* LEFT */}
        <div className="space-y-8 xl:col-span-2">
          <QuickActions actions={QUICK_ACTIONS} />

          {/* RECENT ACTIVITY */}
          <Card className="p-7">
            <div className="flex justify-between mb-8">
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight">Recent Activity</h2>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Timeline</p>
              </div>
              <Link to="/history" className="text-slate-500 mt-2 text-sm hover:text-blue-500 flex items-center gap-1">
                View All <ChevronRight className="h-5 w-5" />
              </Link>
            </div>

            <div className="space-y-4">
              {isLoading ? (
                [...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center gap-4 p-5 rounded-3xl border border-white/3 bg-white/2 animate-pulse">
                    <div className="h-12 w-12 rounded-2xl bg-white/5" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-40 rounded-full bg-white/5" />
                      <div className="h-2 w-24 rounded-full bg-white/5" />
                    </div>
                  </div>
                ))
              ) : recentActivities.length === 0 ? (
                <p className="text-slate-500 text-sm text-center py-8">Belum ada aktivitas</p>
              ) : (
                recentActivities.map((item) => {
                  const config = ACTION_CONFIG[item.actionType] || ACTION_CONFIG['document_uploaded'];
                  const Icon = config.icon;
                  return (
                    <div
                      key={item.id}
                      onClick={() => item.workspaceId && navigate(`/learning/workspace/${item.workspaceId}/content`)}
                      className={`flex items-center justify-between gap-5 rounded-3xl border border-white/3 bg-white/2 p-5 transition-all duration-300 hover:bg-white/5 group ${item.workspaceId ? 'cursor-pointer' : 'cursor-default'}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 group-hover:scale-110 transition-transform">
                          <Icon className="h-5 w-5 text-indigo-400" />
                        </div>
                        <div>
                          <h3 className="font-bold text-white group-hover:text-indigo-400 transition-colors">
                            {config.label}
                          </h3>
                          <p className="text-[10px] font-bold uppercase tracking-tighter mt-0.5 text-slate-500">
                            {item.workspaceTitle || 'Unknown'}
                          </p>
                        </div>
                      </div>
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">
                        {formatTimeAgo(item.createdAt)}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </Card>
        </div>

        {/* RIGHT */}
        <div className="space-y-8">
          <Card className="p-7">
            <div className="flex items-center justify-between gap-5 mb-8">
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight">Favorite Document</h2>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Your Fav</p>
              </div>
              <Star className="h-5 w-5 fill-amber-500 text-amber-500" />
            </div>

            <div className="space-y-4">
              {isLoading ? (
                [...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white/2 border border-white/5 animate-pulse">
                    <div className="h-10 w-10 rounded-xl bg-white/5" />
                    <div className="h-3 w-32 rounded-full bg-white/5" />
                  </div>
                ))
              ) : favoriteWorkspaces.length === 0 ? (
                <div className="text-center py-8 space-y-2">
                  <p className="text-slate-500 text-sm">Belum ada favorit</p>
                  <p className="text-slate-600 text-xs">Bintangi workspace di Learning page</p>
                </div>
              ) : (
                favoriteWorkspaces.map((ws) => (
                  <div
                    key={ws._id}
                    onClick={() => navigate(`/learning/workspace/${ws._id}/content`)}
                    className="flex items-center justify-between p-4 rounded-2xl bg-white/2 border border-white/5 hover:bg-white/4 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 group-hover:scale-110 transition-transform">
                        <FileText className="h-5 w-5" />
                      </div>
                      <h3 className="text-sm font-bold text-white line-clamp-1 group-hover:text-indigo-400 transition-colors">
                        {ws.title}
                      </h3>
                    </div>
                    <ExternalLink className="h-4 w-4 text-slate-600 group-hover:text-indigo-400 transition-colors" />
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;