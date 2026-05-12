import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

const Hero = () => {
  return (
    <section
      id="home"
      className="
        relative flex min-h-screen justify-center overflow-hidden
          bg-linear-to-t from-violet-950 to-black"
    >
      <div
        className="
          absolute left-1/2 top-1/2
          h-175 w-175
          -translate-x-1/2 -translate-y-1/2 
          rounded-full
          bg-violet-600/15
          blur-3xl
        "
      />
      <div
        className="
          relative z-10 w-full max-w-6xl
          px-6 pb-20 pt-32
        "
      >
        <div
          className="
            hero-grid grid items-center gap-16
            lg:grid-cols-2
          "
        >
          {/* LEFT */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <div
              className="
                mb-7 inline-flex items-center gap-2
                rounded-full border border-blue-500/25
                bg-blue-500/10
                px-4 py-2
              "
            >
              <Sparkles size={14} color="#60a5fa" />

              <span className="text-[13px] text-blue-300">
                Context-Aware AI Learning for students
              </span>
            </div>

            {/* Title */}
            <h1
              className="
                mb-6 text-[clamp(50px,5vw,62px)]
                font-black leading-tight text-white
              "
            >
              Belajar Lebih{" "}
              <span
                className="
                  bg-[linear-gradient(135deg,#60a5fa,#a78bfa,#67e8f9)]
                  bg-clip-text text-transparent
                "
              >
                Cerdas
              </span>{" "}
              dengan AiDen
            </h1>

            {/* Desc */}
            <p className="mb-10 max-w-xl text-lg leading-relaxed text-slate-400">
              Upload PDF, lalu AI bantu kamu memahami isi materi, membuat
              summary, quiz, flashcard, dan chat berdasarkan konteks dokumenmu.
            </p>

            {/* Button */}
            <Link to="/register">
              <button
                className=" flex items-center gap-2
                  rounded-xl
                  bg-linear-to-br from-blue-500 to-violet-500
                  px-8 py-5
                  text-sm font-bold text-white
                  shadow-[0_4px_15px_rgba(59,130,246,0.35)]
                  transition-all duration-200
                  hover:scale-105
                  hover:shadow-[0_6px_20px_rgba(59,130,246,0.5)]
                "
              >
                Mulai Gratis
                <ArrowRight size={16} />
              </button>
            </Link>
          </motion.div>

          {/* RIGHT */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div
              className="
                overflow-hidden rounded-3xl
                border border-white/10
                bg-white/5
                shadow-2xl backdrop-blur-lg
              "
            >
              <img
                src="/imgabout.png"
                alt="AI Learning Assistant"
                className="h-full w-full object-cover"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
