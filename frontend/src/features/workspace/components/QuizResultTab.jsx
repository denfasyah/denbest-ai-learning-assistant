import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import { CheckCircle2, XCircle, RotateCcw, ArrowLeft, BrainCircuit } from 'lucide-react';
import useQuiz from '../hooks/useQuiz';

const QuizResultTab = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { quizResult, loadResult, isLoadingResult } = useQuiz();

  useEffect(() => {
    if (quizId) {
      loadResult(quizId);
    }
  }, [quizId, loadResult]);

  if (isLoadingResult) {
    return (
      <div className="w-full flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!quizResult) {
    return null;
  }

  return (
    <div className="w-full max-w-4xl mx-auto pb-12 animate-in zoom-in duration-500">
      <Card className="p-8 border-white/10 bg-white/5 backdrop-blur-xl rounded-3xl">
        <div className="flex justify-between items-start mb-8">
          <Button
            variant="secondary"
            icon={ArrowLeft}
            onClick={() => navigate(`..`)}
            className="rounded-xl h-10 px-4 text-xs font-bold"
          >
            Kembali
          </Button>
        </div>

        <div className="text-center max-w-2xl mx-auto">
          <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-4xl bg-indigo-500/10 border border-indigo-500/20 shadow-xl mb-8">
            <div className="text-center">
              <span className="block text-3xl font-black text-white italic">{quizResult.score}</span>
              <span className="block text-[10px] font-black text-indigo-400 uppercase tracking-widest mt-1">SCORE</span>
            </div>
          </div>

          <h2 className="text-2xl font-black text-white tracking-tight">Quiz Complete</h2>
          <p className="mt-3 text-slate-500 font-medium text-sm">
            Review your answers below to master the material.
          </p>

          <button
            onClick={() => navigate(`..`)}
            className="mt-8 flex items-center gap-2 mx-auto px-6 h-11 rounded-xl bg-white/5 text-white font-black uppercase tracking-widest text-[10px] border border-white/10 hover:bg-white/10 transition-all"
          >
            <RotateCcw className="h-4 w-4" />
            Try Another Quiz
          </button>
        </div>

        <div className="mt-12 space-y-6">
          {quizResult.questions.map((quiz, index) => {
            const selected = quizResult.answers[quiz._id];
            const isCorrect = selected === quiz.correctAnswer;

            return (
              <div key={index} className="rounded-2xl border border-white/3 bg-white/2 p-6 hover:bg-white/4 transition-all">
                <div className="flex items-start justify-between gap-6 mb-6">
                  <h3 className="text-base font-bold text-white leading-tight">
                    <span className="text-indigo-500 mr-2">#{index + 1}</span> {quiz.question}
                  </h3>
                  <Badge variant={isCorrect ? "emerald" : "rose"} icon={isCorrect ? CheckCircle2 : XCircle} className="px-3 py-1 rounded-full text-[9px] font-black uppercase whitespace-nowrap">
                    {isCorrect ? "Correct" : "Incorrect"}
                  </Badge>
                </div>

                <div className="grid gap-3 mb-6">
                  {quiz.options.map((option, idx) => {
                    const isSelected = selected === option;
                    const isCorrectAnswer = option === quiz.correctAnswer;

                    let stateClass = "border-white/5 bg-white/5 text-slate-600";
                    if (isCorrectAnswer) stateClass = "border-emerald-500/30 bg-emerald-500/10 text-emerald-400";
                    else if (isSelected && !isCorrect) stateClass = "border-rose-500/30 bg-rose-500/10 text-rose-400";

                    return (
                      <div key={idx} className={`rounded-xl border px-5 py-4 text-sm font-medium transition-all ${stateClass}`}>
                        {option}
                      </div>
                    );
                  })}
                </div>

                <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-xl p-5 flex gap-4 items-start">
                  <BrainCircuit className="w-6 h-6 text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">AI Explanation</h4>
                    <p className="text-sm text-slate-300 leading-relaxed">{quiz.explanation}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default QuizResultTab;
