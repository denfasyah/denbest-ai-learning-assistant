import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Swal from "sweetalert2";
import api from "../../services/api";
import { User, Mail, Lock, ArrowLeft } from "lucide-react";

const schema = yup.object().shape({
  name: yup
    .string()
    .min(3, "Nama minimal 3 karakter")
    .required("Nama wajib diisi"),

  email: yup
    .string()
    .email("Format email tidak valid")
    .matches(/@gmail\.com$/, "Email harus menggunakan domain @gmail.com")
    .required("Email wajib diisi"),

  password: yup
    .string()
    .min(6, "Password minimal 6 karakter")
    .required("Password wajib diisi"),
});

const RegisterPage = () => {
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);

    try {
      await api.post("/auth/register", data);

      Swal.fire({
        icon: "success",
        title: "Register Berhasil",
        text: "Silakan login dengan akun Anda",
        confirmButtonColor: "#3b82f6",
        background: "#050816",
        color: "#fff",
        backdrop: `
    rgba(0,0,0,0.45)
    blur(80px)
  `,
        customClass: {
          popup: "rounded-3xl border border-white/10 shadow-2xl",
          title: "text-white",
          htmlContainer: "text-slate-300",
        },
      });

      navigate("/login");
    } catch (err) {
      const msg = err.response?.data?.message || "Registrasi gagal";

      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: msg,
        background: "#050816",
        color: "#fff",
        backdrop: `
    rgba(0,0,0,0.45)
    blur(80px)
  `,
        customClass: {
          popup: "rounded-3xl border border-white/10 shadow-2xl",
          title: "text-white",
          htmlContainer: "text-slate-300",
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section
      className="
        relative flex min-h-screen items-center justify-center
        overflow-hidden
        bg-linear-to-b from-black via-[#090014] to-violet-950
        px-4 py-10
      "
    >
      {/* BACK BUTTON */}

      {/* BACKGROUND GLOW */}
      <div
        className="
          absolute left-1/2 top-1/2
          h-125 w-125
          -translate-x-1/2 -translate-y-1/2
          rounded-full
          bg-violet-600/20
          blur-[140px]
        "
      />

      {/* CARD */}
      <div
        className="
          relative z-10 w-full max-w-md
          overflow-hidden rounded-3xl
          border border-white/10
          bg-white/5
          p-8 backdrop-blur-xl
          shadow-[0_10px_60px_rgba(0,0,0,0.45)]
        "
      >
        <button
          onClick={() => navigate("/")}
          className="
    absolute left-5 top-5 z-20
    flex items-center gap-2
    rounded-2xl
    border border-white/10
    bg-white/5
    px-4 py-3
    text-sm font-semibold text-slate-200
    backdrop-blur-xl
    transition-all duration-300
    hover:bg-white/10
    hover:shadow-[0_0_25px_rgba(139,92,246,0.25)]
  "
        >
          <ArrowLeft size={17} />
          Back to Home
        </button>
        {/* LOGO */}
        <div className="mb-8 flex flex-col items-center">
          <h1 className="text-3xl font-black text-white mt-16">Daftar </h1>

          <p className="mt-2 text-center text-sm leading-relaxed text-slate-400">
            Buat akun dan mulai belajar lebih cerdas dengan AI
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* NAMA */}
          <div className="mb-5">
            <label className="mb-2 block text-sm font-semibold text-slate-300">
              Nama Lengkap
            </label>

            <div className="relative">
              <User
                size={18}
                className="
                  absolute left-4 top-1/2
                  -translate-y-1/2
                  text-slate-500
                "
              />

              <input
                type="text"
                placeholder="Contoh: John Doe"
                className={`
                  w-full rounded-2xl
                  border bg-white/5
                  py-4 pl-12 pr-4
                  text-sm text-white
                  outline-none backdrop-blur-md
                  transition-all duration-200
                  placeholder:text-slate-500
                  focus:border-blue-500
                  focus:bg-white/8
                  ${errors.name ? "border-red-500/60" : "border-white/10"}
                `}
                {...registerField("name")}
              />
            </div>

            {errors.name && (
              <p className="mt-2 text-xs text-red-400">{errors.name.message}</p>
            )}
          </div>

          {/* EMAIL */}
          <div className="mb-5">
            <label className="mb-2 block text-sm font-semibold text-slate-300">
              Email
            </label>

            <div className="relative">
              <Mail
                size={18}
                className="
                  absolute left-4 top-1/2
                  -translate-y-1/2
                  text-slate-500
                "
              />

              <input
                type="email"
                placeholder="user@gmail.com"
                className={`
                  w-full rounded-2xl
                  border bg-white/5
                  py-4 pl-12 pr-4
                  text-sm text-white
                  outline-none backdrop-blur-md
                  transition-all duration-200
                  placeholder:text-slate-500
                  focus:border-blue-500
                  focus:bg-white/8
                  ${errors.email ? "border-red-500/60" : "border-white/10"}
                `}
                {...registerField("email")}
              />
            </div>

            {errors.email && (
              <p className="mt-2 text-xs text-red-400">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* PASSWORD */}
          <div className="mb-7">
            <label className="mb-2 block text-sm font-semibold text-slate-300">
              Password
            </label>

            <div className="relative">
              <Lock
                size={18}
                className="
                  absolute left-4 top-1/2
                  -translate-y-1/2
                  text-slate-500
                "
              />

              <input
                type="password"
                placeholder="••••••••"
                className={`
                  w-full rounded-2xl
                  border bg-white/5
                  py-4 pl-12 pr-4
                  text-sm text-white
                  outline-none backdrop-blur-md
                  transition-all duration-200
                  placeholder:text-slate-500
                  focus:border-blue-500
                  focus:bg-white/8
                  ${errors.password ? "border-red-500/60" : "border-white/10"}
                `}
                {...registerField("password")}
              />
            </div>

            {errors.password && (
              <p className="mt-2 text-xs text-red-400">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={isLoading}
            className="
              flex w-full items-center justify-center
              rounded-2xl
              bg-linear-to-r from-blue-500 to-violet-500
              px-5 py-4
              text-sm font-bold text-white
              shadow-[0_6px_30px_rgba(59,130,246,0.35)]
              transition-all duration-200
              hover:scale-[1.02]
              hover:shadow-[0_10px_35px_rgba(139,92,246,0.45)]
              disabled:cursor-not-allowed
              disabled:opacity-70
            "
          >
            {isLoading ? "Sedang Memproses..." : "Daftar Sekarang"}
          </button>

          {/* LOGIN */}
          <p className="mt-6 text-center text-sm text-slate-400">
            Sudah punya akun?{" "}
            <Link
              to="/login"
              className="
                font-semibold text-blue-400
                transition-colors duration-200
                hover:text-violet-400
              "
            >
              Login di sini
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
};

export default RegisterPage;
