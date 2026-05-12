import Card from '../../../components/ui/Card';

const RecentActivity = ({ activities }) => {
  return (
    <Card className="p-7">
      <div className="mb-8">
        <h2 className="text-2xl font-black text-white tracking-tight">Recent Activity</h2>
        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Timeline</p>
      </div>

      <div className="space-y-4">
        {activities.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between gap-5 rounded-3xl border border-white/3 bg-white/2 p-5 transition-all duration-300 hover:bg-white/5 group cursor-default"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 group-hover:scale-110 transition-transform">
                <item.icon className="h-5 w-5 text-indigo-400" />
              </div>

              <div>
                <h3 className="font-bold text-white group-hover:text-indigo-400 transition-colors">{item.title}</h3>
                <p className={`text-[10px] font-bold uppercase tracking-tighter mt-0.5 ${item.status === 'deleted' ? 'text-rose-500/50 line-through' : 'text-slate-500'}`}>
                  {item.description} {item.status === 'deleted' && '(Unavailable)'}
                </p>
              </div>
            </div>

            <div className="text-[10px] font-bold text-slate-700 uppercase tracking-widest whitespace-nowrap">
              {item.time}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};


export default RecentActivity;
