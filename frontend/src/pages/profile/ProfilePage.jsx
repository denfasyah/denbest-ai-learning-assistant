
import { useState } from "react";

import {
  Flame,
  FileText,
  Sparkles,
  Brain,
  NotebookPen,
  Clock3,
  ChevronRight,
  Trophy,
  Star,
  Target,
  CalendarDays,
  Mail,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import useLogout from "../../hooks/useLogout";

import SidebarDashboard from "../../components/dashboard/layout/SidebarDashboard";
import NavbarDashboard from "../../components/dashboard/layout/NavbarDashboard";

const ProfilePage = () => {
  const { user } = useAuth();
  const { handleLogout } = useLogout();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const stats = [
    {
      title: "Documents",
      value: 24,
      icon: FileText,
    },

    {
      title: "AI Summaries",
      value: 18,
      icon: Sparkles,
    },

    {
      title: "Flashcards",
      value: 56,
      icon: Brain,
    },

    {
      title: "Notes",
      value: 31,
      icon: NotebookPen,
    },
  ];

  const learningProgress = [
    {
      title: "Frontend Development",
      progress: 82,
    },

    {
      title: "Backend Development",
      progress: 68,
    },

    {
      title: "Database",
      progress: 57,
    },

    {
      title: "AI / Machine Learning",
      progress: 34,
    },
  ];

  const recentActivities = [
    {
      title: "Created note about JWT Authentication",
      time: "2 hours ago",
    },

    {
      title: "Completed React Authentication Quiz",
      time: "Yesterday",
    },

    {
      title: "Generated AI Summary from Machine Learning.pdf",
      time: "2 days ago",
    },
  ];

  const achievements = [
    {
      title: "7 Days Streak",
      description: "Consistent learning for 7 days.",
      icon: Flame,
    },

    {
      title: "Quiz Master",
      description: "Completed 20 quizzes successfully.",
      icon: Trophy,
    },

    {
      title: "Fast Learner",
      description: "Generated 50+ flashcards.",
      icon: Star,
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
          title={"Profile"}
          description={"Manage your account and learning progress."}
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
            <div
              className="
                flex flex-col gap-8
                lg:flex-row lg:items-center lg:justify-between
              "
            >
              {/* LEFT */}
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
                {/* AVATAR */}
                <div
                  className="
                    flex h-28 w-28 items-center justify-center
                    rounded-4xl
                    bg-linear-to-br from-violet-500 to-blue-500
                    text-4xl font-bold text-white
                    shadow-2xl
                  "
                >
                  {user?.displayName?.charAt(0) || "A"}
                </div>

                {/* INFO */}
                <div>
                  <div
                    className="
                      inline-flex items-center gap-2
                      rounded-full
                      border border-violet-500/20
                      bg-violet-500/10
                      px-4 py-2
                      text-sm text-violet-300
                    "
                  >
                    <Flame className="h-4 w-4" />
                    7 Days Learning Streak
                  </div>

                  <h1 className="mt-5 text-4xl font-bold tracking-[-1px]">
                    {user?.displayName || "Adent Fallah"}
                  </h1>

                  <p className="mt-3 text-lg text-slate-300">
                    AI Learning Explorer
                  </p>

                  <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-slate-400">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {user?.email || "adent@gmail.com"}
                    </div>

                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4" />
                      Joined April 2026
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT */}
              <div
                className="
                  rounded-3xl
                  border border-white/10
                  bg-white/5
                  px-6 py-5
                  backdrop-blur-xl
                "
              >
                <div className="flex items-center gap-3">
                  <Target className="h-5 w-5 text-blue-400" />

                  <p className="text-sm text-slate-300">
                    Current Learning Goal
                  </p>
                </div>

                <h3 className="mt-4 text-xl font-bold">
                  Become MERN Stack Engineer
                </h3>

                <p className="mt-3 max-w-xs text-sm leading-relaxed text-slate-400">
                  Fokus memperdalam React, Node.js, MongoDB, dan AI Integration.
                </p>
              </div>
            </div>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((item, index) => {
              const Icon = item.icon;

              return (
                <div
                  key={index}
                  className="
                    rounded-4xl
                    border border-white/10
                    bg-white/5
                    p-6
                    backdrop-blur-xl
                  "
                >
                  <div
                    className="
                      flex h-14 w-14 items-center justify-center
                      rounded-2xl
                      bg-linear-to-br from-blue-500/15 to-violet-500/15
                    "
                  >
                    <Icon className="h-6 w-6 text-blue-300" />
                  </div>

                  <h2 className="mt-5 text-4xl font-bold">
                    {item.value}
                  </h2>

                  <p className="mt-2 text-sm text-slate-400">
                    {item.title}
                  </p>
                </div>
              );
            })}
          </div>

          {/* GRID */}
          <div className="mt-8 grid grid-cols-1 gap-5 xl:grid-cols-3">
            {/* LEARNING PROGRESS */}
            <div
              className="
                rounded-4xl
                border border-white/10
                bg-white/5
                p-6
                backdrop-blur-xl
                xl:col-span-2
              "
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">
                    Learning Progress
                  </h2>

                  <p className="mt-2 text-sm text-slate-400">
                    Track your current skill development.
                  </p>
                </div>
              </div>

              <div className="mt-8 space-y-6">
                {learningProgress.map((item, index) => (
                  <div key={index}>
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="font-medium text-slate-300">
                        {item.title}
                      </h3>

                      <span className="text-sm text-slate-400">
                        {item.progress}%
                      </span>
                    </div>

                    <div
                      className="
                        h-3 overflow-hidden
                        rounded-full
                        bg-white/5
                      "
                    >
                      <div
                        style={{ width: `${item.progress}%` }}
                        className="
                          h-full rounded-full
                          bg-linear-to-r from-blue-500 to-violet-500
                        "
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RECENT ACTIVITY */}
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
                Recent Activity
              </h2>

              <p className="mt-2 text-sm text-slate-400">
                Your latest learning activity.
              </p>

              <div className="mt-8 space-y-5">
                {recentActivities.map((item, index) => (
                  <div
                    key={index}
                    className="
                      rounded-3xl
                      border border-white/10
                      bg-white/3
                      p-4
                    "
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-sm leading-relaxed text-slate-300">
                          {item.title}
                        </h3>

                        <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                          <Clock3 className="h-3.5 w-3.5" />
                          {item.time}
                        </div>
                      </div>

                      <ChevronRight className="h-4 w-4 text-slate-500" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ACHIEVEMENTS */}
          <div
            className="
              mt-8 rounded-4xl
              border border-white/10
              bg-white/5
              p-6
              backdrop-blur-xl
            "
          >
            <h2 className="text-2xl font-bold">
              Achievements
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              Milestones and learning accomplishments.
            </p>

            <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {achievements.map((item, index) => {
                const Icon = item.icon;

                return (
                  <div
                    key={index}
                    className="
                      rounded-4xl
                      border border-white/10
                      bg-linear-to-br from-blue-500/5 to-violet-500/5
                      p-6
                    "
                  >
                    <div
                      className="
                        flex h-14 w-14 items-center justify-center
                        rounded-2xl
                        bg-linear-to-br from-blue-500 to-violet-500
                      "
                    >
                      <Icon className="h-6 w-6 text-white" />
                    </div>

                    <h3 className="mt-5 text-xl font-bold">
                      {item.title}
                    </h3>

                    <p className="mt-3 text-sm leading-relaxed text-slate-400">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;