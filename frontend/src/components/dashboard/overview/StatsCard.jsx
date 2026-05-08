
const StatsCard = () => {
  return (
     <div className="flex-1 px-5 py-10">
          {/* STATS */}
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {[
              {
                title: "Total Dokumen",
                value: "0",
              },
              {
                title: "Flashcard",
                value: "0",
              },
              {
                title: "Quiz AI",
                value: "0",
              },
              {
                title: "AI Chat",
                value: "0",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="
                  rounded-3xl
                  border border-white/10
                  bg-linear-to-br from-slate-900 to-indigo-950 p-6
                  backdrop-blur-xl
                "
              >
                <p className="text-sm text-slate-400">{item.title}</p>

                <h3 className="mt-3 text-4xl font-black">{item.value}</h3>
              </div>
            ))}
          </div>
        </div>
  )
}

export default StatsCard