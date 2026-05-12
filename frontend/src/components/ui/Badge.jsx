import React from 'react';

const Badge = ({ 
  children, 
  variant = 'blue', 
  className = '', 
  icon: Icon,
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium';
  
  const variants = {
    blue: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
    indigo: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    rose: 'bg-rose-500/10 text-rose-400 border border-rose-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    slate: 'bg-slate-500/10 text-slate-400 border border-slate-500/20',
  };

  return (
    <div 
      className={`${baseStyles} ${variants[variant] || variants.blue} ${className}`}
      {...props}
    >
      {Icon && <Icon className="h-3.5 w-3.5" />}
      {children}
    </div>
  );
};

export default Badge;
