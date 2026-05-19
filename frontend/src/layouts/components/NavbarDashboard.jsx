import { useEffect, useState } from "react";
import { Menu, Bell} from "lucide-react";
import SectionHeader from "../../components/ui/SectionHeader";
import ProfileDropdown from "./ProfileDropdown";
import { Link, useLocation } from "react-router-dom";
import useNotificationStore from "../../features/notification/store/notificationStore";
import axiosInstance from "../../services/axiosInstance";

const NavbarDashboard = ({ setSidebarOpen, user, handleLogout, title, description }) => {
  const { unreadCount, fetchUnreadCount } = useNotificationStore();
  const location = useLocation();
  const [notifEnabled, setNotifEnabled] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosInstance.get('/users/preferences');
        if (res.data?.success) {
          setNotifEnabled(res.data.data.notifications_enabled);
        }
      } catch (e) {
        console.error('Failed to fetch preference:', e);
      }
      fetchUnreadCount();
    };

    fetchData();
    
    // Poll every 60 seconds
    const interval = setInterval(fetchUnreadCount, 60000);
    return () => clearInterval(interval);
  }, [location.pathname, fetchUnreadCount]);

  return (
    <div>
      <header
        className="
            sticky top-0 z-30
            border-b border-white/10
            bg-[#050816]/80
            backdrop-blur-xl
          "
      >
        <div
          className="
              flex items-center justify-between
              px-5 py-4 lg:px-8
            "
        >
          {/* LEFT */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="
                  flex h-11 w-11 items-center justify-center
                  rounded-2xl
                  border border-white/10
                  bg-white/5
                  lg:hidden
                "
            >
              <Menu className="h-5 w-5 text-white" />
            </button>

            <SectionHeader title={title} description={description} />
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-3">

            {/* NOTIF */}
            <Link to={"/notification"}
              className="
                  relative
                  flex h-11 w-11 items-center justify-center
                  rounded-2xl
                  border border-white/10
                  bg-white/5
                "
            >
              <Bell className="h-5 w-5 text-slate-300" />
              {notifEnabled && unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 h-4 w-4 flex items-center justify-center rounded-full bg-indigo-500 text-[9px] font-black text-white">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Link>
            <ProfileDropdown user={user} onLogout={handleLogout} />
          </div>
        </div>
      </header>
    </div>
  );
};

export default NavbarDashboard;
