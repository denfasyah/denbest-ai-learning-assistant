import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Swal from 'sweetalert2';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, ArrowRight } from 'lucide-react';

const schema = yup.object().shape({
  email: yup.string().email('Format email tidak valid').required('Email wajib diisi'),
  password: yup.string().required('Password wajib diisi'),
});

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);

    try {
      await login(data.email, data.password);

      Swal.fire({
        icon: 'success',
        title: 'Login Berhasil',
        text: 'Selamat datang kembali!',
        timer: 1500,
        showConfirmButton: false,
      });

      navigate('/dashboard');
    } catch (err) {
      const msg = err.message || 'Email atau password salah';

      Swal.fire({
        icon: 'error',
        title: 'Login Gagal',
        text: msg,
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
        bg-linear-to-b from-black via-[#050816] to-violet-950
        px-5 py-10
      "
    >
      {/* Background Glow */}
      <div
        className="
          absolute left-1/2 top-1/2
          h-125 w-125
          -translate-x-1/2 -translate-y-1/2
          rounded-full
          bg-violet-600/20
          blur-3xl
        "
      />

      <div
        className="
          relative z-10
          flex w-full max-w-5xl
          overflow-hidden rounded-4xl
          border border-white/10
          bg-white/3
          shadow-[0_20px_80px_rgba(0,0,0,0.45)]
          backdrop-blur-xl
        "
      >
        {/* LEFT SIDE */}
        <div
          className="
            hidden flex-1 flex-col justify-between
            bg-linear-to-br from-blue-500/10 to-violet-500/10
            p-10
            lg:flex
          "
        >
          <div>
            {/* Logo */}
            <Link
              to="/"
              className="mb-14 flex items-center gap-3 text-white no-underline"
            >
              <div
                className="
                  flex h-12 w-12 items-center justify-center
                  rounded-2xl
                  shadow-[0_8px_30px_rgba(59,130,246,0.35)]
                "
              >
               <img src="/logo.png" alt="" className="w-full"/>
              </div>

              <span className="text-2xl font-black tracking-[-1px]">
                Ai<span className="text-violet-400">Den</span>
              </span>
            </Link>

            {/* Text */}
            <h1
              className="
                max-w-sm
                text-5xl font-black leading-tight
                tracking-[-2px]
                text-white
              "
            >
              Welcome
              <br />

              Back.
            </h1>

            <p className="mt-6 max-w-md text-base leading-relaxed text-slate-400">
              Masuk kembali ke platform AI Learning Assistant dan lanjutkan
              pengalaman belajar cerdasmu bersama AI.
            </p>
          </div>

          {/* Bottom */}
          <div
            className="
              rounded-3xl border border-white/10
              bg-white/3
              p-6
            "
          >
            <p className="text-sm leading-relaxed text-slate-300">
              “Belajar jadi lebih cepat dengan AI yang memahami isi dokumenmu.”
            </p>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="w-full lg:w-120">
          <div className="p-7 sm:p-10">
            {/* Mobile Logo */}
            <div className="mb-10 flex justify-center lg:hidden">
              <Link
                to="/"
                className="flex items-center gap-3 text-white no-underline"
              >
                <div
                  className="
                    flex h-11 w-11 items-center justify-center
                    rounded-2xl
                  "
                >
                   <img src="/logo.png" alt="" className="h-10 w-10 "/>
                </div>

                <span className="text-2xl font-black">
                  Ai<span className="text-violet-400">Den</span>
                </span>
              </Link>
            </div>

            {/* Header */}
            <div className="mb-8 text-center lg:text-left">
              <h2 className="text-4xl font-black tracking-[-1px] text-white">
                Login
              </h2>

              <p className="mt-2 text-sm text-slate-400">
                Masuk untuk melanjutkan ke dashboard.
              </p>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Email */}
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
                      border border-white/10
                      bg-white/3
                      py-4 pl-12 pr-4
                      text-white outline-none
                      transition-all duration-200
                      placeholder:text-slate-500
                      focus:border-blue-500
                      focus:bg-white/5
                      ${
                        errors.email
                          ? 'border-red-500'
                          : ''
                      }
                    `}
                    {...register('email')}
                  />
                </div>

                {errors.email && (
                  <p className="mt-2 text-xs text-red-400">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
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
                      border border-white/10
                      bg-white/3
                      py-4 pl-12 pr-4
                      text-white outline-none
                      transition-all duration-200
                      placeholder:text-slate-500
                      focus:border-blue-500
                      focus:bg-white/5
                      ${
                        errors.password
                          ? 'border-red-500'
                          : ''
                      }
                    `}
                    {...register('password')}
                  />
                </div>

                {errors.password && (
                  <p className="mt-2 text-xs text-red-400">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="
                  group flex w-full items-center justify-center gap-2
                  rounded-2xl
                  bg-linear-to-r from-blue-500 to-violet-500
                  px-6 py-4
                  text-sm font-bold text-white
                  shadow-[0_10px_35px_rgba(59,130,246,0.35)]
                  transition-all duration-300
                  hover:-translate-y-1
                  hover:shadow-[0_14px_45px_rgba(139,92,246,0.45)]
                  disabled:cursor-not-allowed
                  disabled:opacity-70
                "
              >
                {isLoading ? 'Processing...' : 'Masuk Dashboard'}

                {!isLoading && (
                  <ArrowRight
                    size={17}
                    className="
                      transition-transform duration-300
                      group-hover:translate-x-1
                    "
                  />
                )}
              </button>

              {/* Register */}
              <p className="mt-7 text-center text-sm text-slate-400">
                Belum punya akun?{' '}
                <Link
                  to="/register"
                  className="
                    font-semibold text-blue-400
                    transition-colors duration-200
                    hover:text-violet-400
                  "
                >
                  Daftar sekarang
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;