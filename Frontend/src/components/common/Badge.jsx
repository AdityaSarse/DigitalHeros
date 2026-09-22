import React from 'react';

const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
}) => {
  const variantClasses = {
    default: 'bg-transparent text-[#6C6863] border border-[#1A1A1A]/20',
    active: 'bg-[#1A1A1A] text-[#F9F8F6] border border-[#1A1A1A]',
    gold: 'bg-[#D4AF37]/15 text-[#9E7B16] border border-[#D4AF37]',
    approved: 'bg-[#1A1A1A] text-[#D4AF37] border border-[#D4AF37]',
    pending: 'bg-[#EBE5DE] text-[#6C6863] border border-[#1A1A1A]/20',
    rejected: 'bg-rose-50 text-rose-700 border border-rose-200',
    paid: 'bg-[#1A1A1A] text-[#D4AF37] border border-[#D4AF37]',
  };

  const sizeClasses = {
    sm: 'text-[9px] px-2 py-0.5 tracking-[0.22em]',
    md: 'text-[10px] px-3 py-1 tracking-[0.25em]',
    lg: 'text-xs px-4 py-1.5 tracking-[0.25em]',
  };

  return (
    <span
      className={`
        inline-flex items-center gap-2 uppercase font-mono font-medium select-none
        ${variantClasses[variant] || variantClasses.default}
        ${sizeClasses[size] || sizeClasses.md}
        ${className}
      `}
    >
      <span className="w-1 h-1 bg-current opacity-70" />
      {children}
    </span>
  );
};

export default Badge;
