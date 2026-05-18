import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, ChevronDown } from "lucide-react";
import ParticleBackground from "../../../components/ui/ParticleBackground";

const Hero = () => {
  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-linear-to-t from-violet-950 to-black"
    >
      <ParticleBackground />

      {/* Glow center */}
      <div className="absolute left-1/2 top-1/2 h-150 w-150 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/10 blur-3xl" />
      {/* Glow top-left accent */}
      <div className="absolute -left-32 top-0 h-80 w-80 rounded-full bg-blue-600/8 blur-3xl" />
      {/* Glow bottom-right accent */}
      <div className="absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-violet-500/8 blur-3xl" />

      <div className="relative z-10 w-full max-w-4xl px-6 pb-20 pt-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-7 inline-flex items-center gap-2 rounded-full border border-blue-500/25 bg-blue-500/10 px-4 py-2 backdrop-blur-sm"
          >
            <Sparkles size={13} color="#60a5fa" />
            <span className="text-[13px] text-blue-300 tracking-wide">
              Context-Aware AI Learning for students
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-6 text-[clamp(44px,5.5vw,68px)] font-black leading-[1.08] tracking-[-2px] text-white"
          >
            Belajar Lebih{" "}
            <span className="bg-[linear-gradient(135deg,#60a5fa,#a78bfa,#67e8f9)] bg-clip-text text-transparent">
              Cerdas
            </span>{" "}
            dengan AiDen
          </motion.h1>

          {/* Desc */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="mb-10 max-w-lg text-[17px] leading-[1.75] text-slate-400"
          >
            Upload PDF, lalu AI bantu kamu memahami isi materi, membuat summary,
            quiz, flashcard, dan chat berdasarkan konteks dokumenmu.
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-col items-center gap-4 sm:flex-row"
          >
            <Link to="/register">
              <button className="flex items-center gap-2.5 rounded-2xl bg-linear-to-br from-blue-500 to-violet-600 px-9 py-4 text-[15px] font-bold text-white shadow-[0_4px_24px_rgba(59,130,246,0.4)] transition-all duration-200 hover:scale-105 hover:shadow-[0_8px_32px_rgba(59,130,246,0.55)]">
                Mulai Gratis
                <ArrowRight size={16} />
              </button>
            </Link>
            <Link
              to="#features"
              onClick={(e) => {
                e.preventDefault();

                const section = document.getElementById("features");

                if (section) {
                  section.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }
              }}
            >
              <button className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-7 py-4 text-[15px] font-semibold text-slate-300 backdrop-blur-sm transition-all duration-200 hover:bg-white/10 hover:text-white">
                Lihat Fitur
              </button>
            </Link>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.9 }}
            className="mt-16 flex items-center gap-8 text-center"
          >
            {[
              { val: "5", label: "Fitur AI" },
              { val: "PDF", label: "Context-Aware" },
              { val: "100%", label: "Gratis" },
            ].map((s, i) => (
              <div key={i} className="flex flex-col items-center">
                <span className="text-2xl font-black text-white">{s.val}</span>
                <span className="text-[12px] text-slate-500">{s.label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown size={22} className="text-slate-500" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
