import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Swal from "sweetalert2";

import {
  LayoutDashboard,
  FileText,
  BrainCircuit,
  Menu,
  X,
  LogOut,
  Bell,
  Search,
} from "lucide-react";

const DashboardPage = () => {
  const { user, logout } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    Swal.fire({
      title: "Konfirmasi Keluar",
      text: "Anda yakin ingin keluar dari akun?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#8b5cf6",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Ya, Keluar!",
      cancelButtonText: "Batal",
      background: "#050816",
      color: "#fff",
      backdrop: `
        rgba(0,0,0,0.45)
        blur(12px)
      `,
      customClass: {
        popup:
          "rounded-[28px] border border-white/10 shadow-[0_20px_80px_rgba(0,0,0,0.55)]",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        logout();

        Swal.fire({
          title: "Logout Berhasil",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
          background: "#050816",
          color: "#fff",
          backdrop: `
            rgba(0,0,0,0.45)
            blur(12px)
          `,
          customClass: {
            popup:
              "rounded-[28px] border border-white/10 shadow-[0_20px_80px_rgba(0,0,0,0.55)]",
          },
        });
      }
    });
  };

  return (
    <section className="flex min-h-screen bg-[#050816] text-white">
      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed left-0 top-0 z-50
          flex h-screen w-72 flex-col
          border-r border-white/10
          bg-[#0b1020]
          transition-all duration-300

          lg:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* LOGO */}
        <div
          className="
            flex items-center justify-between
            border-b border-white/10
            px-6 py-5
          "
        >
          <div className="flex items-center gap-3">
            <div
              className="
                flex h-11 w-11 items-center justify-center
                rounded-2xl
                bg-linear-to-br from-blue-500 to-violet-500
                shadow-[0_8px_30px_rgba(59,130,246,0.35)]
              "
            >
              <BrainCircuit className="h-5 w-5 text-white" />
            </div>

            <div>
              <h1 className="text-lg font-black tracking-[-0.5px]">
                DenBest<span className="text-violet-400">AI</span>
              </h1>

              <p className="text-xs text-slate-400">
                AI Learning Assistant
              </p>
            </div>
          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden"
          >
            <X className="h-5 w-5 text-white" />
          </button>
        </div>

        {/* MENU */}
        <div className="flex flex-1 flex-col gap-2 p-4">
          {[
            {
              icon: LayoutDashboard,
              label: "Dashboard",
              active: true,
            },
            {
              icon: FileText,
              label: "My Learning",
            },

          ].map((item) => (
            <button
              key={item.label}
              className={`
                flex items-center gap-3
                rounded-2xl px-4 py-3
                text-sm font-semibold
                transition-all duration-200

                ${
                  item.active
                    ? "bg-linear-to-r from-blue-500 to-violet-500 text-white shadow-lg"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }
              `}
            >
              <item.icon className="h-5 w-5" />

              {item.label}
            </button>
          ))}
        </div>

        {/* USER */}
        <div className="border-t border-white/10 p-4">
          <div
            className="
              mb-4 flex items-center gap-3
              rounded-2xl
              bg-white/5 p-3
            "
          >
            <div
              className="
                flex h-11 w-11 items-center justify-center
                rounded-full
                bg-linear-to-br from-blue-500 to-violet-500
                font-bold text-white
              "
            >
              {user?.name?.charAt(0)}
            </div>

            <div>
              <h3 className="text-sm font-bold text-white">
                {user?.name}
              </h3>

              <p className="text-xs text-slate-400">
                {user?.email}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="
              flex w-full items-center justify-center gap-2
              rounded-2xl
              border border-red-500/20
              bg-red-500/10 px-4 py-3
              text-sm font-semibold text-red-400
              transition-all duration-200
              hover:bg-red-500/20
            "
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex flex-1 flex-col lg:ml-72">
        {/* TOPBAR */}
        <header
          className="
            sticky top-0 z-30
            border-b border-white/10
            bg-[#050816]/80
            backdrop-blur-xl
          "
        >
          <div
            className="
              flex items-center justify-between
              px-5 py-4 lg:px-8
            "
          >
            {/* LEFT */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="
                  flex h-11 w-11 items-center justify-center
                  rounded-2xl
                  border border-white/10
                  bg-white/5
                  lg:hidden
                "
              >
                <Menu className="h-5 w-5 text-white" />
              </button>

              <div>
                <h2 className="text-2xl font-black tracking-[-1px]">
                  Dashboard
                </h2>

                <p className="text-sm text-slate-400">
                  Selamat datang kembali 👋
                </p>
              </div>
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-3">
              {/* SEARCH */}
              <div
                className="
                  hidden items-center gap-2
                  rounded-2xl
                  border border-white/10
                  bg-white/5
                  px-4 py-3
                  md:flex
                "
              >
                <Search className="h-4 w-4 text-slate-500" />

                <input
                  type="text"
                  placeholder="Cari dokumen..."
                  className="
                    bg-transparent
                    text-sm text-white
                    outline-none
                    placeholder:text-slate-500
                  "
                />
              </div>

              {/* NOTIF */}
              <button
                className="
                  flex h-11 w-11 items-center justify-center
                  rounded-2xl
                  border border-white/10
                  bg-white/5
                "
              >
                <Bell className="h-5 w-5 text-slate-300" />
              </button>
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <div className="flex-1 p-5 lg:p-8">
          {/* STATS */}
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {[
              {
                title: "Total Dokumen",
                value: "0",
              },
              {
                title: "Flashcard",
                value: "0",
              },
              {
                title: "Quiz AI",
                value: "0",
              },
              {
                title: "AI Chat",
                value: "0",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="
                  rounded-3xl
                  border border-white/10
                  bg-white/5 p-6
                  backdrop-blur-xl
                "
              >
                <p className="text-sm text-slate-400">
                  {item.title}
                </p>

                <h3 className="mt-3 text-4xl font-black">
                  {item.value}
                </h3>
              </div>
            ))}
          </div>

          {/* MAIN CARD */}
          {/* <div
            className="
              mt-8
              rounded-4xl
              border border-white/10
              bg-white/5
              p-8
              backdrop-blur-xl
            "
          >
            <div
              className="
                flex flex-col items-center justify-center
                py-18 text-center
              "
            >
              <div
                className="
                  mb-6 flex h-24 w-24 items-center justify-center
                  rounded-[28px]
                  bg-linear-to-br from-blue-500/20 to-violet-500/20
                "
              >
                <Upload className="h-10 w-10 text-blue-400" />
              </div>

              <h3 className="text-3xl font-black">
                Belum Ada Dokumen
              </h3>

              <p className="mt-3 max-w-lg text-slate-400">
                Upload materi kuliah atau dokumen PDF untuk mulai
                menggunakan fitur AI seperti summary, flashcard,
                quiz, dan AI chat.
              </p>

              <button
                className="
                  mt-8 flex items-center gap-2
                  rounded-2xl
                  bg-linear-to-r from-blue-500 to-violet-500
                  px-6 py-4
                  text-sm font-bold text-white
                  shadow-[0_10px_35px_rgba(59,130,246,0.35)]
                  transition-all duration-300
                  hover:-translate-y-1
                "
              >
                <Upload className="h-4 w-4" />
                Upload PDF
              </button>
            </div>
          </div> */}
        </div>
      </main>
    </section>
  );
};

export default DashboardPage;