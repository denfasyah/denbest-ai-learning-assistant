import { useState } from "react";
import ChatSidebar from "../../features/assistant/components/ChatSidebar";
import ChatArea from "../../features/assistant/components/ChatArea";
import Card from "../../components/ui/Card";

const conversationsData = [
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
    active: false,
  },
  {
    id: 3,
    title: "Database Normalization",
    lastMessage: "Apa itu 3NF?",
    time: "Yesterday",
    active: false,
  },
];

const messagesData = [
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

const AssistantPage = () => {
  const [conversations] = useState(conversationsData);
  const [messages] = useState(messagesData);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebarProps = {
    conversations,
    onSelect: () => {},
    onNewChat: () => {},
    openMenuId,
    setOpenMenuId,
    mobileOpen,
    onMobileClose: () => setMobileOpen(false),
  };

  return (
    <>
      {/* Mobile drawer — di luar Card supaya tidak ter-trap overflow-hidden */}
      <ChatSidebar {...sidebarProps} mobileOnly />

      <div className="flex h-[calc(100vh-140px)] gap-6 animate-in fade-in duration-500">
        {/* LEFT SIDEBAR desktop */}
        <div className="hidden xl:block w-80 shrink-0">
          <Card className="h-full p-5 overflow-hidden">
            <ChatSidebar {...sidebarProps} desktopOnly />
          </Card>
        </div>

        {/* MAIN CHAT AREA */}
        <Card className="flex-1 flex flex-col p-0 overflow-hidden">
          <ChatArea
            messages={messages}
            activeContext="Machine Learning Summary"
            onMobileMenuOpen={() => setMobileOpen(true)}
          />
        </Card>
      </div>
    </>
  );
};

export default AssistantPage;