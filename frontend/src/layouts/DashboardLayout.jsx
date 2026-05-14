import { useState, useMemo } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import useLogout from '../hooks/useLogout';
import SidebarDashboard from './components/SidebarDashboard';
import NavbarDashboard from './components/NavbarDashboard';

const DashboardLayout = ({ title: propTitle, description: propDescription }) => {
  const { user } = useAuth();
  const { handleLogout } = useLogout();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const { title, description } = useMemo(() => {
    if (propTitle) return { title: propTitle, description: propDescription };

    const path = location.pathname;
    if (path === '/dashboard') return { title: 'Dashboard', description: 'Overview of your learning progress.' };
    if (path === '/learning') return { title: 'My Learning', description: 'Manage your documents and courses.' };
    if (path.startsWith('/learning/workspace')) return { title: 'Workspace', description: 'Interactive AI learning session.' };
    if (path === '/assistant') return { title: 'AI Assistant', description: 'Interactive learning with your documents.' };
    if (path === '/notes') return { title: 'My Notes', description: 'Capture and organize your thoughts.' };
    if (path === '/history') return { title: 'History', description: 'Your past learning activities.' };
    if (path === '/profile') return { title: 'Profile', description: 'Manage your account settings.' };
    if (path === '/setting') return { title: 'Settings', description: 'App preferences and configurations.' };
    if (path === '/notification') return { title: 'Notifications', description: 'Stay updated with your progress.' };

    return { title: 'Workspace', description: '' };
  }, [location.pathname, propTitle, propDescription]);

  return (
    <div className="flex min-h-screen bg-[#020204] text-white selection:bg-indigo-500/30 selection:text-indigo-200 overflow-hidden">
      {/* PREMIUM BACKGROUND BLURS */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute top-[20%] right-[-5%] w-[30%] h-[30%] bg-violet-500/5 rounded-full blur-[100px] animate-pulse [animation-delay:2s]" />
      </div>

      {/* OVERLAY for mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden animate-in fade-in duration-300"
        />
      )}

      {/* SIDEBAR */}
      <SidebarDashboard
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        handleLogout={handleLogout}
        user={user}
      />

      {/* MAIN CONTENT AREA */}
      <main className="flex flex-1 flex-col lg:ml-72 relative z-10 min-w-0 overflow-x-hidden">
        <NavbarDashboard
          title={title}
          description={description}
          setSidebarOpen={setSidebarOpen}
          user={user}
          handleLogout={handleLogout}
        />

        <div className="flex-1 px-5 py-8 lg:px-12 xl:px-16 pb-20 overflow-x-hidden">
          <Outlet context={{ user, setSidebarOpen }} />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;


