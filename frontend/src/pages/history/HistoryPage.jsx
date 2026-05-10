import { useMemo, useState } from "react";

import {
  Search,
  Clock3,
  Bot,
  FileText,
  Sparkles,
  Layers3,
  CalendarDays,
  Filter,
  CheckCircle2,
  XCircle,
  Brain,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import useLogout from "../../hooks/useLogout";

import SidebarDashboard from "../../components/dashboard/layout/SidebarDashboard";
import NavbarDashboard from "../../components/dashboard/layout/NavbarDashboard";

const HistoryPage = () => {
  const { user } = useAuth();
  const { handleLogout } = useLogout();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 5;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const activities = [
    {
      id: 1,
      type: "summary",
      title: "Generated AI Summary",
      description:
        "AI berhasil membuat rangkuman dari Machine Learning Fundamentals.pdf",
      file: "Machine Learning Fundamentals.pdf",
      time: "2 minutes ago",
      status: "completed",
      resourceAvailable: true,
      route: "/learning/workspace/1/summary",
    },

    {
      id: 2,
      type: "quiz",
      title: "Completed Quiz",
      description:
        "Menyelesaikan quiz React Authentication dengan score 85/100",
      file: "React Authentication",
      time: "20 minutes ago",
      status: "completed",
      resourceAvailable: true,
      route: "/learning/workspace/2/quiz",
    },

    {
      id: 3,
      type: "flashcard",
      title: "Generated Flashcards",
      description:
        "AI membuat 15 flashcards dari materi Database Normalization",
      file: "Database Normalization",
      time: "1 hour ago",
      status: "completed",
      resourceAvailable: true,
      route: "/learning/workspace/3/flashcard",
    },

    {
      id: 4,
      type: "document",
      title: "Uploaded Document",
      description: "Dokumen baru berhasil diupload ke workspace learning.",
      file: "Advanced NodeJS.pdf",
      time: "Yesterday",
      status: "completed",
      resourceAvailable: false,
      route: null,
    },

    {
      id: 5,
      type: "assistant",
      title: "AI Conversation",
      description: "Diskusi dengan AI Assistant tentang supervised learning.",
      file: "AI Assistant",
      time: "Yesterday",
      status: "active",
      resourceAvailable: true,
      route: "/assistant/chat/1",
    },

    {
      id: 6,
      type: "notes",
      title: "Created Learning Note",
      description: "Membuat note baru tentang konsep JWT Authentication.",
      file: "JWT Authentication",
      time: "2 days ago",
      status: "completed",
      resourceAvailable: true,
      route: "/notes/1",
    },

    {
      id: 7,
      type: "summary",
      title: "Summary Failed",
      description: "Terjadi error ketika generate summary pada file besar.",
      file: "Deep Learning Research.pdf",
      time: "3 days ago",
      status: "failed",
      resourceAvailable: false,
      route: null,
    },

    {
      id: 8,
      type: "document",
      title: "Deleted Workspace",
      description: "Workspace Machine Learning sudah dihapus oleh user.",
      file: "Machine Learning Workspace",
      time: "4 days ago",
      status: "failed",
      resourceAvailable: false,
      route: null,
    },
  ];

  const filteredActivities = useMemo(() => {
    let filtered = [...activities];

    filtered = filtered.filter(
      (item) =>
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase()) ||
        item.file.toLowerCase().includes(search.toLowerCase()),
    );

    if (filter !== "all") {
      filtered = filtered.filter((item) => item.type === filter);
    }

    return filtered;
  }, [activities, search, filter]);

  // PAGINATION
  const totalPages = Math.ceil(filteredActivities.length / ITEMS_PER_PAGE);

  const paginatedActivities = filteredActivities.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const getActivityIcon = (type) => {
    switch (type) {
      case "summary":
        return <Sparkles className="h-5 w-5 text-blue-300" />;

      case "quiz":
        return <Brain className="h-5 w-5 text-violet-300" />;

      case "flashcard":
        return <Layers3 className="h-5 w-5 text-pink-300" />;

      case "document":
        return <FileText className="h-5 w-5 text-cyan-300" />;

      case "assistant":
        return <Bot className="h-5 w-5 text-emerald-300" />;

      case "notes":
        return <FileText className="h-5 w-5 text-yellow-300" />;

      default:
        return <Clock3 className="h-5 w-5 text-white" />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return (
          <div
            className="
              inline-flex items-center gap-2
              rounded-full
              bg-emerald-500/10
              px-3 py-1
              text-xs text-emerald-400
            "
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            Completed
          </div>
        );

      case "active":
        return (
          <div
            className="
              inline-flex items-center gap-2
              rounded-full
              bg-blue-500/10
              px-3 py-1
              text-xs text-blue-400
            "
          >
            <Clock3 className="h-3.5 w-3.5" />
            Active
          </div>
        );

      case "failed":
        return (
          <div
            className="
              inline-flex items-center gap-2
              rounded-full
              bg-red-500/10
              px-3 py-1
              text-xs text-red-400
            "
          >
            <XCircle className="h-3.5 w-3.5" />
            Failed
          </div>
        );

      default:
        return null;
    }
  };

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
          title={"History Activity"}
          description={"Track recent activity."}
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
              bg-linear-to-br from-blue-500/10 via-violet-500/10 to-transparent
              p-7
              backdrop-blur-xl
            "
          >
            <div className="flex max-w-3xl">
              <div
                className="
                  mb-5 mr-10 flex h-16 w-16 items-center justify-center
                  rounded-3xl shrink-0
                  bg-linear-to-br from-blue-500 to-violet-500
                "
              >
                <Clock3 className="h-8 w-8 text-white" />
              </div>
              <div className="">
                <h1 className="md:text-3xl text-xl font-bold tracking-[-1px]">
                  Learning Activity Center
                </h1>

                <p className="mt-4 leading-relaxed text-slate-300 text-sm">
                  Pantau seluruh aktivitas AI Assistant, summary, flashcards,
                  notes, quiz, dan progress pembelajaran.
                </p>
              </div>
            </div>
          </div>

          {/* TOOLBAR */}
          <div
            className="
              mb-8 flex gap-4
              flex-row lg:items-center lg:justify-between
            "
          >
            {/* SEARCH */}
            <div
              className="
                flex w-full items-center gap-3
                rounded-2xl
                border border-white/10
                bg-white/5
                px-5 py-4
                backdrop-blur-xl

                lg:max-w-md
              "
            >
              <Search className="h-5 w-5 text-slate-500" />

              <input
                type="text"
                placeholder="Search activity..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="
                  w-full bg-transparent
                  text-sm text-white
                  outline-none
                  placeholder:text-slate-500
                "
              />
            </div>

            {/* FILTER */}
            <div className="flex flex-wrap items-center gap-3">
              <div
                className="
                  flex items-center gap-3
                  rounded-2xl
                  border border-white/10
                  bg-white/5
                  px-5 py-3
                "
              >
                <Filter className="h-5 w-5 text-slate-400" />

                <select
                  value={filter}
                  onChange={(e) => {
                    setFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="
                    bg-transparent
                    text-sm text-white
                    outline-none
                  "
                >
                  <option value="all" className="text-black">
                    All Activity
                  </option>

                  <option value="summary" className="text-black">
                    AI Summary
                  </option>

                  <option value="quiz" className="text-black">
                    Quiz
                  </option>

                  <option value="flashcard" className="text-black">
                    Flashcard
                  </option>

                  <option value="assistant" className="text-black">
                    AI Assistant
                  </option>

                  <option value="notes" className="text-black">
                    Notes
                  </option>

                  <option value="document" className="text-black">
                    Documents
                  </option>
                </select>
              </div>
            </div>
          </div>

          {/* EMPTY */}
          {filteredActivities.length === 0 ? (
            <div
              className="
                flex flex-col items-center justify-center
                rounded-4xl
                border border-dashed border-white/10
                bg-white/5
                px-6 py-20
                text-center
              "
            >
              <div
                className="
                  flex h-20 w-20 items-center justify-center
                  rounded-full
                  bg-linear-to-br from-blue-500/20 to-violet-500/20
                "
              >
                <Sparkles className="h-10 w-10 text-blue-400" />
              </div>

              <h2 className="mt-6 text-2xl font-bold">No Activity Found</h2>

              <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-400">
                Aktivitas learning belum tersedia atau hasil pencarian tidak
                ditemukan.
              </p>
            </div>
          ) : (
            <>
              {/* LIST */}
              <div className="space-y-5">
                {paginatedActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="
                      group relative overflow-hidden
                      rounded-4xl
                      border border-white/10
                      bg-white/5
                      p-5
                      backdrop-blur-xl
                      transition-all duration-300

                      hover:border-blue-500/20
                      hover:bg-white/[0.07]
                    "
                  >
                    <div
                      className="
                        flex flex-col gap-5
                        lg:flex-row lg:items-start lg:justify-between
                      "
                    >
                      {/* LEFT */}
                      <div className="flex flex-1 gap-4">
                        {/* ICON */}
                        <div
                          className="
                            flex h-14 w-14 shrink-0 items-center justify-center
                            rounded-2xl
                            bg-linear-to-br from-blue-500/15 to-violet-500/15
                          "
                        >
                          {getActivityIcon(activity.type)}
                        </div>

                        {/* CONTENT */}
                        <div className="flex-1">
                          {/* TOP */}
                          <div className="flex flex-wrap items-center gap-3">
                            {getStatusBadge(activity.status)}

                            <div
                              className="
                                inline-flex items-center gap-2
                                rounded-full
                                bg-white/5
                                px-3 py-1
                                text-xs text-slate-400
                              "
                            >
                              <CalendarDays className="h-3.5 w-3.5" />
                              {activity.time}
                            </div>
                          </div>

                          {/* TITLE */}
                          <h2 className="mt-4 text-xl font-bold">
                            {activity.title}
                          </h2>

                          {/* DESC */}
                          <p className="mt-3 max-w-3xl leading-relaxed text-slate-400">
                            {activity.description}
                          </p>

                          {/* FILE */}
                          <div className="mt-5 flex flex-wrap items-center gap-3">
                            <div
                              className="
                                inline-flex items-center gap-2
                                rounded-2xl
                                border border-white/10
                                bg-white/5
                                px-4 py-3
                                text-sm text-slate-300
                              "
                            >
                              <FileText className="h-4 w-4 text-blue-400" />

                              {activity.file}
                            </div>

                            {/* SOFT HISTORY */}
                            {!activity.resourceAvailable && (
                              <div
                                className="
                                  inline-flex items-center gap-2
                                  rounded-2xl
                                  border border-red-500/10
                                  bg-red-500/10
                                  px-4 py-3
                                  text-sm text-red-300
                                "
                              >
                                <AlertTriangle className="h-4 w-4" />
                                Resource unavailable
                              </div>
                            )}
                          </div>

                          {/* UNAVAILABLE MESSAGE */}
                          {!activity.resourceAvailable && (
                            <div
                              className="
                                mt-4 rounded-2xl
                                border border-white/10
                                bg-black/20
                                p-4
                              "
                            >
                              <p className="text-sm text-slate-400">
                                This workspace no longer exists. The document or
                                resource may have been deleted.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* RIGHT */}
                      <div className="flex items-center">
                        {activity.resourceAvailable ? (
                          <button
                            className="
                              flex items-center gap-2 
                              rounded-2xl
                              bg-linear-to-r from-blue-500 to-violet-500
                              px-5 py-3 ml-18 
                              text-sm font-semibold text-white
                              transition-all duration-300
                              hover:scale-[1.02]
                            "
                          >
                            View Detail
                            <ExternalLink className="h-4 w-4" />
                          </button>
                        ) : (
                          <button
                            disabled
                            className="
                              flex cursor-not-allowed items-center gap-2
                              rounded-2xl
                              border border-white/10
                              bg-white/5
                              px-5 py-3 ml-18
                              text-sm font-semibold text-slate-500
                            "
                          >
                            Unavailable
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* PAGINATION */}
              {totalPages > 1 && (
                <div className="mt-10 flex items-center justify-center gap-3">
                  {Array.from({ length: totalPages }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentPage(index + 1)}
                      className={`
                          flex h-11 w-11 items-center justify-center
                          rounded-2xl
                          border text-sm font-semibold
                          transition-all duration-300

                          ${
                            currentPage === index + 1
                              ? "border-blue-500/20 bg-linear-to-r from-blue-500 to-violet-500 text-white"
                              : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                          }
                        `}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default HistoryPage;
