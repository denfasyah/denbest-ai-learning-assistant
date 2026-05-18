import { motion } from "framer-motion";
import { Upload, Layout, Sparkles, GraduationCap } from "lucide-react";
import ParticleBackground from "../../../components/ui/ParticleBackground";

const STEPS = [
  {
    number: "01",
    icon: Upload,
    title: "Upload PDF",
    desc: "Unggah materi kuliah dari LMS atau sumber belajarmu dalam format PDF.",
    gradient: "from-blue-500 to-blue-600",
    glow: "rgba(59,130,246,0.3)",
    border: "rgba(59,130,246,0.25)",
    ring: "rgba(59,130,246,0.1)",
  },
  {
    number: "02",
    icon: Layout,
    title: "Buka Workspace",
    desc: "Akses dokumen dalam workspace interaktif dengan PDF Viewer dan panel AI.",
    gradient: "from-violet-500 to-violet-700",
    glow: "rgba(139,92,246,0.3)",
    border: "rgba(139,92,246,0.25)",
    ring: "rgba(139,92,246,0.1)",
  },
  {
    number: "03",
    icon: Sparkles,
    title: "Gunakan AI",
    desc: "Summary, Chat, Flashcard, dan Quiz — semuanya dari konteks dokumenmu.",
    gradient: "from-pink-500 to-pink-600",
    glow: "rgba(236,72,153,0.3)",
    border: "rgba(236,72,153,0.25)",
    ring: "rgba(236,72,153,0.1)",
  },
  {
    number: "04",
    icon: GraduationCap,
    title: "Kuasai Materi",
    desc: "Pahami konsep lebih cepat, siap ujian, dan tingkatkan nilai akademismu.",
    gradient: "from-emerald-500 to-emerald-600",
    glow: "rgba(16,185,129,0.3)",
    border: "rgba(16,185,129,0.25)",
    ring: "rgba(16,185,129,0.1)",
  },
];

const HowItWorks = () => (
  <section id="how-it-works" className="relative overflow-hidden bg-[#050816] py-24 lg:py-32">
    <ParticleBackground />

    {/* Ambient glows */}
    <div className="pointer-events-none absolute left-1/4 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-violet-600/5 blur-3xl" />
    <div className="pointer-events-none absolute right-1/4 top-1/3 h-64 w-64 rounded-full bg-blue-600/5 blur-3xl" />

    <div className="relative z-10 mx-auto max-w-6xl px-6">
      {/* Header */}
      <div className="mx-auto mb-24 max-w-2xl text-center">
        <span className="mb-5 inline-block rounded-full border border-blue-500/25 bg-blue-500/10 px-4 py-1.5 text-[13px] font-bold text-blue-300">
          Cara Kerja
        </span>
        <h2 className="mb-4 text-4xl font-black leading-tight tracking-tight text-slate-200 md:text-5xl">
          Hanya{" "}
          <span className="bg-linear-to-r from-blue-500 to-violet-500 bg-clip-text text-transparent">
            4 Langkah
          </span>{" "}
          untuk Mulai
        </h2>
        <p className="text-base leading-7 text-slate-400 md:text-lg">
          Dari upload hingga siap ujian — prosesnya simpel dan hanya butuh beberapa menit.
        </p>
      </div>

      {/* Steps */}
      <div className="relative grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Connector line */}
        <div className="absolute left-[calc(12.5%+40px)] right-[calc(12.5%+40px)] top-13 hidden h-px lg:block"
          style={{ background: "linear-gradient(to right, rgba(59,130,246,0.4), rgba(139,92,246,0.4), rgba(236,72,153,0.4), rgba(16,185,129,0.4))" }}
        />

        {STEPS.map((step, i) => (
          <motion.div
            key={step.number}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: i * 0.13 }}
            whileHover={{ y: -6 }}
            className="group flex flex-col items-center text-center"
          >
            {/* Icon circle */}
            <div className="relative mb-8">
              {/* Outer ring */}
              <div
                className="absolute -inset-3 rounded-full transition-all duration-500 group-hover:scale-110"
                style={{ background: step.ring }}
              />
              {/* Glow blur */}
              <div
                className="absolute -inset-2 rounded-full opacity-0 blur-lg transition-all duration-500 group-hover:opacity-100"
                style={{ background: step.glow }}
              />
              {/* Circle */}
              <div
                className={`relative z-10 flex h-26 w-26 items-center justify-center rounded-full bg-linear-to-br ${step.gradient}`}
                style={{ boxShadow: `0 20px 40px ${step.glow}` }}
              >
                <step.icon className="h-9 w-9 text-white" strokeWidth={1.75} />
              </div>
              {/* Number badge */}
              <div
                className={`absolute -bottom-1 -right-1 z-20 flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#050816] bg-linear-to-br ${step.gradient}`}
              >
                <span className="text-[10px] font-black text-white">{step.number}</span>
              </div>
            </div>

            {/* Card content */}
            <div
              className="w-full rounded-2xl border p-5 transition-all duration-300 group-hover:border-opacity-60"
              style={{
                background: "rgba(255,255,255,0.02)",
                borderColor: step.border,
                backdropFilter: "blur(8px)",
              }}
            >
              <h3 className="mb-2 text-[17px] font-extrabold text-slate-100">{step.title}</h3>
              <p className="text-[13.5px] leading-6 text-slate-400">{step.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;