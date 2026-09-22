import React from 'react';
import { Link } from 'react-router-dom';

const Button = ({
  children,
  to,
  href,
  onClick,
  variant = 'outline', // 'primary', 'outline', 'text', 'ghost'
  size = 'md',        // 'sm', 'md', 'lg'
  icon = null,
  disabled = false,
  className = '',
  type = 'button',
}) => {
  const sizeClasses = {
    sm: 'h-10 px-5 text-xs',
    md: 'h-12 px-8 text-xs',
    lg: 'h-14 px-10 text-xs',
  };

  if (variant === 'primary') {
    const primaryClasses = `
      relative inline-flex items-center justify-center overflow-hidden font-mono uppercase tracking-[0.2em] font-medium
      bg-[#1A1A1A] text-white shadow-[0_4px_16px_rgba(0,0,0,0.15)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.25)]
      transition-shadow duration-500 group select-none cursor-pointer
      ${sizeClasses[size] || sizeClasses.md}
      ${disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}
      ${className}
    `;

    const innerContent = (
      <>
        {/* Sliding Gold Layer */}
        <span
          className="absolute inset-0 bg-[#D4AF37] -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] z-0"
        />
        {/* Content above gold layer */}
        <span className="relative z-10 flex items-center justify-center gap-2.5">
          {icon && <span className="transition-transform group-hover:scale-110">{icon}</span>}
          <span>{children}</span>
        </span>
      </>
    );

    if (to) {
      return (
        <Link to={to} className={primaryClasses}>
          {innerContent}
        </Link>
      );
    }
    if (href) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={primaryClasses}>
          {innerContent}
        </a>
      );
    }
    return (
      <button type={type} onClick={onClick} disabled={disabled} className={primaryClasses}>
        {innerContent}
      </button>
    );
  }

  const variantClasses = {
    // Sharp rectangular outline with 500ms fill
    outline:
      'border border-[#1A1A1A] bg-transparent text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-[#F9F8F6] transition-colors duration-500 uppercase font-mono tracking-[0.2em] font-medium select-none cursor-pointer',
    // Editorial text link
    text:
      'p-0 text-[#1A1A1A] hover:text-[#D4AF37] group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] transition-colors duration-300 underline underline-offset-4 decoration-[#1A1A1A]/30 hover:decoration-[#D4AF37]',
    // Subtle ghost
    ghost:
      'text-[#6C6863] hover:text-[#1A1A1A] hover:bg-[#EBE5DE]/40 uppercase font-mono tracking-[0.2em] text-xs transition-colors duration-300',
  };

  const combinedClasses = `
    inline-flex items-center justify-center gap-2 select-none
    ${variantClasses[variant] || variantClasses.outline}
    ${variant !== 'text' ? (sizeClasses[size] || sizeClasses.md) : ''}
    ${disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}
    ${className}
  `;

  const content = (
    <>
      {icon && <span>{icon}</span>}
      <span>{children}</span>
    </>
  );

  if (to) {
    return (
      <Link to={to} className={combinedClasses}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={combinedClasses}>
        {content}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={combinedClasses}>
      {content}
    </button>
  );
};

export default Button;
