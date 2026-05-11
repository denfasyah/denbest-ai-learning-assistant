import { useState, useRef, useEffect } from "react";
import { LogOut, User } from "lucide-react";
import { Link } from "react-router-dom";

const ProfileDropdown = ({ user, onLogout }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // CLOSE WHEN CLICK OUTSIDE
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef} className="relative">
      {/* TRIGGER */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center rounded-2xl hover:bg-white/10 transition"
      >
        <div className="h-10 w-10 rounded-2xl bg-linear-to-br from-blue-500 to-violet-500 flex items-center justify-center font-bold text-sm">
          <User className="h-5 w-5" />
        </div>
      </button>

      {/* DROPDOWN */}
      {open && (
        <div className="absolute right-0 mt-5 w-64 rounded-2xl border border-white/10 bg-[#0b1020] shadow-xl overflow-hidden z-50">
          {/* USER INFO */}
          <div className="p-4 border-b border-white/10">
            <p className="font-semibold text-white">{user?.name}</p>
            <p className="text-xs text-slate-400">{user?.email}</p>
          </div>

          {/* MENU */}
          <div className="p-2">
            <Link to={"/profile"} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-300 hover:bg-white/5">
              <User className="h-4 w-4" />
              My Profile
            </Link>

             <Link to={"/setting"} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-300 hover:bg-white/5">
              <User className="h-4 w-4" />
              Setting
            </Link>

            <button
              onClick={onLogout}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-red-400 hover:bg-red-500/10"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;