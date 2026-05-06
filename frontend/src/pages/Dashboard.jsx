import React from 'react';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';

const Dashboard = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Swal.fire({
      title: 'Konfirmasi Keluar',
      text: 'Anda yakin ingin keluar dari akun?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Ya, Keluar!',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        Swal.fire({
          title: 'Logout Berhasil',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
      }
    });
  };
  
  return (
    <div className="min-h-screen bg-base-200">
      {/* Navbar */}
      <div className="navbar bg-base-100 shadow-md px-8">
        <div className="flex-1">
          <a className="text-xl font-bold text-primary">AI Learning Assistant</a>
        </div>
        <div className="flex-none gap-4">
          <span className="hidden sm:inline-block font-medium">Hello, {user?.name}</span>
          <button onClick={handleLogout} className="btn btn-outline btn-error btn-sm">Logout</button>
        </div>
      </div>

      <div className="p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            <p className="opacity-70">Materi Perkuliahan dan Dokumen Anda</p>
          </div>
          <button className="btn btn-primary mt-4 md:mt-0">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Upload PDF
          </button>
        </div>

        <div className="bg-base-100 rounded-box p-8 shadow-sm text-center">
          <div className="py-20 text-center">
            <h3 className="text-xl font-semibold mb-2">Belum ada dokumen</h3>
            <p className="opacity-60 mb-6">Mulai unggah materi kuliah Anda untuk menggunakan AI Assistant</p>
            <button className="btn btn-primary font-bold shadow-lg">Mulai Upload</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
