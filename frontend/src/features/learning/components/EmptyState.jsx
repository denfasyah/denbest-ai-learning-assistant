import { FilePlus, SearchX, StarOff } from 'lucide-react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';

const EmptyState = ({ 
  type = 'documents', 
  onAction 
}) => {
  const configs = {
    documents: {
      icon: FilePlus,
      title: "No documents yet",
      description: "Upload your first study material to start learning with AI.",
      actionLabel: "Upload Document",
      iconColor: "text-indigo-500"
    },
    search: {
      icon: SearchX,
      title: "No results found",
      description: "We couldn't find any documents matching your search criteria.",
      actionLabel: "Clear Search",
      iconColor: "text-slate-500"
    },
    favorites: {
      icon: StarOff,
      title: "No favorites yet",
      description: "Mark your important documents as favorite to see them here.",
      actionLabel: "Show All",
      iconColor: "text-amber-500"
    }
  };

  const config = configs[type] || configs.documents;
  const Icon = config.icon;

  return (
    <Card className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in duration-300">
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-white/5 shadow-inner">
        <Icon className={`h-12 w-12 ${config.iconColor}`} />
      </div>
      
      <h3 className="text-2xl font-bold text-white">{config.title}</h3>
      <p className="mt-2 max-w-sm text-slate-400">{config.description}</p>
      
      {onAction && (
        <Button 
          variant="primary" 
          className="mt-8" 
          onClick={onAction}
        >
          {config.actionLabel}
        </Button>
      )}
    </Card>
  );
};

export default EmptyState;
