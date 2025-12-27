
# DreamGarden AI

![Version](https://img.shields.io/badge/version-1.5.0-blue)
![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Status](https://img.shields.io/badge/Status-Production_Ready-green)

**DreamGarden AI** is a next-generation landscape design application powered by Google's Gemini ecosystem. It empowers users to visualize, edit, and animate their dream gardens using a suite of advanced generative AI models.

## 🚀 Key Features

### 🎨 Generative Design
- **Gemini 3 Pro Image Integration:** Create stunning, high-resolution (up to 4K) garden layouts from text.
- **Aspect Ratio Control:** Switch seamlessly between Square (1:1), Portrait (9:16), and Landscape (16:9).
- **Pro Features:** Native support for search grounding in generation and complex composition planning.

### ✏️ AI Magic Editor
- **Conversational Editing:** Use **Gemini 2.5 Flash** to modify images (e.g., "Add a stone path", "Make it sunset").
- **Drag & Drop Palette:** Intuitively drag plants and furniture directly onto your design canvas.
- **3D Parallax View:** Toggle a simulated depth view to explore your 2D designs in 3D space.
- **Smart History:** Non-destructive Undo/Redo allowing you to traverse your design evolution.

### 🎥 Cinematic Video (Veo)
- **Image-to-Video:** Bring static designs to life with wind, lighting changes, and camera movement using **Veo 3.1**.

### 🧠 Vision & Analysis
- **Plant Doctor:** Upload photos to identify plants and diagnose diseases using **Gemini 3 Pro**.
- **Search Grounding:** AI advice is cross-referenced with Google Search for accuracy.

### 🗣️ Voice Assistant
- **Live API Integration:** Talk to your garden assistant in real-time for advice and ideas via low-latency PCM streaming.

## 🏗️ Technical Architecture

This project uses a modular, domain-driven architecture focused on resilience and AI model flexibility.

### Directory Structure
```
/src
  /components    # UI Components (Atomic Design inspired)
  /services      # API Layer
    /ai          # Modular AI Logic (Imaging, Video, Analysis)
    /gemini.ts   # Facade Service (Unified Entry Point)
  /hooks         # Shared Business Logic
  /utils         # Infrastructure (Logger, Retry, Errors)
```

### Core Technologies
- **Frontend:** React 19, TypeScript, Tailwind CSS
- **AI Models:**
  - `gemini-3-flash-preview` (Core Logic / Vision)
  - `gemini-3-pro-preview` (Complex Reasoning / Thinking)
  - `gemini-2.5-flash-image` (Fast Editing)
  - `gemini-3-pro-image-preview` (Ultra High-Res Generation)
  - `veo-3.1-fast-generate-preview` (Video)
  - `gemini-2.5-flash-native-audio` (Live API)

## 🛠️ Setup & Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/dreamgarden-ai.git
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment:**
   Set your Google GenAI API key in your environment variables.
   ```bash
   export API_KEY="your_google_genai_api_key"
   ```

4. **Run Locally:**
   ```bash
   npm start
   ```

## 📄 License
MIT
