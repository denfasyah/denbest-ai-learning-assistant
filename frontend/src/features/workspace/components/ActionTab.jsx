import { Sparkles, BrainCircuit, ChevronRight } from 'lucide-react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';

const ActionTab = () => {
  const actions = [
    {
      id: "summary",
      title: "Generate Summary",
      description: "AI extracts key concepts and creates a comprehensive overview.",
      icon: Sparkles,
      color: "indigo",
      btnLabel: "Generate Summary"
    },
    {
      id: "explain",
      title: "Explain Material",
      description: "Simplified explanations for complex topics found in the document.",
      icon: BrainCircuit,
      color: "violet",
      btnLabel: "Explain Document"
    }
  ];

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {actions.map((action) => (
        <Card key={action.id} hover className="p-8 group">
          <div className={`mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-${action.color}-500/10 border border-${action.color}-500/20 group-hover:scale-110 transition-transform`}>
            <action.icon className={`h-8 w-8 text-${action.color}-400`} />
          </div>

          <h2 className="text-2xl font-black text-white tracking-tight">{action.title}</h2>
          <p className="mt-4 text-sm font-medium leading-relaxed text-slate-500">
            {action.description}
          </p>

          <Button 
            variant="primary" 
            className="mt-8 w-full rounded-2xl h-12 font-black italic tracking-tight"
            icon={ChevronRight}
          >
            {action.btnLabel}
          </Button>
        </Card>
      ))}
    </div>
  );
};

export default ActionTab;
