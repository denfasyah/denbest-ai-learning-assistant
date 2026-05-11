import { useState } from "react";

import {
  Sparkles,
  Brain,
  FileText,
  Layers3,
  Clock3,
  ChevronRight,
  Plus,
  Bot,
  ArrowUpRight,
  Flame,
  Activity,
  BadgeCheck,
  CalendarDays,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import useLogout from "../../hooks/useLogout";

import SidebarDashboard from "../../components/dashboard/layout/SidebarDashboard";
import NavbarDashboard from "../../components/dashboard/layout/NavbarDashboard";

const DashboardPage = () => {
  const { user } = useAuth();
  const { handleLogout } = useLogout();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const stats = [
    {
      id: 1,
      title: "Documents",
      value: "24",
      growth: "+12%",
      icon: <FileText className="h-6 w-6 text-cyan-300" />,
    },

    {
      id: 2,
      title: "AI Summary",
      value: "58",
      growth: "+18%",
      icon: <Sparkles className="h-6 w-6 text-blue-300" />,
    },

    {
      id: 3,
      title: "Flashcards",
      value: "132",
      growth: "+25%",
      icon: <Layers3 className="h-6 w-6 text-pink-300" />,
    },

    {
      id: 4,
      title: "Quiz Completed",
      value: "16",
      growth: "+9%",
      icon: <Brain className="h-6 w-6 text-violet-300" />,
    },
  ];

  const recentActivities = [
    {
      id: 1,
      title: "Generated AI Summary",
      description: "Machine Learning Fundamentals.pdf",
      time: "2 hours ago",
    },

    {
      id: 2,
      title: "Created React Flashcards",
      description: "React Authentication Workspace",
      time: "Yesterday",
    },

    {
      id: 3,
      title: "Completed Quiz",
      description: "Database Normalization Quiz",
      time: "2 days ago",
    },
  ];

  const quickActions = [
    {
      id: 1,
      title: "Upload Document",
      icon: <FileText className="h-5 w-5 text-cyan-300" />,
    },

    {
      id: 2,
      title: "Generate Summary",
      icon: <Sparkles className="h-5 w-5 text-blue-300" />,
    },

    {
      id: 3,
      title: "Create Flashcards",
      icon: <Layers3 className="h-5 w-5 text-pink-300" />,
    },

    {
      id: 4,
      title: "Open AI Assistant",
      icon: <Bot className="h-5 w-5 text-emerald-300" />,
    },
  ];

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
          title={"Dashboard"}
          setSidebarOpen={setSidebarOpen}
          user={user}
          handleLogout={handleLogout}
        />

        {/* CONTENT */}
        <div className="px-5 py-5 lg:px-8">
          {/* HERO */}
          <div
            className="
              overflow-hidden
              rounded-4xl
              border border-white/10
              bg-linear-to-br from-blue-500/10 via-violet-500/10 to-transparent
              p-7
              backdrop-blur-xl
            "
          >
            <div
              className="
                flex flex-col gap-8
                lg:flex-row lg:items-center lg:justify-between
              "
            >
              {/* LEFT */}
              <div className="max-w-2xl">
                <div
                  className="
                    mb-5 flex h-16 w-16 items-center justify-center
                    rounded-3xl
                    bg-linear-to-br from-blue-500 to-violet-500
                  "
                >
                  <Sparkles className="h-8 w-8 text-white" />
                </div>

                <div
                  className="
                    inline-flex items-center gap-2
                    rounded-full
                    bg-emerald-500/10
                    px-4 py-2
                    text-xs text-emerald-400
                  "
                >
                  <BadgeCheck className="h-3.5 w-3.5" />
                  AI Learning Workspace Active
                </div>

                <h1 className="mt-5 text-4xl font-bold tracking-[-1px]">
                  Welcome back,{" "}
                  {user?.displayName?.split(" ")[0] || "Adent"} 👋
                </h1>

                <p className="mt-5 leading-relaxed text-slate-300">
                  Continue your AI-powered learning journey, generate smarter
                  summaries, create flashcards, and track your learning
                  progress in one modern workspace.
                </p>
              </div>

              {/* RIGHT */}
              <div className="grid grid-cols-2 gap-4">
                <div
                  className="
                    rounded-3xl
                    border border-white/10
                    bg-white/5
                    p-5
                    backdrop-blur-xl
                  "
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="
                        flex h-12 w-12 items-center justify-center
                        rounded-2xl
                        bg-orange-500/10
                      "
                    >
                      <Flame className="h-5 w-5 text-orange-400" />
                    </div>

                    <div>
                      <p className="text-sm text-slate-400">
                        Study Streak
                      </p>

                      <h2 className="mt-1 text-2xl font-bold">
                        12 Days
                      </h2>
                    </div>
                  </div>
                </div>

                <div
                  className="
                    rounded-3xl
                    border border-white/10
                    bg-white/5
                    p-5
                    backdrop-blur-xl
                  "
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="
                        flex h-12 w-12 items-center justify-center
                        rounded-2xl
                        bg-blue-500/10
                      "
                    >
                      <Activity className="h-5 w-5 text-blue-400" />
                    </div>

                    <div>
                      <p className="text-sm text-slate-400">
                        AI Usage
                      </p>

                      <h2 className="mt-1 text-2xl font-bold">
                        148x
                      </h2>
                    </div>
                  </div>
                </div>

                <div
                  className="
                    rounded-3xl
                    border border-white/10
                    bg-white/5
                    p-5
                    backdrop-blur-xl
                  "
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="
                        flex h-12 w-12 items-center justify-center
                        rounded-2xl
                        bg-violet-500/10
                      "
                    >
                      <Brain className="h-5 w-5 text-violet-400" />
                    </div>

                    <div>
                      <p className="text-sm text-slate-400">
                        Quiz Score
                      </p>

                      <h2 className="mt-1 text-2xl font-bold">
                        85%
                      </h2>
                    </div>
                  </div>
                </div>

                <div
                  className="
                    rounded-3xl
                    border border-white/10
                    bg-white/5
                    p-5
                    backdrop-blur-xl
                  "
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="
                        flex h-12 w-12 items-center justify-center
                        rounded-2xl
                        bg-emerald-500/10
                      "
                    >
                      <CalendarDays className="h-5 w-5 text-emerald-400" />
                    </div>

                    <div>
                      <p className="text-sm text-slate-400">
                        Last Active
                      </p>

                      <h2 className="mt-1 text-lg font-bold">
                        Today
                      </h2>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* STATS */}
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((item) => (
              <div
                key={item.id}
                className="
                  rounded-4xl
                  border border-white/10
                  bg-white/5
                  p-6
                  backdrop-blur-xl
                  transition-all duration-300

                  hover:border-blue-500/20
                  hover:bg-white/[0.07]
                "
              >
                <div className="flex items-start justify-between gap-4">
                  <div
                    className="
                      flex h-14 w-14 items-center justify-center
                      rounded-2xl
                      bg-linear-to-br from-blue-500/15 to-violet-500/15
                    "
                  >
                    {item.icon}
                  </div>

                  <div
                    className="
                      inline-flex items-center gap-1
                      rounded-full
                      bg-emerald-500/10
                      px-3 py-1
                      text-xs text-emerald-400
                    "
                  >
                    <ArrowUpRight className="h-3.5 w-3.5" />
                    {item.growth}
                  </div>
                </div>

                <h2 className="mt-6 text-4xl font-bold">
                  {item.value}
                </h2>

                <p className="mt-2 text-sm text-slate-400">
                  {item.title}
                </p>
              </div>
            ))}
          </div>

          {/* GRID */}
          <div className="mt-8 grid grid-cols-1 gap-5 xl:grid-cols-3">
            {/* LEFT */}
            <div className="space-y-5 xl:col-span-2">
              {/* QUICK ACTION */}
              <div
                className="
                  rounded-4xl
                  border border-white/10
                  bg-white/5
                  p-7
                  backdrop-blur-xl
                "
              >
                <div className="flex items-center justify-between gap-5">
                  <div>
                    <h2 className="text-2xl font-bold">
                      Quick Actions
                    </h2>

                    <p className="mt-2 text-sm text-slate-400">
                      Start learning faster with AI powered tools.
                    </p>
                  </div>

                  <button
                    className="
                      hidden items-center gap-2
                      rounded-2xl
                      border border-white/10
                      bg-white/5
                      px-5 py-3
                      text-sm text-slate-300

                      hover:bg-white/10

                      md:flex
                    "
                  >
                    <Plus className="h-4 w-4" />
                    New Workspace
                  </button>
                </div>

                <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
                  {quickActions.map((item) => (
                    <button
                      key={item.id}
                      className="
                        group flex items-center justify-between
                        rounded-3xl
                        border border-white/10
                        bg-white/5
                        p-5
                        text-left
                        transition-all duration-300

                        hover:border-blue-500/20
                        hover:bg-white/[0.07]
                      "
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className="
                            flex h-12 w-12 items-center justify-center
                            rounded-2xl
                            bg-linear-to-br from-blue-500/15 to-violet-500/15
                          "
                        >
                          {item.icon}
                        </div>

                        <div>
                          <h3 className="font-semibold">
                            {item.title}
                          </h3>

                          <p className="mt-1 text-sm text-slate-400">
                            Open workspace action
                          </p>
                        </div>
                      </div>

                      <ChevronRight
                        className="
                          h-5 w-5 text-slate-500
                          transition-all duration-300

                          group-hover:translate-x-1
                        "
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* RECENT ACTIVITY */}
              <div
                className="
                  rounded-4xl
                  border border-white/10
                  bg-white/5
                  p-7
                  backdrop-blur-xl
                "
              >
                <div className="flex items-center justify-between gap-5">
                  <div>
                    <h2 className="text-2xl font-bold">
                      Recent Activity
                    </h2>

                    <p className="mt-2 text-sm text-slate-400">
                      Latest learning activity from your workspace.
                    </p>
                  </div>
                </div>

                <div className="mt-8 space-y-4">
                  {recentActivities.map((item) => (
                    <div
                      key={item.id}
                      className="
                        flex items-center justify-between gap-5
                        rounded-3xl
                        border border-white/10
                        bg-white/5
                        p-5
                        transition-all duration-300

                        hover:bg-white/[0.07]
                      "
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className="
                            flex h-12 w-12 items-center justify-center
                            rounded-2xl
                            bg-linear-to-br from-blue-500/15 to-violet-500/15
                          "
                        >
                          <Clock3 className="h-5 w-5 text-blue-300" />
                        </div>

                        <div>
                          <h3 className="font-semibold">
                            {item.title}
                          </h3>

                          <p className="mt-1 text-sm text-slate-400">
                            {item.description}
                          </p>
                        </div>
                      </div>

                      <div className="text-sm text-slate-500">
                        {item.time}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div className="space-y-5">
              {/* LEARNING PROGRESS */}
              <div
                className="
                  rounded-4xl
                  border border-white/10
                  bg-white/5
                  p-7
                  backdrop-blur-xl
                "
              >
                <div className="flex items-center justify-between gap-5">
                  <div>
                    <h2 className="text-2xl font-bold">
                      Learning Progress
                    </h2>

                    <p className="mt-2 text-sm text-slate-400">
                      Overall learning consistency.
                    </p>
                  </div>

                  <div
                    className="
                      rounded-2xl
                      bg-blue-500/10
                      px-4 py-3
                      text-sm font-semibold text-blue-400
                    "
                  >
                    78%
                  </div>
                </div>

                <div className="mt-8">
                  <div
                    className="
                      h-4 overflow-hidden
                      rounded-full
                      bg-white/10
                    "
                  >
                    <div
                      className="
                        h-full w-[78%]
                        rounded-full
                        bg-linear-to-r from-blue-500 to-violet-500
                      "
                    />
                  </div>
                </div>

                <div className="mt-8 space-y-4">
                  <div
                    className="
                      flex items-center justify-between
                      rounded-3xl
                      border border-white/10
                      bg-white/5
                      p-5
                    "
                  >
                    <div>
                      <p className="text-sm text-slate-400">
                        Documents Learned
                      </p>

                      <h3 className="mt-2 text-xl font-bold">
                        24 Files
                      </h3>
                    </div>

                    <FileText className="h-6 w-6 text-cyan-300" />
                  </div>

                  <div
                    className="
                      flex items-center justify-between
                      rounded-3xl
                      border border-white/10
                      bg-white/5
                      p-5
                    "
                  >
                    <div>
                      <p className="text-sm text-slate-400">
                        Notes Created
                      </p>

                      <h3 className="mt-2 text-xl font-bold">
                        34 Notes
                      </h3>
                    </div>

                    <Sparkles className="h-6 w-6 text-blue-300" />
                  </div>

                  <div
                    className="
                      flex items-center justify-between
                      rounded-3xl
                      border border-white/10
                      bg-white/5
                      p-5
                    "
                  >
                    <div>
                      <p className="text-sm text-slate-400">
                        Flashcards Mastered
                      </p>

                      <h3 className="mt-2 text-xl font-bold">
                        132 Cards
                      </h3>
                    </div>

                    <Layers3 className="h-6 w-6 text-pink-300" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;