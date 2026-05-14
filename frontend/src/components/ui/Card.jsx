

const Card = ({ 
  children, 
  className = '', 
  variant = 'default',
  hover = false,
  ...props 
}) => {
  const baseStyles = 'rounded-4xl border border-white/10 backdrop-blur-xl transition-all duration-300';
  
  const variants = {
    default: 'bg-white/5',
    glass: 'bg-linear-to-br from-blue-500/10 via-violet-500/10 to-transparent',
    solid: 'bg-slate-900',
    header: 'bg-white/5 border-b border-white/10 rounded-none backdrop-blur-md',
  };

  const hoverStyles = hover ? 'hover:border-blue-500/20 hover:bg-white/[0.07] hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-500/20' : '';

  return (
    <div 
      className={`${baseStyles} ${variants[variant]} ${hoverStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
