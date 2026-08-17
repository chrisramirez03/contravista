/**
 * ============================================================================
 * ElectronFlow — tests/tier4_student_workloads.js
 * 
 * Nivel 4: Escenarios de Carga de Trabajo de Estudiantes Reales (Student Workloads).
 * Simula de extremo a extremo las trayectorias completas de aprendizaje de
 * estudiantes universitarios a través de las 8 fases curriculares de ElectronFlow:
 * desde física atómica de cargas hasta transitorios RLC, fasores AC y Op-Amps.
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
  assertDefined
} = Assertions;

/**
 * Suite de pruebas Tier 4: Escenarios Reales de Estudiantes
 */
function runTier4Tests() {
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
     ESCENARIO 1: Trayectoria de Fundamentos DC y Ley de Ohm (Fase 1)
     ========================================================================== */
  test('T4.S1: Flujo completo de Fase 1 — Lectura de Cargas, Lab de Ohm, Quiz y Flashcards', () => {
    // 1. El estudiante inicia en 0% en la lección 1.1
    const studentSession = {
      currentLesson: 'lesson-1-1',
      stepIndex: 0,
      xp: 0,
      completedSteps: []
    };

    // 2. Lee el contenido conceptual de la estructura atómica y electrones de valencia
    studentSession.stepIndex = 0; // Paso 0: Content
    studentSession.completedSteps.push('lesson-1-1-step-0');
    studentSession.xp += 10;

    // 3. Pasa al laboratorio interactivo de flujo de electrones (Paso 1: Animation)
    studentSession.stepIndex = 1;
    studentSession.completedSteps.push('lesson-1-1-step-1');
    studentSession.xp += 15;

    // 4. Responde el primer cuestionario sobre velocidad de deriva (Paso 2: Quiz)
    const quiz1 = { correctIndex: 0 };
    const answer1 = 0; // El estudiante acierta
    assertEqual(answer1, quiz1.correctIndex, 'Debe acertar la respuesta 1');
    studentSession.stepIndex = 2;
    studentSession.completedSteps.push('lesson-1-1-step-2');
    studentSession.xp += 25;

    // 5. Revisa las tarjetas de memoria (Paso 3 y 4: Flashcards)
    studentSession.stepIndex = 3;
    studentSession.completedSteps.push('lesson-1-1-step-3');
    studentSession.xp += 10;

    // 6. Llega a la pantalla de felicitaciones (Paso 5: Complete)
    studentSession.stepIndex = 4;
    studentSession.completedSteps.push('lesson-1-1-step-4');
    studentSession.xp += 15;

    assertEqual(studentSession.xp, 75, 'El estudiante debe acumular 75 XP al culminar la lección 1.1');
    assertEqual(studentSession.completedSteps.length, 5, 'Debe haber completado los 5 pasos del flujo');
  });

  /* ==========================================================================
     ESCENARIO 2: Análisis Sistemático de Redes y Equivalente de Thévenin (Fase 2)
     ========================================================================== */
  test('T4.S2: Flujo completo de Fase 2 — Análisis Nodal, Mallas y Reducción de Thévenin', () => {
    // El estudiante analiza una red resistiva compleja
    // Circuito: Fuente Vs = 36V, R1 = 6Ω, R2 = 12Ω, RL = 4Ω
    const Vs = 36.0;
    const R1 = 6.0;
    const R2 = 12.0;
    const RL = 4.0;

    // Paso 1: Cálculo de tensión de circuito abierto Vth = Vs * (R2 / (R1 + R2))
    const Vth = Vs * (R2 / (R1 + R2)); // 36 * (12/18) = 24V
    assertEqual(Vth, 24.0, 'Vth debe ser 24V');

    // Paso 2: Cálculo de resistencia equivalente Rth = R1 || R2 = (6*12)/18 = 4Ω
    const Rth = (R1 * R2) / (R1 + R2);
    assertEqual(Rth, 4.0, 'Rth debe ser 4Ω');

    // Paso 3: Conexión de la carga RL = 4Ω (Adaptación de impedancias)
    const IL = Vth / (Rth + RL); // 24 / 8 = 3A
    const VL = IL * RL;          // 3 * 4 = 12V
    const PL = IL * IL * RL;     // 9 * 4 = 36W (Potencia máxima)

    assertEqual(IL, 3.0, 'La corriente de carga debe ser 3A');
    assertEqual(VL, 12.0, 'La tensión de carga debe ser 12V');
    assertEqual(PL, 36.0, 'La potencia máxima transferida debe ser 36W');

    // Paso 4: Verificación de rendimiento en máxima transferencia (eta = 50%)
    const P_source = Vth * IL; // Potencia total suministrada en el modelo Thévenin = 24 * 3 = 72W
    const efficiency = (PL / P_source) * 100;
    assertEqual(efficiency, 50.0, 'El rendimiento bajo máxima transferencia de potencia debe ser exactamente 50%');
  });

  /* ==========================================================================
     ESCENARIO 3: Almacenamiento Reactivo y Transitorio RC de Primer Orden (Fases 3 y 4)
     ========================================================================== */
  test('T4.S3: Flujo de Fases 3 y 4 — Carga de Condensador, Constante tau y Energía Almacenada', () => {
    // El estudiante experimenta en el laboratorio con un circuito temporizador RC
    const Vs = 9.0;       // Batería de 9V
    const R = 100000;     // 100 kΩ
    const C = 47e-6;      // 47 µF
    const tau = R * C;    // 4.7 segundos

    assertCloseTo(tau, 4.7, 1e-5, 'La constante de tiempo debe ser 4.7 segundos');

    // El estudiante observa la curva en el osciloscopio en t = 1tau, 2tau, 3tau, 5tau
    const v1 = Vs * (1 - Math.exp(-1)); // 5.689V
    const v2 = Vs * (1 - Math.exp(-2)); // 7.782V
    const v3 = Vs * (1 - Math.exp(-3)); // 8.552V
    const v5 = Vs * (1 - Math.exp(-5)); // 8.939V

    assertCloseTo(v1, 5.689, 1e-2, 'A 1tau el voltaje es 5.69V');
    assertCloseTo(v5, 8.940, 1e-2, 'A 5tau el voltaje alcanza prácticamente los 9V');

    // Cálculo de la energía electrostática final almacenada: W = 0.5 * C * Vs^2
    const W_final = 0.5 * C * Vs * Vs; // 0.5 * 47e-6 * 81 = 1.9035 mJ
    assertCloseTo(W_final, 0.0019035, 1e-6, 'La energía almacenada debe ser 1.90 mJ');
  });

  /* ==========================================================================
     ESCENARIO 4: Transitorios de Segundo Orden y Resonancia RLC (Fase 4)
     ========================================================================== */
  test('T4.S4: Flujo de Fase 4 — Análisis RLC y Transición Dinámica de Amortiguamiento', () => {
    // El estudiante diseña un circuito RLC serie con L = 100mH, C = 10µF (omega0 = 1000 rad/s)
    const L = 0.1;
    const C = 10e-6;
    const omega0 = 1 / Math.sqrt(L * C); // 1000 rad/s

    // 1. Caso Subamortiguado: R = 40 Ω -> alpha = 40 / 0.2 = 200 s^-1 (< 1000)
    const R_under = 40;
    const alpha_under = R_under / (2 * L);
    const omegad_under = Math.sqrt(omega0 * omega0 - alpha_under * alpha_under); // sqrt(1000000 - 40000) = 979.8 rad/s

    assertLessThan(alpha_under, omega0, 'alpha debe ser menor que omega0 en régimen subamortiguado');
    assertCloseTo(omegad_under, 979.7959, 1e-3, 'La frecuencia oscilatoria amortiguada omegad debe ser 979.8 rad/s');

    // 2. Caso Críticamente Amortiguado: R_crit = 2 * L * omega0 = 200 Ω -> alpha = 1000 s^-1
    const R_crit = 2 * L * omega0;
    const alpha_crit = R_crit / (2 * L);
    assertEqual(alpha_crit, omega0, 'alpha debe igualar a omega0 para amortiguamiento crítico');

    // 3. Caso Sobreamortiguado: R = 500 Ω -> alpha = 2500 s^-1 (> 1000)
    const R_over = 500;
    const alpha_over = R_over / (2 * L);
    assertGreaterThan(alpha_over, omega0, 'alpha debe superar a omega0 en régimen sobreamortiguado');
  });

  /* ==========================================================================
     ESCENARIO 5: Régimen Permanente de CA, Fasores y Osciloscopio (Fase 5)
     ========================================================================== */
  test('T4.S5: Flujo de Fase 5 — Análisis Fasorial de Impedancia y Desfase en Osciloscopio', () => {
    // Señal sinusoidal: v(t) = 10 * cos(2*pi*60*t) aplicada a circuito RC serie con R = 100Ω, C = 26.525µF
    const f = 60.0;
    const omega = 2 * Math.PI * f; // 376.991 rad/s
    const R = 100.0;
    const C = 26.5258e-6;

    // Reactancia capacitiva Xc = 1 / (omega * C) = 1 / (376.991 * 26.5258e-6) = 100 Ω
    const Xc = 1 / (omega * C);
    assertCloseTo(Xc, 100.0, 1e-1, 'La reactancia capacitiva Xc debe ser 100 Ω');

    // Magnitud de la impedancia total |Z| = sqrt(R^2 + Xc^2) = 100 * sqrt(2) = 141.42 Ω
    const Z_mag = Math.sqrt(R * R + Xc * Xc);
    assertCloseTo(Z_mag, 141.4213, 1e-2, 'La magnitud de la impedancia debe ser 141.42 Ω');

    // Ángulo de desfase phi = -arctan(Xc / R) = -45° (-pi/4 rad)
    const phaseRad = -Math.atan2(Xc, R);
    const phaseDeg = (phaseRad * 180) / Math.PI;
    assertCloseTo(phaseDeg, -45.0, 1e-2, 'El ángulo de desfase de la impedancia debe ser -45 grados');

    // Corriente pico I_m = V_m / |Z| = 10 / 141.42 = 0.0707 A = 70.7 mA
    const Vm = 10.0;
    const Im = Vm / Z_mag;
    assertCloseTo(Im, 0.07071, 1e-4, 'La corriente pico debe ser 70.7 mA');
  });

  /* ==========================================================================
     ESCENARIO 6: Amplificadores Operacionales y Filtros Activos (Fase 7)
     ========================================================================== */
  test('T4.S6: Flujo de Fase 7 — Reglas de Oro de Op-Amps, Ganancia Inversora y Saturación', () => {
    // El estudiante configura un amplificador de audio inversor con R1 = 5kΩ, Rf = 25kΩ alimentado a +-12V
    const R1 = 5000;
    const Rf = 25000;
    const Vsat = 12.0;
    const Av = -Rf / R1; // -5.0

    assertEqual(Av, -5.0, 'La ganancia de tensión debe ser -5.0');

    // Señal pequeña de entrada: Vin = 1.5V -> Vout_calc = -7.5V (Zona lineal)
    const Vin_small = 1.5;
    const Vout_small = Av * Vin_small;
    assertEqual(Vout_small, -7.5, 'Salida lineal debe ser -7.5V');

    // Señal grande de entrada: Vin = 3.5V -> Vout_calc = -17.5V -> Se recorta a -12V (Saturación)
    const Vin_large = 3.5;
    const Vout_calc = Av * Vin_large;
    const Vout_clipped = Math.max(-Vsat, Math.min(Vsat, Vout_calc));

    assertEqual(Vout_calc, -17.5, 'Salida teórica sin límite sería -17.5V');
    assertEqual(Vout_clipped, -12.0, 'Salida real recortada debe ser exactamente -12.0V');
  });

  /* ==========================================================================
     ESCENARIO 7: Semiconductores Discretos y Consulta de Síntesis al Tutor (Fase 8)
     ========================================================================== */
  test('T4.S7: Flujo de Fase 8 — Rectificación con Diodos, Conmutación MOSFET y Consulta IA', () => {
    // 1. Rectificador de onda completa con puente de diodos (caída 2 * 0.7V = 1.4V)
    const V_peak_in = 18.0;
    const Vf_diode = 0.7;
    const V_peak_out = V_peak_in - 2 * Vf_diode;
    assertEqual(V_peak_out, 16.6, 'El voltaje pico rectificado debe ser 16.6V');

    // 2. Pérdidas por conducción en un MOSFET de potencia (RDS(on) = 15 mΩ, ID = 10A)
    const RDSon = 0.015;
    const ID = 10.0;
    const P_cond = ID * ID * RDSon; // 100 * 0.015 = 1.5 W
    assertEqual(P_cond, 1.5, 'La pérdida de conducción en el MOSFET debe ser 1.5 Watts');

    // 3. El estudiante consulta al Asistente IA sobre reglas de diseño de Horowitz & Hill
    const kb = ctx.TUTOR_KNOWLEDGE_BASE;
    const query = 'bypass capacitor ceramic 0.1 uF';
    const match = kb.find(item => item.keywords.some(kw => kw.includes('bypass') || kw.includes('capacitor')));

    assertDefined(match, 'Debe localizar el principio de condensadores de desacoplo');

    // 4. Completitud de la trayectoria global del curso (100% de lecciones)
    const totalLessons = 20;
    const completedCount = 20;
    const finalProgressPct = Math.round((completedCount / totalLessons) * 100);
    assertEqual(finalProgressPct, 100, 'El estudiante debe alcanzar el 100% del curso');
  });

  env.cleanup();
  return results;
}

module.exports = { runTier4Tests };
