# Project: ElectronFlow EE 101 Educational Platform

## Architecture
ElectronFlow is a modern, modular educational web platform for introductory and intermediate electrical engineering (EE 101).
- **Presentation Layer**: `index.html`, `styles.css` — responsive UI, course navigation, modal cheatsheets, KaTeX math typesetting (`vendor/katex/`).
- **Curriculum & Data Layer**: `curriculum.js` (20 modules across 8 phases, content, simulations, quizzes, practice problems, flashcards), `tutor_knowledge_base.js` (grounded textbook concepts, formulas, citations).
- **Interactive Simulator Engine**: `script.js` — Canvas 2D circuit simulations, dynamic controls, AC oscilloscope, RC/RLC transient curve generator, Op-Amp gain visualizers, electron flow animation.
- **AI Tutor & Audio Sync Engine**: `tutor_engine.js`, `script.js` — local semantic matcher + Gemini API fallback, read-along sentence audio synchronization (`audio/lesson-*.mp3` and `.json`).
- **Verification & Testing Layer**: `textbook_verification_matrix.md`, automated E2E test harness (`tests/e2e_runner.js` / test suites).

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Master Textbook Verification Matrix | Produce `textbook_verification_matrix.md` mapping all 20 modules to Alexander & Sadiku (7th ed), Horowitz & Hill (x-Chapters), and Morris Mano (6th ed). | M1 | ORIGINAL_REQUEST §R1 |
| 2 | Curriculum LaTeX Math Upgrade & Artifact Cleanup | Convert all equations in `curriculum.js` and `tutor_knowledge_base.js` to canonical 2D KaTeX (`$$...$$`, `$...$`), fix units (W, VAR, VA, Hz, rad/s), fix `totalLessons: 20`, and eliminate `18988` artifacts. | M1 | Survey Miner & Explorer |
| 3 | University-Level Problem Sets Authoring | Author 8 university-level homework problems across all 8 phases with complete step-by-step LaTeX derivations and textbook citations. | M2 | ORIGINAL_REQUEST §R2 |
| 4 | Practice Problem UI Renderer & Quiz KaTeX Dynamic Feedback Fix | Add `practice` step UI in `script.js` and fix dynamic quiz feedback rendering with `innerHTML` and `renderMath()`. | M2 | Survey Problems Explorer |
| 5 | Real-Time AC Oscilloscope Simulator | Dual-trace AC oscilloscope with variable frequency, amplitude, and phase, phosphor CRT grid, and dynamic trigonometric waveform rendering. | M3 | ORIGINAL_REQUEST §R3 |
| 6 | Interactive RC/RLC Transient Response Curve Generator | Dynamic transient visualizer for charging/discharging curves, time constant markers ($1\tau-5\tau$), and underdamped/critically damped/overdamped RLC regimes. | M3 | ORIGINAL_REQUEST §R3 |
| 7 | Voltage Divider & Thevenin Visualizer | Interactive voltage divider and loaded Thevenin circuit visualizer with dynamic current and voltage drop readouts. | M3 | ORIGINAL_REQUEST §R3 |
| 8 | Op-Amp Inverting / Non-Inverting Gain & Saturation Visualizer | Interactive op-amp circuit visualizer showing linear gain ($A_v$) and rail saturation ($\pm V_{\text{sat}}$) clipping. | M3 | ORIGINAL_REQUEST §R3 |
| 9 | Opaque-Box E2E Test Suite (Tiers 1-4) | Comprehensive test suite covering feature coverage, boundary conditions, cross-feature interactions, and real-world application scenarios. | M4 | ORIGINAL_REQUEST §R4 |
| 10 | System-Wide Runtime QA, Audio Sync & Keyboard Validation | Validate KaTeX 2D rendering, audio sentence highlighting sync, keyboard shortcuts (1-4, Space, Enter, Arrows), 0% clean initialization, and zero console errors. | M5 | ORIGINAL_REQUEST §R4 |
| 11 | Adversarial Coverage Hardening (Tier 5) | White-box stress-testing, adversarial edge cases, and continuous validation. | M5 | Project Orchestration Pattern |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | Academic Corroboration & Master Matrix | F1, F2: Verify all 20 modules, generate `textbook_verification_matrix.md`, upgrade LaTeX formulas and fix curriculum data. | none | PLANNED |
| 2 | University Problem Sets & Solutions | F3, F4: Author 8 university homework sets with LaTeX derivations, add practice step UI in `script.js`, fix KaTeX feedback rendering. | M1 | PLANNED |
| 3 | Dynamic Interactive Simulators | F5, F6, F7, F8: Implement AC Oscilloscope, RC/RLC Transient Generator, Voltage Divider, and Op-Amp visualizers in `script.js`. | none | PLANNED |
| 4 | E2E Testing Suite Track | F9: Build standalone E2E test harness and test cases (Tiers 1-4), publish `TEST_READY.md`. | none | PLANNED |
| 5 | Final E2E Test Pass & Adversarial Hardening | F10, F11: Pass 100% of E2E tests, execute Tier 5 adversarial hardening, and pass Forensic Integrity Audit. | M1, M2, M3, M4 | PLANNED |

## Interface Contracts
### `curriculum.js` ↔ `script.js` (Step Schemas)
- **Content Step**: `{ id: string, type: "content", title: string, readingContent: string, bulletPoints: string[], formula: string, formulaDesc: string }`
- **Animation/Lab Step**: `{ id: string, type: "animation", title: string, labType: "ohms-law" | "voltage-divider" | "rc-transient" | "rlc-transient" | "ac-oscilloscope" | "opamp-gain", ... }`
- **Quiz Step**: `{ id: string, type: "quiz", title: string, question: string, options: string[], correctIndex: number (0..3), explanation: string }`
- **Practice Step**: `{ id: string, type: "practice", title: string, problemStatement: string, givenData: object, hint: string, solutionSteps: string[], finalAnswer: string, textbookCitation: string }`
- **Flashcard Step**: `{ id: string, type: "flashcards", title: string, cards: Array<{ front: string, back: string }> }`

### `tutor_knowledge_base.js` ↔ `tutor_engine.js`
- Knowledge Item: `{ id: string, title: string, category: string, coreLaw: string, mathFormula: string, plainExplanation: string, engineeringApplication: string, commonMistake: string, textbookReference: { book: string, edition: string, chapter: string, pages: string } }`

### `SimulatorEngine` (`script.js`) ↔ Canvas Rendering
- Dynamic state object: `{ V: number, R1: number, R2: number, C: number, L: number, Vm: number, freq: number, phase: number, Rf: number, Rin: number, Vsat: number, isRunning: boolean }`
- Render loop properly cleaned up via `cancelAnimationFrame(window.electronAnimationId)` on step transitions.

## Code Layout
- `curriculum.js` — Complete course catalog, 8 phases, 20 modules, steps, formulas, quizzes, practice problems.
- `tutor_knowledge_base.js` — Grounded textbook concepts and citations.
- `tutor_engine.js` — AI Tutor query handler and semantic matcher.
- `script.js` — Main application logic, navigation, KaTeX renderer, simulator renderers, audio player sync.
- `styles.css` — Global stylesheets and simulator canvas styles.
- `index.html` — Main SPA structure, KaTeX stylesheets/scripts, canvas container.
- `textbook_verification_matrix.md` — Authoritative textbook verification matrix.
- `tests/` — Standalone test harness and E2E test suites.
