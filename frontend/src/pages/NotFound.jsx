import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="page-container">
      <div className="text-center">
        <h1 className="text-9xl font-black text-primary opacity-20">404</h1>
        <div className="relative -top-16">
          <h2 className="text-4xl font-bold mb-4">Halaman Tidak Ditemukan</h2>
          <p className="opacity-60 mb-8 max-w-sm mx-auto">
            Maaf, halaman yang Anda cari tidak tersedia atau telah dipindahkan.
          </p>
          <Link to="/" className="btn btn-primary px-8">
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
