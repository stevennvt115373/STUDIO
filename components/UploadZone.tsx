
import React, { useRef } from 'react';

interface UploadZoneProps {
  onImageSelect: (base64: string) => void;
  currentImage: string | null;
}

export const UploadZone: React.FC<UploadZoneProps> = ({ onImageSelect, currentImage }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (readerEvent) => {
        const result = readerEvent.target?.result;
        if (typeof result === 'string') {
          onImageSelect(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="relative">
      {!currentImage ? (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-200 rounded-xl aspect-square flex flex-col items-center justify-center cursor-pointer hover:border-black transition-all bg-gray-50 group"
        >
          <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <p className="text-sm font-medium text-gray-600">Upload Product Photo</p>
          <p className="text-xs text-gray-400 mt-1">RAW, PNG, or JPEG</p>
        </div>
      ) : (
        <div className="relative rounded-xl overflow-hidden aspect-square group shadow-inner">
          <img src={currentImage} alt="Source" className="w-full h-full object-contain bg-white" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-white text-black text-xs font-bold rounded-lg hover:bg-gray-100"
            >
              Replace Image
            </button>
          </div>
        </div>
      )}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
        accept="image/*" 
      />
    </div>
  );
};
