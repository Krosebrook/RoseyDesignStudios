
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
  "studio lighting with black background",
  "dappled shade"
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
  "surrealist fantasy",
  "gouache painting",
  "stained glass art",
  "low poly 3d model",
  "macro photography with bokeh",
  "pencil sketch"
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
  "A bioluminescent nocturnal garden with glowing purple ferns, neon blue mushrooms, and dark obsidian paths under a silver full moon.",
  "A Mediterranean courtyard with terracotta tiles, a central tiered marble fountain, climbing magenta bougainvillea, and fragrant lemon trees.",
  "A futuristic sustainable rooftop oasis featuring vertical hydroponic walls, glass-enclosed seating, and wind-sculpted kinetic metal art.",
  "A rugged Scandinavian woodland retreat with a natural swimming pond, silver birch trees, and a weathered timber sauna cabin in the mist.",
  "A Moroccan riad garden with intricate zellige mosaic tiles, teal water channels, lush fan palms, and oversized terracotta pots filled with jasmine.",
  "A high-desert xeriscape with structural blue agaves, golden barrel cacti, red sandstone boulders, and a minimalist corten steel fire bowl.",
  "A Victorian-inspired gothic secret garden with a rusted iron gazebo, overgrown dark ivy, black hellebores, and crumbling mossy stone statues.",
  "A sleek mid-century modern backyard with a kidney-shaped pool, white gravel beds, architectural yucca, and orange accent breeze block walls.",
  "A peaceful Japanese Zen garden with a small koi pond, bridge, bamboo fence, and raked gravel around a single ancient maple tree.",
  "A lush English cottage garden overflowing with colorful delphiniums, foxgloves, and a winding cobblestone path through a rose arch."
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
