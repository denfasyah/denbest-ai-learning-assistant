import { FileText, Sparkles, Brain, NotebookPen, Flame, Trophy, Star } from "lucide-react";

export const PROFILE_STATS = [
  {
    title: "Documents",
    value: 24,
    icon: FileText,
  },
  {
    title: "AI Summaries",
    value: 18,
    icon: Sparkles,
  },
  {
    title: "Flashcards",
    value: 56,
    icon: Brain,
  },
  {
    title: "Notes",
    value: 31,
    icon: NotebookPen,
  },
];

export const SKILL_PROGRESS = [
  {
    title: "Frontend Development",
    progress: 82,
  },
  {
    title: "Backend Development",
    progress: 68,
  },
  {
    title: "Database",
    progress: 57,
  },
  {
    title: "AI / Machine Learning",
    progress: 34,
  },
];

export const RECENT_LEARNING = [
  {
    title: "Created note about JWT Authentication",
    time: "2 hours ago",
  },
  {
    title: "Completed React Authentication Quiz",
    time: "Yesterday",
  },
  {
    title: "Generated AI Summary from Machine Learning.pdf",
    time: "2 days ago",
  },
];

export const ACHIEVEMENTS = [
  {
    title: "7 Days Streak",
    description: "Consistent learning for 7 days in a row.",
    icon: Flame,
  },
  {
    title: "Quiz Master",
    description: "Completed 20 quizzes with over 90% score.",
    icon: Trophy,
  },
  {
    title: "Fast Learner",
    description: "Generated 50+ AI insights and flashcards.",
    icon: Star,
  },
];
