import { Sparkles, BrainCircuit, ChevronRight } from 'lucide-react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';

const ActionTab = () => {
  const actions = [
    {
      id: "summary",
      title: "Generate Summary",
      description: "AI extracts key concepts and creates a comprehensive overview of your document.",
      icon: Sparkles,
      color: "indigo",
      btnLabel: "Generate Summary"
    },
    {
      id: "explain",
      title: "Explain Material",
      description: "Simplified explanations for complex topics found in your learning materials.",
      icon: BrainCircuit,
      color: "violet",
      btnLabel: "Start Explanation"
    }
  ];

  return (
    <div className="w-full pb-12">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {actions.map((action) => (
          <Card key={action.id} hover className="p-8 group bg-white/5 border-white/10 rounded-3xl">
            <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-${action.color}-500/10 border border-${action.color}-500/20 group-hover:scale-110 transition-transform`}>
              <action.icon className={`h-7 w-7 text-${action.color}-400`} />
            </div>

            <h2 className="text-xl font-black text-white tracking-tight">{action.title}</h2>
            <p className="mt-3 text-sm font-medium leading-relaxed text-slate-500">
              {action.description}
            </p>

            <Button 
              variant="primary" 
              className="mt-8 w-full rounded-xl h-12 font-black italic tracking-tight text-xs"
              icon={ChevronRight}
            >
              {action.btnLabel}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ActionTab;
