import React from 'react';

const GridLines = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-30 max-w-[1600px] mx-auto px-6 sm:px-12 w-full flex justify-between">
      {/* 4 Architectural Vertical Gridlines */}
      <div className="w-px h-full bg-[#1A1A1A]/[0.05]" />
      <div className="w-px h-full bg-[#1A1A1A]/[0.05] hidden md:block" />
      <div className="w-px h-full bg-[#1A1A1A]/[0.05] hidden md:block" />
      <div className="w-px h-full bg-[#1A1A1A]/[0.05]" />
    </div>
  );
};

export default GridLines;
