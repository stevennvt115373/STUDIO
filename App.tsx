
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
        // @ts-ignore
        const hasKey = await window.aistudio.hasSelectedApiKey();
        setHasApiKey(hasKey);
      }
    };
    checkKey();
  }, []);

  const handleOpenKeySelector = async () => {
    // @ts-ignore
    if (window.aistudio) {
      // @ts-ignore
      await window.aistudio.openSelectKey();
      // Assume success as per race condition guidelines
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
      console.error("Studio Generation Error:", error);
      
      const errorStr = JSON.stringify(error);
      const errorMessage = error?.message || errorStr || "Unknown Error";
      
      const isPermissionError = 
        errorMessage.includes("403") || 
        errorMessage.includes("PERMISSION_DENIED") ||
        errorMessage.includes("permission");
        
      const isNotFoundError = 
        errorMessage.includes("Requested entity was not found") ||
        errorMessage.includes("404");

      if (isPermissionError || isNotFoundError) {
        if (config.engine === 'gemini-3-pro-image-preview') {
          // Mandatory key re-selection for Pro model failures
          setHasApiKey(false);
          alert("Pro Access Error: The selected API key does not have permission for the Pro model. Ensure you have a paid project and billing enabled.\n\nRedirecting to Key Selection...");
          handleOpenKeySelector();
        } else {
          setHasApiKey(false);
          alert("Access Error: Please select a valid API key to continue.");
          handleOpenKeySelector();
        }
      } else {
        alert(`Production Alert: ${errorMessage}`);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  if (!hasApiKey) {
    return (
      <div className="min-h-screen flex items-center justify-center luxury-gradient text-white p-6">
        <div className="max-w-md w-full text-center space-y-8">
          <div className="flex flex-col items-center gap-2">
             <div className="w-12 h-12 bg-white text-black flex items-center justify-center font-black text-2xl rounded-sm italic shadow-2xl">L</div>
             <h1 className="text-3xl font-light tracking-[0.3em] mt-4">LUMIÈRE <span className="font-black">STUDIO</span></h1>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed tracking-wide">
            ENTER THE NEXUS OF AI & HAUTE COUTURE. <br/>
            CONNECT YOUR GOOGLE AI STUDIO CREDENTIALS TO BEGIN PRODUCTION.
          </p>
          <button
            onClick={handleOpenKeySelector}
            className="w-full py-5 bg-white text-black font-black uppercase tracking-[0.2em] text-xs rounded-sm hover:bg-gray-100 transition-all shadow-2xl active:scale-[0.98]"
          >
            Authenticate Studio Key
          </button>
          <div className="space-y-4 pt-8 border-t border-white/10">
            <p className="text-[10px] text-gray-500 uppercase tracking-[0.3em] font-black">System Requirements</p>
            <ul className="text-[10px] text-gray-400 space-y-2 uppercase tracking-widest font-bold">
              <li>• Gemini 3.0 Pro Access Recommended</li>
              <li>• Valid Google Cloud Billing Project (Paid)</li>
              <li>• High-Resolution Product Reference</li>
            </ul>
            <a 
              href="https://ai.google.dev/gemini-api/docs/billing" 
              target="_blank" 
              className="inline-block text-[10px] text-gray-500 hover:text-white underline mt-4 tracking-tighter"
            >
              Learn about API tiers and billing requirements
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header 
        onReset={() => { setSourceImage(null); setResults([]); }} 
        onChangeKey={handleOpenKeySelector}
      />
      
      <main className="flex-1 max-w-[1700px] mx-auto w-full p-4 md:p-10 grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4 xl:col-span-3 space-y-10">
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="w-6 h-[1px] bg-black"></span>
              <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-black">Source Selection</h2>
            </div>
            <UploadZone onImageSelect={setSourceImage} currentImage={sourceImage} />
          </section>

          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="w-6 h-[1px] bg-black"></span>
              <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-black">Studio Parameters</h2>
            </div>
            <ConfigurationPanel 
              config={config} 
              setConfig={setConfig} 
              isGenerating={isGenerating} 
              onGenerate={handleGenerate}
              disabled={!sourceImage}
            />
          </section>
        </div>

        <div className="lg:col-span-8 xl:col-span-9">
          <section className="min-h-[800px] border-l border-gray-100 pl-0 lg:pl-12">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-3">
                <span className="w-6 h-[1px] bg-black"></span>
                <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-black">Lookbook Output</h2>
              </div>
              {results.length > 0 && (
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Showing {results.length} Generated Assets
                </span>
              )}
            </div>
            <ResultGallery results={results} isGenerating={isGenerating} />
          </section>
        </div>
      </main>

      <footer className="p-8 text-center border-t border-gray-50 bg-white">
        <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.4em]">
          LUMIÈRE AI FASHION STUDIO // OPTIC-PRIME v2.4 // COMMERCIAL LICENSED
        </p>
      </footer>
    </div>
  );
};

export default App;
