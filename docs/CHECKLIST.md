# Sprint Documentation Checklist

Use this checklist before closing any sprint or merging major features.

### 1. The Code & Config
- [ ] **README.md:** Did we add new environment variables? Did installation steps change?
- [ ] **Dependencies:** Did `package.json` change? Are updates reflected in the setup guide?
- [ ] **API Keys:** Are new required permissions (e.g., Camera, Microphone) added to `metadata.json`?

### 2. The Features (Changelog)
- [ ] **Completed:** Labeled as `[COMPLETE]` in Changelog.
- [ ] **Partial:** Labeled as `[IN-PROGRESS]` with a note explaining *why* it wasn't finished.
- [ ] **Removed:** If a feature was deprecated, is there a migration guide?

### 3. The Technicals
- [ ] **Models:** Are we using the latest model versions (e.g., `gemini-2.5-flash`, `imagen-4.0`)?
- [ ] **Architecture:** Did we split components? (e.g., `Editor` -> `EditorCanvas`).
- [ ] **Tests:** Did we verify the fallback behavior for AI failures?

### 4. The Handoff
- [ ] **Roadmap:** Are incomplete items moved to the backlog?
- [ ] **Version:** Is the version tag bumped?
