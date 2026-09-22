import React from 'react';

const GolfBall = ({
  number,
  isMatch = false,
  size = 'md',
  className = '',
  label = null,
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-11 h-11 text-sm',
    lg: 'w-14 h-14 text-base',
    xl: 'w-18 h-18 text-xl',
  };

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <div
        className={`
          ${sizeClasses[size] || sizeClasses.md}
          flex items-center justify-center font-mono font-medium transition-all duration-500
          relative select-none
          ${
            isMatch
              ? 'bg-[#1A1A1A] text-[#D4AF37] border-2 border-[#D4AF37] shadow-[0_4px_16px_rgba(212,175,55,0.25)]'
              : 'bg-[#F9F8F6] text-[#1A1A1A] border border-[#1A1A1A]/20 hover:border-[#1A1A1A] shadow-[0_2px_8px_rgba(0,0,0,0.04)]'
          }
        `}
      >
        <span>{number}</span>
      </div>
      {label && (
        <span className="text-[9px] font-mono tracking-[0.25em] uppercase text-[#6C6863]">
          {label}
        </span>
      )}
    </div>
  );
};

export default GolfBall;
