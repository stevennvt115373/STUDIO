
import { GoogleGenAI } from "@google/genai";
import { GenerationConfig, GeneratedImage } from "../types";

/**
 * Optic-Prime Engine v3
 * Tối ưu hóa cho độ sắc nét vượt tiêu chuẩn Studio (High-Frequency Detail Recovery)
 */
export const generateLookbookImages = async (
  sourceBase64: string,
  config: GenerationConfig
): Promise<GeneratedImage[]> => {
  const apiKey = process.env.API_KEY;
  
  if (!apiKey) {
    throw new Error("API Key required. Please authenticate via Studio Key.");
  }

  const ai = new GoogleGenAI({ apiKey });
  const modelName = config.engine;

  const base64Clean = sourceBase64.replace(/^data:image\/\w+;base64,/, "");
  const mimeType = sourceBase64.match(/^data:(image\/\w+);base64,/)?.[1] || 'image/png';

  const getModelPrompt = () => {
    const genderTerm = config.gender === 'female' ? 'woman' : (config.gender === 'male' ? 'man' : 'model');
    
    switch (config.modelType) {
      case 'none': return 'architectural high-end flat lay, zero human subject';
      case 'mannequin': return 'ghost mannequin with professional structural padding';
      case 'asian': return `elite East Asian fashion ${genderTerm} model, radiant complexion, hyper-realistic skin pores`;
      case 'western': return `top-tier Western fashion ${genderTerm} model, sharp facial features, editorial gaze`;
      case 'african': return `premium African fashion ${genderTerm} model, flawless skin texture, powerful presence`;
      case 'latino': return `professional Latino fashion ${genderTerm} model, warm skin tones, vibrant energy`;
      default: return `world-class professional ${genderTerm} fashion model`;
    }
  };

  const getFramingPrompt = () => {
    switch(config.shotScale) {
      case 'full-body': 
        return "SHOT: FULL-BODY MASTER. Head to toe. Headroom: 10%, Footroom: 5%. Include high-end footwear. Absolute vertical alignment.";
      case 'close-up': 
        return "SHOT: MACRO DETAIL. Focus on collar, buttons, and fabric weave. 1:1 scale texture reproduction.";
      default: 
        return "SHOT: STANDARD MEDIUM CROP. Waist-up to full-body transition.";
    }
  };

  const perspectives = [
    "ANGLE: 0-degree eye-level, focal length 85mm, zero perspective distortion.",
    "ANGLE: 45-degree isometric turn, emphasizing garment volume and 3D depth.",
    "ANGLE: Sharp side profile, highlighting silhouette and drape physics.",
    "ANGLE: Dynamic walking stride, capturing natural movement and fabric drag.",
    "ANGLE: Low-angle (worm's eye) hero shot, emphasizing authority and scale.",
    "ANGLE: High-angle architectural, focusing on shoulder construction.",
    "ANGLE: Reverse 3/4 turn, capturing back detail and light wrap.",
    "ANGLE: Detail crop, focusing on the most intricate part of the garment."
  ];

  const generationPromises = Array.from({ length: config.quantity }).map(async (_, idx) => {
    const perspectivePrompt = perspectives[idx % perspectives.length];
    
    const prompt = `
      [SYSTEM: OPTIC-PRIME PRODUCTION MODE]
      GOAL: Render a commercial-grade fashion asset with pixel density exceeding 100MP physical studio capture.

      TECHNICAL PARAMETERS:
      ${getFramingPrompt()}
      ${perspectivePrompt}

      IMAGE FIDELITY SPECIFICATIONS:
      - RAW RECONSTRUCTION: No AI hallucinations. Every stitch, texture, and color from the reference must be preserved.
      - LIGHTING: 3-point professional studio setup (Key, Fill, Back). Use path-traced shadows and realistic light fall-off.
      - OPTICS: Zero chromatic aberration. Emulate Phase One XF medium format camera sharpness.
      - TEXTURE: Hyper-realistic rendering of ${config.fabricDetail === 'high-detail' ? 'micro-fibers, thread count, and material weave' : 'natural fabric surfaces'}.
      - SKIN RENDERING: Realistic sub-surface scattering for skin. Do not airbrush; maintain natural pores and micro-textures.

      ENVIRONMENT:
      - CONTEXT: ${config.styles.join(", ")} professional setting.
      - BOKEH: f/11 aperture for edge-to-edge sharpness across the product.
      
      FINAL POLISH: HDR-ready, color-calibrated (sRGB), maximum micro-contrast.
    `;

    try {
      const imageConfig: any = { aspectRatio: config.aspectRatio };
      if (modelName === 'gemini-3-pro-image-preview') imageConfig.imageSize = "4K";

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

      if (!imageUrl) throw new Error("Null Frame Output.");

      return {
        id: Math.random().toString(36).substring(7).toUpperCase(),
        url: imageUrl,
        config: { ...config },
        status: 'completed',
        timestamp: Date.now()
      } as GeneratedImage;

    } catch (e: any) {
      throw e;
    }
  });

  return Promise.all(generationPromises);
};
