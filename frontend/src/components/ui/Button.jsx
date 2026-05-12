import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  icon: Icon,
  iconPosition = 'left',
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none';
  
  const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-500/20',
    secondary: 'bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10',
    outline: 'bg-transparent text-slate-300 border border-slate-700 hover:bg-slate-800 hover:border-slate-600',
    ghost: 'bg-transparent text-slate-400 hover:bg-slate-800 hover:text-white',
    danger: 'bg-rose-600 text-white hover:bg-rose-700 shadow-lg shadow-rose-500/20',
    emerald: 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-500/20',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs rounded-lg',
    md: 'px-5 py-2.5 text-sm rounded-xl',
    lg: 'px-6 py-3 text-base rounded-2xl',
    icon: 'p-2 rounded-xl',
  };

  const variantStyles = variants[variant] || variants.primary;
  const sizeStyles = sizes[size] || sizes.md;

  return (
    <button 
      className={`${baseStyles} ${variantStyles} ${sizeStyles} ${className}`}
      {...props}
    >
      {Icon && iconPosition === 'left' && <Icon className={size === 'sm' ? 'h-3.5 w-3.5' : 'h-5 w-5'} />}
      {children}
      {Icon && iconPosition === 'right' && <Icon className={size === 'sm' ? 'h-3.5 w-3.5' : 'h-5 w-5'} />}
    </button>
  );
};

export default Button;
