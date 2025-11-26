
export const GENERATION_ANGLES = [
  "close-up macro shot showing texture", 
  "eye-level botanical portrait", 
  "low angle shot looking up", 
  "artistic overhead detail shot",
  "top-down aerial view",
  "wide angle garden context",
  "Dutch angle artistic shot"
];

export const GENERATION_LIGHTING = [
  "soft morning mist lighting", 
  "golden hour sunlight", 
  "dramatic afternoon shadows", 
  "bright diffused daylight",
  "mysterious moonlight",
  "studio lighting with black background"
];

export const GENERATION_STYLES = [
  "highly detailed photorealistic 8k", 
  "nature documentary style photography", 
  "cinematic garden shot",
  "vintage botanical illustration",
  "minimalist vector art",
  "soft watercolor painting",
  "botanical line drawing",
  "oil painting style",
  "impressionist garden painting",
  "charcoal sketch",
  "3d render isometric",
  "pixel art",
  "cyberpunk neon garden",
  "pop art style",
  "surrealist fantasy"
];

export const EDIT_LOADING_MESSAGES = [
  "Parsing semantic segmentation maps...",
  "Estimating light diffusion...",
  "Applying procedural textures...",
  "Synthesizing depth-aware foliage...",
  "Compiling final render layer..."
];

export const GENERATOR_LOADING_MESSAGES = [
  "Dreaming up your garden...",
  "Calculating light and shadows...",
  "Planting virtual seeds...",
  "Rendering in 4K resolution...",
  "Polishing the leaves..."
];

export const GENERATOR_SUGGESTIONS = [
  "A peaceful Japanese Zen garden with a small koi pond, bamboo fence, and maple trees.",
  "A modern minimalist backyard with concrete pavers, succulents, and a fire pit.",
  "A lush English cottage garden overflowing with colorful wildflowers and a cobblestone path.",
  "A tropical paradise with palm trees, a hammock, and vibrant exotic flowers."
];

// Prompt Builders
export const buildPlantImagePrompt = (name: string, description: string, style: string, angle: string, lighting: string, seed: number) => `
    Create a distinctly unique high-resolution image of ${name}. 
    Context: ${description}.
    
    ARTISTIC DIRECTION:
    - Style: ${style}
    - Perspective: ${angle}
    - Lighting: ${lighting}
    
    REQUIREMENTS:
    - Focus purely on the plant aesthetics.
    - High detail, 8k resolution.
    - Make it look distinctively different from standard stock photos.
    - Use the random seed to vary composition, zoom level, and background blur.
    - Ensure uniqueness compared to typical ${name} photos.
    - Random Noise Seed: ${seed}
`;

export const buildPlantDescriptionPrompt = (name: string, currentDescription: string) => `
    Write a detailed and engaging description for ${name}. 
    Base Information: "${currentDescription}".
    
    Guidelines:
    - Focus on its aesthetic qualities (color, texture, form).
    - Mention its suitability for different garden styles (e.g. cottage, modern, zen, xeriscape).
    - Keep it under 100 words.
    - Tone: Inspiring and expert.
`;
