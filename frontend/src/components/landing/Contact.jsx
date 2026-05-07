import { motion } from "framer-motion";
import Swal from "sweetalert2";
import {
  Mail,
  Code2,
  Send,
  MessageSquare,
} from "lucide-react";

const CONTACT_LINKS = [
  {
    icon: Mail,
    label: "Email",
    value: "denfasyah@gmail.com",
    href: "mailto:denfasyah@gmail.com",
    color: "#3B82F6",
    bg: "rgba(59,130,246,0.08)",
    border: "rgba(59,130,246,0.15)",
  },
  {
    icon: Code2,
    label: "GitHub",
    value: "denfasyah",
    href: "https://github.com/denfasyah",
    color: "#1e293b",
    bg: "rgba(30,41,59,0.06)",
    border: "rgba(30,41,59,0.12)",
  },
];

const Contact = () => {
  const handleSend = () => {
    Swal.fire({
      icon: "success",
      title: "Pesan Berhasil Dikirim",
      text: "Terima kasih sudah menghubungi kami 🚀",
      confirmButtonColor: "#050816",
      background: "#0f172a",
      color: "#fff",
    });
  };

  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-white py-24 lg:py-28"
    >
      {/* Background */}
      <div className="absolute -left-25 top-[20%] h-100 w-100 rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.05),transparent_70%)]" />

      <div className="mx-auto w-full max-w-6xl px-6">
        {/* Header */}
        <div className="mx-auto mb-20 max-w-2xl text-center">
          <span className="mb-5 inline-block rounded-full border border-sky-200 bg-sky-500/10 px-4 py-1.5 text-[13px] font-bold text-sky-500">
            Kontak
          </span>

          <h2 className="mb-4 text-4xl font-black leading-tight tracking-[-0.8px] text-slate-900 md:text-5xl">
            Ada{" "}
            <span className="bg-linear-to-r from-blue-500 to-violet-500 bg-clip-text text-transparent">
              Pertanyaan?
            </span>
          </h2>

          <p className="text-[16px] leading-7 text-slate-500">
            Kami senang mendengar masukan, pertanyaan, atau laporan bug
            dari kamu.
          </p>
        </div>

        {/* Grid */}
        <div className="contact-grid grid grid-cols-1 items-start gap-8 lg:grid-cols-[1fr_1.3fr]">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-4"
          >
            {/* Contact Cards */}
            {CONTACT_LINKS.map((c) => (
              <a
                key={c.label}
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 rounded-2xl border p-5 transition-all duration-200 hover:translate-x-1 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)]"
                style={{
                  background: c.bg,
                  borderColor: c.border,
                }}
              >
                <div
                  className="flex h-11.5 w-11.5 shrink-0 items-center justify-center rounded-[14px]"
                  style={{
                    background: c.color,
                    boxShadow: `0 4px 12px ${c.bg}`,
                  }}
                >
                  <c.icon className="h-5.5 w-5.5 text-white" />
                </div>

                <div>
                  <p className="mb-0.5 text-[12px] font-semibold text-slate-400">
                    {c.label}
                  </p>

                  <p className="text-[15px] font-bold text-slate-900">
                    {c.value}
                  </p>
                </div>
              </a>
            ))}

            {/* Note Card */}
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
              <div className="mb-2.5 flex items-center gap-2.5">
                <MessageSquare className="h-4.5 w-4.5 text-blue-500" />

                <span className="text-[14px] font-bold text-slate-900">
                  Respons Cepat
                </span>
              </div>

              <p className="text-[13.5px] leading-6 text-slate-500">
                Tim kami aktif Senin–Jumat (08.00–17.00 WIB). Kami
                berusaha merespons dalam 24 jam.
              </p>
            </div>
          </motion.div>

          {/* Right */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-3xl border border-slate-100 bg-white p-9 shadow-[0_8px_32px_rgba(0,0,0,0.05)]"
          >
            <h3 className="mb-7 text-[20px] font-extrabold text-slate-900">
              Kirim Pesan
            </h3>

            <div className="flex flex-col gap-4">
              {[
                {
                  label: "Nama",
                  type: "text",
                  placeholder: "Nama lengkap kamu",
                },
                {
                  label: "Email",
                  type: "email",
                  placeholder: "email@gmail.com",
                },
              ].map((f) => (
                <div key={f.label}>
                  <label className="mb-2 block text-[13px] font-semibold text-gray-700">
                    {f.label}
                  </label>

                  <input
                    type={f.type}
                    placeholder={f.placeholder}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-[14px] text-slate-800 outline-none transition-all duration-200 focus:border-blue-500 focus:bg-white"
                  />
                </div>
              ))}

              <div>
                <label className="mb-2 block text-[13px] font-semibold text-gray-700">
                  Pesan
                </label>

                <textarea
                  rows={4}
                  placeholder="Tuliskan pertanyaan atau masukan kamu..."
                  className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-[14px] text-slate-800 outline-none transition-all duration-200 focus:border-blue-500 focus:bg-white"
                />
              </div>

              <button
                onClick={handleSend}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-blue-500 to-violet-500 px-4 py-4 text-[15px] font-bold text-white shadow-[0_6px_20px_rgba(59,130,246,0.3)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(59,130,246,0.4)]"
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