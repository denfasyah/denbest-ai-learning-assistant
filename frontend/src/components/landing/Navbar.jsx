import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Fitur", href: "#features" },
  { label: "Cara Kerja", href: "#how-it-works" },
  { label: "Tentang", href: "#about" },
  { label: "Kontak", href: "#contact" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);

    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const scrollTo = (href) => {
    setOpen(false);

    setTimeout(() => {
      document.querySelector(href)?.scrollIntoView({
        behavior: "smooth",
      });
    }, 150);
  };

  return (
    <>
      {/* NAVBAR */}
      <nav
        className={`
          fixed left-0 right-0 top-0 z-50
          transition-all duration-300
          ${
            scrolled
              ? "border-b border-black/5 bg-white/90 shadow-[0_1px_20px_rgba(0,0,0,0.08)] backdrop-blur-xl"
              : "bg-transparent"
          }
        `}
      >
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex h-18 items-center justify-between">
            {/* LOGO */}

            <Link to="/" className="mb-4 flex items-center gap-3 no-underline mt-5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-blue-500 to-violet-500">
                <img src="/logo.png" alt="" className="w-full" />
              </div>

              <span
                className={`
                  text-2xl font-extrabold tracking-[-0.4px]
                  ${scrolled ? "text-slate-800" : "text-white"}
                `}
              >
                Ai<span className="text-violet-500">Den</span>
              </span>
            </Link>

            {/* DESKTOP MENU */}
            <div className="hidden items-center gap-1 md:flex">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollTo(link.href)}
                  className={`
                    rounded-xl px-4 py-2
                    text-sm font-medium
                    transition-all duration-200
                    ${
                      scrolled
                        ? "text-slate-600 hover:bg-blue-50 hover:text-blue-500"
                        : "text-white/80 hover:bg-white/10 hover:text-white"
                    }
                  `}
                >
                  {link.label}
                </button>
              ))}
            </div>

            {/* DESKTOP CTA */}
            <div className="hidden items-center gap-2 md:flex">
              <Link
                to="/login"
                className={`
                  rounded-xl px-5 py-2.5
                  text-sm font-medium
                  transition-all duration-200
                  ${
                    scrolled
                      ? "text-slate-600 hover:text-blue-500"
                      : "text-white/90 hover:text-white"
                  }
                `}
              >
                Masuk
              </Link>

              <Link
                to="/register"
                className="
                  rounded-xl
                  bg-linear-to-br from-blue-500 to-violet-500
                  px-5 py-2.5
                  text-sm font-bold text-white
                  shadow-[0_4px_15px_rgba(59,130,246,0.35)]
                  transition-all duration-200
                  hover:scale-105
                  hover:shadow-[0_6px_20px_rgba(59,130,246,0.5)]
                "
              >
                Daftar
              </Link>
            </div>

            {/* MOBILE BUTTON */}
            <button
              onClick={() => setOpen(!open)}
              className={`
                flex items-center justify-center
                rounded-xl p-2
                transition-all duration-200
                md:hidden
                ${
                  scrolled
                    ? "bg-slate-100 text-slate-800"
                    : "bg-white/10 text-white backdrop-blur-md"
                }
              `}
            >
              {open ? <X size={21} /> : <Menu size={21} />}
            </button>
          </div>
        </div>

        {/* MOBILE DROPDOWN MENU */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25 }}
              className="
                md:hidden
                border-t border-black/5
                bg-white/95
                backdrop-blur-xl
                shadow-[0_10px_30px_rgba(0,0,0,0.08)]
              "
            >
              <div className="mx-auto flex max-w-7xl flex-col px-6 py-5">
                {/* NAV LINKS */}
                <div className="flex flex-col gap-1">
                  {NAV_LINKS.map((link) => (
                    <button
                      key={link.href}
                      onClick={() => scrollTo(link.href)}
                      className="
                        rounded-xl px-4 py-3
                        text-left text-[15px] font-medium
                        text-slate-700
                        transition-all duration-200
                        hover:bg-blue-50 hover:text-blue-500
                      "
                    >
                      {link.label}
                    </button>
                  ))}
                </div>

                {/* DIVIDER */}
                <div className="my-5 h-px bg-slate-200" />

                {/* CTA */}
                <div className="flex flex-col gap-3">
                  <Link
                    to="/login"
                    onClick={() => setOpen(false)}
                    className="
                      rounded-xl border border-slate-200
                      px-4 py-3
                      text-center text-sm
                      font-semibold text-slate-700
                      transition-all duration-200
                      hover:border-blue-200 hover:bg-blue-50
                    "
                  >
                    Masuk
                  </Link>

                  <Link
                    to="/register"
                    onClick={() => setOpen(false)}
                    className="
                      rounded-xl
                      bg-linear-to-br from-blue-500 to-violet-500
                      px-4 py-3
                      text-center text-sm
                      font-bold text-white
                      shadow-[0_4px_15px_rgba(59,130,246,0.3)]
                      transition-all duration-200
                      hover:scale-[1.02]
                    "
                  >
                    Daftar Gratis
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
};

export default Navbar;
