import { Mail, CalendarDays, Flame, Target } from 'lucide-react';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';

const ProfileHeader = ({ user, learningStreak, joinedDate, goal, goalDescription }) => {
  const initials = user?.displayName?.charAt(0) || "U";

  return (
    <Card variant="glass" className="p-8 mb-8 border-white/10">
      <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
        {/* LEFT SECTION */}
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center">
          {/* AVATAR */}
          <div className="flex h-32 w-32 shrink-0 items-center justify-center rounded-[2.5rem] bg-linear-to-br from-indigo-500 to-violet-500 text-5xl font-black text-white shadow-[0_20px_50px_rgba(79,70,229,0.3)] border-4 border-white/10">
            {initials}
          </div>

          {/* USER INFO */}
          <div>
            <Badge variant="indigo" icon={Flame}>
              {learningStreak} Learning Streak
            </Badge>

            <h1 className="mt-5 text-4xl lg:text-5xl font-black tracking-tight text-white leading-none">
              {user?.displayName || "Research Fellow"}
            </h1>

            <p className="mt-4 text-lg font-bold text-indigo-400/80 italic tracking-tight">
              AI Learning Explorer
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-indigo-500" />
                {user?.email}
              </div>
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-violet-500" />
                Joined {joinedDate}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SECTION - GOAL */}
        <div className="rounded-[2.5rem] border border-white/5 bg-white/2 p-7 lg:max-w-xs relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Target className="h-20 w-20 text-indigo-500" />
          </div>
          
          <div className="flex items-center gap-3 relative z-10">
            <Target className="h-5 w-5 text-indigo-400" />
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Learning Goal</p>
          </div>

          <h3 className="mt-5 text-xl font-black text-white leading-tight relative z-10">
            {goal}
          </h3>

          <p className="mt-3 text-xs font-medium leading-relaxed text-slate-400 relative z-10">
            {goalDescription}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default ProfileHeader;
