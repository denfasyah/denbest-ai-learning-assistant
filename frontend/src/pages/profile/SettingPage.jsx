import { useState } from "react";
import {
  Settings,
  Bell,
  Shield,
  Moon,
  User,
  Lock,
  Trash2,
  LogOut,
  ChevronRight,
  Mail,
  Save,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Badge from "../../components/ui/Badge";

const SettingsPage = () => {
  const { user } = useAuth();

  const [darkMode, setDarkMode] = useState(true);
  const [emailNotification, setEmailNotification] = useState(true);
  const [aiAutoSave, setAiAutoSave] = useState(true);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* HERO SECTION */}
      <Card variant="glass" className="p-7">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-linear-to-br from-indigo-500 to-violet-500 shadow-lg shadow-indigo-500/20">
            <Settings className="h-8 w-8 text-white" />
          </div>
          <div className="max-w-3xl">
            <Badge variant="indigo" className="mb-3">System Control</Badge>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white">
              Workspace Settings
            </h1>
            <p className="mt-4 leading-relaxed text-slate-400 font-medium">
              Manage your profile, security preferences, and AI learning engine configuration.
            </p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
        {/* LEFT COLUMN */}
        <div className="space-y-8 xl:col-span-2">
          {/* ACCOUNT SETTINGS */}
          <Card className="p-8">
            <div className="flex items-center gap-4 mb-10">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
                <User className="h-6 w-6 text-indigo-400" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white tracking-tight leading-none">Account Identity</h2>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-2">Public Profile Information</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Input label="Full Name" defaultValue={user?.displayName || "Research Fellow"} />
              <Input label="Email Address" defaultValue={user?.email || "user@example.com"} />
            </div>

            <Button variant="primary" icon={Save} className="mt-10 rounded-2xl h-14 px-8 font-black italic tracking-tight">
              SAVE CHANGES
            </Button>
          </Card>

          {/* SECURITY */}
          <Card className="p-8">
            <div className="flex items-center gap-4 mb-10">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                <Shield className="h-6 w-6 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white tracking-tight leading-none">Security Access</h2>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-2">Account Protection Layers</p>
              </div>
            </div>

            <div className="space-y-4">
              {[
                { label: "Update Password", desc: "Modify your access credentials", icon: Lock },
                { label: "Active Sessions", desc: "Manage logged in devices", icon: LogOut },
              ].map((item, idx) => (
                <button key={idx} className="w-full flex items-center justify-between p-5 rounded-2xl bg-white/2 border border-white/5 hover:bg-white/4 transition-all group">
                  <div className="flex items-center gap-5">
                    <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-white/5">
                      <item.icon className="h-5 w-5 text-slate-400 group-hover:text-white transition-colors" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-sm font-black text-white uppercase tracking-tight">{item.label}</h3>
                      <p className="text-xs font-medium text-slate-500 mt-1">{item.desc}</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-slate-700 group-hover:translate-x-1 transition-all" />
                </button>
              ))}
            </div>
          </Card>

          {/* DANGER ZONE */}
          <Card className="p-8 border-rose-500/20 bg-rose-500/2">
             <h2 className="text-xl font-black text-rose-500 tracking-tight mb-2 uppercase">Destructive Zone</h2>
             <p className="text-sm font-medium text-slate-500 mb-8 leading-relaxed">
               Irreversible actions. Deleting your account will purge all documents, summaries, and AI history permanently.
             </p>
             <Button variant="secondary" icon={Trash2} className="rounded-xl h-12 px-6 font-black text-rose-500 border-rose-500/20 hover:bg-rose-500/10">
               DELETE ACCOUNT
             </Button>
          </Card>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-8">
          {/* PREFERENCES */}
          <Card className="p-8">
            <h2 className="text-xl font-black text-white tracking-tight mb-8">Preferences</h2>
            
            <div className="space-y-6">
              {[
                { label: "Dark Mode", desc: "OLED optimized display", icon: Moon, state: darkMode, setState: setDarkMode },
                { label: "AI Notifications", desc: "Smart alert frequency", icon: Bell, state: emailNotification, setState: setEmailNotification },
                { label: "AI Auto Save", desc: "Commit insights to notes", icon: Mail, state: aiAutoSave, setState: setAiAutoSave },
              ].map((pref, idx) => (
                <div key={idx} className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/5">
                      <pref.icon className="h-4 w-4 text-slate-400" />
                    </div>
                    <div>
                      <h3 className="text-xs font-black text-white uppercase tracking-tight">{pref.label}</h3>
                      <p className="text-[10px] font-bold text-slate-500 mt-1">{pref.desc}</p>
                    </div>
                  </div>

                  <button 
                    onClick={() => pref.setState(!pref.state)}
                    className={`relative h-6 w-11 rounded-full transition-all duration-300 ${pref.state ? 'bg-indigo-500' : 'bg-white/10'}`}
                  >
                    <div className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-all duration-300 ${pref.state ? 'left-6' : 'left-1'}`} />
                  </button>
                </div>
              ))}
            </div>
          </Card>

          {/* CONNECTED SERVICES */}
          <Card className="p-8">
             <h2 className="text-xl font-black text-white tracking-tight mb-8">Integrations</h2>
             <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/2 border border-white/5">
                   <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center">G</div>
                      <div>
                         <h3 className="text-xs font-black text-white uppercase tracking-tight">Google</h3>
                         <p className="text-[10px] font-bold text-emerald-500 mt-0.5">Connected</p>
                      </div>
                   </div>
                </div>
                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/2 border border-white/5">
                   <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center">GH</div>
                      <div>
                         <h3 className="text-xs font-black text-white uppercase tracking-tight">Github</h3>
                         <p className="text-[10px] font-bold text-slate-500 mt-0.5">Disconnected</p>
                      </div>
                   </div>
                   <button className="text-[10px] font-black text-indigo-400 hover:text-indigo-300 uppercase tracking-widest px-3">Connect</button>
                </div>
             </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
