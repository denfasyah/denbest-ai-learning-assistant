import React from 'react';

const SectionHeader = ({ title, description, className = '' }) => {
  return (
    <div className={className}>
      <h2 className="text-xl md:text-2xl font-black tracking-tight text-white">{title}</h2>
      {description && <p className="text-xs md:text-sm text-slate-400 mt-0.5">{description}</p>}
    </div>
  );
};

export default SectionHeader;
