import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FileText, MessagesSquare, Sparkles, Layers3, BrainCircuit } from "lucide-react";
import WorkspaceHeader from "../../features/workspace/components/WorkspaceHeader";
import WorkspaceTabs from "../../features/workspace/components/WorkspaceTabs";
import ContentTab from "../../features/workspace/components/ContentTab";
import ChatTab from "../../features/workspace/components/ChatTab";
import ActionTab from "../../features/workspace/components/ActionTab";
import FlashcardTab from "../../features/workspace/components/FlashcardTab";
import QuizTab from "../../features/workspace/components/QuizTab";

const WorkspacePage = () => {
  const { tab } = useParams();
  const [activeTab, setActiveTab] = useState("content");

  useEffect(() => {
    if (tab) {
      // Map URL tab names to internal IDs if necessary
      const tabMap = {
        'summary': 'action',
        'quiz': 'quiz',
        'flashcard': 'flashcard',
        'chat': 'chat'
      };
      setActiveTab(tabMap[tab] || tab);
    }
  }, [tab]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState({});

  const tabs = [
    { id: "content", label: "Content", icon: FileText },
    { id: "chat", label: "Chat AI", icon: MessagesSquare },
    { id: "action", label: "AI Action", icon: Sparkles },
    { id: "flashcard", label: "Flashcard", icon: Layers3 },
    { id: "quiz", label: "Quiz", icon: BrainCircuit },
  ];

  const chatMessages = [
    {
      role: "assistant",
      text: "Halo 👋 Saya sudah memahami isi dokumen Machine Learning Fundamentals. Ada bagian yang ingin dipelajari?",
    },
    {
      role: "user",
      text: "Jelaskan supervised learning dengan sederhana.",
    },
    {
      role: "assistant",
      text: "Supervised learning adalah metode machine learning dimana model belajar menggunakan data yang sudah memiliki label atau jawaban.",
    },
  ];

  const flashcards = [
    {
      question: "Apa itu Supervised Learning?",
      answer: "Metode machine learning yang menggunakan data berlabel untuk proses training model.",
    },
    {
      question: "Apa tujuan model classification?",
      answer: "Untuk memprediksi kategori atau class berdasarkan data input.",
    },
    {
      question: "Apa itu dataset?",
      answer: "Kumpulan data yang digunakan untuk training maupun testing model AI.",
    },
  ];

  const quizzes = [
    {
      question: "Apa fungsi label pada supervised learning?",
      correctAnswer: "Sebagai output jawaban",
      options: [
        "Sebagai output jawaban",
        "Sebagai warna dataset",
        "Sebagai animasi",
        "Sebagai database",
      ],
    },
    {
      question: "Classification termasuk?",
      correctAnswer: "Supervised Learning",
      options: [
        "Supervised Learning",
        "Unsupervised Learning",
        "Database",
        "Frontend",
      ],
    },
  ];

  const handleSelectAnswer = (questionIndex, answer) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: answer,
    }));
  };

  const score = quizzes.filter(
    (quiz, index) => selectedAnswers[index] === quiz.correctAnswer
  ).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <WorkspaceHeader 
        title="Machine Learning Fundamentals.pdf" 
        uploadTime="2 hours ago" 
        size="2.4 MB" 
      />

      <WorkspaceTabs 
        tabs={tabs} 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />

      <div className="min-h-[500px]">
        {activeTab === "content" && <ContentTab title="Machine Learning Fundamentals.pdf" />}
        {activeTab === "chat" && <ChatTab messages={chatMessages} />}
        {activeTab === "action" && <ActionTab />}
        {activeTab === "flashcard" && <FlashcardTab flashcards={flashcards} />}
        {activeTab === "quiz" && (
          <QuizTab 
            quizzes={quizzes}
            submitted={quizSubmitted}
            selectedAnswers={selectedAnswers}
            onSelectAnswer={handleSelectAnswer}
            onSubmit={() => setQuizSubmitted(true)}
            onRetry={() => { setQuizSubmitted(false); setSelectedAnswers({}); }}
            score={score}
          />
        )}
      </div>
    </div>
  );
};

export default WorkspacePage;
