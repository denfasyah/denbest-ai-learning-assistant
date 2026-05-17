import { Sparkles, BadgeCheck } from 'lucide-react';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';

const WelcomeCard = ({ user }) => {
  const displayName = user?.name?.split(" ")[0] || "Scholar";
  
  return (
  

    <Card variant="glass" className="p-7">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-linear-to-br from-indigo-500 to-violet-500 shadow-lg shadow-indigo-500/20">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <div className="max-w-3xl">
            <Badge variant="emerald" icon={BadgeCheck} className="mb-3">AI Learning Workspace Active</Badge>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white">
              Welcome back, {displayName} 👋
            </h1>
            <p className="mt-4 leading-relaxed text-slate-400 font-medium">
              Continue your AI-powered learning journey. Upload documents, generate summaries, 
            create flashcards, and master your materials in one modern workspace.
            </p>
          </div>
        </div>
      </Card>
  );
};


export default WelcomeCard;
