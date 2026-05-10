import { useAuth } from "../../context/AuthContext";
import { useEffect, useRef, useState } from "react";

import {
  Sparkles,
  Plus,
  Search,
  Paperclip,
  Send,
  Mic,
  Bot,
  User,
  Clock3,
  MoreHorizontal,
  FileText,
  Pencil,
  Trash2,
  Menu,
  X,
} from "lucide-react";

import useLogout from "../../hooks/useLogout";

import SidebarDashboard from "../../components/dashboard/layout/SidebarDashboard";
import NavbarDashboard from "../../components/dashboard/layout/NavbarDashboard";

const AssistantPage = () => {
  const { user } = useAuth();
  const { handleLogout } = useLogout();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // MOBILE HISTORY
  const [mobileHistoryOpen, setMobileHistoryOpen] = useState(false);

  // MENU
  const [openMenuId, setOpenMenuId] = useState(null);

  const menuRef = useRef(null);

  // CLOSE MENU CLICK OUTSIDE
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const conversations = [
    {
      id: 1,
      title: "Machine Learning Summary",
      lastMessage: "Jelaskan supervised learning...",
      time: "2 min ago",
      active: true,
    },
    {
      id: 2,
      title: "React Authentication",
      lastMessage: "Bagaimana cara kerja JWT?",
      time: "1 hour ago",
    },
    {
      id: 3,
      title: "Database Normalization",
      lastMessage: "Apa itu 3NF?",
      time: "Yesterday",
    },
  ];

  const messages = [
    {
      role: "assistant",
      text: "Halo 👋 Saya siap membantu memahami dokumen dan materi pembelajaran kamu.",
    },
    {
      role: "user",
      text: "Jelaskan supervised learning dengan bahasa sederhana.",
    },
    {
      role: "assistant",
      text: "Supervised learning adalah metode machine learning dimana AI belajar menggunakan data yang sudah memiliki jawaban atau label.",
    },
  ];

  return (
    <div className="flex min-h-screen bg-linear-to-b from-black via-[#050816] to-violet-950 text-white">
      {/* OVERLAY SIDEBAR */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* MOBILE HISTORY OVERLAY */}
      {mobileHistoryOpen && (
        <div
          onClick={() => setMobileHistoryOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm xl:hidden"
        />
      )}

      {/* SIDEBAR */}
      <SidebarDashboard
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        handleLogout={handleLogout}
        user={user}
      />

      {/* MOBILE HISTORY DRAWER */}
      <div
        className={`
          fixed top-0 left-0 z-50 h-screen w-[320px]
          border-r border-white/10
          bg-[#070B18]
          p-5
          backdrop-blur-xl
          transition-all duration-300

          ${
            mobileHistoryOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }

          xl:hidden
        `}
      >
        {/* TOP */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">
              Conversations
            </h2>

            <p className="text-sm text-slate-400">
              Riwayat chat AI Assistant
            </p>
          </div>

          <button
            onClick={() => setMobileHistoryOpen(false)}
            className="
              flex h-11 w-11 items-center justify-center
              rounded-2xl
              border border-white/10
              bg-white/5
            "
          >
            <X className="h-5 w-5 text-white" />
          </button>
        </div>

        {/* NEW CHAT */}
        <button
          className="
            mb-5 flex w-full items-center justify-center gap-2
            rounded-2xl
            bg-linear-to-r from-blue-500 to-violet-500
            px-5 py-4
            text-sm font-semibold text-white
          "
        >
          <Plus className="h-5 w-5" />
          New Conversation
        </button>

        {/* SEARCH */}
        <div
          className="
            mb-6 flex items-center gap-3
            rounded-2xl
            border border-white/10
            bg-[#0B1120]
            px-4 py-3
          "
        >
          <Search className="h-5 w-5 text-slate-500" />

          <input
            type="text"
            placeholder="Search conversation..."
            className="
              w-full bg-transparent
              text-sm text-white
              outline-none
              placeholder:text-slate-500
            "
          />
        </div>

        {/* HISTORY */}
        <div className="space-y-3 overflow-y-auto">
          {conversations.map((chat) => (
            <div
              key={chat.id}
              className={`
                rounded-3xl border p-4

                ${
                  chat.active
                    ? "border-blue-500/20 bg-linear-to-br from-blue-500/10 to-violet-500/10"
                    : "border-white/10 bg-white/5"
                }
              `}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="line-clamp-1 font-semibold text-white">
                    {chat.title}
                  </h2>

                  <p className="mt-2 line-clamp-2 text-sm text-slate-400">
                    {chat.lastMessage}
                  </p>
                </div>

                <button>
                  <MoreHorizontal className="h-5 w-5 text-slate-500" />
                </button>
              </div>

              <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                <Clock3 className="h-4 w-4" />
                {chat.time}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MAIN */}
      <main className="flex flex-1 flex-col lg:ml-72">
        {/* NAVBAR */}
        <NavbarDashboard
          title={"AI Assistant"}
          description={"Belajar interaktif bersama AI Assistant context-aware."}
          setSidebarOpen={setSidebarOpen}
          user={user}
          handleLogout={handleLogout}
        />

        {/* CONTENT */}
        <div className="flex flex-1 gap-6 px-5 py-5 lg:px-8">
          {/* LEFT HISTORY DESKTOP */}
          <div
            className="
              hidden w-85 shrink-0
              rounded-4xl
              border border-white/10
              bg-white/5
              p-5
              backdrop-blur-xl

              xl:flex xl:flex-col
            "
          >
            {/* TOP */}
            <div className="mb-5">
              <button
                className="
                  flex w-full items-center justify-center gap-2
                  rounded-2xl
                  bg-linear-to-r from-blue-500 to-violet-500
                  px-5 py-4
                  text-sm font-semibold text-white
                  transition-all duration-300

                  hover:scale-[1.02]
                "
              >
                <Plus className="h-5 w-5" />
                New Conversation
              </button>
            </div>

            {/* SEARCH */}
            <div
              className="
                mb-6 flex items-center gap-3
                rounded-2xl
                border border-white/10
                bg-[#0B1120]
                px-4 py-3
              "
            >
              <Search className="h-5 w-5 text-slate-500" />

              <input
                type="text"
                placeholder="Search conversation..."
                className="
                  w-full bg-transparent
                  text-sm text-white
                  outline-none
                  placeholder:text-slate-500
                "
              />
            </div>

            {/* HISTORY */}
            <div className="flex-1 overflow-y-auto">
              <h3 className="mb-4 text-xs font-semibold tracking-[2px] text-slate-500 uppercase">
                Recent Conversations
              </h3>

              <div className="space-y-3">
                {conversations.map((chat) => (
                  <div
                    key={chat.id}
                    className={`
                      relative rounded-3xl border p-4
                      transition-all duration-300

                      ${
                        chat.active
                          ? "border-blue-500/20 bg-linear-to-br from-blue-500/10 to-violet-500/10"
                          : "border-white/10 bg-white/5 hover:bg-white/8"
                      }
                    `}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <h2 className="line-clamp-1 font-semibold text-white">
                          {chat.title}
                        </h2>

                        <p className="mt-2 line-clamp-2 text-sm text-slate-400">
                          {chat.lastMessage}
                        </p>
                      </div>

                      {/* MENU */}
                      <div className="relative" ref={menuRef}>
                        <button
                          onClick={() =>
                            setOpenMenuId(
                              openMenuId === chat.id ? null : chat.id,
                            )
                          }
                          className="
                            flex h-9 w-9 items-center justify-center
                            rounded-xl
                            transition-all duration-300

                            hover:bg-white/10
                          "
                        >
                          <MoreHorizontal className="h-5 w-5 text-slate-500" />
                        </button>

                        {/* DROPDOWN */}
                        {openMenuId === chat.id && (
                          <div
                            className="
                              absolute right-0 top-11 z-50
                              w-44 overflow-hidden
                              rounded-2xl
                              border border-white/10
                              bg-[#0B1120]
                              shadow-2xl
                            "
                          >
                            <button
                              className="
                                flex w-full items-center gap-3
                                px-4 py-3
                                text-sm text-white
                                transition hover:bg-white/5
                              "
                            >
                              <Pencil className="h-4 w-4" />
                              Rename Chat
                            </button>

                            <button
                              className="
                                flex w-full items-center gap-3
                                px-4 py-3
                                text-sm text-red-400
                                transition hover:bg-red-500/10
                              "
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete Chat
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                      <Clock3 className="h-4 w-4" />
                      {chat.time}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CHAT AREA */}
          <div
            className="
              flex flex-1 flex-col
              rounded-4xl
              border border-white/10
              bg-white/5
              backdrop-blur-xl
            "
          >
            {/* TOP */}
            <div
              className="
                flex flex-col gap-5
                border-b border-white/10
                p-6

                lg:flex-row lg:items-center lg:justify-between
              "
            >
              <div className="flex items-center gap-4">
                {/* MOBILE HISTORY BUTTON */}
                <button
                  onClick={() => setMobileHistoryOpen(true)}
                  className="
                    flex h-12 w-12 items-center justify-center
                    rounded-2xl
                    border border-white/10
                    bg-white/5

                    xl:hidden
                  "
                >
                  <Menu className="h-5 w-5 text-white" />
                </button>

                <div
                  className="
                    flex h-14 w-14 items-center justify-center
                    rounded-3xl
                    bg-linear-to-br from-blue-500 to-violet-500
                  "
                >
                  <Sparkles className="h-7 w-7 text-white" />
                </div>

                <div>
                  <h1 className="text-2xl font-bold">
                    AI Learning Assistant
                  </h1>

                  <p className="mt-1 text-sm text-slate-400">
                    Context-aware assistant untuk membantu pembelajaran.
                  </p>
                </div>
              </div>

              {/* ACTIVE CONTEXT */}
              <div
                className="
                  flex items-center gap-3
                  rounded-2xl
                  border border-blue-500/20
                  bg-linear-to-r from-blue-500/10 to-violet-500/10
                  px-5 py-3
                "
              >
                <FileText className="h-5 w-5 text-blue-400" />

                <div>
                  <p className="text-xs text-slate-400">
                    Active Context
                  </p>

                  <h3 className="text-sm font-semibold text-white">
                    Machine Learning Summary
                  </h3>
                </div>
              </div>
            </div>

            {/* CHAT BODY */}
            <div className="flex-1 space-y-6 overflow-y-auto p-6">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-4 ${
                    message.role === "user"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  {message.role === "assistant" && (
                    <div
                      className="
                        flex h-12 w-12 shrink-0 items-center justify-center
                        rounded-2xl
                        bg-linear-to-br from-blue-500 to-violet-500
                      "
                    >
                      <Bot className="h-6 w-6 text-white" />
                    </div>
                  )}

                  <div
                    className={`
                      max-w-3xl rounded-[28px] border p-5

                      ${
                        message.role === "assistant"
                          ? "border-blue-500/20 bg-linear-to-br from-blue-500/10 to-violet-500/10"
                          : "border-white/10 bg-white/5"
                      }
                    `}
                  >
                    <p className="leading-relaxed text-slate-200">
                      {message.text}
                    </p>
                  </div>

                  {message.role === "user" && (
                    <div
                      className="
                        flex h-12 w-12 shrink-0 items-center justify-center
                        rounded-2xl
                        border border-white/10
                        bg-white/10
                      "
                    >
                      <User className="h-6 w-6 text-white" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* INPUT */}
            <div className="border-t border-white/10 p-5">
              <div
                className="
                  flex items-end gap-3
                  rounded-[28px]
                  border border-white/10
                  bg-[#0B1120]
                  p-3
                "
              >
                {/* ATTACH */}
                <button
                  className="
                    flex h-12 w-12 items-center justify-center
                    rounded-2xl
                    bg-white/5
                    transition-all duration-300

                    hover:bg-white/10
                  "
                >
                  <Paperclip className="h-5 w-5 text-slate-300" />
                </button>

                {/* INPUT */}
                <textarea
                  rows={1}
                  placeholder="Ask anything about your learning material..."
                  className="
                    max-h-40 min-h-12 flex-1 resize-none
                    bg-transparent px-2 py-3
                    text-sm text-white
                    outline-none
                    placeholder:text-slate-500
                  "
                />

                {/* MIC */}
                <button
                  className="
                    hidden h-12 w-12 items-center justify-center
                    rounded-2xl
                    bg-white/5
                    transition-all duration-300

                    hover:bg-white/10

                    sm:flex
                  "
                >
                  <Mic className="h-5 w-5 text-slate-300" />
                </button>

                {/* SEND */}
                <button
                  className="
                    flex h-12 w-12 items-center justify-center
                    rounded-2xl
                    bg-linear-to-r from-blue-500 to-violet-500
                    transition-all duration-300

                    hover:scale-[1.03]
                  "
                >
                  <Send className="h-5 w-5 text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AssistantPage;