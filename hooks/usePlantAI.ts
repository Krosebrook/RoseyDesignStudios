
import { useState } from 'react';
import { Plant } from '../types';
import { generatePlantImage, generatePlantDescription } from '../services/gemini';

export const usePlantAI = () => {
    // Key: Plant ID, Value: Array of base64 image strings
    const [generatedImages, setGeneratedImages] = useState<Record<string, string[]>>({});
    const [generatingIds, setGeneratingIds] = useState<Set<string>>(new Set());

    // State for enhanced descriptions
    const [enhancedDescriptions, setEnhancedDescriptions] = useState<Record<string, string>>({});
    const [enhancingDescIds, setEnhancingDescIds] = useState<Set<string>>(new Set());

    const generateImage = async (plant: Plant, style?: string, lighting?: string) => {
        if (generatingIds.has(plant.id)) return;

        setGeneratingIds(prev => new Set(prev).add(plant.id));
        
        try {
            const newImage = await generatePlantImage(plant.name, plant.description, style, lighting);
            setGeneratedImages(prev => {
                const existing = prev[plant.id] || [];
                // Append new image to the existing array for this plant
                return { ...prev, [plant.id]: [...existing, newImage] };
            });
        } catch (err) {
            console.error("Failed to generate plant image", err);
        } finally {
            setGeneratingIds(prev => {
                const next = new Set(prev);
                next.delete(plant.id);
                return next;
            });
        }
    };

    const enhanceDescription = async (plant: Plant) => {
        if (enhancingDescIds.has(plant.id)) return;

        setEnhancingDescIds(prev => new Set(prev).add(plant.id));

        try {
            const newDesc = await generatePlantDescription(plant.name, plant.description);
            setEnhancedDescriptions(prev => ({ ...prev, [plant.id]: newDesc }));
        } catch (err) {
            console.error("Failed to generate description", err);
        } finally {
            setEnhancingDescIds(prev => {
                const next = new Set(prev);
                next.delete(plant.id);
                return next;
            });
        }
    };

    return {
        generatedImages,
        generatingIds,
        enhancedDescriptions,
        enhancingDescIds,
        generateImage,
        enhanceDescription
    };
};
