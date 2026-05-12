import React from 'react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Badge from '../../../components/ui/Badge';
import { Layers3, Sparkles } from 'lucide-react';

const FlashcardTab = ({ flashcards }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* CONTROL PANEL */}
      <Card className="p-7 border-white/10 bg-white/5 backdrop-blur-xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight leading-none">Flashcard Engine</h2>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-2">Personalized Study Sets</p>
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
            <Button variant="primary" icon={Sparkles} className="rounded-2xl h-11 px-6 font-bold uppercase tracking-widest text-[10px]">
              Generate New Set
            </Button>
          </div>
        </div>
      </Card>

      {/* GRID */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {flashcards.map((card, index) => (
          <Card key={index} hover className="p-8 group relative overflow-hidden">
             <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl -mr-12 -mt-12 group-hover:bg-indigo-500/10 transition-all" />
             
             <div className="flex items-center gap-3 mb-6">
                <Badge variant="indigo">CARD #{index + 1}</Badge>
                <Layers3 className="h-4 w-4 text-slate-700" />
             </div>

             <h3 className="text-xl font-black text-white leading-tight mb-5">
                {card.question}
             </h3>

             <div className="pt-6 border-t border-white/[0.03]">
                <p className="text-sm font-medium leading-relaxed text-slate-400">
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
