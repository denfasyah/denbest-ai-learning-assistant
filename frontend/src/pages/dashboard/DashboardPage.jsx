import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

import useLogout from "../../hooks/useLogout";

import SidebarDashboard from "../../components/dashboard/layout/SidebarDashboard";
import NavbarDashboard from "../../components/dashboard/layout/NavbarDashboard";
import StatsCard from "../../components/dashboard/overview/StatsCard";
import WelcomeCard from "../../components/dashboard/overview/WelcomeCard";
import RecentLearning from "../../components/dashboard/overview/RecentLearning";

const DashboardPage = () => {
  const { user } = useAuth();
  const { handleLogout } = useLogout();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const recentLearningData = [
    {
      title: "React Hooks",
      description: "useEffect & useState deep dive",
      time: "2 jam lalu",
    },
    {
      title: "Node.js API",
      description: "Express routing & middleware",
      time: "5 jam lalu",
    },
    {
      title: "AI Prompting",
      description: "Context-aware prompting basics",
      time: "1 hari lalu",
    },
  ];

  

  return (
    <div className="flex min-h-screen bg-linear-to-b from-black via-[#050816] to-violet-950 text-white">
      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* SIDEBAR */}
      <SidebarDashboard
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        handleLogout={handleLogout}
        user={user}
      />

      {/* MAIN */}
      <main className="flex flex-1 flex-col lg:ml-72">
        {/* TOPBAR */}
        <NavbarDashboard
          title={"DashBoard"}
          description={"Lihat progres dan lanjutkan perjalanan belajarmu."}
          setSidebarOpen={setSidebarOpen}
          user={user}
          handleLogout={handleLogout}
        />

        {/* CONTENT */}
        <WelcomeCard user={user} />
        <StatsCard />
        <RecentLearning items={recentLearningData} />
      </main>
    </div>
  );
};

export default DashboardPage;
