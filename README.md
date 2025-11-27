
# DreamGarden AI

![Version](https://img.shields.io/badge/version-1.2.0-blue)
![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Sprint Status](https://img.shields.io/badge/Sprint-Complete-green)

**DreamGarden AI** is a comprehensive landscape design application powered by Google's Gemini ecosystem. It allows users to generate photorealistic garden designs, edit existing photos using natural language, animate static images into videos, and interact with an AI gardening assistant via voice.

## Latest Updates (Production Refactor)
We have optimized the codebase for maintainability and separation of concerns:
- **Custom Hooks:** `useVoiceAssistant`, `usePlantAI`, `useMarkers` handle complex logic.
- **Utils:** Pure functions extracted for audio, image, and editor geometry.
- **Component Split:** Monolithic components decomposed into cleaner, focused UI units.

## Features

### 🎨 Design & Generate
- **Text-to-Image:** Generate stunning garden layouts using **Imagen 4.0**.
- **Aspect Ratio Control:** Support for Square, Portrait, and Landscape formats.

### ✏️ AI Editor
- **Natural Language Editing:** Use **Gemini 2.5 Flash** to add plants, change textures, or modify lighting.
- **Drag & Drop:** Drag plants from the library directly onto your canvas.
- **3D Perspective:** Toggle between 2D and a simulated 3D parallax view.
- **In-Browser Camera:** Capture photos of your yard directly within the app.

### 🎥 Animation (Veo)
- **Image-to-Video:** Transform static garden photos into cinematic videos using **Veo 3.1**.

### 🧠 Analysis & Vision
- **Plant Doctor:** Analyze photos using **Gemini 3 Pro** to identify plants and diagnose issues.
- **Search Grounding:** Verify AI advice with real-time Google Search results.

### 🗣️ Voice Assistant
- **Live API:** Have a real-time, low-latency conversation with an expert gardening AI.

## Setup

1. Clone the repository.
2. Install dependencies: `npm install`
3. Set your API Key:
   ```bash
   export API_KEY="your_google_genai_api_key"
   ```
4. Run the development server: `npm start`

## Tech Stack
- **Frontend:** React 19, TypeScript, Tailwind CSS
- **AI:** @google/genai SDK (Gemini 2.5, 3.0, Veo, Imagen)
- **Audio:** Web Audio API for PCM streaming
