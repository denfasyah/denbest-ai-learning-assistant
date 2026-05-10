import { useState } from "react";
import { Link } from "react-router-dom";

import {
  User,
  Mail,
  CalendarDays,
  FileText,
  BrainCircuit,
  Layers3,
  MessageSquare,
  Pencil,
  TrendingUp,
  Clock3,
  Star,
  ChevronRight,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

import useLogout from "../../hooks/useLogout";

import SidebarDashboard from "../../components/dashboard/layout/SidebarDashboard";
import NavbarDashboard from "../../components/dashboard/layout/NavbarDashboard";

const ProfilePage = () => {
  const { user } = useAuth();
  const { handleLogout } = useLogout();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // DUMMY DATA
  const statistics = [
    {
      title: "Documents",
      value: 24,
      icon: FileText,
      color: "from-blue-500/20 to-cyan-500/20",
      iconColor: "text-blue-400",
    },
    {
      title: "AI Chats",
      value: 128,
      icon: MessageSquare,
      color: "from-violet-500/20 to-pink-500/20",
      iconColor: "text-violet-400",
    },
    {
      title: "Flashcards",
      value: 86,
      icon: Layers3,
      color: "from-orange-500/20 to-yellow-500/20",
      iconColor: "text-orange-400",
    },
    {
      title: "Quiz Completed",
      value: 17,
      icon: BrainCircuit,
      color: "from-emerald-500/20 to-green-500/20",
      iconColor: "text-emerald-400",
    },
  ];

  const recentActivities = [
    {
      title: "Completed AI Quiz",
      description: "Machine Learning Fundamentals",
      time: "2 hours ago",
    },
    {
      title: "Generated Flashcards",
      description: "Database Management System",
      time: "Yesterday",
    },
    {
      title: "Uploaded New Document",
      description: "Artificial Intelligence.pdf",
      time: "2 days ago",
    },
  ];

  const favoriteDocuments = [
    "Machine Learning Fundamentals.pdf",
    "React Advanced Guide.pdf",
    "Database Design System.pdf",
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
          title={"My Profile"}
          description={"Kelola informasi akun dan progress pembelajaran."}
          setSidebarOpen={setSidebarOpen}
          user={user}
          handleLogout={handleLogout}
        />

        {/* CONTENT */}
        <div className="space-y-6 px-5 py-5 lg:px-8">
          {/* PROFILE HERO */}
          <div
            className="
              overflow-hidden
              rounded-4xl
              border border-white/10
              bg-white/5
              backdrop-blur-xl
            "
          >
            {/* TOP BACKGROUND */}
            <div
              className="
                h-36
                bg-linear-to-r
                from-blue-500/20
                via-violet-500/20
                to-pink-500/20
              "
            />

            {/* CONTENT */}
            <div className="relative px-6 pb-6">
              {/* AVATAR */}
              <div
                className="
                  absolute -top-14
                  flex h-28 w-28 items-center justify-center
                  rounded-[30px]
                  border-4 border-[#050816]
                  bg-linear-to-br from-blue-500 to-violet-500
                  shadow-2xl shadow-blue-500/20
                "
              >
                <User className="h-12 w-12 text-white" />
              </div>

              {/* ACTION */}
              <div className="flex justify-end pt-5">
                <button
                  className="
                    flex items-center gap-2
                    rounded-2xl
                    border border-white/10
                    bg-white/5
                    px-5 py-3
                    text-sm font-semibold text-white
                    transition-all duration-300

                    hover:bg-white/10
                  "
                >
                  <Pencil className="h-4 w-4" />
                  Edit Profile
                </button>
              </div>

              {/* INFO */}
              <div className="mt-16">
                <h1 className="text-3xl font-bold tracking-[-0.5px]">
                  {user?.displayName || "Adent Fallah"}
                </h1>

                <div className="mt-5 flex flex-wrap gap-4 text-sm text-slate-400">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {user?.email || "adent@example.com"}
                  </div>

                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4" />
                    Joined May 2026
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {statistics.map((item, index) => {
              const Icon = item.icon;

              return (
                <div
                  key={index}
                  className="
                    rounded-[28px]
                    border border-white/10
                    bg-white/5
                    p-5
                    backdrop-blur-xl
                    transition-all duration-300

                    hover:-translate-y-1
                    hover:border-blue-500/20
                  "
                >
                  <div
                    className={`
                      mb-5 flex h-14 w-14 items-center justify-center
                      rounded-2xl bg-linear-to-br ${item.color}
                    `}
                  >
                    <Icon className={`h-7 w-7 ${item.iconColor}`} />
                  </div>

                  <h2 className="text-3xl font-bold">
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
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            {/* ACTIVITY */}
            <div
              className="
                xl:col-span-2
                rounded-[28px]
                border border-white/10
                bg-white/5
                p-6
                backdrop-blur-xl
              "
            >
              {/* HEADER */}
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">
                    Recent Activity
                  </h2>

                  <p className="mt-1 text-sm text-slate-400">
                    Aktivitas pembelajaran terbaru.
                  </p>
                </div>

                <TrendingUp className="h-6 w-6 text-blue-400" />
              </div>

              {/* LIST */}
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div
                    key={index}
                    className="
                      flex items-center justify-between
                      rounded-2xl
                      border border-white/10
                      bg-[#0B1120]
                      p-5
                    "
                  >
                    <div>
                      <h3 className="font-semibold text-white">
                        {activity.title}
                      </h3>

                      <p className="mt-1 text-sm text-slate-400">
                        {activity.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Clock3 className="h-4 w-4" />
                      {activity.time}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FAVORITE */}
            <div
              className="
                rounded-[28px]
                border border-white/10
                bg-white/5
                p-6
                backdrop-blur-xl
              "
            >
              {/* HEADER */}
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">
                    Favorite Documents
                  </h2>

                  <p className="mt-1 text-sm text-slate-400">
                    Dokumen favorit yang sering dipelajari.
                  </p>
                </div>

                <Star className="h-6 w-6 text-yellow-400" />
              </div>

              {/* LIST */}
              <div className="space-y-4">
                {favoriteDocuments.map((doc, index) => (
                  <div
                    key={index}
                    className="
                      flex items-center justify-between
                      rounded-2xl
                      border border-white/10
                      bg-[#0B1120]
                      px-4 py-4
                    "
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="
                          flex h-10 w-10 items-center justify-center
                          rounded-xl
                          bg-linear-to-br from-blue-500/20 to-violet-500/20
                        "
                      >
                        <FileText className="h-5 w-5 text-blue-400" />
                      </div>

                      <p className="line-clamp-1 text-sm text-slate-300">
                        {doc}
                      </p>
                    </div>

                    <ChevronRight className="h-4 w-4 text-slate-500" />
                  </div>
                ))}
              </div>

              {/* BUTTON */}
              <Link
                to="/learning"
                className="
                  mt-6 flex items-center justify-center gap-2
                  rounded-2xl
                  bg-linear-to-r from-blue-500 to-violet-500
                  px-5 py-3
                  text-sm font-semibold text-white
                  transition-all duration-300

                  hover:scale-[1.02]
                "
              >
                Open Learning
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;