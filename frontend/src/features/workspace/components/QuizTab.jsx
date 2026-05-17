import { useState } from 'react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import { BrainCircuit, Sparkles, AlertCircle, Loader2, RefreshCcw, CheckCircle2, XCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import useQuiz from '../hooks/useQuiz';

const QuizTab = () => {
  const {
    view,
    isGenerating,
    isSubmitting,
    error,
    activeQuiz,
    selectedAnswers,
    currentQuestionIndex,
    quizResult,
    answeredCount,
    setCurrentQuestionIndex,
    handleGenerate,
    selectAnswer,
    handleSubmit,
    handleReset,
    handleRetry
  } = useQuiz();

  const [countSelect, setCountSelect] = useState("5");
  const [warningMsg, setWarningMsg] = useState("");

  const submitAction = async () => {
    const res = await handleSubmit();
    if (res && res.valid === false && res.unansweredCount) {
      setWarningMsg(`Masih ada ${res.unansweredCount} soal yang belum dijawab.`);
      setTimeout(() => setWarningMsg(""), 3000);
    }
  };

  const renderHeader = () => {
  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between pb-8 border-b border-white/5">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
          <BrainCircuit className="h-6 w-6 text-indigo-400" />
        </div>
        <div>
          <h2 className="text-base font-black text-white tracking-tight leading-none">Intelligence Quiz</h2>
          <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-1.5">Validasi Pengetahuan</p>
        </div>
      </div>

      {view === 'idle' && !isGenerating && (
        <div className="flex items-center gap-3">
          <select
            value={countSelect}
            onChange={(e) => setCountSelect(e.target.value)}
            className="bg-black/20 border border-white/10 text-white rounded-2xl h-12 px-4 text-sm font-bold focus:outline-none focus:border-indigo-500/50 w-40"
          >
            <option value="5" className="bg-[#1a1a2e]">5 Soal</option>
            <option value="10" className="bg-[#1a1a2e]">10 Soal (Best)</option>
          </select>
          <Button
            variant="primary"
            icon={Sparkles}
            onClick={() => handleGenerate(parseInt(countSelect))}
            className="rounded-xl h-12 px-6 font-bold uppercase tracking-widest text-[11px]"
          >
            Generate
          </Button>
        </div>
      )}

      {view === 'result' ? (
        <div className="flex gap-2">
          <Button variant="secondary" onClick={handleRetry} className="rounded-xl h-10 px-4 text-xs font-bold">Ulangi</Button>
          <Button variant="primary" onClick={handleReset} className="rounded-xl h-10 px-4 text-xs font-bold">Quiz Baru</Button>
        </div>
      ) : view !== 'idle' ? (
        <Button variant="secondary" icon={RefreshCcw} onClick={handleReset} className="rounded-xl h-10 px-4 text-xs font-bold">
          Batalkan Quiz
        </Button>
      ) : null}
    </div>
  );
};

  const renderIdle = () => (
  <div className="flex flex-col items-center justify-center py-16 gap-4">
    {isGenerating ? (
      <>
        <div className="relative mb-4">
          <div className="absolute inset-0 bg-indigo-500/20 blur-2xl rounded-full animate-pulse"></div>
          <div className="h-20 w-20 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center relative z-10">
            <Sparkles className="h-8 w-8 text-indigo-400 animate-bounce" />
          </div>
        </div>
        <h2 className="text-xl font-black text-white tracking-tight">AI sedang membuat soal...</h2>
        <p className="text-slate-500 font-medium text-sm">Estimasi 10–30 detik</p>
      </>
    ) : (
      <>
        <div className="h-16 w-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/10 flex items-center justify-center mb-2">
          <BrainCircuit className="h-8 w-8 text-indigo-500/40" />
        </div>
        <p className="text-lg font-black text-white/60 tracking-tight">Belum ada quiz</p>
        <p className="text-slate-500 text-sm text-center max-w-xs">
          Klik <span className="text-indigo-400 font-bold">Generate</span> di atas untuk membuat quiz otomatis dari dokumen ini menggunakan AI.
        </p>
        {error && <p className="text-rose-400 text-sm mt-2">{error}</p>}
      </>
    )}
  </div>
);

  const renderActiveQuiz = () => {
    if (!activeQuiz) return null;
    const q = activeQuiz.questions[currentQuestionIndex];
    const total = activeQuiz.totalQuestions;

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-end mb-2">
          <div>
            <h3 className="text-sm font-bold text-slate-400">Soal {currentQuestionIndex + 1} / {total}</h3>
            <p className="text-xs text-slate-500">{answeredCount}/{total} dijawab</p>
          </div>
        </div>
        <div className="w-full bg-white/5 rounded-full h-1.5 mb-6">
          <div
            className="bg-indigo-500 h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${(answeredCount / total) * 100}%` }}
          ></div>
        </div>

        <div className="flex gap-2 mb-8 justify-center">
          {activeQuiz.questions.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentQuestionIndex(idx)}
              className={`w-3 h-3 rounded-full transition-all ${currentQuestionIndex === idx
                  ? "bg-white scale-125"
                  : selectedAnswers[idx]
                    ? "bg-emerald-500/50"
                    : "bg-white/10 hover:bg-white/20"
                }`}
            />
          ))}
        </div>

        <div className="p-8 bg-white/2 border border-white/5 rounded-3xl mb-6 min-h-75">
          <h3 className="text-xl font-black text-white leading-tight mb-8">
            {q.question}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {q.options.map((option, idx) => {
              const isSelected = selectedAnswers[currentQuestionIndex] === option;
              return (
                <button
                  key={idx}
                  onClick={() => selectAnswer(currentQuestionIndex, option)}
                  className={`
                    rounded-xl border px-6 py-4 text-left text-sm font-bold transition-all duration-300
                    ${isSelected
                      ? "border-indigo-500 bg-indigo-500/10 text-white shadow-lg shadow-indigo-500/10 ring-2 ring-indigo-500/20"
                      : "border-white/5 bg-black/20 text-slate-400 hover:bg-white/5 hover:text-slate-200"
                    }
                  `}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>

        {warningMsg && (
          <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 p-4 rounded-xl text-sm font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            {warningMsg}
          </div>
        )}

        <div className="flex justify-between items-center mt-8">
          <Button
            variant="secondary"
            onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
            disabled={currentQuestionIndex === 0}
            icon={ArrowLeft}
            className="rounded-xl h-11 px-6 text-xs"
          >
            Prev
          </Button>

          {currentQuestionIndex === total - 1 ? (
            <Button
              variant="primary"
              onClick={submitAction}
              disabled={isSubmitting}
              className="rounded-xl h-12 px-8 font-black italic tracking-tight text-xs"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "SUBMIT QUIZ"}
            </Button>
          ) : (
            <Button
              variant="secondary"
              onClick={() => setCurrentQuestionIndex(Math.min(total - 1, currentQuestionIndex + 1))}
              className="rounded-xl h-11 px-6 text-xs flex-row-reverse"
            >
              Next <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    );
  };



  const renderResult = () => {
    if (!quizResult || !quizResult.questions || quizResult.questions.length === 0) return null;

    const questions = quizResult.questions;
    const correctCount = questions.filter((q, i) => selectedAnswers[i] === q.correctAnswer).length;
    const total = questions.length;
    const percentage = Math.round((correctCount / total) * 100);

    let label = "Cukup Baik, Tingkatkan Lagi!";
    if (percentage >= 70) label = "Bagus! Terus Berlatih!";
    else if (percentage < 40) label = "Pelajari Lagi Materinya!";

    const q = questions[currentQuestionIndex];
    if (!q) return null;
    const userAnswer = selectedAnswers[currentQuestionIndex];
    const isCorrect = userAnswer === q.correctAnswer;

    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className={`text-6xl font-bold ${percentage >= 70 ? "text-green-400" :
              percentage >= 40 ? "text-yellow-400" : "text-red-400"
            }`}>
            {percentage}%
          </div>
          <p className="text-gray-400 mt-2">
            {correctCount} dari {total} jawaban benar
          </p>
          <p className="text-white font-bold text-lg mt-1">
            {label}
          </p>
        </div>

        <div className="bg-[#1a1a2e] border border-white/5 rounded-2xl p-6">
          <div className="flex justify-between text-sm text-slate-400 mb-4">
            <span>Soal {currentQuestionIndex + 1} / {total}</span>
            <span className={isCorrect ? "text-emerald-400 font-bold flex items-center gap-1" : "text-rose-400 font-bold flex items-center gap-1"}>
              {isCorrect ? <><CheckCircle2 className="w-4 h-4" /> Benar</> : <><XCircle className="w-4 h-4" /> Salah</>}
            </span>
          </div>

          <div className="flex gap-2 justify-center mb-8">
            {questions.map((_, i) => {
              const ans = selectedAnswers[i];
              const correct = questions[i].correctAnswer === ans;
              return (
                <button
                  key={i}
                  onClick={() => setCurrentQuestionIndex(i)}
                  className={`w-3 h-3 rounded-full transition-all ${i === currentQuestionIndex ? "ring-2 ring-white scale-125" :
                      correct ? "bg-emerald-500" : "bg-rose-500"
                    }`}
                />
              );
            })}
          </div>

          <p className="text-lg font-medium text-white mb-6">{q.question}</p>

          <div className="grid grid-cols-1 gap-3 mb-8">
            {q.options.map((option, idx) => {
              const isCorrectOption = option === q.correctAnswer;
              const isWrongUserAnswer = option === userAnswer && !isCorrect;

              let stateClass = "border-white/5 bg-black/20 text-slate-400";
              if (isCorrectOption) stateClass = "border-emerald-500/50 bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-500/20";
              else if (isWrongUserAnswer) stateClass = "border-rose-500/50 bg-rose-500/10 text-rose-300";

              return (
                <div key={idx} className={`px-5 py-3 rounded-xl border text-sm font-medium transition-all ${stateClass}`}>
                  {option}
                </div>
              );
            })}
          </div>

          <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <BrainCircuit className="w-4 h-4 text-indigo-400" />
              <h4 className="text-[11px] font-black text-indigo-400 uppercase tracking-wider">AI Explanation</h4>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">{q.explanation}</p>
            {!isCorrect && (
              <p className="text-rose-400 text-xs mt-3 font-medium">
                Jawaban kamu: {userAnswer || "-"} <span className="mx-2 text-white/20">|</span> Jawaban benar: {q.correctAnswer}
              </p>
            )}
          </div>

          <div className="flex justify-between items-center mt-6">
            <Button
              variant="secondary"
              onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
              disabled={currentQuestionIndex === 0}
              icon={ArrowLeft}
              className="rounded-xl h-11 px-6 text-xs"
            >
              Prev
            </Button>
            <Button
              variant="secondary"
              onClick={() => setCurrentQuestionIndex(Math.min(total - 1, currentQuestionIndex + 1))}
              disabled={currentQuestionIndex === total - 1}
              className="rounded-xl h-11 px-6 text-xs flex-row-reverse"
            >
              Next <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 pb-12 animate-in fade-in duration-500">
      <Card className="p-6 border-white/10 bg-white/5 backdrop-blur-xl rounded-3xl">
        {renderHeader()}

        {view === 'idle' && renderIdle()}
        {view === 'quiz' && renderActiveQuiz()}
        {view === 'result' && renderResult()}
      </Card>
    </div>
  );
};

export default QuizTab;
