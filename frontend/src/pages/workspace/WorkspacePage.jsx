import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import { Link } from "react-router-dom";

import {
  ArrowLeft,
  FileText,
  MessagesSquare,
  Sparkles,
  Layers3,
  BrainCircuit,
  Send,
  BookOpen,
  Clock3,
  ChevronRight,
} from "lucide-react";

import useLogout from "../../hooks/useLogout";

import SidebarDashboard from "../../components/dashboard/layout/SidebarDashboard";
import NavbarDashboard from "../../components/dashboard/layout/NavbarDashboard";

const WorkspacePage = () => {
  const { user } = useAuth();
  const { handleLogout } = useLogout();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [activeTab, setActiveTab] = useState("content");

  const tabs = [
    {
      id: "content",
      label: "Content",
      icon: FileText,
    },
    {
      id: "chat",
      label: "Chat AI",
      icon: MessagesSquare,
    },
    {
      id: "action",
      label: "AI Action",
      icon: Sparkles,
    },
    {
      id: "flashcard",
      label: "Flashcard",
      icon: Layers3,
    },
    {
      id: "quiz",
      label: "Quiz",
      icon: BrainCircuit,
    },
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
      answer:
        "Metode machine learning yang menggunakan data berlabel untuk proses training model.",
    },
    {
      question: "Apa tujuan model classification?",
      answer: "Untuk memprediksi kategori atau class berdasarkan data input.",
    },
    {
      question: "Apa itu dataset?",
      answer:
        "Kumpulan data yang digunakan untuk training maupun testing model AI.",
    },
  ];
// ===============================
// STATE
// ===============================
const [quizSubmitted, setQuizSubmitted] = useState(false);

const [selectedAnswers, setSelectedAnswers] = useState({});

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

// ===============================
// HANDLE SELECT ANSWER
// ===============================
const handleSelectAnswer = (questionIndex, answer) => {
  setSelectedAnswers((prev) => ({
    ...prev,
    [questionIndex]: answer,
  }));
};

// ===============================
// SUBMIT QUIZ
// ===============================
const handleSubmitQuiz = () => {
  setQuizSubmitted(true);
};

// ===============================
// RETRY QUIZ
// ===============================
const handleRetryQuiz = () => {
  setSelectedAnswers({});
  setQuizSubmitted(false);
};

