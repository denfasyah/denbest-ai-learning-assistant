import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-secondary flex flex-col items-center justify-center text-white p-4">
      <div className="text-center max-w-2xl px-6 py-12 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 shadow-2xl">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight">
          AI Learning <span className="text-accent">Assistant</span>
        </h1>
        <p className="text-xl md:text-2xl mb-10 opacity-90 font-medium">
          Pahami materi perkuliahan lebih cepat dengan bantuan AI yang cerdas dan context-aware.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/login" 
            className="btn btn-lg btn-accent px-10 shadow-xl hover:scale-105 transition-transform"
          >
            Get Started
          </Link>
          <Link 
            to="/register" 
            className="btn btn-lg btn-outline text-white hover:bg-white hover:text-primary transition-all px-10"
          >
            Register
          </Link>
        </div>
      </div>
      
      <div className="mt-12 text-sm opacity-50 flex gap-8">
        <span>Context-Aware Chat</span>
        <span>AI PDF Summary</span>
        <span>Quiz Generator</span>
      </div>
    </div>
  );
};

export default Landing;
