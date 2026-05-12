import React from 'react';

const Input = ({ 
  label, 
  error, 
  className = '', 
  icon: Icon,
  ...props 
}) => {
  return (
    <div className="w-full space-y-1.5">
      {label && <label className="text-sm font-medium text-slate-300 ml-1">{label}</label>}
      <div className="relative group">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors">
            <Icon className="h-5 w-5" />
          </div>
        )}
        <input
          className={`
            w-full rounded-xl border border-slate-700 bg-slate-900/50 py-2.5 px-4 
            text-sm text-white placeholder-slate-500 transition-all outline-none
            focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
            ${Icon ? 'pl-11' : ''}
            ${error ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-rose-500 ml-1">{error}</p>}
    </div>
  );
};

export default Input;
