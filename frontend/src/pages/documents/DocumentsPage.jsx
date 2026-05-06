import React from 'react';
import { useAuth } from '../../context/AuthContext';

const DocumentsPage = () => {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-base-200">
      <div className="navbar bg-base-100 shadow-md px-8">
        <div className="flex-1">
          <a className="text-xl font-bold text-primary">AI Learning Assistant</a>
        </div>
        <div className="flex-none gap-4">
          <span className="hidden sm:inline-block font-medium">Hello, {user?.name}</span>
        </div>
      </div>

      <div className="p-8">
        <h1 className="text-3xl font-bold mb-8">My Documents</h1>
        <div className="alert alert-info">
          <span>Halaman Documents sedang dalam tahap pengembangan.</span>
        </div>
      </div>
    </div>
  );
};

export default DocumentsPage;
