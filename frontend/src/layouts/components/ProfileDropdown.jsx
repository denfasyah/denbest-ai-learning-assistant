import React, { useState, useRef, useEffect } from 'react';
import { User, LogOut, Settings, Bell, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProfileDropdown = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const initials = user?.displayName?.charAt(0) || "U";

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 p-1.5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
      >
        <div className="h-9 w-9 flex items-center justify-center rounded-xl bg-linear-to-br from-indigo-500 to-violet-500 text-white font-black shadow-lg shadow-indigo-500/20">
          {initials}
        </div>
        <div className="hidden md:block text-left mr-2">
           <p className="text-xs font-black text-white tracking-tight leading-none uppercase">{user?.displayName || "Member"}</p>
           <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">Research Fellow</p>
        </div>
        <ChevronDown className={`h-4 w-4 text-slate-500 group-hover:text-white transition-all ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-4 w-64 overflow-hidden rounded-[2rem] border border-white/10 bg-[#0B1120] shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300 z-50">
          <div className="p-6 border-b border-white/5 bg-linear-to-br from-indigo-500/5 to-transparent">
            <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Authenticated As</p>
            <p className="text-sm font-black text-white truncate">{user?.email}</p>
          </div>

          <div className="p-3">
            <Link 
              to="/profile" 
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-4 px-4 py-3 rounded-2xl text-slate-400 hover:text-white hover:bg-white/5 transition-all group"
            >
              <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-indigo-500/10 group-hover:bg-indigo-500/20 transition-colors">
                <User className="h-5 w-5 text-indigo-400" />
              </div>
              <span className="text-xs font-black uppercase tracking-widest">My Profile</span>
            </Link>

            <Link 
              to="/setting" 
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-4 px-4 py-3 rounded-2xl text-slate-400 hover:text-white hover:bg-white/5 transition-all group"
            >
              <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-violet-500/10 group-hover:bg-violet-500/20 transition-colors">
                <Settings className="h-5 w-5 text-violet-400" />
              </div>
              <span className="text-xs font-black uppercase tracking-widest">Settings</span>
            </Link>
          </div>

          <div className="p-3 bg-white/[0.02]">
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-rose-500 hover:bg-rose-500/10 transition-all group"
            >
              <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-rose-500/10">
                <LogOut className="h-5 w-5" />
              </div>
              <span className="text-xs font-black uppercase tracking-widest">Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
