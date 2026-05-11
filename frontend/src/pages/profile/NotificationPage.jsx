
import { useMemo, useState } from "react";

import {
  Bell,
  Check,
  Trash2,
  Sparkles,
  FileText,
  Brain,
  Layers3,
  Bot,
  Clock3,
  CheckCheck,
  Search,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import useLogout from "../../hooks/useLogout";

import SidebarDashboard from "../../components/dashboard/layout/SidebarDashboard";
import NavbarDashboard from "../../components/dashboard/layout/NavbarDashboard";

const NotificationPage = () => {
  const { user } = useAuth();
  const { handleLogout } = useLogout();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "summary",
      title: "AI Summary Ready",
      description:
        "Machine Learning Fundamentals.pdf summary berhasil dibuat.",
      time: "2 minutes ago",
      read: false,
    },

    {
      id: 2,
      type: "quiz",
      title: "Quiz Generated",
      description:
        "10 soal quiz baru berhasil dibuat dari React Authentication.",
      time: "10 minutes ago",
      read: false,
    },

    {
      id: 3,
      type: "flashcard",
      title: "Flashcards Generated",
      description:
        "15 flashcards baru berhasil dibuat dari materi Database.",
      time: "1 hour ago",
      read: true,
    },

    {
      id: 4,
      type: "document",
      title: "Document Uploaded",
      description:
        "Advanced NodeJS.pdf berhasil diupload ke workspace.",
      time: "Yesterday",
      read: true,
    },

    {
      id: 5,
      type: "assistant",
      title: "AI Assistant Replied",
      description:
        "AI Assistant memberikan jawaban baru untuk pertanyaanmu.",
      time: "Yesterday",
      read: false,
    },

    {
      id: 6,
      type: "reminder",
      title: "Learning Reminder",
      description:
        "Jangan lupa lanjutkan progress belajar hari ini.",
      time: "2 days ago",
      read: true,
    },
  ]);

  const filteredNotifications = useMemo(() => {
    let filtered = [...notifications];

    filtered = filtered.filter(
      (item) =>
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase()),
    );

    if (filter === "unread") {
      filtered = filtered.filter((item) => !item.read);
    }

    if (filter === "read") {
      filtered = filtered.filter((item) => item.read);
    }

    return filtered;
  }, [notifications, search, filter]);

  const unreadCount = notifications.filter(
    (item) => !item.read,
  ).length;

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, read: true } : item,
      ),
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((item) => ({ ...item, read: true })),
    );
  };

  const deleteNotification = (id) => {
    setNotifications((prev) =>
      prev.filter((item) => item.id !== id),
    );
  };

  const getNotificationIcon = (type) => {
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

      default:
        return <Bell className="h-5 w-5 text-yellow-300" />;
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
          title={"Notifications"}
          description={"Manage your workspace notifications."}
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
            <div
              className="
                flex flex-col gap-6
                lg:flex-row lg:items-center lg:justify-between
              "
            >
              <div className="max-w-2xl">
                <div
                  className="
                    mb-5 flex h-16 w-16 items-center justify-center
                    rounded-3xl
                    bg-linear-to-br from-blue-500 to-violet-500
                  "
                >
                  <Bell className="h-8 w-8 text-white" />
                </div>

                <h1 className="text-3xl font-bold tracking-[-1px]">
                  Notification Center
                </h1>

                <p className="mt-4 leading-relaxed text-slate-300">
                  Pantau seluruh update AI Assistant, summary, quiz,
                  flashcards, dan aktivitas workspace kamu.
                </p>
              </div>

              <div
                className="
                  flex items-center gap-4
                  rounded-3xl
                  border border-white/10
                  bg-white/5
                  px-6 py-5
                "
              >
                <div>
                  <p className="text-sm text-slate-400">
                    Unread Notifications
                  </p>

                  <h2 className="mt-2 text-3xl font-bold">
                    {unreadCount}
                  </h2>
                </div>

                <div
                  className="
                    flex h-14 w-14 items-center justify-center
                    rounded-2xl
                    bg-linear-to-br from-blue-500 to-violet-500
                  "
                >
                  <Bell className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* TOOLBAR */}
          <div
            className="
              mb-8 flex flex-col gap-4
              lg:flex-row lg:items-center lg:justify-between
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
                placeholder="Search notifications..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="
                  w-full bg-transparent
                  text-sm text-white
                  outline-none
                  placeholder:text-slate-500
                "
              />
            </div>

            {/* ACTION */}
            <div className="flex flex-wrap items-center gap-3">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="
                  rounded-2xl
                  border border-white/10
                  bg-white/5
                  px-5 py-3
                  text-sm text-white
                  outline-none
                "
              >
                <option value="all" className="text-black">
                  All Notifications
                </option>

                <option value="unread" className="text-black">
                  Unread
                </option>

                <option value="read" className="text-black">
                  Read
                </option>
              </select>

              <button
                onClick={markAllAsRead}
                className="
                  flex items-center gap-2
                  rounded-2xl
                  bg-linear-to-r from-blue-500 to-violet-500
                  px-5 py-3
                  text-sm font-semibold text-white
                "
              >
                <CheckCheck className="h-4 w-4" />
                Mark All Read
              </button>
            </div>
          </div>

          {/* EMPTY */}
          {filteredNotifications.length === 0 ? (
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
                <Bell className="h-10 w-10 text-blue-400" />
              </div>

              <h2 className="mt-6 text-2xl font-bold">
                No Notifications
              </h2>

              <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-400">
                Semua notifikasi sudah dibaca atau belum ada aktivitas baru.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {filteredNotifications.map((item) => (
                <div
                  key={item.id}
                  className={`
                    relative overflow-hidden
                    rounded-4xl
                    border
                    p-5
                    backdrop-blur-xl
                    transition-all duration-300

                    ${
                      item.read
                        ? "border-white/10 bg-white/5"
                        : "border-blue-500/20 bg-blue-500/[0.06]"
                    }
                  `}
                >
                  {!item.read && (
                    <div
                      className="
                        absolute right-5 top-5
                        h-3 w-3 rounded-full bg-blue-400
                      "
                    />
                  )}

                  <div
                    className="
                      flex flex-col gap-5
                      lg:flex-row lg:items-start lg:justify-between
                    "
                  >
                    {/* LEFT */}
                    <div className="flex flex-1 gap-4">
                      <div
                        className="
                          flex h-14 w-14 shrink-0 items-center justify-center
                          rounded-2xl
                          bg-linear-to-br from-blue-500/15 to-violet-500/15
                        "
                      >
                        {getNotificationIcon(item.type)}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <div
                            className="
                              inline-flex items-center gap-2
                              rounded-full
                              bg-white/5
                              px-3 py-1
                              text-xs text-slate-400
                            "
                          >
                            <Clock3 className="h-3.5 w-3.5" />
                            {item.time}
                          </div>
                        </div>

                        <h2 className="mt-4 text-xl font-bold">
                          {item.title}
                        </h2>

                        <p className="mt-3 max-w-3xl leading-relaxed text-slate-400">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    {/* RIGHT */}
                    <div className="flex items-center gap-3">
                      {!item.read && (
                        <button
                          onClick={() => markAsRead(item.id)}
                          className="
                            flex items-center gap-2
                            rounded-2xl
                            border border-white/10
                            bg-white/5
                            px-5 py-3
                            text-sm font-semibold text-slate-300
                            transition-all duration-300

                            hover:bg-white/10
                          "
                        >
                          <Check className="h-4 w-4" />
                          Mark Read
                        </button>
                      )}

                      <button
                        onClick={() => deleteNotification(item.id)}
                        className="
                          flex h-12 w-12 items-center justify-center
                          rounded-2xl
                          bg-red-500/10
                          text-red-400
                          transition-all duration-300

                          hover:bg-red-500/20
                        "
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default NotificationPage;