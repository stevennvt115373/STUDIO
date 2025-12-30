
export type Gender = 'female' | 'male' | 'unisex';
export type LookbookStyle = 'mannequin' | 'lifestyle' | 'cyclorama' | 'editorial' | 'flat-lay';
export type ModelType = 
  | 'none' 
  | 'mannequin' 
  | 'asian' 
  | 'western' 
  | 'african' 
  | 'latino' 
  | 'middle-eastern' 
  | 'south-asian' 
  | 'plus-size' 
  | 'mature';
export type BackgroundType = 'studio' | 'indoor' | 'cyclorama' | 'minimalist' | 'concrete';
export type AspectRatio = '1:1' | '3:4' | '4:3' | '9:16' | '16:9';
export type PoseVariation = 'static' | 'slight-angle' | 'editorial' | 'dynamic';
export type LightingMood = 'soft-daylight' | 'studio-neutral' | 'dramatic-shadow' | 'warm-indoor';
export type CameraAngle = 'eye-level' | 'low-angle' | 'high-angle';
export type FabricEmphasis = 'normal' | 'high-detail';
export type ModelEngine = 'gemini-3-pro-image-preview' | 'gemini-2.5-flash-image';
export type ShotScale = 'standard' | 'full-body' | 'close-up';

export interface GenerationConfig {
  gender: Gender;
  styles: LookbookStyle[];
  modelType: ModelType;
  backgroundType: BackgroundType;
  aspectRatio: AspectRatio;
  quantity: number;
  pose: PoseVariation;
  lighting: LightingMood;
  angle: CameraAngle;
  fabricDetail: FabricEmphasis;
  engine: ModelEngine;
  shotScale: ShotScale;
}

export interface GeneratedImage {
  id: string;
  url: string;
  config: GenerationConfig;
  status: 'pending' | 'completed' | 'failed';
  timestamp: number;
}
