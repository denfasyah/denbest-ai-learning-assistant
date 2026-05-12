import Card from '../../../components/ui/Card';

const AchievementGrid = ({ achievements }) => {
  return (
    <Card className="p-8 border-white/10 bg-white/5 backdrop-blur-xl">
      <div className="mb-10">
        <h2 className="text-2xl font-black text-white tracking-tight">Milestones</h2>
        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-2">Locked Learning Achievements</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {achievements.map((item, index) => {
          const Icon = item.icon;

          return (
            <div
              key={index}
              className="group relative overflow-hidden rounded-4xl border border-white/5 bg-white/1 p-7 transition-all hover:bg-white/3 hover:border-indigo-500/20"
            >
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-indigo-500 to-violet-500 text-white shadow-xl shadow-indigo-500/20 group-hover:scale-110 transition-transform">
                <Icon className="h-7 w-7" />
              </div>

              <h3 className="text-lg font-black text-white tracking-tight">
                {item.title}
              </h3>

              <p className="mt-3 text-xs font-medium leading-relaxed text-slate-500">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default AchievementGrid;
