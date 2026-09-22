import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const Modal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'max-w-lg',
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#1A1A1A]/60 backdrop-blur-sm"
          />

          {/* Dialog Card with architectural precision */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 10 }}
            transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            className={`relative w-full ${maxWidth} bg-[#F9F8F6] border border-[#1A1A1A] p-8 sm:p-10 shadow-[0_16px_48px_rgba(0,0,0,0.18)] z-10`}
          >
            {/* Header */}
            <div className="flex items-start justify-between pb-6 border-b border-[#1A1A1A]/10 mb-6">
              <div>
                {subtitle && (
                  <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-[#D4AF37] block mb-1 font-medium">
                    {subtitle}
                  </span>
                )}
                {title && (
                  <h3 className="font-serif text-2xl sm:text-3xl font-normal text-[#1A1A1A] tracking-tight">
                    {title}
                  </h3>
                )}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="text-[#6C6863] hover:text-[#1A1A1A] p-2 hover:bg-[#EBE5DE] transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            <div className="text-[#1A1A1A]">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
