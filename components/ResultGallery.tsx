
import React from 'react';
import { GeneratedImage } from '../types';

interface ResultGalleryProps {
  results: GeneratedImage[];
  isGenerating: boolean;
}

export const ResultGallery: React.FC<ResultGalleryProps> = ({ results, isGenerating }) => {
  if (results.length === 0 && !isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center py-40 text-center">
        <div className="w-32 h-32 border border-dashed border-gray-200 rounded-full flex items-center justify-center mb-10 group hover:border-black transition-colors duration-500">
          <svg className="w-12 h-12 text-gray-200 group-hover:text-black transition-colors duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </div>
        <h3 className="text-xs font-black uppercase tracking-[0.4em] text-gray-400 mb-2">Awaiting Studio Input</h3>
        <p className="text-[10px] text-gray-300 font-bold uppercase tracking-widest italic">Digital production queue empty.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
      {isGenerating && Array.from({ length: 2 }).map((_, i) => (
        <div key={`shimmer-${i}`} className="space-y-6">
          <div className="shimmer aspect-[3/4] rounded-2xl w-full border border-gray-50" />
          <div className="space-y-3">
            <div className="shimmer h-3 w-1/2 rounded-full" />
            <div className="shimmer h-2 w-full rounded-full opacity-50" />
          </div>
        </div>
      ))}
      
      {results.map((img) => (
        <div key={img.id} className="group space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
            <img 
              src={img.url} 
              alt="Studio Asset" 
              className="w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-105" 
            />
            
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8">
              <div className="flex justify-between items-end">
                <div className="text-white space-y-2">
                  <p className="text-[9px] font-black uppercase tracking-[0.3em]">Shot Scale: {img.config.shotScale}</p>
                  <p className="text-lg font-light tracking-tighter">{img.config.modelType.toUpperCase()} ARCHETYPE</p>
                </div>
                <button 
                  onClick={() => {
                    const a = document.createElement('a');
                    a.href = img.url;
                    a.download = `LUMIERE_${img.id}.png`;
                    a.click();
                  }}
                  className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center hover:bg-black hover:text-white transition-all shadow-xl active:scale-90"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between items-start px-2">
            <div className="space-y-2">
              <div className="flex gap-2">
                 <span className="px-2 py-0.5 bg-black text-white text-[8px] font-black rounded uppercase">{img.config.lighting}</span>
                 <span className="px-2 py-0.5 border border-black text-black text-[8px] font-black rounded uppercase">{img.config.aspectRatio}</span>
              </div>
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{img.config.styles[0]} - OPTIC PRIME v3</p>
            </div>
            <p className="text-[9px] font-black text-gray-200 font-mono italic">#{img.id}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
