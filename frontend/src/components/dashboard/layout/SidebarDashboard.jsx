import { LayoutDashboard, FileText, X, User, LogOut } from "lucide-react";
const SidebarDashboard = ({
  sidebarOpen,
  setSidebarOpen,
  user,
  handleLogout,
}) => {
  return (
    <div>
      {/* SIDEBAR */}
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
              <img src="/logo.png" alt="" className="w-full" />
            </div>

            <div>
              <h1 className="text-2xl font-black tracking-[-0.5px]">
                Ai
                <span
                  className=" bg-linear-to-r
              from-blue-500 to-violet-500
              bg-clip-text text-transparent"
                >
                  Den
                </span>
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
              <User className="h-5 w-5" />
            </div>

            <div>
              <h3 className="text-sm font-bold text-white">{user?.name}</h3>

              <p className="text-xs text-slate-400">{user?.email}</p>
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
    </div>
  );
};

export default SidebarDashboard;
