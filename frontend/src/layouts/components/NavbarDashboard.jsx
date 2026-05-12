import { Menu, Bell} from "lucide-react";
import SectionHeader from "../../components/ui/SectionHeader";
import ProfileDropdown from "./ProfileDropdown";
import { Link } from "react-router-dom";
const NavbarDashboard = ({ setSidebarOpen, user, handleLogout, title, description }) => {
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
                  flex h-11 w-11 items-center justify-center
                  rounded-2xl
                  border border-white/10
                  bg-white/5
                "
            >
              <Bell className="h-5 w-5 text-slate-300" />
            </Link>
            <ProfileDropdown user={user} onLogout={handleLogout} />
          </div>
        </div>
      </header>
    </div>
  );
};

export default NavbarDashboard;
