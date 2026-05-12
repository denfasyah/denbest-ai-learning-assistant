import React from 'react';

const Select = ({ 
  label, 
  options = [], 
  className = '', 
  ...props 
}) => {
  return (
    <div className="space-y-1.5">
      {label && <label className="text-sm font-medium text-slate-300 ml-1">{label}</label>}
      <select
        className={`
          w-full rounded-xl border border-slate-700 bg-slate-900/50 py-2.5 px-4 
          text-sm text-white transition-all outline-none cursor-pointer
          focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
          ${className}
        `}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-slate-900 text-white">
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
