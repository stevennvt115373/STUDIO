
import React from 'react';
import { GenerationConfig, LookbookStyle, ModelType, AspectRatio, PoseVariation, LightingMood, FabricEmphasis, Gender, ShotScale } from '../types';

interface ConfigurationPanelProps {
  config: GenerationConfig;
  setConfig: React.Dispatch<React.SetStateAction<GenerationConfig>>;
  isGenerating: boolean;
  onGenerate: () => void;
  disabled: boolean;
}

export const ConfigurationPanel: React.FC<ConfigurationPanelProps> = ({ 
  config, 
  setConfig, 
  isGenerating, 
  onGenerate,
  disabled
}) => {
  const updateConfig = <K extends keyof GenerationConfig>(key: K, value: GenerationConfig[K]) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const toggleStyle = (style: LookbookStyle) => {
    const newStyles = config.styles.includes(style)
      ? config.styles.filter(s => s !== style)
      : [...config.styles, style];
    if (newStyles.length > 0) updateConfig('styles', newStyles);
  };

  return (
    <div className="space-y-6">
      {/* 1. Subject Definition */}
      <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100 space-y-4">
        <header className="flex items-center justify-between">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-black">01. Subject Definition</h3>
          <span className="text-[9px] bg-black text-white px-2 py-0.5 rounded-full font-bold">CORE</span>
        </header>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-gray-400 uppercase">Line</label>
              <select 
                value={config.gender}
                onChange={(e) => updateConfig('gender', e.target.value as Gender)}
                className="w-full bg-white border border-gray-100 rounded-lg p-2.5 text-xs font-bold focus:ring-1 focus:ring-black outline-none transition-all"
              >
                <option value="female">Women's Wear</option>
                <option value="male">Men's Wear</option>
                <option value="unisex">Unisex Line</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-gray-400 uppercase">Archetype</label>
              <select 
                value={config.modelType}
                onChange={(e) => updateConfig('modelType', e.target.value as ModelType)}
                className="w-full bg-white border border-gray-100 rounded-lg p-2.5 text-xs font-bold focus:ring-1 focus:ring-black outline-none transition-all"
              >
                <option value="none">Flat Lay Only</option>
                <option value="mannequin">Ghost Mannequin</option>
                <option value="western">Western Model</option>
                <option value="asian">East Asian Model</option>
                <option value="african">African Model</option>
                <option value="latino">Latino Model</option>
                <option value="plus-size">Curve Model</option>
                <option value="mature">Mature Model</option>
              </select>
            </div>
          </div>
          
          <div className="space-y-1">
            <label className="text-[9px] font-bold text-gray-400 uppercase">Shot Framing</label>
            <div className="grid grid-cols-3 gap-1">
              {(['standard', 'full-body', 'close-up'] as ShotScale[]).map(s => (
                <button
                  key={s}
                  onClick={() => updateConfig('shotScale', s)}
                  className={`py-1.5 text-[9px] font-black rounded border uppercase tracking-tighter transition-all ${
                    config.shotScale === s ? 'bg-black border-black text-white' : 'bg-white border-gray-100 text-gray-400 hover:text-black'
                  }`}
                >
                  {s.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Atmospheric Mood */}
      <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100 space-y-4">
        <header className="flex items-center justify-between">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-black">02. Studio Atmosphere</h3>
          <span className="text-[9px] border border-black/10 px-2 py-0.5 rounded-full font-bold">MOOD</span>
        </header>
        <div className="space-y-3">
          <div className="flex flex-wrap gap-1.5">
            {(['cyclorama', 'lifestyle', 'editorial', 'flat-lay'] as LookbookStyle[]).map(s => (
              <button
                key={s}
                onClick={() => toggleStyle(s)}
                className={`px-3 py-1.5 rounded-md text-[10px] font-black uppercase tracking-tight transition-all border ${
                  config.styles.includes(s) 
                    ? 'bg-black text-white border-black shadow-md' 
                    : 'bg-white text-gray-400 border-gray-100 hover:border-gray-200'
                }`}
              >
                {s.replace('-', ' ')}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <select 
              value={config.pose} 
              onChange={(e) => updateConfig('pose', e.target.value as PoseVariation)}
              className="w-full bg-white border border-gray-100 rounded-lg p-2.5 text-[11px] font-bold"
            >
              <option value="static">Static Focus</option>
              <option value="editorial">Editorial Form</option>
              <option value="dynamic">Kinetic Motion</option>
            </select>
            <select 
              value={config.lighting} 
              onChange={(e) => updateConfig('lighting', e.target.value as LightingMood)}
              className="w-full bg-white border border-gray-100 rounded-lg p-2.5 text-[11px] font-bold"
            >
              <option value="studio-neutral">Studio Neutral</option>
              <option value="soft-daylight">Natural Daylight</option>
              <option value="dramatic-shadow">High Contrast</option>
              <option value="warm-indoor">Warm Tungsten</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. Technical Precision */}
      <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100 space-y-4">
        <header className="flex items-center justify-between">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-black">03. Technical Precision</h3>
          <span className="text-[9px] bg-blue-500 text-white px-2 py-0.5 rounded-full font-bold italic">PRIME</span>
        </header>
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white p-1 rounded-lg border border-gray-100">
            <button 
              onClick={() => updateConfig('engine', 'gemini-3-pro-image-preview')}
              className={`flex-1 py-1.5 text-[9px] font-black rounded transition-all ${config.engine === 'gemini-3-pro-image-preview' ? 'bg-black text-white' : 'text-gray-400 hover:text-black'}`}
            >
              ULTRA 4K PRO
            </button>
            <button 
              onClick={() => updateConfig('engine', 'gemini-2.5-flash-image')}
              className={`flex-1 py-1.5 text-[9px] font-black rounded transition-all ${config.engine === 'gemini-2.5-flash-image' ? 'bg-black text-white' : 'text-gray-400 hover:text-black'}`}
            >
              FLASH HD
            </button>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <span className="text-[9px] font-black text-gray-400 uppercase">Production Batch</span>
              <span className="text-xs font-black text-black">{config.quantity} Assets</span>
            </div>
            <input 
              type="range" min="1" max="8" step="1"
              value={config.quantity}
              onChange={(e) => updateConfig('quantity', parseInt(e.target.value))}
              className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
            />
          </div>

          <div className="flex gap-1">
            {(['1:1', '3:4', '4:3', '9:16', '16:9'] as AspectRatio[]).map(r => (
              <button
                key={r}
                onClick={() => updateConfig('aspectRatio', r)}
                className={`flex-1 py-2 text-[10px] font-black rounded border transition-all ${
                  config.aspectRatio === r ? 'bg-black border-black text-white shadow-sm' : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button 
        disabled={disabled || isGenerating}
        onClick={onGenerate}
        className={`w-full py-5 font-black text-xs tracking-[0.3em] uppercase transition-all rounded-xl flex items-center justify-center gap-3 shadow-2xl ${
          disabled || isGenerating 
          ? 'bg-gray-100 text-gray-300 cursor-not-allowed border border-gray-200' 
          : 'luxury-gradient text-white hover:opacity-90 active:scale-[0.97]'
        }`}
      >
        {isGenerating ? (
          <span className="flex items-center gap-3">
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Rendering High-Fidelity Output
          </span>
        ) : (
          "Initiate Production"
        )}
      </button>
    </div>
  );
};
