import { useEffect } from "react";
import { Menu, Bell} from "lucide-react";
import SectionHeader from "../../components/ui/SectionHeader";
import ProfileDropdown from "./ProfileDropdown";
import { Link } from "react-router-dom";
import useNotificationStore from "../../features/notification/store/notificationStore";

const NavbarDashboard = ({ setSidebarOpen, user, handleLogout, title, description }) => {
  const { unreadCount, fetchUnreadCount } = useNotificationStore();

  useEffect(() => {
    fetchUnreadCount();
    // Poll setiap 60 detik untuk update badge
    const interval = setInterval(fetchUnreadCount, 60000);
    return () => clearInterval(interval);
  }, []);

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
              {unreadCount > 0 && (
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
