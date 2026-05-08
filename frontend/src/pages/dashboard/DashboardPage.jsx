import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Swal from "sweetalert2";
import SidebarDashboard from "../../components/dashboard/layout/SidebarDashboard";
import NavbarDashboard from "../../components/dashboard/layout/NavbarDashboard";
import StatsCard from "../../components/dashboard/overview/StatsCard";
import WelcomeCard from "../../components/dashboard/overview/WelcomeCard";
import RecentLearning from "../../components/dashboard/overview/RecentLearning";

const DashboardPage = () => {
  const { user, logout } = useAuth();

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

  const handleLogout = () => {
    Swal.fire({
      title: "Konfirmasi Keluar",
      text: "Anda yakin ingin keluar dari akun?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#8b5cf6",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Ya, Keluar!",
      cancelButtonText: "Batal",
      background: "#050816",
      color: "#fff",
      backdrop: `
        rgba(0,0,0,0.45)
        blur(12px)
      `,
      customClass: {
        popup:
          "rounded-[28px] border border-white/10 shadow-[0_20px_80px_rgba(0,0,0,0.55)]",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        logout();

        Swal.fire({
          title: "Logout Berhasil",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
          background: "#050816",
          color: "#fff",
          backdrop: `
            rgba(0,0,0,0.45)
            blur(12px)
          `,
          customClass: {
            popup:
              "rounded-[28px] border border-white/10 shadow-[0_20px_80px_rgba(0,0,0,0.55)]",
          },
        });
      }
    });
  };

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