// ===============================
// SCORE
// ===============================
const score = quizzes.filter(
  (quiz, index) => selectedAnswers[index] === quiz.correctAnswer,
).length;

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
          title={"Learning Workspace"}
          description={"Belajar interaktif bersama AI Assistant."}
          setSidebarOpen={setSidebarOpen}
          user={user}
          handleLogout={handleLogout}
        />

        {/* CONTENT */}
        <div className="px-5 py-5 lg:px-8">
          {/* TOP HEADER */}
          <div
            className="
              mb-8
              rounded-4xl
              border border-white/10
              bg-white/5
              p-6
              backdrop-blur-xl
            "
          >
            {/* BACK */}
            <Link
              to="/learning"
              className="
                mb-5 inline-flex items-center gap-2
                text-sm text-slate-400
                transition hover:text-white
              "
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Learning
            </Link>

            {/* FILE */}
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-4">
                <div
                  className="
                    flex h-16 w-16 items-center justify-center
                    rounded-3xl
                    bg-linear-to-br from-blue-500/20 to-violet-500/20
                  "
                >
                  <FileText className="h-8 w-8 text-blue-400" />
                </div>

                <div>
                  <h1 className="text-2xl font-bold tracking-[-0.5px]">
                    Machine Learning Fundamentals.pdf
                  </h1>

                  <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-400">
                    <div className="flex items-center gap-2">
                      <Clock3 className="h-4 w-4" />
                      Uploaded 2 hours ago
                    </div>

                    <span className="rounded-full bg-white/5 px-3 py-1">
                      PDF
                    </span>

                    <span>2.4 MB</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* TAB */}
          <div
            className="
              mb-8 flex flex-wrap gap-3
            "
          >
            {tabs.map((tab) => {
              const Icon = tab.icon;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2
                    rounded-2xl
                    px-5 py-3
                    text-sm font-semibold
                    transition-all duration-300

                    ${
                      activeTab === tab.id
                        ? "bg-linear-to-r from-blue-500 to-violet-500 text-white shadow-lg shadow-blue-500/20"
                        : "border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                    }
                  `}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* CONTENT TAB */}
          {activeTab === "content" && (
            <div
              className="
                overflow-hidden
                rounded-4xl
                border border-white/10
                bg-white/5
                backdrop-blur-xl
              "
            >
              {/* PDF HEADER */}
              <div className="border-b border-white/10 p-5">
                <div className="flex items-center gap-3">
                  <BookOpen className="h-5 w-5 text-blue-400" />

                  <div>
                    <h2 className="font-semibold text-white">
                      Document Preview
                    </h2>

                    <p className="text-sm text-slate-400">
                      Preview isi dokumen pembelajaran.
                    </p>
                  </div>
                </div>
              </div>

              {/* PDF PREVIEW */}
              <div className="p-5">
                <div
                  className="
                    flex h-175 items-center justify-center
                    rounded-[28px]
                    border border-dashed border-white/10
                    bg-[#0B1120]
                  "
                >
                  <div className="text-center">
                    <FileText className="mx-auto h-16 w-16 text-blue-400" />

                    <h3 className="mt-5 text-xl font-bold">PDF Preview Area</h3>

                    <p className="mt-2 text-sm text-slate-400">
                      Nanti render preview PDF document di sini.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CHAT TAB */}
          {activeTab === "chat" && (
            <div
              className="
                rounded-4xl
                border border-white/10
                bg-white/5
                p-5
                backdrop-blur-xl
              "
            >
              {/* CHAT HEADER */}
              <div className="mb-6 flex items-center gap-3">
                <div
                  className="
                    flex h-12 w-12 items-center justify-center
                    rounded-2xl
                    bg-linear-to-br from-blue-500 to-violet-500
                  "
                >
                  <MessagesSquare className="h-6 w-6 text-white" />
                </div>

                <div>
                  <h2 className="font-semibold text-white">
                    Context-Aware AI Chat
                  </h2>

                  <p className="text-sm text-slate-400">
                    AI memahami isi dokumen yang sedang dipelajari.
                  </p>
                </div>
              </div>

              {/* CHAT BODY */}
              <div className="space-y-5">
                {chatMessages.map((chat, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      chat.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`
                        max-w-2xl rounded-[28px] border p-5

                        ${
                          chat.role === "assistant"
                            ? "border-blue-500/20 bg-linear-to-br from-blue-500/10 to-violet-500/10"
                            : "border-white/10 bg-white/5"
                        }
                      `}
                    >
                      <p className="leading-relaxed text-slate-200">
                        {chat.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* INPUT */}
              <div className="mt-8">
                <div
                  className="
                    flex items-center gap-3
                    rounded-[28px]
                    border border-white/10
                    bg-[#0B1120]
                    p-3
                  "
                >
                  <input
                    type="text"
                    placeholder="Tanyakan materi dari dokumen..."
                    className="
                      w-full bg-transparent px-3
                      text-sm text-white
                      outline-none
                      placeholder:text-slate-500
                    "
                  />

                  <button
                    className="
                      flex h-12 w-12 items-center justify-center
                      rounded-2xl
                      bg-linear-to-r from-blue-500 to-violet-500
                      transition hover:scale-[1.03]
                    "
                  >
                    <Send className="h-5 w-5 text-white" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* AI ACTION */}
          {activeTab === "action" && (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {/* SUMMARY */}
              <div
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
                    mb-5 flex h-14 w-14 items-center justify-center
                    rounded-2xl
                    bg-linear-to-br from-blue-500/20 to-violet-500/20
                  "
                >
                  <Sparkles className="h-7 w-7 text-blue-400" />
                </div>

                <h2 className="text-xl font-bold">Generate Summary</h2>

                <p className="mt-3 text-sm leading-relaxed text-slate-400">
                  AI akan membuat ringkasan otomatis berdasarkan isi dokumen.
                </p>

                <button
                  className="
                    mt-6 flex items-center gap-2
                    rounded-2xl
                    bg-linear-to-r from-blue-500 to-violet-500
                    px-5 py-3
                    text-sm font-semibold text-white
                  "
                >
                  Generate Summary
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              {/* EXPLAIN */}
              <div
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
                    mb-5 flex h-14 w-14 items-center justify-center
                    rounded-2xl
                    bg-linear-to-br from-violet-500/20 to-pink-500/20
                  "
                >
                  <BrainCircuit className="h-7 w-7 text-violet-400" />
                </div>

                <h2 className="text-xl font-bold">Explain Material</h2>

                <p className="mt-3 text-sm leading-relaxed text-slate-400">
                  AI menjelaskan isi dokumen menjadi lebih sederhana dan mudah
                  dipahami.
                </p>

                <button
                  className="
                    mt-6 flex items-center gap-2
                    rounded-2xl
                    bg-linear-to-r from-violet-500 to-pink-500
                    px-5 py-3
                    text-sm font-semibold text-white
                  "
                >
                  Explain Document
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* FLASHCARD */}
          {activeTab === "flashcard" && (
            <div className="space-y-5">
              {/* TOP */}
              <div
                className="
                  flex flex-col gap-5
                  rounded-4xl
                  border border-white/10
                  bg-white/5
                  p-6
                  backdrop-blur-xl

                  lg:flex-row lg:items-center lg:justify-between
                "
              >
                <div>
                  <h2 className="text-2xl font-bold">Flashcard Generator</h2>

                  <p className="mt-2 text-sm text-slate-400">
                    Generate flashcard otomatis berdasarkan isi dokumen.
                  </p>
                </div>

                <div className="flex gap-3">
                  <select
                    className="
                      rounded-2xl
                      border border-white/10
                      bg-[#0B1120]
                      px-4 py-3
                      text-sm text-white
                      outline-none
                    "
                  >
                    <option>5 Flashcard</option>
                    <option>10 Flashcard</option>
                  </select>

                  <button
                    className="
                      rounded-2xl
                      bg-linear-to-r from-blue-500 to-violet-500
                      px-5 py-3
                      text-sm font-semibold text-white
                    "
                  >
                    Generate Flashcard
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                {flashcards.map((card, index) => (
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
                    <span
                      className="
                      rounded-full
                      bg-linear-to-r from-blue-500/20 to-violet-500/20
                      px-3 py-1
                      text-xs text-blue-300
                    "
                    >
                      Flashcard #{index + 1}
                    </span>

                    <h2 className="mt-5 text-xl font-bold">{card.question}</h2>

                    <p className="mt-4 leading-relaxed text-slate-300">
                      {card.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* QUIZ */}
         {/* QUIZ */}
{activeTab === "quiz" && (
  <div className="space-y-5">
    {!quizSubmitted ? (
      <>
        {/* TOP */}
        <div
          className="
            flex flex-col gap-5
            rounded-4xl
            border border-white/10
            bg-white/5
            p-6
            backdrop-blur-xl

            lg:flex-row lg:items-center lg:justify-between
          "
        >
          <div>
            <h2 className="text-2xl font-bold">
              AI Quiz Generator
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              Generate quiz otomatis berdasarkan isi dokumen.
            </p>
          </div>

          <div className="flex gap-3">
            <select
              className="
                rounded-2xl
                border border-white/10
                bg-[#0B1120]
                px-4 py-3
                text-sm text-white
                outline-none
              "
            >
              <option>5 Questions</option>
              <option>10 Questions</option>
            </select>

            <button
              className="
                rounded-2xl
                bg-linear-to-r from-blue-500 to-violet-500
                px-5 py-3
                text-sm font-semibold text-white
              "
            >
              Generate Quiz
            </button>
          </div>
        </div>

        {/* QUIZ CARD */}
        {quizzes.map((quiz, index) => (
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
            <h3 className="text-lg font-bold">
              {index + 1}. {quiz.question}
            </h3>

            <div className="mt-5 grid gap-3">
              {quiz.options.map((option, idx) => {
                const isSelected =
                  selectedAnswers[index] === option;

                return (
                  <button
                    key={idx}
                    onClick={() =>
                      handleSelectAnswer(index, option)
                    }
                    className={`
                      rounded-2xl
                      border
                      px-5 py-4
                      text-left text-sm
                      transition-all duration-300

                      ${
                        isSelected
                          ? "border-blue-500 bg-blue-500/20 text-white"
                          : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                      }
                    `}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {/* SUBMIT */}
        <div className="flex justify-end">
          <button
            onClick={handleSubmitQuiz}
            className="
              rounded-2xl
              bg-linear-to-r from-blue-500 to-violet-500
              px-6 py-3
              text-sm font-semibold text-white
              transition-all duration-300

              hover:scale-[1.02]
            "
          >
            Submit Quiz
          </button>
        </div>
      </>
    ) : (
      <>
        {/* ========================= */}
        {/* RESULT PAGE */}
        {/* ========================= */}
        <div
          className="
            rounded-4xl
            border border-white/10
            bg-white/5
            p-8
            backdrop-blur-xl
          "
        >
          <div className="text-center">
            <div
              className="
                mx-auto flex h-24 w-24 items-center justify-center
                rounded-full
                bg-linear-to-br from-blue-500/20 to-violet-500/20
              "
            >
              <span className="text-3xl font-bold text-blue-400">
                {score}/{quizzes.length}
              </span>
            </div>

            <h2 className="mt-6 text-3xl font-bold">
              Quiz Result
            </h2>

            <p className="mt-3 text-slate-400">
              Berikut hasil pengerjaan quiz kamu.
            </p>
          </div>

          {/* DETAIL RESULT */}
          <div className="mt-10 space-y-5">
            {quizzes.map((quiz, index) => {
              const selected = selectedAnswers[index];
              const isCorrect =
                selected === quiz.correctAnswer;

              return (
                <div
                  key={index}
                  className="
                    rounded-3xl
                    border border-white/10
                    bg-[#0B1120]
                    p-6
                  "
                >
                  {/* QUESTION */}
                  <div className="flex items-start justify-between gap-5">
                    <h3 className="text-lg font-semibold">
                      {index + 1}. {quiz.question}
                    </h3>

                    <span
                      className={`
                        rounded-full px-3 py-1 text-xs font-semibold

                        ${
                          isCorrect
                            ? "bg-green-500/20 text-green-400"
                            : "bg-red-500/20 text-red-400"
                        }
                      `}
                    >
                      {isCorrect ? "Correct" : "Wrong"}
                    </span>
                  </div>

                  {/* OPTIONS */}
                  <div className="mt-5 grid gap-3">
                    {quiz.options.map((option, idx) => {
                      const isCorrectAnswer =
                        option === quiz.correctAnswer;

                      const isSelected =
                        option === selected;

                      return (
                        <div
                          key={idx}
                          className={`
                            rounded-2xl
                            border
                            px-5 py-4
                            text-sm

                            ${
                              isCorrectAnswer
                                ? "border-green-500/30 bg-green-500/20 text-green-300"
                                : isSelected
                                ? "border-red-500/30 bg-red-500/20 text-red-300"
                                : "border-white/10 bg-white/5 text-slate-400"
                            }
                          `}
                        >
                          {option}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* ACTION */}
          <div className="mt-8 flex flex-wrap justify-end gap-3">
            <button
              onClick={handleRetryQuiz}
              className="
                rounded-2xl
                border border-white/10
                bg-white/5
                px-5 py-3
                text-sm font-semibold text-white
                transition-all duration-300

                hover:bg-white/10
              "
            >
              Retry Quiz
            </button>

            <button
              className="
                rounded-2xl
                bg-linear-to-r from-blue-500 to-violet-500
                px-5 py-3
                text-sm font-semibold text-white
                transition-all duration-300

                hover:scale-[1.02]
              "
            >
              Generate New Quiz
            </button>
          </div>
        </div>
      </>
    )}
  </div>
)}
        </div>
      </main>
    </div>
  );
};

export default WorkspacePage;
