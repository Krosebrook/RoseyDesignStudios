
# Changelog
All notable changes to this project will be documented in this file.

## [v1.3.0] - 2025-05-23 (Production Robustness)

### 🟢 Robustness & Optimization
- **Async Safety:** Implemented `useRef` mount tracking in `Generator`, `VideoAnimator`, and `ImageAnalyzer` to prevent state updates on unmounted components (fixing potential memory leaks).
- **Resource Cleanup:** Added strict `useEffect` teardown logic for `useVoiceAssistant` to release microphone streams and AudioContexts when navigating away.
- **Accessibility:** Added ARIA labels and roles to navigation elements in `Header` for better screen reader support.

## [v1.2.0] - 2025-05-22 (Production Grade Refactoring)

### 🟢 Refactoring
- **VoiceChat:** Extracted complex audio/socket logic into `hooks/useVoiceAssistant.ts`.
- **Editor:** Extracted geometry logic to `utils/editor.ts` and marker state to `hooks/useMarkers.ts`.
- **Cleanup:** Centralized constants and improved type safety across the board.

## [v1.1.0] - 2025-05-21 (Feature Expansion)

### 🟢 Features
- **Seasonal Spotlight:** Dynamic homepage component suggesting plants based on the current month.
- **Plant AI:** Added specific "Artistic Style" and "Lighting" controls for generating plant variations.
- **Carousel:** Implemented multi-image carousel for plant variations.

## [v1.0.0] - 2025-05-20 (Initial Release)

### 🟢 Core
- **GenAI Integration:** Full suite of Gemini models (Flash, Pro, Imagen, Veo) integrated.
- **UI Framework:** Tailwind CSS with a responsive, mobile-first design.
