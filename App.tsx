
import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { UploadZone } from './components/UploadZone';
import { ConfigurationPanel } from './components/ConfigurationPanel';
import { ResultGallery } from './components/ResultGallery';
import { GenerationConfig, GeneratedImage } from './types';
import { generateLookbookImages } from './services/geminiService';

const App: React.FC = () => {
  const [hasApiKey, setHasApiKey] = useState<boolean>(false);
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<GeneratedImage[]>([]);
  const [config, setConfig] = useState<GenerationConfig>({
    gender: 'female',
    styles: ['cyclorama'],
    modelType: 'western',
    backgroundType: 'studio',
    aspectRatio: '3:4',
    quantity: 2,
    pose: 'static',
    lighting: 'studio-neutral',
    angle: 'eye-level',
    fabricDetail: 'high-detail',
    engine: 'gemini-3-pro-image-preview',
    shotScale: 'full-body'
  });

  useEffect(() => {
    const checkKey = async () => {
      // @ts-ignore
      if (window.aistudio) {
        try {
          // @ts-ignore
          const hasKey = await window.aistudio.hasSelectedApiKey();
          setHasApiKey(hasKey);
        } catch (e) {
          console.warn("Studio Auth Check Skipped", e);
        }
      }
    };
    checkKey();
  }, []);

  const handleOpenKeySelector = async () => {
    // @ts-ignore
    if (window.aistudio) {
      // @ts-ignore
      await window.aistudio.openSelectKey();
      setHasApiKey(true);
    }
  };

  const handleGenerate = async () => {
    if (!sourceImage) return;
    setIsGenerating(true);

    try {
      const generated = await generateLookbookImages(sourceImage, config);
      setResults(prev => [...generated, ...prev]);
    } catch (error: any) {
      console.error("Studio Error:", error);
      const msg = error?.message || JSON.stringify(error);
      
      const isAuthError = msg.includes("403") || msg.includes("PERMISSION") || msg.includes("denied");
      
      if (isAuthError) {
        setHasApiKey(false);
        alert("Studio Authentication Required. Please re-select your professional API key.");
        handleOpenKeySelector();
      } else {
        alert(`Production Alert: ${msg}`);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  if (!hasApiKey) {
    return (
      <div className="min-h-screen flex items-center justify-center luxury-gradient text-white p-6">
        <div className="max-w-md w-full text-center space-y-10">
          <div className="space-y-4">
             <div className="w-16 h-16 bg-white text-black flex items-center justify-center font-black text-4xl mx-auto rounded-xl italic shadow-2xl">L</div>
             <h1 className="text-4xl font-light tracking-[0.4em]">LUMIÈRE</h1>
             <p className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-500">AI Fashion Production Studio</p>
          </div>
          
          <div className="bg-white/5 p-8 rounded-2xl border border-white/10 space-y-6">
            <p className="text-gray-400 text-sm leading-relaxed tracking-wide font-medium">
              READY FOR PRODUCTION? <br/>
              CONNECT YOUR PROFESSIONAL CLOUD KEY TO START GENERATING 4K ASSETS.
            </p>
            <button
              onClick={handleOpenKeySelector}
              className="w-full py-5 bg-white text-black font-black uppercase tracking-[0.2em] text-xs rounded-xl hover:bg-gray-100 transition-all shadow-2xl active:scale-95"
            >
              Initialize Studio
            </button>
          </div>

          <div className="pt-10 border-t border-white/5">
             <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="text-[9px] text-gray-600 hover:text-white transition-colors uppercase tracking-[0.3em] font-bold">
               Requires Paid API Tier for Pro Rendering
             </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white selection:bg-black selection:text-white">
      <Header 
        onReset={() => { setSourceImage(null); setResults([]); }} 
        onChangeKey={handleOpenKeySelector}
      />
      
      <main className="flex-1 max-w-[1800px] mx-auto w-full px-6 py-10 lg:px-20 grid grid-cols-1 lg:grid-cols-12 gap-16">
        <aside className="lg:col-span-4 xl:col-span-3 space-y-12">
          <div className="space-y-8">
            <header className="flex items-center gap-4">
              <span className="w-8 h-[2px] bg-black"></span>
              <h2 className="text-[12px] font-black uppercase tracking-[0.3em]">Source</h2>
            </header>
            <UploadZone onImageSelect={setSourceImage} currentImage={sourceImage} />
          </div>

          <div className="space-y-8">
            <header className="flex items-center gap-4">
              <span className="w-8 h-[2px] bg-black"></span>
              <h2 className="text-[12px] font-black uppercase tracking-[0.3em]">Config</h2>
            </header>
            <ConfigurationPanel 
              config={config} 
              setConfig={setConfig} 
              isGenerating={isGenerating} 
              onGenerate={handleGenerate}
              disabled={!sourceImage}
            />
          </div>
        </aside>

        <section className="lg:col-span-8 xl:col-span-9 border-l border-gray-100 pl-0 lg:pl-16">
          <div className="flex items-center justify-between mb-12">
            <header className="flex items-center gap-4">
              <span className="w-8 h-[2px] bg-black"></span>
              <h2 className="text-[12px] font-black uppercase tracking-[0.3em]">Collection</h2>
            </header>
            <div className="flex gap-4">
              <span className="text-[10px] font-bold text-black bg-gray-100 px-3 py-1 rounded-full uppercase tracking-tighter">Engine: {config.engine.includes('pro') ? 'PRO 4K' : 'FLASH'}</span>
              <span className="text-[10px] font-bold text-black bg-gray-100 px-3 py-1 rounded-full uppercase tracking-tighter">Status: {isGenerating ? 'RENDER' : 'READY'}</span>
            </div>
          </div>
          <ResultGallery results={results} isGenerating={isGenerating} />
        </section>
      </main>

      <footer className="p-10 text-center border-t border-gray-50">
        <p className="text-[10px] font-black text-gray-200 uppercase tracking-[0.6em]">
          LUMIÈRE // OPTIC-PRIME v3.0 GITHUB READY // ULTRA-FIDELITY ASSETS
        </p>
      </footer>
    </div>
  );
};

export default App;
