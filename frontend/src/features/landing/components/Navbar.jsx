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

function Navbar() {
  var [scrolled, setScrolled] = useState(false);
  var [open, setOpen] = useState(false);
  var [active, setActive] = useState("#home");

  useEffect(function () {
    function onScroll() {
      setScrolled(window.scrollY > 40);

      var sections = NAV_LINKS.map(function (l) {
        return l.href;
      });

      for (var i = sections.length - 1; i >= 0; i--) {
        var el = document.querySelector(sections[i]);
        if (el && window.scrollY >= el.offsetTop - 120) {
          setActive(sections[i]);
          break;
        }
      }
    }

    window.addEventListener("scroll", onScroll);
    return function () {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(
    function () {
      document.body.style.overflow = open ? "hidden" : "";
      return function () {
        document.body.style.overflow = "";
      };
    },
    [open]
  );

  function scrollTo(href) {
    setOpen(false);
    setTimeout(function () {
      var el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 150);
  }

  return (
    <>
      <nav
        className="fixed left-0 right-0 top-0 z-50 transition-all duration-300"
        style={{
          background: scrolled
            ? "rgba(5,8,22,0.85)"
            : "rgba(5,8,22,0.3)",
          backdropFilter: "blur(20px)",
          borderBottom: scrolled
            ? "1px solid rgba(255,255,255,0.07)"
            : "1px solid rgba(255,255,255,0.04)",
          boxShadow: scrolled
            ? "0 8px 32px rgba(0,0,0,0.4)"
            : "none",
        }}
      >
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center gap-2.5 no-underline">
              <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-xl bg-linear-to-br from-blue-500 to-violet-500">
                <img src="/logo.png" alt="AiDen" className="w-full" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white">
                Ai
                <span className="bg-linear-to-r from-blue-500 to-violet-500 bg-clip-text text-transparent">
                  Den
                </span>
              </span>
            </Link>

            <div className="hidden items-center gap-1 md:flex">
              {NAV_LINKS.map(function (link) {
                var isActive = active === link.href;
                return (
                  <button
                    key={link.href}
                    onClick={function () {
                      scrollTo(link.href);
                    }}
                    className="relative rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200"
                    style={{
                      color: isActive ? "#fff" : "rgba(148,163,184,0.9)",
                      background: isActive
                        ? "rgba(255,255,255,0.08)"
                        : "transparent",
                    }}
                  >
                    {link.label}
                    {isActive && (
                      <span
                        className="absolute bottom-1 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full"
                        style={{
                          background:
                            "linear-gradient(to right, #3b82f6, #8b5cf6)",
                        }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="hidden items-center gap-2 md:flex">
              <Link
                to="/login"
                className="rounded-xl px-5 py-2 text-sm font-medium text-slate-300 transition-all duration-200 hover:bg-white/8 hover:text-white"
              >
                Masuk
              </Link>
              <Link
                to="/register"
                className="rounded-xl bg-linear-to-br from-blue-500 to-violet-500 px-5 py-2 text-sm font-bold text-white shadow-[0_4px_15px_rgba(59,130,246,0.35)] transition-all duration-200 hover:scale-105 hover:shadow-[0_6px_20px_rgba(59,130,246,0.5)]"
              >
                Daftar
              </Link>
            </div>

            <button
              onClick={function () {
                setOpen(!open);
              }}
              className="flex items-center justify-center rounded-xl p-2 text-white transition-all duration-200 hover:bg-white/10 md:hidden"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="md:hidden"
              style={{
                background: "rgba(5,8,22,0.97)",
                backdropFilter: "blur(24px)",
                borderTop: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div className="mx-auto flex max-w-7xl flex-col px-6 py-5">
                <div className="flex flex-col gap-1">
                  {NAV_LINKS.map(function (link) {
                    var isActive = active === link.href;
                    return (
                      <button
                        key={link.href}
                        onClick={function () {
                          scrollTo(link.href);
                        }}
                        className="rounded-xl px-4 py-3 text-left text-sm font-medium transition-all duration-200"
                        style={{
                          color: isActive ? "#fff" : "#94a3b8",
                          background: isActive
                            ? "rgba(255,255,255,0.06)"
                            : "transparent",
                          borderLeft: isActive
                            ? "2px solid #3b82f6"
                            : "2px solid transparent",
                        }}
                      >
                        {link.label}
                      </button>
                    );
                  })}
                </div>

                <div
                  className="my-4 h-px"
                  style={{ background: "rgba(255,255,255,0.06)" }}
                />

                <div className="flex flex-col gap-3">
                  <Link
                    to="/login"
                    onClick={function () {
                      setOpen(false);
                    }}
                    className="rounded-xl px-4 py-3 text-center text-sm font-semibold text-slate-300 transition-all duration-200 hover:bg-white/8 hover:text-white"
                    style={{ border: "1px solid rgba(255,255,255,0.1)" }}
                  >
                    Masuk
                  </Link>
                  <Link
                    to="/register"
                    onClick={function () {
                      setOpen(false);
                    }}
                    className="rounded-xl bg-linear-to-br from-blue-500 to-violet-500 px-4 py-3 text-center text-sm font-bold text-white shadow-[0_4px_15px_rgba(59,130,246,0.3)] transition-all duration-200 hover:scale-105"
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
}

export default Navbar;