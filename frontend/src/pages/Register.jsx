import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Swal from 'sweetalert2';
import api from '../services/api';

const schema = yup.object().shape({
  name: yup.string().min(3, 'Nama minimal 3 karakter').required('Nama wajib diisi'),
  email: yup.string()
    .email('Format email tidak valid')
    .matches(/@gmail\.com$/, 'Email harus menggunakan domain @gmail.com')
    .required('Email wajib diisi'),
  password: yup.string().min(6, 'Password minimal 6 karakter').required('Password wajib diisi'),
});

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const { register: registerField, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await api.post('/auth/register', data);

      Swal.fire({
        icon: 'success',
        title: 'Register Berhasil',
        text: 'Silakan login dengan akun Anda',
        confirmButtonColor: '#3b82f6',
      });

      navigate('/login');
    } catch (err) {
      const msg = err.response?.data?.message || 'Registrasi gagal';
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: msg,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="card w-full max-w-md bg-base-100 shadow-2xl">
        <div className="card-body">
          <h2 className="card-title justify-center text-3xl font-extrabold mb-6 text-primary">Daftar Akun</h2>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-control w-full mb-4">
              <label className="label">
                <span className="label-text font-bold">Nama Lengkap</span>
              </label>
              <input
                type="text"
                placeholder="Contoh: John Doe"
                className={`input input-bordered w-full ${errors.name ? 'input-error' : ''}`}
                {...registerField('name')}
              />
              {errors.name && <p className="text-error text-xs mt-1">{errors.name.message}</p>}
            </div>

            <div className="form-control w-full mb-4">
              <label className="label">
                <span className="label-text font-bold">Email</span>
              </label>
              <input
                type="email"
                placeholder="user@gmail.com"
                className={`input input-bordered w-full ${errors.email ? 'input-error' : ''}`}
                {...registerField('email')}
              />
              {errors.email && <p className="text-error text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div className="form-control w-full mb-6">
              <label className="label">
                <span className="label-text font-bold">Password</span>
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className={`input input-bordered w-full ${errors.password ? 'input-error' : ''}`}
                {...registerField('password')}
              />
              {errors.password && <p className="text-error text-xs mt-1">{errors.password.message}</p>}
            </div>

            <div className="card-actions justify-center flex-col gap-4">
              <button
                type="submit"
                className={`btn btn-primary w-full shadow-lg ${isLoading ? 'loading' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? 'Sedang Memproses...' : 'Daftar Sekarang'}
              </button>

              <p className="text-center text-sm">
                Sudah punya akun? <Link to="/login" className="link link-primary font-semibold">Login di sini</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
