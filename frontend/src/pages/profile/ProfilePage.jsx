import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { Camera, Edit3, Save, X, Mail, Calendar, MapPin } from "lucide-react";
import axiosInstance from "../../services/axiosInstance";

const ProfilePage = () => {
  const { user, refreshUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorToast, setErrorToast] = useState(false);

  const [form, setForm] = useState({
    name: user?.name || "Adent",
    email: user?.email || "adent@gmail.com",
    bio: "AI enthusiast yang lagi mendalami full-stack development dan machine learning.",
    joinedDate: "April 2026",
    location: "Indonesia",
  });

  const [draft, setDraft] = useState({ ...form });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosInstance.get('/users/profile');
        if (res.data?.success) {
          const profile = res.data.data;
          
          // Format date joined
          const dateStr = new Date(profile.createdAt).toLocaleDateString('id-ID', {
            month: 'long',
            year: 'numeric'
          });

          const newForm = {
            name: profile.name,
            email: profile.email,
            bio: profile.bio,
            location: profile.location,
            joinedDate: dateStr,
          };
          setForm(newForm);
          setDraft(newForm);
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const initials = form.name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);

  const handleSave = async () => {
    const previousForm = { ...form };
    
    // Optimistic update
    setForm({ ...draft });
    setEditing(false);
    
    try {
      await axiosInstance.patch('/users/profile', {
        name: draft.name,
        location: draft.location,
        bio: draft.bio
      });
      
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
      
      if (refreshUser) await refreshUser();
      
    } catch (err) {
      console.error("Failed to update profile:", err);
      // Revert if failed
      setForm(previousForm);
      setDraft(previousForm);
      setErrorToast(true);
      setTimeout(() => setErrorToast(false), 2500);
    }
  };

  const handleCancel = () => {
    setDraft({ ...form });
    setEditing(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-20">
        <div className="w-full max-w-2xl bg-[#0f0628] rounded-2xl border border-indigo-500/10 p-8">
          <div className="animate-pulse flex flex-col gap-4">
            <div className="h-24 bg-white/5 rounded-xl w-full"></div>
            <div className="h-6 bg-white/5 rounded-md w-1/3"></div>
            <div className="h-4 bg-white/5 rounded-md w-1/2"></div>
            <div className="h-4 bg-white/5 rounded-md w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-20">

      {/* Toast */}
      {saved && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2 bg-green-950 border border-green-600 text-green-400 text-sm font-medium px-5 py-3 rounded-xl animate-in fade-in slide-in-from-top-2 duration-300">
          ✓ Profil berhasil disimpan
        </div>
      )}
      {errorToast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2 bg-red-950 border border-red-600 text-red-400 text-sm font-medium px-5 py-3 rounded-xl animate-in fade-in slide-in-from-top-2 duration-300">
          ✗ Gagal menyimpan, coba lagi
        </div>
      )}

      <div className="w-full max-w-2xl flex flex-col gap-4">

        {/* ── Profile Card ── */}
        <div className="rounded-2xl border border-indigo-500/10 overflow-hidden bg-[#0f0628]">

          {/* Cover */}
          <div className="h-28 relative bg-gradient-to-br from-indigo-800 via-violet-700 to-indigo-700">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_15%_50%,rgba(255,255,255,0.07)_0%,transparent_55%),radial-gradient(ellipse_at_85%_30%,rgba(255,255,255,0.05)_0%,transparent_50%)]" />
            <div className="absolute bottom-3 right-4 flex gap-2">
              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium text-white bg-black/35 border border-white/20 backdrop-blur-sm cursor-pointer hover:bg-black/50 transition-colors"
                >
                  <Edit3 size={12} /> Edit Profil
                </button>
              ) : (
                <>
                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs text-white/70 bg-black/35 border border-white/15 backdrop-blur-sm cursor-pointer hover:bg-black/50 transition-colors"
                  >
                    <X size={12} /> Batal
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold text-white bg-indigo-500/90 backdrop-blur-sm cursor-pointer hover:bg-indigo-500 transition-colors"
                  >
                    <Save size={12} /> Simpan
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Body */}
          <div className="px-6 pb-6">
            {/* Avatar + streak */}
            <div className="flex items-end justify-between mb-4">
              <div className="relative -mt-11">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-2xl font-bold text-white border-4 border-[#0f0628] tracking-tight select-none">
                  {initials}
                </div>
                <button className="absolute bottom-0.5 right-0.5 w-6 h-6 rounded-full bg-[#1e1050] border-2 border-[#0f0628] flex items-center justify-center text-indigo-300 cursor-pointer hover:bg-[#2d1b6e] transition-colors">
                  <Camera size={11} />
                </button>
              </div>

            </div>

            {/* Name + bio + meta */}
            {!editing ? (
              <>
                <h1 className="text-slate-100 text-xl font-bold tracking-tight mb-1">{form.name}</h1>
                <p className="text-slate-400 text-sm leading-relaxed mb-3 max-w-sm">{form.bio}</p>
                <div className="flex flex-wrap gap-4">
                  {[
                    { Icon: Mail, text: form.email },
                    { Icon: MapPin, text: form.location },
                    { Icon: Calendar, text: `Bergabung ${form.joinedDate}` },
                  ].map(({ Icon, text }) => (
                    <span key={text} className="flex items-center gap-1.5 text-slate-500 text-xs">
                      <Icon size={12} /> {text}
                    </span>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex flex-col gap-3">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { field: "name", label: "Nama Lengkap", placeholder: "Nama kamu" },
                    { field: "location", label: "Lokasi", placeholder: "e.g. Indonesia" },
                  ].map(({ field, label, placeholder }) => (
                    <div key={field} className="flex flex-col gap-1.5">
                      <label className="text-[0.68rem] text-slate-500 uppercase tracking-widest font-medium">{label}</label>
                      <input
                        value={draft[field] || ""}
                        onChange={(e) => setDraft((d) => ({ ...d, [field]: e.target.value }))}
                        placeholder={placeholder}
                        className="w-full bg-white/[0.04] border border-indigo-400/25 focus:border-indigo-400/70 rounded-lg px-3.5 py-2.5 text-slate-200 text-sm outline-none transition-colors placeholder:text-slate-600 font-[inherit]"
                      />
                    </div>
                  ))}
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[0.68rem] text-slate-500 uppercase tracking-widest font-medium">Bio</label>
                  <textarea
                    value={draft.bio || ""}
                    onChange={(e) => setDraft((d) => ({ ...d, bio: e.target.value }))}
                    rows={3}
                    placeholder="Ceritakan sedikit tentang dirimu..."
                    className="w-full bg-white/[0.04] border border-indigo-400/25 focus:border-indigo-400/70 rounded-lg px-3.5 py-2.5 text-slate-200 text-sm outline-none resize-none transition-colors placeholder:text-slate-600 leading-relaxed font-[inherit]"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`@keyframes slideIn { from { opacity:0; transform:translateY(-10px); } to { opacity:1; transform:translateY(0); } }`}</style>
    </div>
  );
};

export default ProfilePage;