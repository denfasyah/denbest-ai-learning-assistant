import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  Bell, Shield, Monitor, KeyRound, Mail,
  Trash2, ChevronRight, AlertTriangle,
} from "lucide-react";
import axiosInstance from "../../services/axiosInstance";

const SettingPage = () => {
  const { logout } = useAuth();

  const [prefs, setPrefs] = useState({
    allNotifications: true,
    darkMode: true,
  });

  const [loadingPrefs, setLoadingPrefs] = useState(true);

  useEffect(() => {
    const fetchPrefs = async () => {
      try {
        const res = await axiosInstance.get('/users/preferences');
        if (res.data?.success) {
          setPrefs(prev => ({
            ...prev,
            allNotifications: res.data.data.notifications_enabled
          }));
        }
      } catch (error) {
        console.error('Failed to fetch preferences', error);
      } finally {
        setLoadingPrefs(false);
      }
    };
    fetchPrefs();
  }, []);

  const toggleNotifications = async () => {
    const newVal = !prefs.allNotifications;
    setPrefs(p => ({ ...p, allNotifications: newVal }));
    try {
      await axiosInstance.patch('/users/preferences', {
        notifications_enabled: newVal
      });
      // Show toast on success
      setToastMsg(newVal ? '✓ Notifikasi diaktifkan' : '✓ Notifikasi dinonaktifkan');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2500);
    } catch (err) {
      console.error('Failed to update preferences', err);
      setPrefs(p => ({ ...p, allNotifications: !newVal })); // revert
    }
  };

  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [toastErr, setToastErr] = useState("");
  const [showErrToast, setShowErrToast] = useState(false);

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [pwForm, setPwForm] = useState({ current: "", new: "", confirm: "" });
  const [pwLoading, setPwLoading] = useState(false);

  const [showEmailForm, setShowEmailForm] = useState(false);
  const [emailForm, setEmailForm] = useState({ new: "", confirm: "" });
  const [emailLoading, setEmailLoading] = useState(false);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handlePwSave = async () => {
    if (!pwForm.current || !pwForm.new || pwForm.new !== pwForm.confirm || pwForm.new.length < 8) return;
    setPwLoading(true);
    try {
      await axiosInstance.patch('/users/change-password', {
        currentPassword: pwForm.current,
        newPassword: pwForm.new
      });
      setShowPasswordForm(false);
      setPwForm({ current: "", new: "", confirm: "" });
      setToastMsg("✓ Password berhasil diperbarui");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2500);
    } catch (error) {
      setToastErr(error.response?.data?.message || "✗ Password saat ini tidak sesuai");
      setShowErrToast(true);
      setTimeout(() => setShowErrToast(false), 2500);
    } finally {
      setPwLoading(false);
    }
  };

  const handleEmailSave = async () => {
    if (!emailForm.new || emailForm.new !== emailForm.confirm) return;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailForm.new)) {
      setToastErr("✗ Format email tidak valid");
      setShowErrToast(true);
      setTimeout(() => setShowErrToast(false), 2500);
      return;
    }
    
    setEmailLoading(true);
    try {
      await axiosInstance.patch('/users/change-email', {
        newEmail: emailForm.new
      });
      setShowEmailForm(false);
      setEmailForm({ new: "", confirm: "" });
      setToastMsg("✓ Email berhasil diperbarui");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2500);
    } catch (error) {
      setToastErr(error.response?.data?.message || "✗ Email sudah digunakan atau terjadi kesalahan");
      setShowErrToast(true);
      setTimeout(() => setShowErrToast(false), 2500);
    } finally {
      setEmailLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto pb-16">

      {/* Toasts */}
      {showToast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2 bg-green-950 border border-green-600 text-green-400 text-sm font-medium px-5 py-3 rounded-xl animate-in fade-in slide-in-from-top-2 duration-300">
          {toastMsg}
        </div>
      )}
      {showErrToast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2 bg-red-950 border border-red-600 text-red-400 text-sm font-medium px-5 py-3 rounded-xl animate-in fade-in slide-in-from-top-2 duration-300">
          {toastErr}
        </div>
      )}

      <div className="flex flex-col gap-4">

        {/* ── Notifikasi ── */}
        <Card title="Notifikasi" icon={<Bell size={16} className="text-indigo-400" />}>
          <ToggleRow
            label="All Notifications"
            desc="Aktifkan atau nonaktifkan semua notifikasi"
            on={prefs.allNotifications}
            onToggle={toggleNotifications}
            disabled={loadingPrefs}
          />
        </Card>

        {/* ── Tampilan ── */}
        <Card title="Tampilan" icon={<Monitor size={16} className="text-indigo-400" />}>
          <ToggleRow
            label={
              <span className="flex items-center gap-2">
                Dark Mode
                <span className="bg-indigo-500/20 text-indigo-300 text-[9px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded-md border border-indigo-500/30">
                  Coming Soon
                </span>
              </span>
            }
            desc="Tema gelap untuk kenyamanan mata"
            on={prefs.darkMode}
            onToggle={() => {}}
            disabled={true}
          />
        </Card>

        {/* ── Keamanan ── */}
        <Card title="Keamanan" icon={<Shield size={16} className="text-indigo-400" />}>

          {/* Ganti Password */}
          <div className="border-b border-white/[0.04]">
            <button
              onClick={() => { setShowPasswordForm(!showPasswordForm); setShowEmailForm(false); }}
              className="w-full flex items-center justify-between py-3.5 bg-transparent border-none cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="bg-indigo-500/10 rounded-lg p-2 flex">
                  <KeyRound size={14} className="text-indigo-400" />
                </div>
                <div className="text-left">
                  <p className="text-slate-200 text-sm font-medium mb-0.5">Ganti Password</p>
                  <p className="text-slate-500 text-xs">Perbarui kata sandi akun kamu</p>
                </div>
              </div>
              <ChevronRight
                size={14}
                className="text-slate-600 transition-transform duration-200"
                style={{ transform: showPasswordForm ? "rotate(90deg)" : "none" }}
              />
            </button>

            {showPasswordForm && (
              <div className="pb-4 flex flex-col gap-3">
                {[
                  { key: "current", label: "Password Saat Ini", placeholder: "••••••••", type: "password" },
                  { key: "new", label: "Password Baru", placeholder: "Min. 8 karakter", type: "password" },
                  { key: "confirm", label: "Konfirmasi Password Baru", placeholder: "Ulangi password baru", type: "password" },
                ].map(({ key, label, placeholder, type }) => (
                  <div key={key} className="flex flex-col gap-1.5">
                    <label className="text-[0.68rem] text-slate-500 uppercase tracking-widest font-medium">{label}</label>
                    <input
                      type={type}
                      value={pwForm[key]}
                      onChange={(e) => setPwForm((f) => ({ ...f, [key]: e.target.value }))}
                      placeholder={placeholder}
                      className="w-full bg-white/[0.04] border border-indigo-400/20 focus:border-indigo-400/60 rounded-lg px-3.5 py-2.5 text-slate-200 text-sm outline-none transition-colors placeholder:text-slate-600 font-[inherit]"
                    />
                  </div>
                ))}
                {pwForm.new && pwForm.new.length < 8 && (
                  <p className="text-red-400 text-xs mt-0.5">Password baru minimal 8 karakter</p>
                )}
                {pwForm.new && pwForm.confirm && pwForm.new !== pwForm.confirm && (
                  <p className="text-red-400 text-xs mt-0.5">Password tidak cocok</p>
                )}
                <button
                  onClick={handlePwSave}
                  disabled={pwLoading || !pwForm.current || !pwForm.new || pwForm.new !== pwForm.confirm || pwForm.new.length < 8}
                  className="w-full bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-sm font-semibold py-2.5 rounded-lg cursor-pointer border-none mt-1 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {pwLoading ? "Menyimpan..." : "Simpan Password"}
                </button>
              </div>
            )}
          </div>

          {/* Ganti Email */}
          <div>
            <button
              onClick={() => { setShowEmailForm(!showEmailForm); setShowPasswordForm(false); }}
              className="w-full flex items-center justify-between py-3.5 bg-transparent border-none cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="bg-indigo-500/10 rounded-lg p-2 flex">
                  <Mail size={14} className="text-indigo-400" />
                </div>
                <div className="text-left">
                  <p className="text-slate-200 text-sm font-medium mb-0.5">Ganti Email</p>
                  <p className="text-slate-500 text-xs">Perbarui alamat email akun kamu</p>
                </div>
              </div>
              <ChevronRight
                size={14}
                className="text-slate-600 transition-transform duration-200"
                style={{ transform: showEmailForm ? "rotate(90deg)" : "none" }}
              />
            </button>

            {showEmailForm && (
              <div className="pb-4 flex flex-col gap-3">
                {[
                  { key: "new", label: "Email Baru", placeholder: "email@contoh.com", type: "email" },
                  { key: "confirm", label: "Konfirmasi Email Baru", placeholder: "Ulangi email baru", type: "email" },
                ].map(({ key, label, placeholder, type }) => (
                  <div key={key} className="flex flex-col gap-1.5">
                    <label className="text-[0.68rem] text-slate-500 uppercase tracking-widest font-medium">{label}</label>
                    <input
                      type={type}
                      value={emailForm[key]}
                      onChange={(e) => setEmailForm((f) => ({ ...f, [key]: e.target.value }))}
                      placeholder={placeholder}
                      className="w-full bg-white/[0.04] border border-indigo-400/20 focus:border-indigo-400/60 rounded-lg px-3.5 py-2.5 text-slate-200 text-sm outline-none transition-colors placeholder:text-slate-600 font-[inherit]"
                    />
                  </div>
                ))}
                {emailForm.new && emailForm.confirm && emailForm.new !== emailForm.confirm && (
                  <p className="text-red-400 text-xs mt-0.5">Email tidak cocok</p>
                )}
                <button
                  onClick={handleEmailSave}
                  disabled={emailLoading || !emailForm.new || emailForm.new !== emailForm.confirm}
                  className="w-full bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-sm font-semibold py-2.5 rounded-lg cursor-pointer border-none mt-1 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {emailLoading ? "Menyimpan..." : "Simpan Email"}
                </button>
              </div>
            )}
          </div>
        </Card>

        {/* ── Danger Zone ── */}
        <div className="bg-red-500/[0.04] border border-red-500/[0.18] rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-1.5">
            <AlertTriangle size={15} className="text-red-500" />
            <p className="text-red-500 text-xs font-bold uppercase tracking-widest m-0">Danger Zone</p>
          </div>
          <p className="text-slate-500 text-xs leading-relaxed mb-5">
            Menghapus akun bersifat permanen. Semua dokumen, summary, flashcard, dan riwayat belajar kamu akan terhapus dan tidak dapat dipulihkan.
          </p>

          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-red-500/10 border border-red-500/25 text-red-400 text-sm font-medium rounded-lg cursor-pointer hover:bg-red-500/15 transition-colors"
            >
              <Trash2 size={13} /> Hapus Akun
            </button>
          ) : (
            <div className="bg-red-500/[0.08] border border-red-500/20 rounded-xl p-4">
              <p className="text-red-300 text-sm font-medium mb-3">
                Yakin ingin menghapus akun? Tindakan ini tidak bisa dibatalkan.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 bg-white/5 border border-white/10 text-slate-400 text-xs rounded-lg cursor-pointer hover:bg-white/10 transition-colors"
                >
                  Batal
                </button>
                <button className="px-4 py-2 bg-red-500 text-white text-xs font-semibold rounded-lg cursor-pointer hover:bg-red-600 transition-colors border-none">
                  Ya, Hapus Akun Saya
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

// ─── Helper Components ────────────────────────────────────────────────────────

const Card = ({ title, icon, children }) => (
  <div className="bg-[#0f0628] border border-white/[0.05] rounded-2xl p-6">
    <div className="flex items-center gap-2 mb-4">
      <div className="bg-indigo-500/10 rounded-lg p-1.5 flex">
        {icon}
      </div>
      <p className="text-slate-200 font-semibold text-sm m-0">{title}</p>
    </div>
    {children}
  </div>
);

const ToggleRow = ({ label, desc, on, onToggle, disabled }) => (
  <div className={`flex items-center justify-between py-3.5 border-b border-white/[0.04] ${disabled ? "opacity-50 pointer-events-none" : ""}`}>
    <div>
      <p className="text-slate-200 text-sm font-medium mb-0.5">{label}</p>
      <p className="text-slate-500 text-xs">{desc}</p>
    </div>
    <button
      onClick={onToggle}
      disabled={disabled}
      className="relative flex-shrink-0 w-10 h-[22px] rounded-full border-none cursor-pointer transition-colors duration-200"
      style={{ background: on ? "#818cf8" : "rgba(255,255,255,0.08)" }}
    >
      <span
        className="absolute top-[3px] w-4 h-4 rounded-full bg-white transition-all duration-200 block"
        style={{ left: on ? "20px" : "3px" }}
      />
    </button>
  </div>
);

export default SettingPage;