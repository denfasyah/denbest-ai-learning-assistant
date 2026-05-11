
import { useState } from "react";

import {
  Settings,
  Bell,
  Shield,
  Moon,
  User,
  Lock,
  Trash2,
  LogOut,
  ChevronRight,
  Mail,
  Save,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import useLogout from "../../hooks/useLogout";

import SidebarDashboard from "../../components/dashboard/layout/SidebarDashboard";
import NavbarDashboard from "../../components/dashboard/layout/NavbarDashboard";

const SettingsPage = () => {
  const { user } = useAuth();
  const { handleLogout } = useLogout();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [darkMode, setDarkMode] = useState(true);
  const [emailNotification, setEmailNotification] = useState(true);
  const [aiAutoSave, setAiAutoSave] = useState(true);

  return (
    <div className="flex min-h-screen bg-linear-to-b from-black via-[#050816] to-violet-950 text-white">
      {/* OVERLAY */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* SIDEBAR */}
      <SidebarDashboard
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        handleLogout={handleLogout}
        user={user}
      />

      {/* MAIN */}
      <main className="flex flex-1 flex-col lg:ml-72">
        {/* NAVBAR */}
        <NavbarDashboard
          title={"Settings"}
          description={"Manage your account preferences."}
          setSidebarOpen={setSidebarOpen}
          user={user}
          handleLogout={handleLogout}
        />

        {/* CONTENT */}
        <div className="px-5 py-5 lg:px-8">
          {/* HERO */}
          <div
            className="
              mb-8 overflow-hidden
              rounded-4xl
              border border-white/10
              bg-linear-to-br from-violet-500/10 via-blue-500/10 to-transparent
              p-7
              backdrop-blur-xl
            "
          >
            <div className="max-w-2xl">
              <div
                className="
                  mb-5 flex h-16 w-16 items-center justify-center
                  rounded-3xl
                  bg-linear-to-br from-violet-500 to-blue-500
                "
              >
                <Settings className="h-8 w-8 text-white" />
              </div>

              <h1 className="text-3xl font-bold tracking-[-1px]">
                Workspace Settings
              </h1>

              <p className="mt-4 leading-relaxed text-slate-300">
                Kelola account, preferences, security, dan pengaturan AI
                Learning Workspace.
              </p>
            </div>
          </div>

          {/* GRID */}
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
            {/* LEFT */}
            <div className="space-y-5 xl:col-span-2">
              {/* ACCOUNT SETTINGS */}
              <div
                className="
                  rounded-4xl
                  border border-white/10
                  bg-white/5
                  p-6
                  backdrop-blur-xl
                "
              >
                <div className="flex items-center gap-3">
                  <div
                    className="
                      flex h-12 w-12 items-center justify-center
                      rounded-2xl
                      bg-linear-to-br from-blue-500/20 to-violet-500/20
                    "
                  >
                    <User className="h-5 w-5 text-blue-300" />
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold">
                      Account Settings
                    </h2>

                    <p className="mt-1 text-sm text-slate-400">
                      Update your personal information.
                    </p>
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div>
                    <label className="text-sm text-slate-400">
                      Full Name
                    </label>

                    <input
                      type="text"
                      defaultValue={user?.displayName || "Adent Fallah"}
                      className="
                        mt-3 w-full
                        rounded-2xl
                        border border-white/10
                        bg-white/5
                        px-5 py-4
                        text-white
                        outline-none
                      "
                    />
                  </div>

                  <div>
                    <label className="text-sm text-slate-400">
                      Email Address
                    </label>

                    <input
                      type="email"
                      defaultValue={user?.email || "adent@gmail.com"}
                      className="
                        mt-3 w-full
                        rounded-2xl
                        border border-white/10
                        bg-white/5
                        px-5 py-4
                        text-white
                        outline-none
                      "
                    />
                  </div>
                </div>

                <button
                  className="
                    mt-6 flex items-center gap-2
                    rounded-2xl
                    bg-linear-to-r from-blue-500 to-violet-500
                    px-5 py-3
                    text-sm font-semibold text-white
                    transition-all duration-300

                    hover:scale-[1.02]
                  "
                >
                  <Save className="h-4 w-4" />
                  Save Changes
                </button>
              </div>

              {/* SECURITY */}
              <div
                className="
                  rounded-4xl
                  border border-white/10
                  bg-white/5
                  p-6
                  backdrop-blur-xl
                "
              >
                <div className="flex items-center gap-3">
                  <div
                    className="
                      flex h-12 w-12 items-center justify-center
                      rounded-2xl
                      bg-linear-to-br from-emerald-500/20 to-cyan-500/20
                    "
                  >
                    <Shield className="h-5 w-5 text-emerald-300" />
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold">
                      Security
                    </h2>

                    <p className="mt-1 text-sm text-slate-400">
                      Protect your workspace account.
                    </p>
                  </div>
                </div>

                <div className="mt-8 space-y-4">
                  <button
                    className="
                      flex w-full items-center justify-between
                      rounded-3xl
                      border border-white/10
                      bg-white/[0.03]
                      px-5 py-5
                      transition-all duration-300

                      hover:bg-white/[0.05]
                    "
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="
                          flex h-12 w-12 items-center justify-center
                          rounded-2xl
                          bg-white/5
                        "
                      >
                        <Lock className="h-5 w-5 text-slate-300" />
                      </div>

                      <div className="text-left">
                        <h3 className="font-semibold">
                          Change Password
                        </h3>

                        <p className="mt-1 text-sm text-slate-400">
                          Update your account password.
                        </p>
                      </div>
                    </div>

                    <ChevronRight className="h-5 w-5 text-slate-500" />
                  </button>

                  <button
                    className="
                      flex w-full items-center justify-between
                      rounded-3xl
                      border border-white/10
                      bg-white/[0.03]
                      px-5 py-5
                      transition-all duration-300

                      hover:bg-white/[0.05]
                    "
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="
                          flex h-12 w-12 items-center justify-center
                          rounded-2xl
                          bg-white/5
                        "
                      >
                        <LogOut className="h-5 w-5 text-slate-300" />
                      </div>

                      <div className="text-left">
                        <h3 className="font-semibold">
                          Logout All Devices
                        </h3>

                        <p className="mt-1 text-sm text-slate-400">
                          Sign out from all active sessions.
                        </p>
                      </div>
                    </div>

                    <ChevronRight className="h-5 w-5 text-slate-500" />
                  </button>
                </div>
              </div>

              {/* DANGER ZONE */}
              <div
                className="
                  rounded-4xl
                  border border-red-500/20
                  bg-red-500/[0.03]
                  p-6
                  backdrop-blur-xl
                "
              >
                <h2 className="text-2xl font-bold text-red-400">
                  Danger Zone
                </h2>

                <p className="mt-2 text-sm text-slate-400">
                  Permanent and destructive account actions.
                </p>

                <button
                  className="
                    mt-6 flex items-center gap-2
                    rounded-2xl
                    bg-red-500/10
                    px-5 py-3
                    text-sm font-semibold text-red-400
                    transition-all duration-300

                    hover:bg-red-500/20
                  "
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Account
                </button>
              </div>
            </div>

            {/* RIGHT */}
            <div className="space-y-5">
              {/* PREFERENCES */}
              <div
                className="
                  rounded-4xl
                  border border-white/10
                  bg-white/5
                  p-6
                  backdrop-blur-xl
                "
              >
                <h2 className="text-2xl font-bold">
                  Preferences
                </h2>

                <p className="mt-2 text-sm text-slate-400">
                  Customize your workspace experience.
                </p>

                <div className="mt-8 space-y-5">
                  {/* DARK MODE */}
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="
                          flex h-11 w-11 items-center justify-center
                          rounded-2xl
                          bg-white/5
                        "
                      >
                        <Moon className="h-5 w-5 text-slate-300" />
                      </div>

                      <div>
                        <h3 className="font-medium">
                          Dark Mode
                        </h3>

                        <p className="mt-1 text-xs text-slate-400">
                          Enable dark appearance.
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setDarkMode(!darkMode)}
                      className={`
                        relative h-7 w-14 rounded-full
                        transition-all duration-300

                        ${
                          darkMode
                            ? "bg-linear-to-r from-blue-500 to-violet-500"
                            : "bg-white/10"
                        }
                      `}
                    >
                      <div
                        className={`
                          absolute top-1 h-5 w-5 rounded-full bg-white
                          transition-all duration-300

                          ${darkMode ? "left-8" : "left-1"}
                        `}
                      />
                    </button>
                  </div>

                  {/* EMAIL NOTIFICATION */}
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="
                          flex h-11 w-11 items-center justify-center
                          rounded-2xl
                          bg-white/5
                        "
                      >
                        <Bell className="h-5 w-5 text-slate-300" />
                      </div>

                      <div>
                        <h3 className="font-medium">
                          Notifications
                        </h3>

                        <p className="mt-1 text-xs text-slate-400">
                          Receive activity alerts.
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        setEmailNotification(!emailNotification)
                      }
                      className={`
                        relative h-7 w-14 rounded-full
                        transition-all duration-300

                        ${
                          emailNotification
                            ? "bg-linear-to-r from-blue-500 to-violet-500"
                            : "bg-white/10"
                        }
                      `}
                    >
                      <div
                        className={`
                          absolute top-1 h-5 w-5 rounded-full bg-white
                          transition-all duration-300

                          ${emailNotification ? "left-8" : "left-1"}
                        `}
                      />
                    </button>
                  </div>

                  {/* AI AUTO SAVE */}
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="
                          flex h-11 w-11 items-center justify-center
                          rounded-2xl
                          bg-white/5
                        "
                      >
                        <Mail className="h-5 w-5 text-slate-300" />
                      </div>

                      <div>
                        <h3 className="font-medium">
                          AI Auto Save
                        </h3>

                        <p className="mt-1 text-xs text-slate-400">
                          Save AI summary automatically.
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setAiAutoSave(!aiAutoSave)}
                      className={`
                        relative h-7 w-14 rounded-full
                        transition-all duration-300

                        ${
                          aiAutoSave
                            ? "bg-linear-to-r from-blue-500 to-violet-500"
                            : "bg-white/10"
                        }
                      `}
                    >
                      <div
                        className={`
                          absolute top-1 h-5 w-5 rounded-full bg-white
                          transition-all duration-300

                          ${aiAutoSave ? "left-8" : "left-1"}
                        `}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* CONNECTED ACCOUNT */}
              <div
                className="
                  rounded-4xl
                  border border-white/10
                  bg-white/5
                  p-6
                  backdrop-blur-xl
                "
              >
                <h2 className="text-2xl font-bold">
                  Connected Accounts
                </h2>

                <p className="mt-2 text-sm text-slate-400">
                  Manage third-party integrations.
                </p>

                <div className="mt-8 space-y-4">
                  <button
                    className="
                      flex w-full items-center justify-between
                      rounded-3xl
                      border border-white/10
                      bg-white/[0.03]
                      px-5 py-5
                    "
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="
                          flex h-12 w-12 items-center justify-center
                          rounded-2xl
                          bg-white/5
                        "
                      >
                      </div>

                      <div className="text-left">
                        <h3 className="font-semibold">
                          Google Account
                        </h3>

                        <p className="mt-1 text-sm text-emerald-400">
                          Connected
                        </p>
                      </div>
                    </div>
                  </button>

                  <button
                    className="
                      flex w-full items-center justify-between
                      rounded-3xl
                      border border-white/10
                      bg-white/[0.03]
                      px-5 py-5
                    "
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="
                          flex h-12 w-12 items-center justify-center
                          rounded-2xl
                          bg-white/5
                        "
                      >
                      </div>

                      <div className="text-left">
                        <h3 className="font-semibold">
                          Github Account
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                          Not Connected
                        </p>
                      </div>
                    </div>

                    <button
                      className="
                        rounded-2xl
                        bg-linear-to-r from-blue-500 to-violet-500
                        px-4 py-2
                        text-sm font-semibold text-white
                      "
                    >
                      Connect
                    </button>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;
