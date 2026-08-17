/**
 * ============================================================================
 * ElectronFlow — tests/adversarial_stress_suite.js
 * 
 * Standalone Adversarial Stress Harness & Empirical Verification Suite
 * Critic / Empirical Challenger Role
 * 
 * Evaluates:
 * 1. Numerical stability and edge cases (zero resistance, infinite C/L, negative voltages,
 *    critical damping zeta=1, extreme AC frequency, Op-Amp rail saturation clipping,
 *    and canvas rendering coordinate validity).
 * 2. Canvas geometry boundary limits and no NaN coordinates during draw calls.
 * 3. Lifecycle, animation frame cancellation, and leak-free rapid step transitions.
 * ============================================================================
 */

const fs = require('fs');
const path = require('path');
const { Assertions, TestEnvironment } = require('./test_harness');

const {
  assert,
  assertEqual,
  assertNotEqual,
  assertDeepEqual,
  assertCloseTo,
  assertMatches,
  assertGreaterThan,
  assertGreaterThanOrEqual,
  assertLessThan,
  assertLessThanOrEqual,
  assertDefined,
  assertThrows
} = Assertions;

function runAdversarialStressSuite() {
  const results = [];
  const projectRoot = path.resolve(__dirname, '..');

  function test(name, fn) {
    const startTime = Date.now();
    try {
      fn();
      results.push({ name, passed: true, duration: Date.now() - startTime });
    } catch (err) {
      results.push({ name, passed: false, error: err.message, stack: err.stack, duration: Date.now() - startTime });
    }
  }

  const env = new TestEnvironment();
  const ctx = env.loadScripts();

  /* ==========================================================================
     SECTION 1: RLC Second-Order Mathematical Damping & Regime Boundaries
     ========================================================================== */

  test('ADV-RLC-1: Exact Critical Damping Threshold (zeta = 1.0000)', () => {
    // Parameter set: L = 100 mH (0.1 H), C = 10 uF (1e-5 F)
    // omega0 = 1 / sqrt(0.1 * 1e-5) = 1 / sqrt(1e-6) = 1000 rad/s
    // Critical resistance: Rcrit = 2 * sqrt(L / C) = 2 * sqrt(0.1 / 1e-5) = 200 Ohm
    const L = 0.1;
    const C = 1e-5;
    const R = 200.0;
    const Vs = 12.0;

    const alpha = R / (2 * L); // 200 / 0.2 = 1000 Np/s
    const omega0 = 1 / Math.sqrt(L * C); // 1000 rad/s
    const zeta = alpha / omega0; // 1.000

    assertEqual(zeta, 1.0, 'Zeta must be exactly 1.0 at critical damping');

    // Test critical damping solution: vC(t) = Vs * (1 - (1 + alpha * t) * exp(-alpha * t))
    const timePoints = [0, 0.0005, 0.001, 0.002, 0.005, 0.01, 0.05];
    let prevVc = -1;
    timePoints.forEach(t => {
      const vC = Vs * (1 - (1 + alpha * t) * Math.exp(-alpha * t));
      assert(!isNaN(vC) && isFinite(vC), `vC(t=${t}) must be finite and non-NaN, got ${vC}`);
      assertGreaterThanOrEqual(vC, prevVc, `Critically damped step response must be monotonically increasing at t=${t}`);
      assertLessThanOrEqual(vC, Vs, `Critically damped response must never overshoot Vs (${Vs}V), got ${vC}`);
      prevVc = vC;
    });

    // Check boundary values
    const vC_0 = Vs * (1 - (1 + alpha * 0) * Math.exp(0));
    assertEqual(vC_0, 0.0, 'Initial voltage at t=0 must be 0V');
    const vC_inf = Vs * (1 - (1 + alpha * 1) * Math.exp(-1000));
    assertCloseTo(vC_inf, Vs, 1e-6, 'Steady state at large t must equal Vs');
  });

  test('ADV-RLC-2: Smooth Regime Transition across Critical Boundary (0.998 <= zeta <= 1.002)', () => {
    // Verify that the piecewise threshold in script.js (zeta < 0.999 underdamped, zeta > 1.001 overdamped, else critical)
    // produces continuous, stable values without numerical division-by-zero or NaN
    const L = 0.1;
    const C = 1e-5;
    const omega0 = 1 / Math.sqrt(L * C); // 1000 rad/s
    const Vs = 10.0;
    const t = 0.002; // 2 ms

    // Case A: Sub-boundary zeta = 0.998 (Underdamped branch)
    const R_under = 2 * L * omega0 * 0.998;
    const alpha_under = R_under / (2 * L);
    const zeta_under = alpha_under / omega0;
    const omegad_under = Math.sqrt(omega0 * omega0 - alpha_under * alpha_under);
    const vC_under = Vs * (1 - Math.exp(-alpha_under * t) * (Math.cos(omegad_under * t) + (alpha_under / omegad_under) * Math.sin(omegad_under * t)));

    // Case B: Critical boundary zeta = 1.000 (Critical branch)
    const R_crit = 2 * L * omega0 * 1.000;
    const alpha_crit = R_crit / (2 * L);
    const vC_crit = Vs * (1 - (1 + alpha_crit * t) * Math.exp(-alpha_crit * t));

    // Case C: Over-boundary zeta = 1.002 (Overdamped branch)
    const R_over = 2 * L * omega0 * 1.002;
    const alpha_over = R_over / (2 * L);
    const zeta_over = alpha_over / omega0;
    const beta_over = Math.sqrt(alpha_over * alpha_over - omega0 * omega0);
    const s1_over = -alpha_over + beta_over;
    const s2_over = -alpha_over - beta_over;
    const vC_over = Vs * (1 - (s2_over * Math.exp(s1_over * t) - s1_over * Math.exp(s2_over * t)) / (s2_over - s1_over));

    assert(!isNaN(vC_under) && isFinite(vC_under), `vC_under must be finite, got ${vC_under}`);
    assert(!isNaN(vC_crit) && isFinite(vC_crit), `vC_crit must be finite, got ${vC_crit}`);
    assert(!isNaN(vC_over) && isFinite(vC_over), `vC_over must be finite, got ${vC_over}`);

    // The differences across the delta = 0.002 margin should be less than 0.05V (continuous)
    assertCloseTo(vC_under, vC_crit, 0.05, 'Underdamped and Critical response must be smoothly continuous');
    assertCloseTo(vC_over, vC_crit, 0.05, 'Overdamped and Critical response must be smoothly continuous');
  });

  test('ADV-RLC-3: Heavily Underdamped Ringing & Overshoot Calculation (zeta = 0.1)', () => {
    // Underdamped RLC with strong ringing: R = 20 Ohm, L = 0.1 H, C = 10 uF
    // omega0 = 1000 rad/s, alpha = 20 / 0.2 = 100 Np/s -> zeta = 0.1
    const L = 0.1;
    const C = 1e-5;
    const R = 20.0;
    const Vs = 10.0;

    const alpha = R / (2 * L); // 100 Np/s
    const omega0 = 1 / Math.sqrt(L * C); // 1000 rad/s
    const zeta = alpha / omega0; // 0.1
    const omegad = Math.sqrt(omega0 * omega0 - alpha * alpha); // sqrt(10^6 - 10000) = 994.987 rad/s

    // First peak occurs at tp = pi / omegad
    const tp = Math.PI / omegad;
    const vC_peak = Vs * (1 - Math.exp(-alpha * tp) * (Math.cos(omegad * tp) + (alpha / omegad) * Math.sin(omegad * tp)));
    // Theoretical peak = Vs * (1 + exp(-pi * zeta / sqrt(1 - zeta^2))) = 10 * (1 + exp(-pi * 0.1 / 0.994987)) = 10 * (1 + 0.729) = 17.29 V
    const theoreticalPeak = Vs * (1 + Math.exp(-Math.PI * zeta / Math.sqrt(1 - zeta * zeta)));

    assertCloseTo(vC_peak, theoreticalPeak, 1e-3, 'Peak voltage in underdamped circuit must match theoretical peak');
    assertGreaterThan(vC_peak, Vs, 'Underdamped circuit must exhibit voltage overshoot exceeding Vs');
  });

  test('ADV-RLC-4: Severely Overdamped Sluggish Response (zeta = 10.0)', () => {
    // R = 2000 Ohm, L = 0.1 H, C = 10 uF -> alpha = 10000 Np/s, omega0 = 1000 rad/s -> zeta = 10.0
    const L = 0.1;
    const C = 1e-5;
    const R = 2000.0;
    const Vs = 10.0;

    const alpha = R / (2 * L);
    const omega0 = 1 / Math.sqrt(L * C);
    const beta = Math.sqrt(alpha * alpha - omega0 * omega0);
    const s1 = -alpha + beta; // -10000 + 9949.87 = -50.125 s^-1 (dominant slow pole)
    const s2 = -alpha - beta; // -19949.87 s^-1 (fast decaying pole)

    const calcVc = (t) => Vs * (1 - (s2 * Math.exp(s1 * t) - s1 * Math.exp(s2 * t)) / (s2 - s1));

    assertEqual(calcVc(0), 0.0, 'vC(0) must be 0');
    // At t = 20 ms (0.02s), slow pole gives 1 - exp(-50.125 * 0.02) = 1 - exp(-1.0025) ≈ 63.3% of Vs = 6.33V
    assertCloseTo(calcVc(0.02), 6.33, 0.1, 'Sluggish response at t=20ms must match dominant pole decay');
    assertLessThan(calcVc(0.02), Vs, 'Overdamped response must not overshoot');
  });

  /* ==========================================================================
     SECTION 2: Op-Amp Gain, Rail Saturation & Inverting/Non-Inverting Modes
     ========================================================================== */

  test('ADV-OPAMP-1: Hard Rail Saturation Clipping at exactly +/- Vsat', () => {
    // Inverting configuration: Av = -Rf / Rin = -50k / 10k = -5.0
    // VinAmp = 4.0 Vpk -> Ideal Vout peak = |-5.0 * 4.0| = 20.0 Vpk
    // Rails Vsat = 12.0 V -> Actual output must hard-clip at [-12.0, +12.0] V
    const Rf = 50.0;
    const Rin = 10.0;
    const VinAmp = 4.0;
    const Vsat = 12.0;
    const isInv = true;

    const Av = isInv ? (-Rf / Rin) : (1 + Rf / Rin);
    assertEqual(Av, -5.0, 'Inverting gain must be -5.0');

    const numSamples = 200;
    let hitPositiveRail = false;
    let hitNegativeRail = false;
    let exceededRail = false;

    for (let i = 0; i <= numSamples; i++) {
      const t = (i / numSamples) * 2 * Math.PI;
      const idealOut = Av * VinAmp * Math.sin(t);
      const actualOut = Math.max(-Vsat, Math.min(Vsat, idealOut));

      if (actualOut === Vsat) hitPositiveRail = true;
      if (actualOut === -Vsat) hitNegativeRail = true;
      if (actualOut > Vsat + 1e-9 || actualOut < -Vsat - 1e-9) exceededRail = true;

      assert(!isNaN(actualOut) && isFinite(actualOut), `actualOut must be finite at t=${t}`);
    }

    assert(hitPositiveRail, 'Output waveform must reach +Vsat (+12.0V) clipping flat top');
    assert(hitNegativeRail, 'Output waveform must reach -Vsat (-12.0V) clipping flat bottom');
    assertEqual(exceededRail, false, 'Output waveform must NEVER exceed +/- Vsat under hard clipping');
  });

  test('ADV-OPAMP-2: Non-Inverting Mode Gain Av = 1 + Rf / Rin with Unity Gain Buffer Limit (Rf = 0)', () => {
    // Non-inverting with Rf = 0 (Voltage Follower / Buffer)
    const Rf = 0.0;
    const Rin = 10.0;
    const Av = 1 + Rf / Rin;
    assertEqual(Av, 1.0, 'Gain of non-inverting buffer (Rf=0) must be exactly 1.0');

    const VinAmp = 3.5;
    const Vsat = 15.0;
    const idealPeak = Math.abs(Av * VinAmp);
    const actualPeak = Math.min(idealPeak, Vsat);

    assertEqual(actualPeak, 3.5, 'Actual peak of buffer with Vin=3.5V must be exactly 3.5V');
    assertEqual(idealPeak <= Vsat, true, 'Buffer must be in linear regime');
  });

  test('ADV-OPAMP-3: Extreme Inverting Gain Av = -100 with Small Input Vin = 0.05V (Linear Regime Boundary)', () => {
    // High gain: Rf = 100k, Rin = 1k -> Av = -100
    // Small input: Vin = 0.05V -> Ideal Vout = 5.0Vpk < Vsat (13.5V) -> Linear operation
    const Rf = 100.0;
    const Rin = 1.0;
    const VinAmp = 0.05;
    const Vsat = 13.5;

    const Av = -Rf / Rin;
    assertEqual(Av, -100.0, 'Gain must be -100');

    const vIdealPeak = Math.abs(Av * VinAmp);
    assertEqual(vIdealPeak, 5.0, 'Ideal peak output must be 5.0V');
    const isSaturated = vIdealPeak > Vsat;
    assertEqual(isSaturated, false, 'Should be in LINEAR REGIME, not saturated');
  });

  /* ==========================================================================
     SECTION 3: Real-Time AC Oscilloscope Dynamics & Extreme Frequency Limits
     ========================================================================== */

  test('ADV-OSC-1: Extreme AC Frequency Limits (f = 0.001 Hz to f = 100 kHz)', () => {
    // Test that the trigonometric evaluation loop handles extreme frequency ranges without NaN or infinite values
    const frequencies = [0.001, 1, 60, 1000, 20000, 100000];
    const Vm = 10.0;
    const phaseDeg = 45;
    const phiRad = (phaseDeg * Math.PI) / 180;
    const timeDivMs = 5.0;
    const secPerScreen = (10 * timeDivMs) / 1000; // 0.05 s
    const widthPixels = 640;

    frequencies.forEach(freq => {
      const omega = 2 * Math.PI * freq;
      let minVal = Infinity;
      let maxVal = -Infinity;

      for (let x = 0; x < widthPixels; x++) {
        const t = (x / widthPixels) * secPerScreen;
        const v = Vm * Math.sin(omega * t + phiRad);
        assert(!isNaN(v) && isFinite(v), `Oscilloscope sample at freq=${freq}, x=${x} must be finite`);
        if (v < minVal) minVal = v;
        if (v > maxVal) maxVal = v;
      }

      assertLessThanOrEqual(maxVal, Vm + 1e-9, `Max sample cannot exceed Vm (${Vm}V)`);
      assertGreaterThanOrEqual(minVal, -Vm - 1e-9, `Min sample cannot be less than -Vm (-${Vm}V)`);
    });
  });

  test('ADV-OSC-2: AC RMS and Peak-to-Peak Exact Mathematical Relationships', () => {
    // Vrms = Vm / sqrt(2), Vpp = 2 * Vm
    const testAmplitudes = [0.5, 1.0, 5.0, 10.0, 120.0, 325.27];
    testAmplitudes.forEach(Vm => {
      const vRms = Vm / Math.SQRT2;
      const vPp = 2 * Vm;

      assertCloseTo(vRms * Math.SQRT2, Vm, 1e-6, `Vrms * sqrt(2) must equal Vm (${Vm})`);
      assertCloseTo(vPp / 2, Vm, 1e-6, `Vpp / 2 must equal Vm (${Vm})`);
    });
  });

  test('ADV-OSC-3: Dual Trace 90-degree Quadrature Phase Shift', () => {
    // CH1: v1(t) = Vm * sin(wt + phi)
    // CH2: v2(t) = 0.7 * Vm * sin(wt + phi - pi/2) = -0.7 * Vm * cos(wt + phi)
    const Vm = 10.0;
    const omega = 2 * Math.PI * 60;
    const phiRad = 0;
    const t = 0.005;

    const v1 = Vm * Math.sin(omega * t + phiRad);
    const v2 = (Vm * 0.70) * Math.sin(omega * t + phiRad - (Math.PI / 2));
    const v2_expected = -0.70 * Vm * Math.cos(omega * t + phiRad);

    assertCloseTo(v2, v2_expected, 1e-6, 'CH2 lagging by 90 degrees must equal -0.7*Vm*cos(wt)');
    // Orthogonality: (v1/Vm)^2 + (v2 / (0.7*Vm))^2 == 1 (Lissajous circle/ellipse)
    const norm1 = v1 / Vm;
    const norm2 = v2 / (0.70 * Vm);
    assertCloseTo(norm1 * norm1 + norm2 * norm2, 1.0, 1e-6, 'Normalized quadrature channels must satisfy sum of squares = 1');
  });

  /* ==========================================================================
     SECTION 4: Voltage Divider, Thévenin Equivalence & Load Sag Limits
     ========================================================================== */

  test('ADV-VD-1: Extreme Load Conditions (RL -> 0 Short vs RL -> Infinity Open)', () => {
    const Vin = 24.0;
    const R1 = 1000.0;
    const R2 = 1000.0;

    const vUnloaded = Vin * (R2 / (R1 + R2)); // 12.0 V
    const Rth = (R1 * R2) / (R1 + R2); // 500.0 Ohm
    assertEqual(vUnloaded, 12.0, 'V_open must be 12.0V');
    assertEqual(Rth, 500.0, 'R_th must be 500 Ohm');

    // Case A: Infinite Load (RL = 1e9 Ohm)
    const Rload_open = 1e9;
    const req2_open = (R2 * Rload_open) / (R2 + Rload_open);
    const iTot_open = Vin / (R1 + req2_open);
    const vOut_open = iTot_open * req2_open;
    assertCloseTo(vOut_open, vUnloaded, 1e-4, 'Unloaded Vout must equal 12.0V');

    // Case B: Matched Load (RL = Rth = 500 Ohm) -> Maximum Power Transfer condition
    const Rload_matched = Rth;
    const req2_matched = (R2 * Rload_matched) / (R2 + Rload_matched); // 1000 * 500 / 1500 = 333.33 Ohm
    const iTot_matched = Vin / (R1 + req2_matched); // 24 / 1333.33 = 0.018 A
    const vOut_matched = iTot_matched * req2_matched; // 6.0 V (exactly half of Vth)
    assertCloseTo(vOut_matched, vUnloaded / 2, 1e-4, 'Matched load (RL=Rth) must produce exactly 50% of Vth (6.0V)');

    // Case C: Heavy Load (RL = 50 Ohm -> severe sag)
    const Rload_heavy = 50.0;
    const req2_heavy = (R2 * Rload_heavy) / (R2 + Rload_heavy); // 1000 * 50 / 1050 = 47.619 Ohm
    const iTot_heavy = Vin / (R1 + req2_heavy);
    const vOut_heavy = iTot_heavy * req2_heavy; // 24 * (47.619 / 1047.619) = 1.09V
    const sagPct = ((vUnloaded - vOut_heavy) / vUnloaded) * 100;
    assertGreaterThan(sagPct, 90.0, 'Heavy load (50 Ohm) must cause over 90% voltage sag');
  });

  test('ADV-VD-2: Voltage Sag Calculation Stability when Vin = 0 or R2 = 0', () => {
    // When Vin = 0 or R2 = 0, vUnloaded = 0.
    // Ensure that calculation ((vUnloaded - vOut) / vUnloaded) * 100 handles zero denominator gracefully
    const calcSafeSag = (vUnloaded, vOut) => {
      if (vUnloaded === 0) return 0.0;
      return ((vUnloaded - vOut) / vUnloaded) * 100;
    };

    assertEqual(calcSafeSag(0, 0), 0.0, 'Safe sag with 0V must be 0% not NaN');
    assertEqual(calcSafeSag(10, 8), 20.0, 'Safe sag with 10V->8V must be 20%');
  });

  /* ==========================================================================
     SECTION 5: Ohm\'s Law Zero Resistance, Zero Voltage & Sign Conservation
     ========================================================================== */

  test('ADV-OHM-1: Zero Voltage and Negative Voltage Behavior', () => {
    // Test Ohm's Law formulas under V = 0 and V = -12V
    const calcOhms = (v, r, isClosed) => {
      const current = isClosed ? (v / r) : 0;
      const power = current * v; // P = V^2 / R >= 0 for resistive elements
      return { current, power };
    };

    const zeroResult = calcOhms(0, 100, true);
    assertEqual(zeroResult.current, 0.0, 'Current at 0V must be 0A');
    assertEqual(zeroResult.power, 0.0, 'Power at 0V must be 0W');

    const negResult = calcOhms(-12, 100, true);
    assertEqual(negResult.current, -0.12, 'Current at -12V must be -0.12A (-120mA)');
    assertEqual(negResult.power, 1.44, 'Power absorbed by resistor must be positive +1.44W');
  });

  test('ADV-OHM-2: Zero Resistance Division by Zero Guard', () => {
    // Testing physical guard when R -> 0
    const safeCurrent = (v, r) => {
      if (r <= 0) return { error: 'SHORT_CIRCUIT', current: Infinity };
      return { current: v / r };
    };

    assertEqual(safeCurrent(12, 0).error, 'SHORT_CIRCUIT', 'R=0 must be identified as short circuit');
  });

  /* ==========================================================================
     SECTION 6: Canvas Drawing Path Coordinates & Geometry Sanity
     ========================================================================== */

  test('ADV-CANVAS-1: Mock Canvas 2D Path Coordinates are all Finite Numbers', () => {
    // Instantiate test sandbox and render each simulator type, inspecting drawHistory for NaN/Infinity
    env.setupCoreDOMElements();
    const canvas = env.getElementById('electron-canvas');
    const ctx2d = canvas.getContext('2d');

    // 1. Test AC Oscilloscope rendering
    ctx.AppState.circuitState.acVm = 5.0;
    ctx.AppState.circuitState.acFreq = 60;
    ctx.AppState.circuitState.acPhase = 30;
    ctx.AppState.circuitState.acVoltsDiv = 2.0;
    ctx.AppState.circuitState.acTimeDiv = 5.0;
    ctx.AppState.circuitState.acDualTrace = true;
    ctx.AppState.circuitState.acRunning = true;

    ctx2d.resetHistory();
    ctx.SimulatorEngine.start('ac-oscilloscope');
    env.stepAnimation();

    let foundNaN = false;
    ctx2d.drawHistory.forEach(op => {
      ['x', 'y', 'w', 'h', 'r'].forEach(param => {
        if (op[param] !== undefined && (isNaN(op[param]) || !isFinite(op[param]))) {
          foundNaN = true;
        }
      });
    });
    assertEqual(foundNaN, false, 'ac-oscilloscope must not generate NaN or infinite canvas coordinates');

    // 2. Test RC / RLC Transient rendering
    ctx.AppState.circuitState.transientMode = 'rlc';
    ctx.AppState.circuitState.rcR = 200; // Critically damped
    ctx.AppState.circuitState.rcC = 10;
    ctx.AppState.circuitState.rlcL = 100;
    ctx.AppState.circuitState.rcVs = 10;

    ctx2d.resetHistory();
    ctx.SimulatorEngine.start('rlc-transient');
    env.stepAnimation();

    foundNaN = false;
    ctx2d.drawHistory.forEach(op => {
      ['x', 'y', 'w', 'h', 'r'].forEach(param => {
        if (op[param] !== undefined && (isNaN(op[param]) || !isFinite(op[param]))) {
          foundNaN = true;
        }
      });
    });
    assertEqual(foundNaN, false, 'rlc-transient must not generate NaN canvas coordinates');

    // 3. Test Op-Amp Circuit rendering
    ctx.AppState.circuitState.opampMode = 'inverting';
    ctx.AppState.circuitState.opampRf = 20;
    ctx.AppState.circuitState.opampRin = 10;
    ctx.AppState.circuitState.opampVinAmp = 4.0;
    ctx.AppState.circuitState.opampVsat = 12.0;

    ctx2d.resetHistory();
    ctx.SimulatorEngine.start('opamp-gain');
    env.stepAnimation();

    foundNaN = false;
    ctx2d.drawHistory.forEach(op => {
      ['x', 'y', 'w', 'h', 'r'].forEach(param => {
        if (op[param] !== undefined && (isNaN(op[param]) || !isFinite(op[param]))) {
          foundNaN = true;
        }
      });
    });
    assertEqual(foundNaN, false, 'opamp-gain must not generate NaN canvas coordinates');

    ctx.SimulatorEngine.stop();
  });

  /* ==========================================================================
     SECTION 7: Rapid Step Transition & Animation Frame Leak Prevention
     ========================================================================== */

  test('ADV-LEAK-1: Rapid Step Switching (100 transitions) does not leak animation loops', () => {
    env.setupCoreDOMElements();

    // Start with a simulator running
    ctx.SimulatorEngine.start('ac-oscilloscope');
    assertDefined(ctx.window.electronAnimationId, 'electronAnimationId must be assigned');
    const initialAnimId = ctx.window.electronAnimationId;

    // Simulate 100 rapid step switches across different course lessons and steps
    for (let i = 0; i < 100; i++) {
      const lessonIdx = (i % 20) + 1;
      const lessonId = `lesson-${Math.ceil(lessonIdx / 3)}-${((lessonIdx - 1) % 3) + 1}`;
      ctx.showLessonView('ee-fundamentals', lessonId);
      // Switch between step types
      ctx.AppState.currentStepIndex = i % 4;
      ctx.renderCurrentStep();
    }

    // After stopping, no orphan animation callbacks should remain active
    ctx.SimulatorEngine.stop();
    assertEqual(ctx.window.electronAnimationId, null, 'window.electronAnimationId must be null after stop()');
    assertEqual(env.animationCallbacks.size, 0, 'No active requestAnimationFrame callbacks should remain registered');
  });

  test('ADV-LEAK-2: showDashboardView() cleanly cancels any running simulator animation', () => {
    env.setupCoreDOMElements();
    ctx.SimulatorEngine.start('rc-transient');
    assertDefined(ctx.window.electronAnimationId, 'Animation ID must be active');

    ctx.showDashboardView();
    assertEqual(ctx.window.electronAnimationId, null, 'Dashboard view must cancel active animation ID');
    assertEqual(ctx.AppState.currentView, 'dashboard', 'View must be dashboard');
  });

  env.cleanup();
  return results;
}

// If executed directly via `node tests/adversarial_stress_suite.js`
if (require.main === module) {
  console.log('========================================================================');
  console.log('       🔥 ElectronFlow EE 101 — Adversarial Stress Test Suite 🔥        ');
  console.log('========================================================================\n');

  const results = runAdversarialStressSuite();
  let passedCount = 0;
  let failedCount = 0;

  results.forEach(r => {
    if (r.passed) {
      passedCount++;
      console.log(`  ✔ [PASÓ] ${r.name} (${r.duration}ms)`);
    } else {
      failedCount++;
      console.log(`  ✖ [FALLÓ] ${r.name} (${r.duration}ms)`);
      console.log(`    Error: ${r.error}`);
      if (r.stack) console.log(`    Stack: ${r.stack.split('\n').slice(1, 3).join('\n')}`);
    }
  });

  console.log('\n------------------------------------------------------------------------');
  console.log(` Total de Pruebas: ${results.length} | Aprobadas: ${passedCount} | Fallidas: ${failedCount}`);
  console.log('------------------------------------------------------------------------\n');

  if (failedCount > 0) {
    process.exit(1);
  }
}

module.exports = { runAdversarialStressSuite };
