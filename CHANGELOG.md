
# Changelog
All notable changes to this project will be documented in this file.

## [v1.5.0] - 2025-05-25 (AI Core Refactor)

### 🟢 Upgrades
- **Model Migration:** Upgraded high-fidelity generation from Imagen to **Gemini 3 Pro Image Preview**, enabling 2K/4K resolution and improved prompt adherence.
- **Base Models:** Switched core text and vision tasks to **Gemini 3 Flash/Pro** series for faster and more accurate analysis.
- **Video API:** Standardized Veo 3.1 implementation with robust key selection handling.

### 🟢 Refactoring
- **Service Layer:** Unified AI model constants in `data/constants.ts` to prevent "magic strings" and ensure cross-component consistency.
- **Imaging Pipeline:** Refactored `ImagingService` and `WorkflowService` to support multi-part responses (Text + Image) from Gemini 3 models.
- **Documentation:** Comprehensive update to README, Roadmap, and internal docs.

## [v1.3.0] - 2025-05-23 (Production Robustness)

### 🟢 Robustness & Optimization
- **Async Safety:** Implemented `useRef` mount tracking in `Generator`, `VideoAnimator`, and `ImageAnalyzer` to prevent state updates on unmounted components.
- **Resource Cleanup:** Added strict `useEffect` teardown logic for `useVoiceAssistant`.

## [v1.2.0] - 2025-05-22 (Architecture)
- **Extracted Logic:** Split markers, history, and voice into dedicated hooks.

## [v1.0.0] - 2025-05-20 (Initial Release)
- **Core:** Initial launch with Flash, Pro, Imagen, and Veo models.
