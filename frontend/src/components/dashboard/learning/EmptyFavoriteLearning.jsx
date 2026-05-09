import { Star } from "lucide-react";
const EmptyFavoriteLearning = () => {
  return (
    <div
      className="
                flex flex-col items-center justify-center
                rounded-4xl
                border border-dashed border-white/10
                bg-white/3
                px-6 py-20
                text-center
                backdrop-blur-xl
              "
    >
      <div
        className="
                  mb-6 flex h-20 w-20 items-center justify-center
                  rounded-full
                  bg-linear-to-br from-yellow-500/20 to-orange-500/20
                "
      >
        <Star className="h-10 w-10 text-yellow-400" />
      </div>

      <h2 className="text-2xl font-bold tracking-[-0.5px]">
        Tidak Ada Favorite
      </h2>

      <p className="mt-3 max-w-md text-sm text-slate-400">
        Dokumen yang kamu tandai sebagai favorite akan muncul di sini.
      </p>
    </div>
  );
};

export default EmptyFavoriteLearning;
