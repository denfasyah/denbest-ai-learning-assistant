import { motion } from "framer-motion";
import {
  Upload,
  Layout,
  Sparkles,
  GraduationCap,
} from "lucide-react";

const STEPS = [
  {
    number: "01",
    icon: Upload,
    title: "Upload PDF",
    desc: "Unggah materi kuliah dari LMS atau sumber belajarmu dalam format PDF.",
    gradient: "from-blue-500 to-blue-600",
    ring: "bg-blue-500/20",
    shadow: "shadow-blue-500/30",
  },
  {
    number: "02",
    icon: Layout,
    title: "Buka Workspace",
    desc: "Akses dokumen dalam workspace interaktif dengan PDF Viewer dan panel AI.",
    gradient: "from-violet-500 to-violet-700",
    ring: "bg-violet-500/20",
    shadow: "shadow-violet-500/30",
  },
  {
    number: "03",
    icon: Sparkles,
    title: "Gunakan AI",
    desc: "Summary, Chat, Flashcard, dan Quiz — semuanya dari konteks dokumenmu.",
    gradient: "from-pink-500 to-pink-600",
    ring: "bg-pink-500/20",
    shadow: "shadow-pink-500/30",
  },
  {
    number: "04",
    icon: GraduationCap,
    title: "Kuasai Materi",
    desc: "Pahami konsep lebih cepat, siap ujian, dan tingkatkan nilai akademismu.",
    gradient: "from-emerald-500 to-emerald-600",
    ring: "bg-emerald-500/20",
    shadow: "shadow-emerald-500/30",
  },
];

const HowItWorks = () => {
  return (
    <section
      id="how-it-works"
      className="relative bg-white py-24 lg:py-28"
    >
      <div className="mx-auto max-w-6xl px-6">
        {/* Header */}
        <div className="mx-auto mb-20 max-w-2xl text-center">
          <span className="mb-5 inline-block rounded-full border border-violet-500/15 bg-violet-500/10 px-4 py-1.5 text-xs font-bold text-violet-700">
            Cara Kerja
          </span>

          <h2 className="mb-4 text-4xl font-black leading-tight tracking-tight text-slate-900 md:text-5xl">
            Hanya{" "}
            <span className="bg-linear-to-r from-blue-500 to-violet-500 bg-clip-text text-transparent">
              4 Langkah
            </span>{" "}
            untuk Mulai
          </h2>

          <p className="text-base leading-7 text-slate-500 md:text-lg">
            Dari upload hingga siap ujian — prosesnya simpel dan
            hanya butuh beberapa menit.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connector */}
          <div className="steps-connector absolute left-[calc(12.5%+35px)] right-[calc(12.5%+35px)] top-15 hidden h-0.5 bg-linear-to-r from-blue-500  to-emerald-500 opacity-30 lg:block" />

          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.55,
                  delay: i * 0.12,
                }}
                className="relative flex flex-col items-center text-center"
              >
                {/* Icon */}
                <div className="relative mb-6">
                  {/* Ring */}
                  <div
                    className={`absolute -inset-2 rounded-full ${step.ring}`}
                  />

                  {/* Main circle */}
                  <div
                    className={`relative z-10 flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br ${step.gradient} shadow-2xl ${step.shadow}`}
                  >
                    <step.icon className="h-8 w-8 text-white" />
                  </div>

                  {/* Number badge */}
                  <div
                    className={`absolute -bottom-1.5 -right-1.5 z-20 flex h-7 w-7 items-center justify-center rounded-full border-[2.5px] border-white bg-linear-to-br ${step.gradient} shadow-lg`}
                  >
                    <span className="text-[9px] font-black text-white">
                      {step.number}
                    </span>
                  </div>
                </div>

                <h3 className="mb-2 text-lg font-extrabold text-slate-900">
                  {step.title}
                </h3>

                <p className="max-w-50 text-sm leading-7 text-slate-500">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;