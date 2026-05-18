import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { Mail, Code2, Send, MessageSquare } from "lucide-react";
import ParticleBackground from "../../../components/ui/ParticleBackground";

const CONTACT_LINKS = [
  {
    icon: Mail,
    label: "Email",
    value: "denfasyah@gmail.com",
    href: "mailto:denfasyah@gmail.com",
    color: "#3B82F6",
    glow: "rgba(59,130,246,0.15)",
    border: "rgba(59,130,246,0.2)",
  },
  {
    icon: Code2,
    label: "GitHub",
    value: "denfasyah",
    href: "https://github.com/denfasyah",
    color: "#a78bfa",
    glow: "rgba(167,139,250,0.15)",
    border: "rgba(167,139,250,0.2)",
  },
];

const ContactCard = ({ item }) => {
  const Icon = item.icon;
  return (
    <div
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-4 rounded-2xl p-5 transition-all duration-200 hover:translate-x-1"
      style={{
        background: item.glow,
        border: "1px solid " + item.border,
        backdropFilter: "blur(8px)",
      }}
    >
      <div
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] transition-all duration-200 group-hover:scale-110"
        style={{
          background: item.color,
          boxShadow: "0 6px 16px " + item.glow,
        }}
      >
        <Icon className="h-5 w-5 text-white" />
      </div>
      <div>
        <p className="mb-0.5 text-[12px] font-semibold text-slate-500">
          {item.label}
        </p>
        <p className="text-[15px] font-bold text-slate-200">{item.value}</p>
      </div>
    </div>
  );
};

const Contact = () => {
  const handleSend = () => {
    Swal.fire({
      icon: "success",
      title: "Pesan Berhasil Dikirim",
      text: "Terima kasih sudah menghubungi kami 🚀",
      confirmButtonColor: "#3b82f6",
      background: "#0f172a",
      color: "#fff",
    });
  };

  return (
    <section
      id="contact"
      className="relative flex min-h-screen justify-center overflow-hidden bg-linear-to-b from-violet-950 to-[#050816] py-24"
    >
      <ParticleBackground />

      <div className="pointer-events-none absolute -left-20 top-[20%] h-96 w-96 rounded-full bg-blue-600/5 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-[10%] h-80 w-80 rounded-full bg-violet-600/5 blur-3xl" />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6">
        <div className="mx-auto mb-20 max-w-2xl text-center">
          <span className="mb-5 inline-block rounded-full border border-blue-500/25 bg-blue-500/10 px-4 py-1.5 text-[13px] font-bold text-blue-300">
            Kontak
          </span>
          <h2 className="mb-4 text-4xl font-black leading-tight tracking-[-0.8px] text-slate-200 md:text-5xl">
            Ada{" "}
            <span className="bg-linear-to-r from-blue-500 to-violet-500 bg-clip-text text-transparent">
              Pertanyaan?
            </span>
          </h2>
          <p className="text-[16px] leading-7 text-slate-400">
            Kami senang mendengar masukan, pertanyaan, atau laporan bug dari
            kamu.
          </p>
        </div>

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1fr_1.4fr]">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-4"
          >
            <ContactCard item={CONTACT_LINKS[0]} />
            <ContactCard item={CONTACT_LINKS[1]} />

            <div
              className="rounded-2xl p-5"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
                backdropFilter: "blur(8px)",
              }}
            >
              <div className="mb-2.5 flex items-center gap-2.5">
                <MessageSquare className="h-4 w-4 text-blue-400" />
                <span className="text-[14px] font-bold text-slate-200">
                  Respons Cepat
                </span>
              </div>
              <p className="text-[13.5px] leading-6 text-slate-400">
                Tim kami aktif Senin–Jumat (08.00–17.00 WIB). Kami berusaha
                merespons dalam 24 jam.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative overflow-hidden rounded-3xl p-8"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              backdropFilter: "blur(16px)",
              boxShadow:
                "0 20px 60px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)",
            }}
          >
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-violet-500/10 blur-2xl" />

            <h3 className="relative z-10 mb-7 text-[20px] font-extrabold text-white">
              Kirim Pesan
            </h3>

            <div className="relative z-10 flex flex-col gap-5">
              <div>
                <label className="mb-2 block text-[13px] font-semibold text-slate-400">
                  Nama
                </label>
                <input
                  type="text"
                  placeholder="Nama lengkap kamu"
                  className="w-full rounded-xl px-4 py-3 text-[14px] text-slate-200 outline-none transition-all duration-200 placeholder:text-slate-600 focus:ring-1 focus:ring-blue-500/50"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                />
              </div>

              <div>
                <label className="mb-2 block text-[13px] font-semibold text-slate-400">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="email@gmail.com"
                  className="w-full rounded-xl px-4 py-3 text-[14px] text-slate-200 outline-none transition-all duration-200 placeholder:text-slate-600 focus:ring-1 focus:ring-blue-500/50"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                />
              </div>

              <div>
                <label className="mb-2 block text-[13px] font-semibold text-slate-400">
                  Pesan
                </label>
                <textarea
                  rows={4}
                  placeholder="Tuliskan pertanyaan atau masukan kamu..."
                  className="w-full resize-none rounded-xl px-4 py-3 text-[14px] text-slate-200 outline-none transition-all duration-200 placeholder:text-slate-600 focus:ring-1 focus:ring-blue-500/50"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                />
              </div>

              <button
                onClick={handleSend}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-blue-500 to-violet-500 px-4 py-4 text-[15px] font-bold text-white shadow-[0_6px_20px_rgba(59,130,246,0.3)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(59,130,246,0.45)]"
              >
                <Send className="h-4 w-4" />
                Kirim
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;