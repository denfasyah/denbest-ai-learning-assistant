import { motion } from "framer-motion";
import {
  FileSearch,
  MessageCircle,
  CreditCard,
  LayoutTemplate,
  BookOpen,
} from "lucide-react";
import { Link } from "react-router-dom";
import ParticleBackground from "../../../components/ui/ParticleBackground";

const FEATURES = [
  {
    icon: FileSearch,
    title: "AI Summary",
    desc: "Ringkas materi panjang secara otomatis menjadi poin utama yang mudah dipahami.",
    tag: "Hemat Waktu",
    color: "#3B82F6",
    gradient: "linear-gradient(135deg, #3B82F6, #2563eb)",
    glow: "rgba(59,130,246,0.35)",
    border: "rgba(59,130,246,0.25)",
  },
  {
    icon: MessageCircle,
    title: "AI Chat",
    desc: "Tanya apa saja — AI menjawab langsung berdasarkan isi dokumenmu dengan akurasi tinggi.",
    tag: "Context-Aware",
    color: "#8B5CF6",
    gradient: "linear-gradient(135deg, #8B5CF6, #6d28d9)",
    glow: "rgba(139,92,246,0.35)",
    border: "rgba(139,92,246,0.25)",
  },
  {
    icon: CreditCard,
    title: "Flashcard Generator",
    desc: "Kartu belajar otomatis dari materi untuk mengingat konsep dengan metode spaced-repetition.",
    tag: "Hafal Cepat",
    color: "#ec4899",
    gradient: "linear-gradient(135deg, #ec4899, #db2777)",
    glow: "rgba(236,72,153,0.35)",
    border: "rgba(236,72,153,0.25)",
  },
  {
    icon: LayoutTemplate,
    title: "Quiz Generator",
    desc: "Latih pemahaman dengan soal pilihan ganda yang digenerate langsung dari materimu.",
    tag: "Siap Ujian",
    color: "#f59e0b",
    gradient: "linear-gradient(135deg, #f59e0b, #d97706)",
    glow: "rgba(245,158,11,0.35)",
    border: "rgba(245,158,11,0.25)",
  },
  {
    icon: BookOpen,
    title: "PDF Viewer",
    desc: "Baca dokumen langsung di platform tanpa perlu buka aplikasi lain. All-in-one.",
    tag: "All-in-one",
    color: "#10b981",
    gradient: "linear-gradient(135deg, #10b981, #059669)",
    glow: "rgba(16,185,129,0.35)",
    border: "rgba(16,185,129,0.25)",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      delay: i * 0.09,
      ease: "easeOut",
    },
  }),
};

