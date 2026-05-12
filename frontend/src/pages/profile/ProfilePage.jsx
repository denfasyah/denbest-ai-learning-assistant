import { useAuth } from "../../context/AuthContext";
import { PROFILE_STATS, SKILL_PROGRESS, RECENT_LEARNING, ACHIEVEMENTS } from "../../features/profile/constants/profileData";
import ProfileHeader from "../../features/profile/components/ProfileHeader";
import SkillProgress from "../../features/profile/components/SkillProgress";
import AchievementGrid from "../../features/profile/components/AchievementGrid";
import StatCard from "../../features/dashboard/components/StatCard";
import RecentActivity from "../../features/dashboard/components/RecentActivity";

const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <ProfileHeader 
        user={user}
        learningStreak="7 Days"
        joinedDate="April 2026"
        goal="Become MERN Stack Engineer"
        goalDescription="Fokus memperdalam React, Node.js, MongoDB, dan AI Integration."
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {PROFILE_STATS.map((stat, index) => (
          <StatCard 
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color="indigo"
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <SkillProgress skills={SKILL_PROGRESS} />
        </div>
        <div>
          <RecentActivity activities={RECENT_LEARNING.map((act, i) => ({
            id: i,
            title: act.title,
            description: "Activity Record",
            time: act.time,
            icon: PROFILE_STATS[0].icon
          }))} />
        </div>
      </div>

      <AchievementGrid achievements={ACHIEVEMENTS} />
    </div>
  );
};

export default ProfilePage;