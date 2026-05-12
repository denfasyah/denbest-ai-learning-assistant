import { motion } from "framer-motion";
import {
  FileSearch,
  MessageCircle,
  CreditCard,
  LayoutTemplate,
  BookOpen,
} from "lucide-react";

const FEATURES = [
  {
    icon: FileSearch,
    title: "AI Summary",
    desc: "Ringkas materi panjang secara otomatis menjadi poin utama yang mudah dipahami.",
    tag: "Hemat Waktu",
    color: "#3B82F6",
    gradient: "linear-gradient(135deg, #3B82F6, #2563eb)",
    glow: "rgba(59,130,246,0.15)",
  },
  {
    icon: MessageCircle,
    title: "AI Chat",
    desc: "Tanya apa saja — AI menjawab langsung berdasarkan isi dokumenmu dengan akurasi tinggi.",
    tag: "Context-Aware",
    color: "#8B5CF6",
    gradient: "linear-gradient(135deg, #8B5CF6, #6d28d9)",
    glow: "rgba(139,92,246,0.15)",
  },
  {
    icon: CreditCard,
    title: "Flashcard Generator",
    desc: "Kartu belajar otomatis dari materi untuk mengingat konsep dengan metode spaced-repetition.",
    tag: "Hafal Cepat",
    color: "#ec4899",
    gradient: "linear-gradient(135deg, #ec4899, #db2777)",
    glow: "rgba(236,72,153,0.15)",
  },
  {
    icon: LayoutTemplate,
    title: "Quiz Generator",
    desc: "Latih pemahaman dengan soal pilihan ganda yang digenerate langsung dari materimu.",
    tag: "Siap Ujian",
    color: "#f59e0b",
    gradient: "linear-gradient(135deg, #f59e0b, #d97706)",
    glow: "rgba(245,158,11,0.15)",
  },
  {
    icon: BookOpen,
    title: "PDF Viewer",
    desc: "Baca dokumen langsung di platform tanpa perlu buka aplikasi lain. All-in-one.",
    tag: "All-in-one",
    color: "#10b981",
    gradient: "linear-gradient(135deg, #10b981, #059669)",
    glow: "rgba(16,185,129,0.15)",
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
    className="relative flex min-h-screen justify-center overflow-hidden
          bg-linear-to-b from-violet-950 to-[#050816] py-24"
  >


    <div className="mx-auto max-w-6xl px-6">
      {/* HEADER */}
      <div className="mx-auto mb-20 max-w-2xl text-center">
        <span
          className="
            mb-5 inline-block rounded-full
            border border-blue-500/25
            bg-blue-500/10
            px-4 py-1.5
            text-[13px] font-bold text-blue-300
          "
        >
          Fitur Unggulan
        </span>

        <h2
          className="
            mb-4 text-[clamp(28px,4vw,44px)]
            font-black leading-tight
            tracking-[-0.8px]
            text-slate-200
          "
        >
          Semua yang Kamu Butuhkan untuk{" "}
          <span
            className="
              bg-linear-to-r
              from-blue-500 to-violet-500
              bg-clip-text text-transparent
            "
          >
            Belajar Lebih Efektif
          </span>
        </h2>

        <p className="text-[17px] leading-relaxed text-slate-400">
          Fitur-fitur berbasis AI yang dirancang khusus mendukung proses
          belajar mahasiswa Indonesia.
        </p>
      </div>

      {/* GRID */}
      <div
        className="
          mb-5 grid gap-5
          sm:grid-cols-2
          lg:grid-cols-3
        "
      >
        {FEATURES.map((f, i) => (
          <motion.div
            key={f.title}
            custom={i}
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-30px" }}
            whileHover={{ y: -6 }}
            className="
              group relative overflow-hidden
              rounded-[20px]
              border border-violet-500/40
              backdrop-blur-md
              bg-slate-200
              p-8
              shadow-[0_8px_30px_rgb(0,0,0,0.3)]
              transition-all duration-300
              hover:shadow-[0_0_40px_-10px_rgba(99,102,241,0.3)]
            "
          >
            {/* Accent */}
            <div
              className="
                absolute right-0 top-0
                h-30 w-30
                rounded-bl-[100%]
              "
              style={{
                background: f.glow,
              }}
            />

            <div className="relative z-10">
              {/* Icon */}
              <div
                className="
                  mb-5 flex h-13 w-13
                  items-center justify-center
                  rounded-2xl
                "
                style={{
                  background: f.gradient,
                  boxShadow: `0 8px 20px ${f.glow}`,
                }}
              >
                <f.icon className="h-6 w-6 text-white" />
              </div>

              {/* Tag */}
              <span
                className="
                  mb-3 inline-block rounded-full
                  px-2.5 py-0.75
                  text-[11px] font-bold
                "
                style={{
                  background: f.glow,
                  color: f.color,
                  border: `1px solid ${f.glow}`,
                }}
              >
                {f.tag}
              </span>

              {/* Title */}
              <h3 className="mb-2.5 text-lg font-extrabold text-black">
                {f.title}
              </h3>

              {/* Desc */}
              <p className="text-sm leading-relaxed text-slate-500">
                {f.desc}
              </p>
            </div>
          </motion.div>
        ))}

        {/* CTA CARD */}
        <motion.div
          custom={FEATURES.length}
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="
            relative flex min-h-50
            flex-col justify-between
            overflow-hidden rounded-[20px]
            bg-linear-to-br
            from-[#1e1b4b] to-[#2d1b69]
            p-8
          "
        >
          {/* Glow */}
          <div
            className="
              absolute -right-10 -top-10
              h-40 w-40 rounded-full
            "
            style={{
              background:
                "radial-gradient(circle, rgba(139,92,246,0.3), transparent)",
            }}
          />

          <div className="relative z-10">
            <h3
              className="
                mb-3 text-[22px]
                font-extrabold
                tracking-[-0.3px]
                text-white
              "
            >
              Siap mencoba semua fitur ini?
            </h3>

            <p className="text-sm leading-relaxed text-violet-300/80">
              Daftar gratis dan mulai belajar lebih cerdas hari ini.
            </p>
          </div>

          <a
            href="/register"
            className="
              relative z-10 mt-5 inline-flex w-fit
              items-center rounded-xl
              bg-linear-to-r
              from-blue-500 to-violet-500
              px-6 py-3
              text-sm font-bold text-white
              shadow-[0_4px_15px_rgba(59,130,246,0.4)]
              transition-all duration-300
              hover:scale-105
            "
          >
            Mulai Sekarang →
          </a>
        </motion.div>
      </div>
    </div>
  </section>
);

export default Features;