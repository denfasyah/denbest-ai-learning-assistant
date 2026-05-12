import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Badge from '../../../components/ui/Badge';
import { BrainCircuit, Sparkles, CheckCircle2, XCircle, RotateCcw } from 'lucide-react';

const QuizTab = ({ 
  quizzes, 
  submitted, 
  selectedAnswers, 
  onSelectAnswer, 
  onSubmit, 
  onRetry,
  score 
}) => {
  if (submitted) {
    return (
      <Card className="p-10 border-white/10 bg-white/5 backdrop-blur-xl animate-in zoom-in duration-500">
        <div className="text-center max-w-2xl mx-auto">
          <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-[2.5rem] bg-indigo-500/10 border border-indigo-500/20 shadow-2xl">
            <div className="text-center">
              <span className="block text-4xl font-black text-white italic">{score}</span>
              <span className="block text-[10px] font-black text-indigo-400 uppercase tracking-widest mt-1">OF {quizzes.length}</span>
            </div>
          </div>

          <h2 className="mt-8 text-3xl font-black text-white tracking-tight">Quiz Analysis Complete</h2>
          <p className="mt-4 text-slate-500 font-medium leading-relaxed">
            Great effort! Review your answers below to understand the concepts better and master the material.
          </p>

          <Button 
            variant="secondary" 
            icon={RotateCcw} 
            onClick={onRetry}
            className="mt-10 rounded-2xl h-12 px-8 font-black uppercase tracking-widest text-xs"
          >
            Retry Quiz Session
          </Button>
        </div>

        <div className="mt-16 space-y-6">
          {quizzes.map((quiz, index) => {
            const selected = selectedAnswers[index];
            const isCorrect = selected === quiz.correctAnswer;

            return (
              <div key={index} className="rounded-3xl border border-white/3 bg-white/2 p-8 hover:bg-white/4 transition-all">
                <div className="flex items-start justify-between gap-6 mb-6">
                  <h3 className="text-lg font-bold text-white leading-tight">
                    <span className="text-indigo-500 mr-2">#{index + 1}</span> {quiz.question}
                  </h3>
                  <Badge variant={isCorrect ? "emerald" : "rose"} icon={isCorrect ? CheckCircle2 : XCircle}>
                    {isCorrect ? "Correct" : "Incorrect"}
                  </Badge>
                </div>

                <div className="grid gap-3">
                  {quiz.options.map((option, idx) => {
                    const isSelected = selected === option;
                    const isCorrectAnswer = option === quiz.correctAnswer;
                    
                    let stateClass = "border-white/5 bg-white/5 text-slate-500";
                    if (isCorrectAnswer) stateClass = "border-emerald-500/30 bg-emerald-500/10 text-emerald-400";
                    else if (isSelected && !isCorrect) stateClass = "border-rose-500/30 bg-rose-500/10 text-rose-400";

                    return (
                      <div key={idx} className={`rounded-2xl border px-5 py-4 text-sm font-medium transition-all ${stateClass}`}>
                        {option}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <Card className="p-7 border-white/10 bg-white/5 backdrop-blur-xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
             <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
                <BrainCircuit className="h-7 w-7 text-indigo-400" />
             </div>
             <div>
                <h2 className="text-2xl font-black text-white tracking-tight leading-none">Intelligence Quiz</h2>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-2">Test Your Understanding</p>
             </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Select 
              className="w-32"
              options={[
                { label: "5 Q's", value: "5" },
                { label: "10 Q's", value: "10" },
              ]}
            />
            <Button variant="primary" icon={Sparkles} className="rounded-2xl h-11 px-6 font-bold uppercase tracking-widest text-[10px]">
              Generate Assessment
            </Button>
          </div>
        </div>
      </Card>

      <div className="space-y-6">
        {quizzes.map((quiz, index) => (
          <Card key={index} className="p-8">
            <h3 className="text-xl font-black text-white leading-tight mb-8">
               <span className="text-indigo-500 italic mr-2">Q{index + 1}.</span> {quiz.question}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quiz.options.map((option, idx) => {
                const isSelected = selectedAnswers[index] === option;

                return (
                  <button
                    key={idx}
                    onClick={() => onSelectAnswer(index, option)}
                    className={`
                      rounded-2xl border px-6 py-4 text-left text-sm font-bold transition-all duration-300
                      ${isSelected
                        ? "border-indigo-500 bg-indigo-500/10 text-white shadow-lg shadow-indigo-500/10"
                        : "border-white/5 bg-white/2 text-slate-500 hover:bg-white/5 hover:text-slate-300"
                      }
                    `}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </Card>
        ))}

        <div className="flex justify-end pt-4">
          <Button 
            variant="primary" 
            onClick={onSubmit}
            className="rounded-2xl h-14 px-10 font-black italic tracking-tight"
          >
            SUBMIT ASSESSMENT
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuizTab;
