import { useMemo, useState } from "react";
import {
  Bell,
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
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";

const NotificationPage = () => {
  // eslint-disable-next-line no-unused-vars
  const { user } = useAuth();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "summary",
      title: "AI Summary Ready",
      description: "Machine Learning Fundamentals.pdf summary berhasil dibuat.",
      time: "2 minutes ago",
      read: false,
    },
    {
      id: 2,
      type: "quiz",
      title: "Quiz Generated",
      description: "10 soal quiz baru berhasil dibuat dari React Authentication.",
      time: "10 minutes ago",
      read: false,
    },
    {
      id: 3,
      type: "flashcard",
      title: "Flashcards Generated",
      description: "15 flashcards baru berhasil dibuat dari materi Database.",
      time: "1 hour ago",
      read: true,
    },
    {
      id: 4,
      type: "document",
      title: "Document Uploaded",
      description: "Advanced NodeJS.pdf berhasil diupload ke workspace.",
      time: "Yesterday",
      read: true,
    },
    {
      id: 5,
      type: "assistant",
      title: "AI Assistant Replied",
      description: "AI Assistant memberikan jawaban baru untuk pertanyaanmu.",
      time: "Yesterday",
      read: false,
    },
    {
      id: 6,
      type: "reminder",
      title: "Learning Reminder",
      description: "Jangan lupa lanjutkan progress belajar hari ini.",
      time: "2 days ago",
      read: true,
    },
  ]);

  const filteredNotifications = useMemo(() => {
    let filtered = [...notifications];

    filtered = filtered.filter(
      (item) =>
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase())
    );

    if (filter === "unread") {
      filtered = filtered.filter((item) => !item.read);
    }

    if (filter === "read") {
      filtered = filtered.filter((item) => item.read);
    }

    return filtered;
  }, [notifications, search, filter]);

  const unreadCount = notifications.filter((item) => !item.read).length;

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, read: true } : item))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id));
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "summary":
        return <Sparkles className="h-5 w-5 text-blue-400" />;
      case "quiz":
        return <Brain className="h-5 w-5 text-violet-400" />;
      case "flashcard":
        return <Layers3 className="h-5 w-5 text-pink-400" />;
      case "document":
        return <FileText className="h-5 w-5 text-cyan-400" />;
      case "assistant":
        return <Bot className="h-5 w-5 text-emerald-400" />;
      default:
        return <Bell className="h-5 w-5 text-yellow-400" />;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* HERO */}
      <Card variant="glass" className="p-7">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-linear-to-br from-blue-500 to-violet-500 shadow-lg shadow-blue-500/20">
              <Bell className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white">
              Notification Center
            </h1>
            <p className="mt-4 leading-relaxed text-slate-400 font-medium">
              Monitor updates from AI Assistant, summaries, quizzes, flashcards, and workspace activities.
            </p>
          </div>

          <div className="flex items-center gap-5 p-6 rounded-4xl bg-white/3 border border-white/5">
            <div className="text-right">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Unread Alerts</p>
              <h2 className="mt-1 text-3xl font-black text-white italic">{unreadCount}</h2>
            </div>
            <div className="h-14 w-14 flex items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400">
              <Bell className="h-7 w-7" />
            </div>
          </div>
        </div>
      </Card>

      {/* TOOLBAR */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-col gap-4 lg:flex-row lg:items-center">
          <div className="w-full lg:max-w-md">
            <Input
              placeholder="Search notifications..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={Search}
            />
          </div>

          <div className="w-full lg:w-48">
            <Select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              options={[
                { label: "All Notifications", value: "all" },
                { label: "Unread Only", value: "unread" },
                { label: "Read Only", value: "read" },
              ]}
            />
          </div>
        </div>

        <Button variant="secondary" icon={CheckCheck} onClick={markAllAsRead} className="rounded-2xl h-11 px-6 font-bold uppercase tracking-widest text-[10px]">
          Mark All as Read
        </Button>
      </div>

      {/* LIST */}
      {filteredNotifications.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-20 text-center border-dashed border-white/10">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-indigo-500/5 text-indigo-500/50 mb-6">
            <Bell className="h-10 w-10" />
          </div>
          <h2 className="text-2xl font-black text-white">No Notifications</h2>
          <p className="mt-2 text-sm text-slate-500 font-medium">All caught up! No new alerts to display.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredNotifications.map((item) => (
            <Card
              key={item.id}
              className={`group relative overflow-hidden transition-all duration-300 ${
                item.read ? "bg-white/1 border-white/3" : "bg-indigo-500/2 border-indigo-500/20"
              }`}
            >
              {!item.read && <div className="absolute right-6 top-6 h-3 w-3 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(79,70,229,0.5)]" />}
              
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex gap-5">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/3 border border-white/5 group-hover:bg-indigo-500/10 transition-colors">
                    {getNotificationIcon(item.type)}
                  </div>

                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        <Clock3 className="h-3 w-3" />
                        {item.time}
                      </div>
                    </div>
                    <h2 className="text-xl font-black text-white tracking-tight group-hover:text-indigo-400 transition-colors">
                      {item.title}
                    </h2>
                    <p className="mt-2 text-sm font-medium text-slate-400 leading-relaxed max-w-3xl">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {!item.read && (
                    <button
                      onClick={() => markAsRead(item.id)}
                      className="h-11 px-5 rounded-xl border border-white/5 bg-white/5 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all"
                    >
                      Mark Read
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(item.id)}
                    className="h-11 w-11 flex items-center justify-center rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 transition-all"
                  >
                    <Trash2 className="h-4.5 w-4.5" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationPage;