import { GoogleGenAI, Modality } from "@google/genai";

// Helper to clean base64 string (remove data URL prefix)
const cleanBase64 = (dataUrl: string): string => {
  return dataUrl.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');
};

// Get MIME type from data URL
const getMimeType = (dataUrl: string): string => {
  const match = dataUrl.match(/^data:(image\/[a-zA-Z]+);base64,/);
  return match ? match[1] : 'image/png';
};

export const generateGardenImage = async (prompt: string): Promise<string> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key not found");

  const ai = new GoogleGenAI({ apiKey });
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        { text: prompt }
      ]
    },
    config: {
      responseModalities: [Modality.IMAGE],
    },
  });

  const part = response.candidates?.[0]?.content?.parts?.[0];
  if (part && part.inlineData && part.inlineData.data) {
    return `data:image/png;base64,${part.inlineData.data}`;
  }
  
  throw new Error("Failed to generate image");
};

export const editGardenImage = async (base64Image: string, prompt: string): Promise<string> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key not found");

  const ai = new GoogleGenAI({ apiKey });
  
  const cleanData = cleanBase64(base64Image);
  const mimeType = getMimeType(base64Image);

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          inlineData: {
            data: cleanData,
            mimeType: mimeType,
          },
        },
        {
          text: prompt,
        },
      ],
    },
    config: {
      responseModalities: [Modality.IMAGE],
    },
  });

  const part = response.candidates?.[0]?.content?.parts?.[0];
  if (part && part.inlineData && part.inlineData.data) {
    return `data:image/png;base64,${part.inlineData.data}`;
  }

  throw new Error("Failed to edit image");
};

export const generatePlantImage = async (plantName: string, description: string): Promise<string> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key not found");

  const ai = new GoogleGenAI({ apiKey });
  
  // Add variety to the prompts to create a diverse set of images
  const lightings = [
    "soft morning mist lighting", 
    "golden hour sunset lighting", 
    "bright high-contrast noon sunlight", 
    "dramatic studio lighting with black background", 
    "dappled shade in a lush garden"
  ];
  
  const angles = [
    "macro close-up emphasizing texture", 
    "eye-level portrait", 
    "low angle looking up", 
    "artistic top-down flat lay"
  ];

  const randomLighting = lightings[Math.floor(Math.random() * lightings.length)];
  const randomAngle = angles[Math.floor(Math.random() * angles.length)];

  // Construct a prompt specifically for botanical photography with randomized elements
  const prompt = `A professional, high-resolution botanical photograph of ${plantName}. ${description}. 
  Style specifics: ${randomAngle}, ${randomLighting}. 
  Technical: Photorealistic, 8k resolution, highly detailed, depth of field.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        { text: prompt }
      ]
    },
    config: {
      responseModalities: [Modality.IMAGE],
    },
  });

  const part = response.candidates?.[0]?.content?.parts?.[0];
  if (part && part.inlineData && part.inlineData.data) {
    return `data:image/png;base64,${part.inlineData.data}`;
  }
  
  throw new Error("Failed to generate plant image");
};