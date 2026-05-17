import { useAuth } from "../../context/AuthContext";
import { DASHBOARD_STATS, QUICK_ACTIONS, RECENT_ACTIVITIES } from "../../features/dashboard/constants/dashboardData";
import WelcomeCard from "../../features/dashboard/components/WelcomeCard";
import StatCard from "../../features/dashboard/components/StatCard";
import QuickActions from "../../features/dashboard/components/QuickActions";
import RecentActivity from "../../features/dashboard/components/RecentActivity";
import Card from "../../components/ui/Card";
import { FileText, Star } from "lucide-react";

const DashboardPage = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* HERO SECTION */}
      <WelcomeCard user={user} />

      {/* STATS GRID */}
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

      {/* MAIN CONTENT GRID */}
      <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
        {/* LEFT COLUMN */}
        <div className="space-y-8 xl:col-span-2">
          <QuickActions actions={QUICK_ACTIONS} />
          <RecentActivity activities={RECENT_ACTIVITIES} />
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-8">
          {/* LEARNING PROGRESS CARD */}
          <Card className="p-7">
            <div className="flex items-center justify-between gap-5 mb-8">
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight">Favorite Document</h2>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">your fav</p>
              </div>
              <div className="rounded-2xl bg-indigo-500/10 border border-indigo-500/20 px-4 py-2 text-sm font-black text-indigo-400">
                <Star className={`h-5 w-5 fill-amber-500`} />
              </div>
            </div>

            <div className="mt-10 space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-white/2 border border-white/5 hover:bg-white/4 transition-colors cursor-default group">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 group-hover:scale-110 transition-transform">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white line-clamp-1">React</h3>
                  </div>
                </div>
              </div>

               <div className="flex items-center justify-between p-4 rounded-2xl bg-white/2 border border-white/5 hover:bg-white/4 transition-colors cursor-default group">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 group-hover:scale-110 transition-transform">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white line-clamp-1">Vue Js</h3>
                  </div>
                </div>
              </div>

               <div className="flex items-center justify-between p-4 rounded-2xl bg-white/2 border border-white/5 hover:bg-white/4 transition-colors cursor-default group">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 group-hover:scale-110 transition-transform">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white line-clamp-1">Laravel</h3>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;