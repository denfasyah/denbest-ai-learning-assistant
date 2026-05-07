import { motion } from "framer-motion";
import {
  BrainCircuit,
  CheckCircle2,
  Quote,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

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
    className="relative overflow-hidden bg-slate-50 py-24 lg:py-28"
  >
    {/* Background decorative */}
    <div className="pointer-events-none absolute -right-25 top-[10%] h-100 w-100 rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.06),transparent_70%)]" />

    <div className="mx-auto w-full max-w-6xl px-6">
      {/* Header */}
      <div className="mx-auto mb-20 max-w-2xl text-center">
        <span className="mb-5 inline-block rounded-full border border-blue-200 bg-blue-500/10 px-4 py-1.5 text-[13px] font-bold text-blue-500">
          Tentang Platform
        </span>

        <h2 className="mb-4 text-4xl font-black leading-tight tracking-[-0.8px] text-slate-900 md:text-5xl">
          AI yang Benar-Benar{" "}
          <span className="bg-linear-to-r from-blue-500 to-violet-500 bg-clip-text text-transparent">
            Memahami Materimu
          </span>
        </h2>

        <p className="text-[17px] leading-7 text-slate-500">
          Bukan AI generik — ini AI yang membaca, memahami, dan
          mengajarkan kembali isi dokumen pilihanmu.
        </p>
      </div>

      {/* Content */}
      <div className="about-grid mb-20 grid grid-cols-1 items-center gap-14 lg:grid-cols-2">
        {/* Left */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Quote */}
          <div className="relative mb-7 rounded-[20px] border border-slate-100 bg-white p-7 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
            <Quote className="absolute left-5 top-5 h-7 w-7 text-blue-100" />

            <p className="pt-2 pl-9 text-[16px] italic leading-8 text-slate-700">
              "Berbeda dari AI biasa, sistem ini memahami isi dokumen
              yang kamu upload sehingga memberikan jawaban yang relevan,
              kontekstual, dan sesuai materi pembelajaran."
            </p>

            <div className="mt-5 flex items-center gap-3 pl-9">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-violet-500">
                <BrainCircuit className="h-4.5 w-4.5 text-white" />
              </div>

              <span className="text-[13px] font-semibold text-slate-500">
                Context-Aware AI Engine
              </span>
            </div>
          </div>

          {/* Advantages */}
          <ul className="flex flex-col gap-4">
            {ADVANTAGES.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0 text-emerald-500" />

                <span className="text-[15px] leading-6 text-gray-700">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Right */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative"
        >
          <div className="pointer-events-none absolute -inset-5 rounded-full bg-[radial-gradient(ellipse,rgba(59,130,246,0.15)_0%,transparent_70%)] blur-xl" />

          <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-linear-to-br from-slate-900 to-indigo-950 px-10 py-12 text-center shadow-[0_30px_60px_rgba(0,0,0,0.25)]">
            {/* Decorative glow */}
            <div className="absolute -right-15 -top-15 h-50 w-50 rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.25),transparent)]" />

            {/* Icon */}
            <div className="relative mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-[28px] bg-linear-to-br from-blue-500 to-violet-500 shadow-[0_20px_40px_rgba(59,130,246,0.3)]">
              <BrainCircuit className="h-14 w-14 text-white" />
            </div>

            <h3 className="mb-2 text-[22px] font-extrabold text-white">
              Context-Aware AI
            </h3>

            <p className="mx-auto mb-7 max-w-65 text-[14px] leading-6 text-slate-400">
              AI yang membaca, memproses, dan memahami setiap halaman
              dokumenmu secara mendalam.
            </p>

            {/* Stats */}
            <div className="flex w-full gap-3">
              {STATS.map(({ value, label }) => (
                <div
                  key={value}
                  className="flex-1 rounded-[14px] border border-white/10 bg-white/5 px-2 py-3"
                >
                  <p className="text-[13px] font-extrabold text-white">
                    {value}
                  </p>

                  <p className="mt-0.5 text-[11px] text-blue-400">
                    {label}
                  </p>
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
        className="cta-banner relative flex flex-col items-center justify-between gap-8 overflow-hidden rounded-[28px] bg-linear-to-br from-blue-700 to-violet-600 px-8 py-14 text-center shadow-[0_30px_60px_rgba(29,78,216,0.3)] lg:flex-row lg:px-14 lg:text-left"
      >
        {/* Decorative blobs */}
        <div className="absolute -right-12.5 -top-12.5 h-62.5 w-62.5 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.1),transparent)]" />

        <div className="absolute -bottom-20 -left-7.5 h-50 w-50 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.06),transparent)]" />

        <div className="relative z-10">
          <h2 className="mb-2 text-3xl font-black tracking-[-0.5px] text-white md:text-4xl">
            Mulai Belajar Lebih Cerdas Hari Ini
          </h2>

          <p className="text-[16px] text-white/70">
            Bergabung dan rasakan perbedaannya — gratis!
          </p>
        </div>

        <Link
          to="/register"
          className="relative z-10 inline-flex shrink-0 items-center gap-2 rounded-2xl bg-white px-9 py-4 text-[16px] font-extrabold text-blue-700 shadow-[0_8px_25px_rgba(0,0,0,0.2)] transition-all duration-200 hover:scale-105"
        >
          Daftar Sekarang
          <ArrowRight className="h-4.5 w-4.5" />
        </Link>
      </motion.div>
    </div>
  </section>
);

export default About;