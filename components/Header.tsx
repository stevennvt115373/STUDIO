
import React from 'react';

interface HeaderProps {
  onReset: () => void;
  onChangeKey: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onReset, onChangeKey }) => {
  return (
    <header className="h-16 luxury-gradient flex items-center justify-between px-6 md:px-10 text-white shadow-lg sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-white text-black flex items-center justify-center font-bold text-lg rounded-sm italic">L</div>
        <h1 className="text-xl font-light tracking-widest">LUMIÈRE <span className="font-bold">STUDIO</span></h1>
      </div>
      <div className="flex items-center gap-4 md:gap-6">
        <span className="hidden lg:inline text-xs text-gray-400 font-medium uppercase tracking-widest">Premium Fashion Engine</span>
        <div className="flex items-center gap-2">
          <button 
            onClick={onChangeKey}
            className="text-[10px] md:text-xs text-gray-400 hover:text-white transition-colors uppercase tracking-widest border border-white/10 px-3 py-1 rounded"
          >
            Change Key
          </button>
          <button 
            onClick={onReset}
            className="text-[10px] md:text-xs hover:text-gray-300 transition-colors uppercase tracking-widest border border-white/20 px-3 py-1 rounded font-medium"
          >
            New Project
          </button>
        </div>
      </div>
    </header>
  );
};
