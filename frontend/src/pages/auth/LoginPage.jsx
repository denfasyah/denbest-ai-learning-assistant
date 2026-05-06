import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Swal from 'sweetalert2';
import { useAuth } from '../../context/AuthContext';

const schema = yup.object().shape({
  email: yup.string().email('Format email tidak valid').required('Email wajib diisi'),
  password: yup.string().required('Password wajib diisi'),
});

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
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
    <div className="page-container">
      <div className="card w-full max-w-md bg-base-100 shadow-2xl">
        <div className="card-body">
          <h2 className="card-title justify-center text-3xl font-extrabold mb-6 text-primary">Login</h2>
          
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-control w-full mb-4">
              <label className="label">
                <span className="label-text font-bold">Email</span>
              </label>
              <input 
                type="email" 
                placeholder="user@gmail.com" 
                className={`input input-bordered w-full ${errors.email ? 'input-error' : ''}`}
                {...register('email')}
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
                {...register('password')}
              />
              {errors.password && <p className="text-error text-xs mt-1">{errors.password.message}</p>}
            </div>
            
            <div className="card-actions justify-center flex-col gap-4">
              <button 
                type="submit"
                className={`btn btn-primary w-full shadow-lg ${isLoading ? 'loading' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Masuk Dashboard'}
              </button>
              
              <p className="text-center text-sm">
                Belum punya akun? <Link to="/register" className="link link-primary font-semibold">Daftar sekarang</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
