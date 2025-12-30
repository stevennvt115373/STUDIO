
import { GoogleGenAI } from "@google/genai";
import { GenerationConfig, GeneratedImage } from "../types";

export const generateLookbookImages = async (
  sourceBase64: string,
  config: GenerationConfig
): Promise<GeneratedImage[]> => {
  const apiKey = process.env.API_KEY;
  
  if (!apiKey) {
    throw new Error("API Key is missing. Please select a valid API key to proceed.");
  }

  // Create a new instance right before the call to ensure the latest key is used
  const ai = new GoogleGenAI({ apiKey });
  const modelName = config.engine;

  const base64Clean = sourceBase64.replace(/^data:image\/\w+;base64,/, "");
  const mimeType = sourceBase64.match(/^data:(image\/\w+);base64,/)?.[1] || 'image/png';

  const getModelPrompt = () => {
    const genderTerm = config.gender === 'female' ? 'woman' : (config.gender === 'male' ? 'man' : 'non-binary model');
    
    switch (config.modelType) {
      case 'none': return 'a clean architectural flat lay display';
      case 'mannequin': return 'a premium matte-white invisible ghost mannequin';
      case 'asian': return `a professional East Asian ${genderTerm} fashion model with flawless skin and elegant poise`;
      case 'western': return `a professional Western ${genderTerm} fashion model with high-fashion features`;
      case 'african': return `a professional African ${genderTerm} fashion model with stunning features and professional gaze`;
      case 'latino': return `a professional Latino ${genderTerm} fashion model with warm, editorial presence`;
      default: return `a top-tier professional ${genderTerm} fashion model`;
    }
  };

  const getFramingPrompt = () => {
    if (config.shotScale === 'full-body') {
      return "FRAME: FULL BODY COMPOSITION. Head-to-toe visibility mandatory. Include model's footwear and the floor surface. Maintain model's entire silhouette within the frame.";
    } else if (config.shotScale === 'close-up') {
      return "FRAME: CLOSE-UP DETAIL. Focus strictly on upper body and garment textures. High-frequency detail focus.";
    }
    return "FRAME: STANDARD FASHION CROP. Mid-shot to full-shot flexibility.";
  };

  const perspectives = [
    "EYE-LEVEL HERO: Symmetrical, centered, zero-distortion lens compression.",
    "ANGULAR VOLUME: 45-degree turn showing structural depth and 3D garment wrap.",
    "PROFILE SILHOUETTE: Focusing on side-seam alignment and silhouette sharpness.",
    "KINETIC ACTION: Natural movement showing fabric fluid dynamics and realistic folds.",
    "LOW-ANGLE EDITORIAL: Powerful low-perspective emphasizing garment scale and dominance.",
    "HIGH-ANGLE ARCHITECTURAL: Top-down view highlighting collar construction and shoulder drape.",
    "MACRO FIDELITY: 1:1 extreme focus on fabric grain, thread density, and stitching perfection.",
    "REVERSE 3/4 TURN: Capturing back construction with realistic light-wrap on edges."
  ];

  const generationPromises = Array.from({ length: config.quantity }).map(async (_, idx) => {
    const perspectivePrompt = perspectives[idx % perspectives.length];
    
    const prompt = `
      [OPTIC-PRIME RENDERING ENGINE INITIALIZED]
      
      CORE MISSION: Create a commercial asset that EXCEEDS physical studio photography in sharpness and realism.
      
      ${getFramingPrompt()}
      PERSPECTIVE: ${perspectivePrompt}

      PIXEL-LEVEL PHYSICS:
      - SENSOR EMULATION: Simulate 100MP CMOS Medium Format output. Zero noise, zero artifacts.
      - TEXTURAL DENSITY: Render fabric fibers at sub-pixel accuracy. If cotton, show the subtle fuzz; if leather, show the organic pore structure; if silk, show the high-specular micro-sheen.
      - PATH-TRACED LIGHTING: Implement physically-based rendering (PBR) for light interaction. Ensure subsurface scattering on skin and complex ambient occlusion in every fabric fold.
      - OPTICAL PRECISION: Zero chromatic aberration. Use high-frequency micro-contrast to define edges against the background.

      STUDIO ENVIRONMENT:
      - BACKGROUND: ${config.styles.join(", ")} context with neutral, color-accurate calibration.
      - LIGHTING: ${config.lighting.replace('-', ' ')} with soft-box diffusion and accurate color temperature (5600K).
      - FOCUS: Razor-sharp focal plane on the product. Use f/11 for deep depth-of-field ensuring the whole garment is crisp.

      IDENTITY PRESERVATION:
      - SUBJECT: ${getModelPrompt()}.
      - PRODUCT INTEGRITY: Maintain 100% fidelity to the source image's colors, patterns, and hardware (zippers, buttons). NO halluncinations.
      
      FINAL OUTPUT: HDR (High Dynamic Range) master with deep tonal richness and absolute clarity.
    `;

    try {
      const imageConfig: any = { aspectRatio: config.aspectRatio };
      if (modelName === 'gemini-3-pro-image-preview') {
        imageConfig.imageSize = "4K";
      }

      // Re-initialize for each part of the batch if needed, but here we can reuse the outer instance 
      // as long as it's fresh for the call.
      const response = await ai.models.generateContent({
        model: modelName,
        contents: {
          parts: [
            { inlineData: { data: base64Clean, mimeType: mimeType } },
            { text: prompt }
          ]
        },
        config: { 
          imageConfig,
          // Only use thinkingConfig for pro models as per guidelines
          thinkingConfig: modelName.includes('pro') ? { thinkingBudget: 4000 } : undefined 
        }
      });

      let imageUrl = '';
      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            imageUrl = `data:image/png;base64,${part.inlineData.data}`;
            break;
          }
        }
      }

      if (!imageUrl) throw new Error("API returned no image data.");

      return {
        id: Math.random().toString(36).substring(7),
        url: imageUrl,
        config: { ...config },
        status: 'completed',
        timestamp: Date.now()
      } as GeneratedImage;

    } catch (e: any) {
      // Re-throw for handling at the App level
      throw e;
    }
  });

  return Promise.all(generationPromises);
};
