import { Link } from "react-router-dom";

const WelcomeCard = ({ user }) => {
  return (
    <div className="bg-linear-to-br from-slate-900 to-indigo-950 text-white rounded-2xl p-5 lg:p-8 shadow-lg flex flex-col md:flex-row md:items-center md:justify-between gap-6 mx-5 mt-5">
      
      {/* Left Content */}
      <div>
        <h2 className="text-xl md:text-2xl font-bold tracking-[-1px]">
          Selamat datang, {user?.name || "User"} 👋
        </h2>

        <p className="text-sm md:text-base text-slate-300 mt-2 max-w-xl">
          AiDen siap membantu kamu memahami materi, melacak progress, dan meningkatkan cara belajar secara lebih efektif.
        </p>

        <div className="mt-4 flex gap-2 flex-wrap">
          <span className="px-3 py-1 text-xs bg-white/10 rounded-full">
            AI Assistant
          </span>
          <span className="px-3 py-1 text-xs bg-white/10 rounded-full">
            Smart Learning
          </span>
          <span className="px-3 py-1 text-xs bg-white/10 rounded-full">
            Progress Tracking
          </span>
        </div>
      </div>

      {/* Right CTA */}
      <div className="flex flex-col md:items-end gap-3">
        <Link to={"/mylearning"} className="px-5 py-2 rounded-xl bg-linear-to-r from-blue-500 to-violet-500 text-white shadow-lg font-semibold hover:bg-slate-200 transition">
          Mulai Belajar
        </Link>

        <p className="text-xs text-slate-400">
          Tip: tanya AI untuk rangkuman materi
        </p>
      </div>
    </div>
  );
};

export default WelcomeCard;