const Features = () => (
  <section
    id="features"
    className="relative flex min-h-screen justify-center overflow-hidden bg-linear-to-b from-violet-950 via-[#070b1d] to-[#04060f] py-24"
  >
    <ParticleBackground />

    {/* Ambient background glow */}
    <div className="absolute left-[-10%] top-20 h-105 w-105 rounded-full bg-blue-500/20 blur-[140px]" />
    <div className="absolute bottom-10 right-[-10%] h-105 w-105 rounded-full bg-violet-500/20 blur-[140px]" />

    <div className="relative z-10 mx-auto max-w-6xl px-6">
      {/* Header */}
      <div className="mx-auto mb-20 max-w-2xl text-center">
        <span className="mb-5 inline-block rounded-full border border-blue-500/25 bg-blue-500/10 px-4 py-1.5 text-[13px] font-bold text-blue-300 backdrop-blur-xl">
          Fitur Unggulan
        </span>

        <h2 className="mb-4 text-[clamp(28px,4vw,44px)] font-black leading-tight tracking-[-0.8px] text-slate-100">
          Semua yang Kamu Butuhkan untuk{" "}
          <span className="bg-linear-to-r from-blue-400 via-cyan-300 to-violet-400 bg-clip-text text-transparent">
            Belajar Lebih Efektif
          </span>
        </h2>

        <p className="text-[17px] leading-relaxed text-slate-400">
          Fitur-fitur berbasis AI yang dirancang khusus mendukung proses belajar
          mahasiswa Indonesia.
        </p>
      </div>

      {/* Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f, i) => (
          <motion.div
            key={f.title}
            custom={i}
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-30px" }}
            whileHover={{
              y: -10,
              scale: 1.015,
            }}
            className="group relative overflow-hidden rounded-[26px] p-px"
            style={{
              background: `linear-gradient(135deg, ${f.border}, rgba(255,255,255,0.06))`,
            }}
          >
            {/* Outer glow */}
            <div
              className="absolute inset-0 opacity-0 blur-2xl transition-all duration-500 group-hover:opacity-100"
              style={{
                background: `radial-gradient(circle at center, ${f.glow}, transparent 70%)`,
              }}
            />

            {/* Card */}
            <div
              className="
                relative h-full overflow-hidden rounded-[25px]
                border border-white/10
                bg-white/5
                backdrop-blur-2xl
                p-7
                transition-all duration-500
                group-hover:border-white/20
              "
            >
              {/* Top gradient line */}
              <div
                className="absolute left-0 top-0 h-0.5 w-full opacity-70"
                style={{
                  background: f.gradient,
                }}
              />

              {/* Hover orb */}
              <div
                className="
                  absolute -right-10 -top-10
                  h-40 w-40 rounded-full
                  opacity-40 blur-3xl
                  transition-all duration-700
                  group-hover:scale-150
                "
                style={{
                  background: f.glow,
                }}
              />

              {/* Bottom glow */}
              <div
                className="
                  absolute -bottom-15 left-1/2
                  h-40 w-40 -translate-x-1/2
                  rounded-full blur-3xl
                  opacity-0 transition-all duration-500
                  group-hover:opacity-100
                "
                style={{
                  background: f.glow,
                }}
              />

              <div className="relative z-10">
                {/* Icon */}
                <div
                  className="
                    mb-5 flex h-14 w-14 items-center justify-center
                    rounded-2xl
                    border border-white/10
                    transition-all duration-500
                    group-hover:scale-110
                  "
                  style={{
                    background: f.gradient,
                    boxShadow: `0 15px 40px ${f.glow}`,
                  }}
                >
                  <f.icon className="h-6 w-6 text-white" />
                </div>

                {/* Tag */}
                <span
                  className="
                    mb-4 inline-flex items-center
                    rounded-full px-3 py-1
                    text-[11px] font-extrabold
                    backdrop-blur-xl
                  "
                  style={{
                    background: `${f.glow}`,
                    color: f.color,
                    border: `1px solid ${f.border}`,
                    boxShadow: `0 0 20px ${f.glow}`,
                  }}
                >
                  {f.tag}
                </span>

                <h3 className="mb-3 text-[20px] font-extrabold tracking-[-0.3px] text-white">
                  {f.title}
                </h3>

                <p className="text-[15px] leading-relaxed text-slate-300">
                  {f.desc}
                </p>
              </div>
            </div>
          </motion.div>
        ))}

        {/* CTA Card */}
        <motion.div
          custom={FEATURES.length}
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          whileHover={{
            y: -10,
            scale: 1.015,
          }}
          className="
            group relative overflow-hidden rounded-[26px]
            border border-violet-500/20
            bg-white/6
            p-8
            backdrop-blur-2xl
          "
        >
          {/* Glow */}
          <div className="absolute inset-0 bg-linear-to-br from-violet-500/10 to-blue-500/10 opacity-0 transition-all duration-500 group-hover:opacity-100" />

          <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-violet-500/30 blur-3xl" />

          <div className="absolute -bottom-16 -left-16 h-52 w-52 rounded-full bg-blue-500/20 blur-3xl" />

          <div className="relative z-10 flex h-full flex-col justify-between gap-6">
            <div>
              <h3 className="mb-3 text-[24px] font-black tracking-[-0.4px] text-white">
                Siap mencoba semua fitur ini?
              </h3>

              <p className="text-[15px] leading-relaxed text-slate-300">
                Daftar gratis dan mulai belajar lebih cerdas hari ini.
              </p>
            </div>

            <Link
              to="/register"
              className="
                inline-flex w-fit items-center gap-2
                rounded-2xl
                bg-linear-to-r from-blue-500 to-violet-500
                px-6 py-3.5
                text-sm font-bold text-white
                shadow-[0_10px_40px_rgba(59,130,246,0.45)]
                transition-all duration-300
                hover:scale-105
                hover:shadow-[0_15px_60px_rgba(139,92,246,0.55)]
              "
            >
              Mulai Sekarang →
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

export default Features;