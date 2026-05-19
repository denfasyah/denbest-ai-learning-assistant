import {
  LayoutDashboard,
  X,
  LogOut,
  Bot,
  GraduationCap,
  NotebookPen,
  History,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

const SidebarDashboard = ({ sidebarOpen, setSidebarOpen, user, handleLogout }) => {
  const navigate = useNavigate();

  const initials = user?.name
    ? user.name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <div>
      <aside
        className={`
          fixed left-0 top-0 z-50
          flex h-screen w-72 flex-col
          border-r border-white/10
          bg-linear-to-b from-black via-[#050816] to-violet-950
          transition-all duration-300
          lg:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* LOGO */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br from-blue-500 to-violet-500 shadow-[0_8px_30px_rgba(59,130,246,0.35)]">
              <img src="/logo.png" alt="" className="w-full" />
            </div>
            <div>
              <h1 className="text-2xl text-white font-black tracking-[-0.5px]">
                Ai<span className="bg-linear-to-r from-blue-500 to-violet-500 bg-clip-text text-transparent">Den</span>
              </h1>
              <p className="text-xs text-slate-400">AI Learning Assistant</p>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
            <X className="h-5 w-5 text-white" />
          </button>
        </div>

        {/* MENU */}
        <div className="flex flex-1 flex-col gap-2 p-4">
          {[
            { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
            { icon: GraduationCap, label: "Learning", path: "/learning" },
            { icon: Bot, label: "Assistant", path: "/assistant" },
            { icon: NotebookPen, label: "Notes", path: "/notes" },
            { icon: History, label: "History", path: "/history" },
          ].map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-200
                ${isActive
                  ? "bg-linear-to-r from-blue-500 to-violet-500 text-white shadow-lg"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              <item.icon className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
              {item.label}
            </NavLink>
          ))}
        </div>

        {/* USER */}
        <div className="border-t border-white/10 p-4">
          <button
            onClick={() => { navigate("/profile"); setSidebarOpen(false); }}
            className="mb-3 flex w-full items-center gap-3 rounded-2xl bg-white/5 p-3 hover:bg-white/10 transition-colors duration-200 cursor-pointer border-none text-left"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-indigo-400 to-violet-500 font-bold text-white text-sm select-none">
              {initials}
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-white truncate">{user?.name}</h3>
              <p className="text-xs text-slate-400 truncate">{user?.email}</p>
            </div>
          </button>

          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-400 transition-all duration-200 hover:bg-red-500/20"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>
    </div>
  );
};

export default SidebarDashboard;