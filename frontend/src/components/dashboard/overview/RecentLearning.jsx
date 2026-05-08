const RecentLearning = ({ items = [] }) => {
  return (
    <div className="mx-5 bg-linear-to-br from-slate-900 to-indigo-950 rounded-2xl shadow-sm p-5 md:p-6 mb-20">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg md:text-xl font-bold tracking-[-0.5px]">
          Recent Learning
        </h3>

        <button className="text-sm text-blue-500 hover:underline">
          View all
        </button>
      </div>

      {/* Content */}
      {items.length === 0 ? (
        <div className="text-sm text-slate-400 py-6 text-center border border-dashed rounded-xl">
          Belum ada aktivitas belajar terbaru
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition"
            >
              {/* Left */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-sm font-bold">
                  {item.title?.charAt(0) || "L"}
                </div>

                <div>
                  <p className="font-semibold text-sm md:text-base">
                    {item.title}
                  </p>
                  <p className="text-xs text-slate-400">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Right */}
              <div className="text-xs text-slate-400 whitespace-nowrap">
                {item.time}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentLearning;