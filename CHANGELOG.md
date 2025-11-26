
# Changelog
All notable changes to this project will be documented in this file.

## [v1.1.0] - 2025-05-21 (Refactoring & Cleanup)

### 🟢 Refactoring
- **Codebase Clean-up**: Centralized AI prompt templates in `data/constants.ts` to separate logic from data.
- **State Management**: Extracted complex AI state management from `PlantLibrary` into a custom `usePlantAI` hook.
- **Service Layer**: Simplified `services/gemini.ts` by removing inline prompts and using the new constants.
- **Documentation**: Added `scripts/sprint_review.py` for automated documentation health checks.

## [v1.0.0] - 2025-05-20 (AI Integration Sprint)

### 🟢 Complete
- **Core Generator**: Upgraded to **Imagen 4.0** for photorealistic results; added aspect ratio controls.
- **Editor**: Implemented **Gemini 2.5 Flash Image** editing.
  - Added Drag-and-Drop plant placement.
  - Added 3D Perspective View (CSS Transform).
  - Added "Save Project" (LocalStorage) and Resume functionality.
  - Added Camera integration for direct capture.
  - **Refactor:** Added non-destructive **Redo** capability to image history.
  - **Refactor:** Improved iconography for Undo/Redo actions.
- **Video**: Integrated **Veo 3.1** for Image-to-Video generation.
- **Analysis**: Integrated **Gemini 3 Pro** for image analysis.
  - Added Google Search Grounding for fact-checking.
- **Voice**: Implemented **Gemini Live API** for real-time bi-directional audio streaming.
- **Plant Library**:
  - Added **Seasonal Spotlight** component.
  - Added AI-powered description enhancement.
  - Added AI-powered plant image variation generator.
- **Architecture**:
  - Refactored monolithic components into `EditorSidebar`, `EditorCanvas`, `PlantCard`.
  - Centralized constants and audio utilities.

### 🟡 Partial / In-Progress
- **Mobile Optimization**: The 3D view works on mobile but performance optimization is ongoing.
- **AR Walkthrough**: Foundation laid with depth estimation concepts, but WebXR implementation is deferred to v1.1.0.

### 🔴 Known Issues
- **Veo Latency**: Video generation can take 1-2 minutes; polling interval set to 5s.
- **Browser Support**: Live API (Web Audio) requires recent Chrome/Edge versions.
