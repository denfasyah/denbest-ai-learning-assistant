
const WorkspaceTabs = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="mb-8 flex flex-wrap gap-3">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              flex items-center gap-2.5 rounded-2xl px-6 py-3.5 text-xs font-black uppercase tracking-widest transition-all duration-300
              ${isActive
                ? "bg-linear-to-r from-indigo-500 to-violet-500 text-white shadow-xl shadow-indigo-500/20 scale-105"
                : "border border-white/5 bg-white/2 text-slate-500 hover:bg-white/5 hover:text-white"
              }
            `}
          >
            <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-slate-600'}`} />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

export default WorkspaceTabs;
