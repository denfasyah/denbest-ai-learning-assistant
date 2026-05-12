import { Sparkles, BadgeCheck } from 'lucide-react';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';

const WelcomeCard = ({ user }) => {
  const displayName = user?.displayName?.split(" ")[0] || "Scholar";
  
  return (
    <Card variant="glass" className="p-7">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-linear-to-br from-blue-500 to-violet-500 shadow-lg shadow-blue-500/20">
            <Sparkles className="h-8 w-8 text-white" />
          </div>

          <Badge variant="emerald" icon={BadgeCheck}>
            AI Learning Workspace Active
          </Badge>

          <h1 className="mt-5 text-3xl md:text-4xl font-black tracking-tight text-white">
            Welcome back, {displayName} 👋
          </h1>

          <p className="mt-5 leading-relaxed text-slate-400 font-medium max-w-xl">
            Continue your AI-powered learning journey. Upload documents, generate summaries, 
            create flashcards, and master your materials in one modern workspace.
          </p>
        </div>
      </div>
    </Card>
  );
};


export default WelcomeCard;
