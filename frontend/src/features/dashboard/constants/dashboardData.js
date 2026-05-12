import { FileText, Sparkles, Layers3, Brain, Bot, Clock3 } from "lucide-react";

export const DASHBOARD_STATS = [
  {
    id: 1,
    title: "Documents",
    value: "24",
    growth: "+12%",
    icon: FileText,
    color: "cyan",
  },
  {
    id: 2,
    title: "AI Summary",
    value: "58",
    growth: "+18%",
    icon: Sparkles,
    color: "blue",
  },
  {
    id: 3,
    title: "Flashcards",
    value: "132",
    growth: "+25%",
    icon: Layers3,
    color: "pink",
  },
  {
    id: 4,
    title: "Quiz Completed",
    value: "16",
    growth: "+9%",
    icon: Brain,
    color: "violet",
  },
];

export const RECENT_ACTIVITIES = [
  {
    id: 1,
    title: "Generated AI Summary",
    description: "Machine Learning Fundamentals.pdf",
    time: "2 hours ago",
    icon: Sparkles,
  },
  {
    id: 2,
    title: "Created React Flashcards",
    description: "React Authentication Workspace",
    time: "Yesterday",
    icon: Layers3,
  },
  {
    id: 3,
    title: "Completed Quiz",
    description: "Database Normalization Quiz",
    time: "2 days ago",
    icon: Brain,
  },
];

export const QUICK_ACTIONS = [
  {
    id: 1,
    title: "Upload Document",
    description: "PDF or Text Files",
    icon: FileText,
    color: "cyan",
  },
  {
    id: 2,
    title: "Generate Summary",
    description: "Quick AI Overview",
    icon: Sparkles,
    color: "blue",
  },
  {
    id: 3,
    title: "Create Flashcards",
    description: "Study Smartly",
    icon: Layers3,
    color: "pink",
  },
  {
    id: 4,
    title: "Open AI Assistant",
    description: "Contextual Help",
    icon: Bot,
    color: "emerald",
  },
];
