import { motion } from "framer-motion";
import { CheckCircle2, Quote, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import ParticleBackground from "../../../components/ui/ParticleBackground";

const ADVANTAGES = [
  "Jawaban AI berbasis isi dokumenmu, bukan opini umum",
  "Tidak perlu copy-paste materi",
  "Privasi terjaga — dokumen hanya untuk kamu",
  "Mendukung kurikulum & gaya belajar mahasiswa Indonesia",
];

const STATS = [
  { value: "AI Chat", label: "Context" },
  { value: "Summary", label: "Auto" },
  { value: "Quiz", label: "Smart" },
];

const About = () => (
  <section
    id="about"
    className="relative flex min-h-screen justify-center overflow-hidden bg-linear-to-t from-violet-950 to-[#050816] py-24"
  >
    <ParticleBackground />

    {/* Ambient */}
    <div className="pointer-events-none absolute -right-20 top-[10%] h-96 w-96 rounded-full bg-violet-600/6 blur-3xl" />
    <div className="pointer-events-none absolute -left-20 bottom-[10%] h-80 w-80 rounded-full bg-blue-600/6 blur-3xl" />

    <div className="relative z-10 mx-auto w-full max-w-6xl px-6">
      {/* Header */}
      <div className="mx-auto mb-20 max-w-2xl text-center">
        <span className="mb-5 inline-block rounded-full border border-blue-500/25 bg-blue-500/10 px-4 py-1.5 text-[13px] font-bold text-blue-300">
          Tentang Platform
        </span>
        <h2 className="mb-4 text-4xl font-black leading-tight tracking-[-0.8px] text-slate-200 md:text-5xl">
          AI yang Benar-Benar{" "}
          <span className="bg-linear-to-r from-blue-500 to-violet-500 bg-clip-text text-transparent">
            Memahami Materimu
          </span>
        </h2>
        <p className="text-[17px] leading-7 text-slate-400">
          Bukan AI generik — ini AI yang membaca, memahami, dan mengajarkan
          kembali isi dokumen pilihanmu.
        </p>
      </div>

      {/* Content */}
      <div className="mb-20 grid grid-cols-1 items-center gap-14 lg:grid-cols-2">
        {/* Left */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Quote card — dark glass */}
          <div
            className="group relative mb-8 overflow-hidden
              rounded-[30px]
              border border-white/10
              bg-white/5
              p-8
              backdrop-blur-2xl"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              backdropFilter: "blur(12px)",
            }}
          >
            {/* Subtle top glow */}
             <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-violet-500/20 blur-3xl transition-all duration-500 group-hover:scale-125" />

            <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-blue-500/15 blur-3xl transition-all duration-500 group-hover:scale-125" />

            {/* Top line */}
            <div className="absolute left-0 top-0 h-0.5 w-full bg-linear-to-r from-blue-500 via-violet-500 to-transparent opacity-80" />
            <Quote className="absolute left-5 top-5 h-7 w-7 text-blue-400/40" />
            <p className="relative z-10 pt-2 pl-9 text-[15.5px] italic leading-8 text-slate-300">
              "Berbeda dari AI biasa, sistem ini memahami isi dokumen yang kamu
              upload sehingga memberikan jawaban yang relevan, kontekstual, dan
              sesuai materi pembelajaran."
            </p>
            <div className="relative z-10 mt-5 flex items-center gap-3 pl-9">
              <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-linear-to-br from-blue-500 to-violet-500">
                <img src="/logo.png" alt="" className="w-full rounded-2xl" />
              </div>
              <span className="text-[13px] font-semibold text-slate-400">
                Context-Aware AI Engine
              </span>
            </div>
          </div>

          {/* Advantages */}
          <ul className="flex flex-col gap-3.5">
            {ADVANTAGES.map((item, i) => (
              <motion.li
                key={item}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="flex items-start gap-3"
              >
                <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0 text-emerald-400" />
                <span className="text-[15px] leading-6 text-slate-300">
                  {item}
                </span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Right */}
        <motion.div
          initial={{ opacity: 0, scale: 0.93 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative"
        >
          <div className="absolute -inset-10 rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.12),transparent_70%)] blur-3xl" />

          <div
            className="
              relative overflow-hidden
              rounded-[34px]
              border border-white/10
              bg-white/5
              px-10 py-12
              text-center
              backdrop-blur-3xl
            "
            style={{
              boxShadow:
                "0 30px 80px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.06)",
            }}
          >
            <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-violet-500/20 blur-3xl" />

            <div className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-blue-500/15 blur-3xl" />
            <div className="absolute left-0 top-0 h-0.5 w-full bg-linear-to-r from-blue-500 via-violet-500 to-transparent" />
            {/* Icon */}
            <div className="relative mx-auto mb-7
                flex h-20 w-20 items-center justify-center
                overflow-hidden rounded-[30px]
                border border-white/10
                bg-linear-to-br from-blue-500 to-violet-500
                shadow-[0_25px_60px_rgba(59,130,246,0.45)]">
              <img src="/logo.png" alt="" className="w-full" />
            </div>

            <h3 className="mb-2 text-[22px] font-extrabold text-white">
              Context-Aware AI
            </h3>
            <p className="mx-auto mb-8 max-w-65 text-[14px] leading-6 text-slate-400">
              AI yang membaca, memproses, dan memahami setiap halaman dokumenmu
              secara mendalam.
            </p>

            {/* Stats */}
            <div className="flex w-full gap-3">
              {STATS.map(({ value, label }) => (
                <div
                  key={value}
                  className="flex-1 rounded-2xl px-2 py-4 transition-all duration-200 hover:scale-105"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <p className="text-[13px] font-extrabold text-white">
                    {value}
                  </p>
                  <p className="mt-1 text-[11px] text-blue-400">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* CTA Banner */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-[28px] px-10 py-14"
        style={{
          background: "linear-gradient(135deg, #1d4ed8, #5b21b6, #4c1d95)",
          boxShadow:
            "0 30px 80px rgba(29,78,216,0.35), inset 0 1px 0 rgba(255,255,255,0.1)",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        {/* Grain texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundSize: "200px",
          }}
        />
        <div className="absolute -right-14 -top-14 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.08),transparent)]" />
        <div className="absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.05),transparent)]" />

        <div className="relative z-10 flex flex-col items-center justify-between gap-8 text-center lg:flex-row lg:text-left">
          <div>
            <h2 className="mb-2 text-3xl font-black tracking-[-0.5px] text-white md:text-4xl">
              Mulai Belajar Lebih Cerdas Hari Ini
            </h2>
            <p className="text-[16px] text-white/60">
              Bergabung dan rasakan perbedaannya — gratis!
            </p>
          </div>
          <Link
            to="/register"
            className="inline-flex shrink-0 items-center gap-2 rounded-2xl bg-white px-9 py-4 text-[15px] font-extrabold text-blue-700 shadow-[0_8px_25px_rgba(0,0,0,0.25)] transition-all duration-200 hover:scale-105 hover:shadow-[0_12px_35px_rgba(0,0,0,0.3)]"
          >
            Daftar Sekarang
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </motion.div>
    </div>
  </section>
);

export default About;
