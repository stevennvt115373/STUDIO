
import React from 'react';
import { GeneratedImage } from '../types';

interface ResultGalleryProps {
  results: GeneratedImage[];
  isGenerating: boolean;
}

export const ResultGallery: React.FC<ResultGalleryProps> = ({ results, isGenerating }) => {
  if (results.length === 0 && !isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center space-y-6 py-20">
        <div className="w-24 h-24 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 border border-dashed border-gray-200">
           <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">Production Queue Empty</h3>
          <p className="text-xs text-gray-400 mt-2 max-w-[240px] leading-relaxed italic">Upload a product and define your studio parameters to generate high-fidelity assets.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-8">
      {isGenerating && Array.from({ length: 2 }).map((_, i) => (
        <div key={`loading-${i}`} className="space-y-4">
          <div className="shimmer rounded-2xl aspect-[3/4] w-full shadow-inner" />
          <div className="space-y-3 px-2">
            <div className="shimmer h-4 w-1/3 rounded-full" />
            <div className="shimmer h-3 w-2/3 rounded-full" />
          </div>
        </div>
      ))}
      
      {results.map((img) => (
        <div key={img.id} className="group space-y-4">
          <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100 shadow-xl border border-gray-100">
            <img 
              src={img.url} 
              alt="AI Lookbook" 
              className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110" 
            />
            
            {/* Overlay Info */}
            <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="flex justify-between items-end">
                <div className="text-white space-y-1">
                  <p className="text-[9px] font-black uppercase tracking-widest opacity-80">{img.config.engine === 'gemini-3-pro-image-preview' ? 'Ultra 4K' : 'HD Fast'}</p>
                  <p className="text-[11px] font-bold">{img.config.modelType.replace('-', ' ')} Edition</p>
                </div>
                <button 
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = img.url;
                    link.download = `Lumiere-${img.id}.png`;
                    link.click();
                  }}
                  className="p-2.5 bg-white text-black rounded-full shadow-2xl hover:bg-gray-100 active:scale-90 transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          
          <div className="px-1 flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[9px] font-black text-black/30 uppercase tracking-[0.2em]">{img.config.styles[0]} Concept</span>
              <div className="flex gap-1.5">
                 <span className="px-1.5 py-0.5 bg-gray-100 rounded text-[8px] font-black text-gray-500 uppercase">{img.config.lighting.replace('-', ' ')}</span>
                 <span className="px-1.5 py-0.5 bg-gray-100 rounded text-[8px] font-black text-gray-500 uppercase">{img.config.aspectRatio}</span>
              </div>
            </div>
            <div className="text-[9px] font-bold text-gray-300 font-mono">
              ID:{img.id.toUpperCase()}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
