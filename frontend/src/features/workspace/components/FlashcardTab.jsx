import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Badge from '../../../components/ui/Badge';
import { Layers3, Sparkles } from 'lucide-react';
import useWorkspace from '../hooks/useWorkspace';

const FlashcardTab = () => {
  const { workspace } = useWorkspace();
  
  const flashcards = [
    {
      question: `Apa inti utama dari materi "${workspace?.title || "ini"}"?`,
      answer: "Sistem AI akan segera membantu Anda memahami konsep-konsep kunci melalui active recall.",
    }
  ];

  return (
    <div className="w-full space-y-8 pb-12">
      {/* CONTROL PANEL - Smaller padding and clean font */}
      <Card className="p-6 border-white/10 bg-white/5 backdrop-blur-xl rounded-3xl">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
               <Layers3 className="h-6 w-6 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-base font-black text-white tracking-tight leading-none">Flashcard Engine</h2>
              <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-1.5">AI Active Recall</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Select 
              className="w-32"
              options={[
                { label: "5 Cards", value: "5" },
                { label: "10 Cards", value: "10" },
                { label: "20 Cards", value: "20" },
              ]}
            />
            <Button variant="primary" icon={Sparkles} className="rounded-xl h-11 px-6 font-bold uppercase tracking-widest text-[10px]">
              Generate Set
            </Button>
          </div>
        </div>
      </Card>

      {/* GRID - 3 columns desktop, 2 tablet, 1 mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {flashcards.map((card, index) => (
          <Card key={index} hover className="p-6 group relative overflow-hidden bg-white/2 border-white/5 rounded-3xl flex flex-col min-h-[220px]">
             <div className="flex items-center gap-2 mb-6">
                <Badge variant="indigo" className="px-2 py-1 text-[9px] font-black uppercase">Card #{index + 1}</Badge>
                <Layers3 className="h-3 w-3 text-slate-700" />
             </div>

             <h3 className="text-base font-black text-white leading-tight mb-6 flex-1">
                {card.question}
             </h3>

             <div className="pt-4 border-t border-white/5">
                <p className="text-[13px] font-medium leading-relaxed text-slate-500 group-hover:text-slate-400 transition-colors">
                  {card.answer}
                </p>
             </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FlashcardTab;
