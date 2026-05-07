import { Link } from "react-router-dom";
import { Mail, Code2 } from "lucide-react";

const LINKS = [
  {
    title: "Platform",
    items: [
      { label: "Fitur", href: "#features" },
      { label: "Cara Kerja", href: "#how-it-works" },
      { label: "Tentang", href: "#about" },
    ],
  },
  {
    title: "Akun",
    items: [
      { label: "Masuk", href: "/login", isRoute: true },
      { label: "Daftar", href: "/register", isRoute: true },
    ],
  },
  {
    title: "Kontak",
    items: [
      { label: "Email Support", href: "mailto:support@denbest.ai" },
      {
        label: "GitHub",
        href: "https://github.com/denfasyah/denbest-ai-learning-assistant",
      },
    ],
  },
];

const scrollTo = (href) => {
  const el = document.querySelector(href);
  if (el) el.scrollIntoView({ behavior: "smooth" });
};

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className=" relative flex justify-center overflow-hidden
          bg-linear-to-t from-violet-950 to-black pt-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="footer-grid mb-16 grid gap-12 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <Link
              to="/"
              className="mb-4 flex items-center gap-3 no-underline"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-blue-500 to-violet-500">
                <img src="/logo.png" alt="" className="h-10 w-10"/>
              </div>

              <span className="text-2xl font-extrabold tracking-tight text-white">
              Ai<span className="text-violet-500">Den</span>
              </span>
            </Link>

            <p className="mb-6 max-w-xs text-sm leading-7 text-slate-400">
              Platform AI Learning Assistant berbasis context-aware untuk
              membantu mahasiswa belajar lebih efektif.
            </p>

            <div className="flex gap-3">
              {[
                {
                  icon: Mail,
                  href: "mailto:support@denbest.ai",
                },
                {
                  icon: Code2,
                  href: "https://github.com/denfasyah",
                },
              ].map(({ icon: Icon, href }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition-all duration-200 hover:border-blue-500/30 hover:bg-blue-500/15"
                >
                  <Icon className="h-4 w-4 text-slate-500" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {LINKS.map((col) => (
            <div key={col.title}>
              <h4 className="mb-5 text-sm font-bold text-white">
                {col.title}
              </h4>

              <ul className="flex flex-col gap-3">
                {col.items.map((item) => (
                  <li key={item.label}>
                    {item.isRoute ? (
                      <Link
                        to={item.href}
                        className="text-sm text-slate-400 transition-colors duration-200 hover:text-blue-400"
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <a
                        href={item.href}
                        onClick={
                          item.href.startsWith("#")
                            ? (e) => {
                                e.preventDefault();
                                scrollTo(item.href);
                              }
                            : undefined
                        }
                        target={
                          item.href.startsWith("http")
                            ? "_blank"
                            : undefined
                        }
                        rel={
                          item.href.startsWith("http")
                            ? "noopener noreferrer"
                            : undefined
                        }
                        className="text-sm text-slate-400 transition-colors duration-200 hover:text-blue-400"
                      >
                        {item.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="flex flex-col items-center justify-between gap-3 border-t border-white/5 py-6 text-center md:flex-row">
          <p className="text-xs text-slate-300">
            © {year} AI Learning Assistant. All rights reserved by Adent
          </p>

          <p className="text-xs text-slate-300">
            Built with ❤️ for Indonesian students
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;