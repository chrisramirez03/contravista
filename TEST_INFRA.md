# E2E Test Infra: ElectronFlow EE 101 Educational Platform

## Test Philosophy
- Opaque-box, requirement-driven. Derived from `ORIGINAL_REQUEST.md`.
- Methodology: Category-Partition + Boundary Value Analysis (BVA) + Pairwise Interaction Testing + Real-World Workload Testing.

## Feature Inventory Mapping
| # | Feature | Source | Tier 1 (Coverage) | Tier 2 (Boundary) | Tier 3 (Pairwise) | Tier 4 (Workload) |
|---|---------|--------|:-----------------:|:-----------------:|:-----------------:|:-----------------:|
| 1 | Master Textbook Matrix | ORIGINAL_REQUEST §R1 | 5 | 5 | ✓ | ✓ |
| 2 | Curriculum LaTeX Math & Data | ORIGINAL_REQUEST §R1 | 5 | 5 | ✓ | ✓ |
| 3 | University Problem Sets | ORIGINAL_REQUEST §R2 | 5 | 5 | ✓ | ✓ |
| 4 | Quiz Bank & KaTeX Feedback | ORIGINAL_REQUEST §R2 | 5 | 5 | ✓ | ✓ |
| 5 | AC Oscilloscope Visualizer | ORIGINAL_REQUEST §R3 | 5 | 5 | ✓ | ✓ |
| 6 | RC/RLC Transient Visualizer | ORIGINAL_REQUEST §R3 | 5 | 5 | ✓ | ✓ |
| 7 | Voltage Divider Visualizer | ORIGINAL_REQUEST §R3 | 5 | 5 | ✓ | ✓ |
| 8 | Op-Amp Gain Visualizer | ORIGINAL_REQUEST §R3 | 5 | 5 | ✓ | ✓ |
| 9 | Audio Timestamp Sync | ORIGINAL_REQUEST §R4 | 5 | 5 | ✓ | ✓ |
| 10 | Keyboard Navigation & State | ORIGINAL_REQUEST §R4 | 5 | 5 | ✓ | ✓ |

## Test Architecture
- Test runner: `node tests/e2e_runner.js` (or JavaScript-based automated runner)
- Coverage tiers:
  - **Tier 1: Feature Coverage** (≥5 tests per feature = 50 tests): Verifies basic functionality of each feature in isolation.
  - **Tier 2: Boundary & Corner Cases** (≥5 tests per feature = 50 tests): Verifies numerical extremes, edge values, negative numbers, extreme slider ranges, zero division guards.
  - **Tier 3: Cross-Feature Interactions** (≥10 tests): Verifies state transitions across steps, simulator parameter updates alongside math rendering, audio sync during navigation, quiz submissions with dynamic KaTeX feedback.
  - **Tier 4: Real-World Student Workload Scenarios** (≥6 scenarios): Full end-to-end student learning flows across all 8 phases from Ohm's law to RLC resonance, AC phasor analysis, Op-Amps, and Digital Logic.
- **Minimum Test Threshold**: 50 (Tier 1) + 50 (Tier 2) + 10 (Tier 3) + 6 (Tier 4) = 116 test cases.

## Coverage Thresholds
- 100% of 20 modules verified and mapped.
- 100% of quiz questions verified.
- 100% of university problem sets have step-by-step LaTeX solutions.
- 100% of simulators execute physical computations and canvas rendering without runtime errors.
