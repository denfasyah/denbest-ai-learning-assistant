import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Bot, Plus } from "lucide-react";
import ChatSidebar from "../../features/assistant/components/ChatSidebar";
import ChatArea from "../../features/assistant/components/ChatArea";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import useAssistantStore from "../../features/assistant/store/assistantStore";

const AssistantPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryConversationId = searchParams.get("conversationId");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const {
    conversations,
    activeConversationId,
    messages,
    isLoadingConversations,
    isLoadingMessages,
    isSendingMessage,
    fetchConversations,
    selectConversation,
    sendMessage,
    createNewConversation,
    renameConversation,
    deleteConversation,
  } = useAssistantStore();

  useEffect(() => {
    const init = async () => {
      await fetchConversations();
      if (queryConversationId) {
        selectConversation(queryConversationId);
      }
    };
    init();
  }, [queryConversationId]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSelectConversation = (id) => {
    selectConversation(id);
    setMobileOpen(false);
  };

  const handleNewChat = () => {
    createNewConversation();
  };

  const activeConversation = conversations.find((c) => c.id === activeConversationId);
  const activeContext = activeConversation ? activeConversation.title : "";

  const sidebarProps = {
    conversations,
    onSelect: handleSelectConversation,
    onNewChat: handleNewChat,
    openMenuId,
    setOpenMenuId,
    mobileOpen,
    onMobileClose: () => setMobileOpen(false),
    activeConversationId,
    isLoading: isLoadingConversations,
    onRename: renameConversation,
    onDelete: deleteConversation,
  };

  const renderChatArea = () => {
    if (conversations.length === 0 && !isLoadingConversations) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-linear-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-500/30 shadow-2xl shadow-indigo-500/10 animate-pulse">
            <Bot className="h-10 w-10 text-indigo-400" />
          </div>
          <div className="max-w-md space-y-2">
            <h2 className="text-2xl font-black text-white tracking-tight">AI Assistant</h2>
            <p className="text-sm text-slate-400 font-medium leading-relaxed">
              Mulai percakapan global dengan AI atau upload file melalui attachment.
            </p>
          </div>
          <Button variant="primary" icon={Plus} onClick={handleNewChat} className="px-6 py-3 font-semibold shadow-lg shadow-indigo-500/20">
            Start New Conversation
          </Button>
        </div>
      );
    }

    return (
      <ChatArea
        messages={messages}
        activeContext={activeContext}
        onMobileMenuOpen={() => setMobileOpen(true)}
        onSendMessage={sendMessage}
        isSendingMessage={isSendingMessage}
        isLoading={isLoadingMessages}
      />
    );
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
          {renderChatArea()}
        </Card>
      </div>
    </>
  );
};

export default AssistantPage;