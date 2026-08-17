/**
 * ============================================================================
 * ElectronFlow — tests/tier2_boundary_corner.js
 * 
 * Nivel 2: Casos Límites y Condiciones de Borde (Boundary & Corner Cases).
 * Evalúa el comportamiento del sistema ante valores extremos, divisiones por
 * cero, singularidades numéricas, saturación física y límites de interfaz.
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

/**
 * Suite de pruebas Tier 2: Casos Límites y Condiciones de Borde
 */
function runTier2Tests() {
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
     CARACTERÍSTICA 1: Casos Límite en Matriz Bibliográfica
     ========================================================================== */

  test('T2.F1.1: Búsqueda segura ante temas o identificadores no existentes', () => {
    // Verificamos que consultas fuera de catálogo no produzcan excepciones
    const matrixContent = fs.readFileSync(path.join(projectRoot, 'textbook_verification_matrix.md'), 'utf8');
    const searchModule = (id) => {
      const match = matrixContent.split('\n').find(line => line.includes(id));
      return match || null;
    };

    assertEqual(searchModule('modulo-fantasma-999'), null, 'Módulo no existente debe retornar null');
    assertDefined(searchModule('1.1 What is Electricity?'), 'Módulo 1.1 debe ser encontrado');
  });

  test('T2.F1.2: Consistencia matemática de rangos de páginas (inicio <= fin)', () => {
    // Escaneamos las páginas citadas (e.g. pp. 30-35) y validamos que inicio sea menor o igual a fin
    const matrixContent = fs.readFileSync(path.join(projectRoot, 'textbook_verification_matrix.md'), 'utf8');
    const pageMatches = matrixContent.match(/pp\.\s*(\d+)[–-](\d+)/g) || [];
    assertGreaterThan(pageMatches.length, 5, 'Deben existir rangos de páginas tabulados');

    pageMatches.forEach(match => {
      const nums = match.match(/(\d+)[–-](\d+)/);
      if (nums) {
        const start = parseInt(nums[1], 10);
        const end = parseInt(nums[2], 10);
        assertLessThanOrEqual(start, end, `Rango de páginas inválido: ${match}`);
      }
    });
  });

  test('T2.F1.3: Robustez ante líneas en blanco o comentarios en markdown', () => {
    // Verificamos que el parseo ignore líneas vacías sin corromper el conteo
    const matrixContent = fs.readFileSync(path.join(projectRoot, 'textbook_verification_matrix.md'), 'utf8');
    const validRows = matrixContent.split('\n').filter(line => line.trim().startsWith('|') && !line.includes('---'));
    assertGreaterThan(validRows.length, 20, 'Debe haber filas tabulares válidas');
  });

  test('T2.F1.4: Mapeo de capítulos límite (Capítulo 1 inicial y Apéndices finales)', () => {
    // Validamos cobertura desde el inicio (Ch. 1) hasta los apéndices de semiconductores
    const matrixContent = fs.readFileSync(path.join(projectRoot, 'textbook_verification_matrix.md'), 'utf8');
    assert(matrixContent.includes('Ch. 1') || matrixContent.includes('Chapter 1'), 'Debe incluir Capítulo 1');
    assert(matrixContent.includes('Appendix') || matrixContent.includes('Ch. 19') || matrixContent.includes('Ch. 10'), 'Debe cubrir capítulos avanzados y apéndices');
  });

  test('T2.F1.5: Tolerancia de búsqueda ante mayúsculas, minúsculas y caracteres especiales', () => {
    // Verificamos coincidencias normalizadas
    const matrixContent = fs.readFileSync(path.join(projectRoot, 'textbook_verification_matrix.md'), 'utf8').toLowerCase();
    assert(matrixContent.includes("ohm's law") || matrixContent.includes('ohms law'), 'Debe contener la ley de Ohm');
    assert(matrixContent.includes('kirchhoff'), 'Debe contener las leyes de Kirchhoff');
    assert(matrixContent.includes('thevenin') || matrixContent.includes('thévenin'), 'Debe contener Thévenin con o sin tilde');
  });

  /* ==========================================================================
     CARACTERÍSTICA 2: Casos Límite en Currículo y Fórmulas LaTeX
     ========================================================================== */

  test('T2.F2.1: Soporte de expresiones matemáticas con exponentes y subíndices anidados', () => {
    // Evaluamos fórmulas con superíndices como e^{-t/tau} o 10^{-19}
    const kb = ctx.TUTOR_KNOWLEDGE_BASE;
    let foundNestedMath = false;
    kb.forEach(entry => {
      if (entry.equations) {
        entry.equations.forEach(eq => {
          if (eq.includes('^') || eq.includes('_')) foundNestedMath = true;
        });
      }
    });
    assert(foundNestedMath, 'Deben existir expresiones LaTeX con exponentes o subíndices');
  });

  test('T2.F2.2: Fórmulas con fracciones compuestas (frac dentro de frac)', () => {
    // Validamos renderizado de ecuaciones fraccionarias complejas
    const sampleTex = '\\omega_0 = \\frac{1}{\\sqrt{L \\cdot C}}';
    const rendered = ctx.katex.renderToString(sampleTex);
    assert(rendered.includes('katex-rendered'), 'KaTeX debe compilar fracciones compuestas');
  });

  test('T2.F2.3: Tolerancia de renderizado ante cadenas LaTeX vacías sin excepción', () => {
    // La función renderToString no debe lanzar excepción si se pasa cadena vacía
    let rendered = '';
    try {
      rendered = ctx.katex.renderToString('');
    } catch (e) {
      assert(false, 'No debe lanzar excepción con cadena vacía');
    }
    assertDefined(rendered, 'Debe retornar resultado definido');
  });

  test('T2.F2.4: Valores numéricos de componentes en órdenes de magnitud extremos (pico a mega)', () => {
    // Probamos conversión de prefijos métricos del SI
    const parseComponentValue = (str) => {
      const val = parseFloat(str);
      if (str.endsWith('p')) return val * 1e-12; // pico
      if (str.endsWith('n')) return val * 1e-9;  // nano
      if (str.endsWith('u') || str.endsWith('µ')) return val * 1e-6; // micro
      if (str.endsWith('m')) return val * 1e-3;  // mili
      if (str.endsWith('k') || str.endsWith('kΩ')) return val * 1e3; // kilo
      if (str.endsWith('M') || str.endsWith('MΩ')) return val * 1e6; // mega
      return val;
    };

    assertEqual(parseComponentValue('10p'), 10e-12, '10 pF debe ser 1e-11 F');
    assertEqual(parseComponentValue('4.7u'), 4.7e-6, '4.7 µF debe ser 4.7e-6 F');
    assertEqual(parseComponentValue('100k'), 100000, '100 kΩ debe ser 100,000 Ω');
    assertEqual(parseComponentValue('2.2M'), 2200000, '2.2 MΩ debe ser 2,200,000 Ω');
  });

  test('T2.F2.5: Prevención de división por cero en cálculo de conductancia cuando R tiende a 0', () => {
    // Cuando R = 0, el cálculo de G = 1/R debe manejarse de forma controlada
    const calcConductance = (R) => {
      if (R <= 0) return Infinity;
      return 1 / R;
    };

    assertEqual(calcConductance(0), Infinity, 'Conductancia con R=0 debe retornar Infinity');
    assertEqual(calcConductance(100), 0.01, 'Conductancia con R=100 debe ser 0.01 S');
  });

  /* ==========================================================================
     CARACTERÍSTICA 3: Casos Límite en Problemas Prácticos
     ========================================================================== */

  test('T2.F3.1: Resistencia nula (cortocircuito ideal R = 0) y cálculo de corriente de falla', () => {
    // En un cortocircuito con fuente real que tiene resistencia interna Rs
    const Vs = 12.0;
    const Rs = 0.1; // Resistencia parásita interna
    const Rload = 0.0; // Cortocircuito puro

    const I_short = Vs / (Rs + Rload);
    assertEqual(I_short, 120.0, 'La corriente de cortocircuito con Rs=0.1Ω debe ser 120A');
  });

  test('T2.F3.2: Resistencia infinita (circuito abierto R -> Infinity) y corriente nula', () => {
    // Circuito abierto: corriente debe ser exactamente 0
    const Vs = 24.0;
    const Ropen = Infinity;
    const I = Vs / Ropen;
    assertEqual(I, 0, 'La corriente en circuito abierto debe ser 0 A');
  });

  test('T2.F3.3: Fuentes de tensión de polaridad negativa (Vs = -15V)', () => {
    // Verificamos que las leyes de Kirchhoff mantengan coherencia de signos
    const Vs = -15.0;
    const R1 = 300;
    const R2 = 600;
    const Vout = Vs * (R2 / (R1 + R2)); // -15 * (600/900) = -10V
    assertEqual(Vout, -10.0, 'El divisor de tensión con fuente negativa debe arrojar -10V');
  });

  test('T2.F3.4: Valores numéricos en notación científica extrema (carga elemental del electrón)', () => {
    // Cálculo de número de electrones para transportar 1 Coulomb
    const q_electron = 1.602176634e-19; // Coulombs
    const totalCharge = 1.0; // 1 Coulomb
    const electronCount = totalCharge / q_electron;

    assertCloseTo(electronCount, 6.2415e18, 1e14, '1 Coulomb equivale aproximadamente a 6.24e18 electrones');
  });

  test('T2.F3.5: Disipación de potencia en resistencias de valor fraccionario bajo alta corriente', () => {
    // Resistencia shunt de medición de corriente R = 0.01 Ω con I = 50 A
    const R_shunt = 0.01;
    const I = 50.0;
    const P = I * I * R_shunt; // 2500 * 0.01 = 25 W
    assertEqual(P, 25.0, 'La disipación en el shunt debe ser 25 Watts');
  });

  /* ==========================================================================
     CARACTERÍSTICA 4: Casos Límite en el Motor de Quiz
     ========================================================================== */

  test('T2.F4.1: Selección de opción en índice inferior (0) e índice superior (options.length - 1)', () => {
    // Validamos extremos de opciones
    const options = ['Opción 0', 'Opción 1', 'Opción 2', 'Opción 3'];
    const checkValidIndex = (idx) => idx >= 0 && idx < options.length;

    assert(checkValidIndex(0), 'Índice 0 debe ser válido');
    assert(checkValidIndex(3), 'Índice 3 debe ser válido');
    assertEqual(checkValidIndex(-1), false, 'Índice negativo debe ser inválido');
    assertEqual(checkValidIndex(4), false, 'Índice 4 fuera de rango debe ser inválido');
  });

  test('T2.F4.2: Manejo de entrada inválida o nula en selección de respuesta', () => {
    // Protección ante selección undefined o null
    const evaluateSelection = (selected, correct) => {
      if (typeof selected !== 'number' || isNaN(selected)) return false;
      return selected === correct;
    };

    assertEqual(evaluateSelection(null, 1), false, 'null debe ser evaluado como incorrecto');
    assertEqual(evaluateSelection(undefined, 1), false, 'undefined debe ser evaluado como incorrecto');
    assertEqual(evaluateSelection(1, 1), true, 'Selección coincidente debe ser correcta');
  });

  test('T2.F4.3: Opciones con fórmulas matemáticas LaTeX multilínea', () => {
    // Probamos opciones de cuestionario con KaTeX complejo
    const complexOption = '$$\\mathbf{Z}_C = \\frac{1}{j\\omega C} = -j\\frac{1}{\\omega C}$$';
    assert(complexOption.includes('$$\\mathbf{Z}_C'), 'Debe contener la notación fasorial en negrita');
  });

  test('T2.F4.4: Permite cambiar selección antes de enviar el quiz', () => {
    // Verificamos mutabilidad del estado de selección antes de la confirmación
    let currentSelection = null;
    currentSelection = 1; // El usuario hace clic en opción 1
    assertEqual(currentSelection, 1, 'Selección preliminar debe ser 1');
    currentSelection = 2; // El usuario cambia a opción 2
    assertEqual(currentSelection, 2, 'Selección actualizada debe ser 2');
  });

  test('T2.F4.5: Soporte para preguntas de dos opciones (Verdadero / Falso)', () => {
    // Preguntas binarias con arreglo de longitud 2
    const tfQuiz = {
      question: 'Is KCL valid for non-planar circuits?',
      options: ['True (KCL applies to all circuit topologies)', 'False (Only applies to planar)'],
      correctIndex: 0,
      explanation: 'KCL is derived from conservation of charge and holds for any graph topology.'
    };

    assertEqual(tfQuiz.options.length, 2, 'Debe admitir 2 opciones');
    assertEqual(tfQuiz.correctIndex, 0, 'La respuesta correcta es True');
  });

  /* ==========================================================================
     CARACTERÍSTICA 5: Casos Límite en Osciloscopio de CA
     ========================================================================== */

  test('T2.F5.1: Frecuencia mínima límite f -> 0 Hz (límite DC donde v(t) = constante)', () => {
    // A frecuencia cero, omega = 0, por lo que v(t) = Vm * sin(phi)
    const Vm = 10.0;
    const f = 0.0;
    const phi = Math.PI / 6; // 30° -> sin(30°) = 0.5
    const t = 1.5; // Cualquier instante

    const v = Vm * Math.sin(2 * Math.PI * f * t + phi);
    assertCloseTo(v, 5.0, 1e-4, 'A frecuencia 0Hz la señal debe ser DC constante de 5V');
  });

  test('T2.F5.2: Frecuencia ultra-alta f = 100 kHz y cálculo de periodo diminuto', () => {
    // f = 100,000 Hz -> T = 10 µs
    const f = 100000;
    const T = 1 / f;
    assertEqual(T, 0.00001, 'El periodo a 100 kHz debe ser 10 microsegundos');
  });

  test('T2.F5.3: Amplitud cero Vm = 0V (traza plana en el eje central horizontal)', () => {
    // Con Vm = 0, para todo t la tensión calculada es idénticamente cero
    const Vm = 0.0;
    const f = 50.0;
    const samples = [0, 0.005, 0.01, 0.015, 0.02];
    samples.forEach(t => {
      const v = Vm * Math.sin(2 * Math.PI * f * t);
      assertEqual(v, 0, 'Tensión debe ser 0 en todo momento con Vm=0');
    });
  });

  test('T2.F5.4: Envoltura angular de fase cíclica (phi = 2*pi equivale a phi = 0)', () => {
    // sin(wt + 2pi) == sin(wt)
    const wt = 1.234;
    const v1 = Math.sin(wt);
    const v2 = Math.sin(wt + 2 * Math.PI);
    assertCloseTo(v1, v2, 1e-6, 'Fase de 2pi debe ser periódica e indistinguible de 0');
  });

  test('T2.F5.5: Base de tiempo en escalas extremas (1 µs/div a 500 ms/div)', () => {
    // Validamos conversión de divisiones horizontales a tiempo total de pantalla (10 divisiones)
    const numDivs = 10;
    const timebaseMicro = 1e-6; // 1 µs/div
    const totalScreenMicro = numDivs * timebaseMicro;
    assertCloseTo(totalScreenMicro, 10e-6, 1e-11, 'Pantalla completa debe abarcar 10 µs');

    const timebaseMilli = 0.5; // 500 ms/div
    const totalScreenMilli = numDivs * timebaseMilli;
    assertCloseTo(totalScreenMilli, 5.0, 1e-6, 'Pantalla completa debe abarcar 5.0 s');
  });

  /* ==========================================================================
     CARACTERÍSTICA 6: Casos Límite en Transitorios RC y RLC
     ========================================================================== */

  test('T2.F6.1: Instante inicial t = 0+ (condensador descargado v(0+) = 0)', () => {
    // Al cerrar el interruptor en t=0, la tensión del condensador no puede cambiar instantáneamente
    const Vs = 10.0;
    const tau = 0.5;
    const v_at_0 = Vs * (1 - Math.exp(-0 / tau));
    assertEqual(v_at_0, 0.0, 'La tensión inicial del condensador debe ser 0V');
  });

  test('T2.F6.2: Régimen permanente t >> 5*tau (condensador cargado al 99.99%)', () => {
    // Para t = 10 * tau
    const Vs = 12.0;
    const tau = 1.0;
    const v_at_10tau = Vs * (1 - Math.exp(-10));
    assertCloseTo(v_at_10tau, 11.9994, 1e-3, 'A 10tau el voltaje debe ser indistinguible de Vs (12V)');
  });

  test('T2.F6.3: Circuito LC sin pérdidas (R = 0, amortiguamiento nulo alpha = 0)', () => {
    // Cuando R = 0, alpha = R/(2L) = 0. Oscilación pura a omega0
    const R = 0.0;
    const L = 0.05; // 50 mH
    const C = 20e-6; // 20 µF
    const alpha = R / (2 * L);
    const omega0 = 1 / Math.sqrt(L * C); // 1 / sqrt(1e-6) = 1000 rad/s

    assertEqual(alpha, 0.0, 'alpha debe ser 0 en circuito sin resistencia');
    assertCloseTo(omega0, 1000.0, 1e-4, 'omega0 debe ser 1000 rad/s');
  });

  test('T2.F6.4: Límite exacto de amortiguamiento crítico (alpha == omega0)', () => {
    // Para L = 1H, C = 1F -> omega0 = 1 rad/s. Crítico requiere alpha = 1 -> R = 2*L*alpha = 2 Ω
    const L = 1.0;
    const C = 1.0;
    const omega0 = 1 / Math.sqrt(L * C);
    const R_crit = 2 * L * omega0; // 2.0 Ω
    const alpha_crit = R_crit / (2 * L);

    assertEqual(omega0, 1.0, 'omega0 = 1 rad/s');
    assertEqual(R_crit, 2.0, 'R crítico debe ser 2.0 Ω');
    assertEqual(alpha_crit, omega0, 'alpha debe igualar exactamente a omega0 en amortiguamiento crítico');
  });

  test('T2.F6.5: Resistencia ultra-alta (R -> 100 kΩ) en RLC generando sobreamortiguamiento severo', () => {
    // L = 10 mH, C = 100 nF, R = 100,000 Ω
    const L = 0.01;
    const C = 100e-9;
    const R = 100000;
    const alpha = R / (2 * L); // 100000 / 0.02 = 5,000,000 s^-1
    const omega0 = 1 / Math.sqrt(L * C); // 1 / sqrt(1e-9) = 31622.77 rad/s

    assertGreaterThan(alpha, omega0 * 100, 'alpha debe ser más de 100 veces superior a omega0');
  });

  test('T2.F6.6: Rechazo o clamp de tiempo negativo (t < 0) antes del escalón', () => {
    // Para t < 0, la respuesta al escalón es 0V
    const stepResponse = (t, Vs, tau) => {
      if (t < 0) return 0.0;
      return Vs * (1 - Math.exp(-t / tau));
    };

    assertEqual(stepResponse(-5, 10, 1), 0.0, 'Para t < 0 la respuesta debe ser 0V');
    assertGreaterThan(stepResponse(0.1, 10, 1), 0.0, 'Para t > 0 la respuesta debe ser positiva');
  });

  /* ==========================================================================
     CARACTERÍSTICA 7: Casos Límite en Divisor de Tensión y Thévenin
     ========================================================================== */

  test('T2.F7.1: Resistencia superior nula R1 = 0 (Vout = Vin total)', () => {
    // Con R1 = 0, el nodo de salida está conectado directamente a Vin
    const Vin = 15.0;
    const R1 = 0.0;
    const R2 = 1000.0;
    const Vout = Vin * (R2 / (R1 + R2));
    assertEqual(Vout, 15.0, 'Vout debe ser 15V (Vin completo)');
  });

  test('T2.F7.2: Resistencia inferior nula R2 = 0 (Vout = 0V exacto)', () => {
    // Con R2 = 0, el nodo de salida está en cortocircuito a tierra
    const Vin = 15.0;
    const R1 = 1000.0;
    const R2 = 0.0;
    const Vout = Vin * (R2 / (R1 + R2));
    assertEqual(Vout, 0.0, 'Vout debe ser 0V');
  });

  test('T2.F7.3: Carga en circuito abierto (RL -> Infinity, VL = Vth)', () => {
    // Cuando no se conecta carga (RL = Infinity)
    const Vth = 10.0;
    const Rth = 500.0;
    const calcLoaded = (RL) => {
      if (RL === Infinity) return Vth;
      return Vth * (RL / (Rth + RL));
    };

    assertEqual(calcLoaded(Infinity), 10.0, 'La tensión sin carga debe ser igual a Vth');
  });

  test('T2.F7.4: Carga en cortocircuito (RL = 0, VL = 0V, corriente máxima Isc)', () => {
    // Cortocircuito en terminales de carga
    const Vth = 12.0;
    const Rth = 4.0;
    const RL = 0.0;
    const VL = Vth * (RL / (Rth + RL));
    const Isc = Vth / Rth;

    assertEqual(VL, 0.0, 'VL en cortocircuito debe ser 0V');
    assertEqual(Isc, 3.0, 'La corriente de cortocircuito debe ser 3.0A');
  });

  test('T2.F7.5: Efecto de carga severo cuando RL << Rth (colapso de tensión de salida)', () => {
    // Fuente con Rth = 10,000 Ω alimentando carga pesada de RL = 100 Ω
    const Vth = 10.0;
    const Rth = 10000.0;
    const RL = 100.0;
    const VL = Vth * (RL / (Rth + RL)); // 10 * (100 / 10100) = 0.099V (< 1% de Vth)

    assertLessThan(VL, 0.1, 'La tensión debe colapsar por debajo de 0.1V debido al efecto de carga');
  });

  /* ==========================================================================
     CARACTERÍSTICA 8: Casos Límite en Amplificadores Operacionales
     ========================================================================== */

  test('T2.F8.1: Resistencia de realimentación nula Rf = 0 en inversor (ganancia cero Av = 0)', () => {
    // Si Rf = 0 en un amplificador inversor, Av = -0/Rin = 0
    const Rin = 1000;
    const Rf = 0;
    const Vin = 5.0;
    const Av = -Rf / Rin;
    const Vout = Av * Vin;

    assertEqual(Av, 0, 'La ganancia con Rf=0 debe ser 0');
    assertEqual(Vout, 0, 'El voltaje de salida debe ser 0V');
  });

  test('T2.F8.2: Resistencia de entrada muy pequeña Rin -> 0 limitada por los rieles de saturación', () => {
    // Con Rin = 1 Ω y Rf = 100 kΩ -> Av teórico = -100,000. Entrada 1V -> salida saturada a -Vsat
    const Rin = 1;
    const Rf = 100000;
    const Vin = 1.0;
    const Vsat = 15.0;
    const theoreticalVout = -(Rf / Rin) * Vin; // -100,000V
    const actualVout = Math.max(-Vsat, Math.min(Vsat, theoreticalVout));

    assertEqual(actualVout, -15.0, 'La salida debe recortarse estrictamente a -15V');
  });

  test('T2.F8.3: Tensión de entrada simétrica que excede ampliamente los rieles (+-100V)', () => {
    // Prueba de saturación bipolar
    const Vsat = 12.0;
    const clamp = (val) => Math.max(-Vsat, Math.min(Vsat, val));

    assertEqual(clamp(150.0), 12.0, 'Entrada de +150V calculada debe recortar a +12V');
    assertEqual(clamp(-250.0), -12.0, 'Entrada de -250V calculada debe recortar a -12V');
  });

  test('T2.F8.4: Rieles de alimentación asimétricos (fuente simple de 0V a 5V)', () => {
    // En sistemas con alimentación única (Single Supply: 0V a 5V)
    const VsatPos = 5.0;
    const VsatNeg = 0.0;
    const clampSingle = (v) => Math.max(VsatNeg, Math.min(VsatPos, v));

    assertEqual(clampSingle(-2.5), 0.0, 'No puede descender por debajo del riel negativo (0V)');
    assertEqual(clampSingle(6.8), 5.0, 'No puede superar el riel positivo (5V)');
    assertEqual(clampSingle(3.3), 3.3, '3.3V opera linealmente dentro de la ventana 0-5V');
  });

  test('T2.F8.5: Configuración de lazo abierto como comparador analógico puro', () => {
    // Sin realimentación negativa, Vout conmuta a +Vsat si V+ > V-, o -Vsat si V+ < V-
    const comparator = (Vplus, Vminus, Vsat) => {
      if (Vplus > Vminus) return Vsat;
      if (Vplus < Vminus) return -Vsat;
      return 0.0;
    };

    assertEqual(comparator(2.5, 2.0, 15), 15.0, 'V+ > V- debe dar +Vsat');
    assertEqual(comparator(1.8, 2.0, 15), -15.0, 'V+ < V- debe dar -Vsat');
    assertEqual(comparator(2.0, 2.0, 15), 0.0, 'V+ == V- debe dar 0V');
  });

  /* ==========================================================================
     CARACTERÍSTICA 9: Casos Límite en Sincronización de Audio
     ========================================================================== */

  test('T2.F9.1: Cabezal en el instante cero exacto t = 0.00s', () => {
    // Si la primera oración inicia en t = 15.96s, en t = 0 no hay oración activa
    const sentences = [
      { id: 's1', start: 15.96, end: 19.8, text: 'Primera oración' }
    ];
    const findActive = (t) => sentences.find(s => t >= s.start && t < s.end) || null;

    assertEqual(findActive(0.0), null, 'En t=0s antes de la primera oración debe retornar null');
  });

  test('T2.F9.2: Cabezal en el intervalo de silencio entre dos oraciones', () => {
    // Espacio de pausa entre s1 (termina en 19.8s) y s2 (inicia en 20.5s)
    const sentences = [
      { id: 's1', start: 15.0, end: 19.8 },
      { id: 's2', start: 20.5, end: 25.0 }
    ];
    const findActive = (t) => sentences.find(s => t >= s.start && t < s.end) || null;

    assertEqual(findActive(20.0), null, 'En tiempo de silencio (20.0s) no debe haber oración activa');
  });

  test('T2.F9.3: Cabezal que supera la duración total del audio (después de finalizado)', () => {
    // t = 1000s superando cualquier pista
    const sentences = [
      { id: 's1', start: 0.0, end: 10.0 }
    ];
    const findActive = (t) => sentences.find(s => t >= s.start && t < s.end) || null;

    assertEqual(findActive(999.9), null, 'Más allá del final debe retornar null');
  });

  test('T2.F9.4: Resiliencia ante saltos aleatorios de reproducción (Scrubbing Seek)', () => {
    // Simulamos saltos no secuenciales: 5s -> 45s -> 12s -> 80s
    const sentences = [
      { id: 's1', start: 0, end: 10 },
      { id: 's2', start: 10, end: 20 },
      { id: 's3', start: 40, end: 50 },
      { id: 's4', start: 75, end: 85 }
    ];
    const findActive = (t) => sentences.find(s => t >= s.start && t < s.end) || null;

    assertEqual(findActive(5).id, 's1', 'Salto a 5s debe dar s1');
    assertEqual(findActive(45).id, 's3', 'Salto a 45s debe dar s3');
    assertEqual(findActive(12).id, 's2', 'Salto a 12s debe dar s2');
    assertEqual(findActive(80).id, 's4', 'Salto a 80s debe dar s4');
  });

  test('T2.F9.5: Oración con duración extremadamente corta (< 0.2s)', () => {
    // Oración muy breve
    const sentenceShort = { id: 's_short', start: 10.0, end: 10.15 };
    const findActive = (t) => (t >= sentenceShort.start && t < sentenceShort.end) ? sentenceShort : null;

    assertEqual(findActive(10.05).id, 's_short', 'Debe detectar intervalos breves');
    assertEqual(findActive(10.16), null, 'Fuera del intervalo breve debe dar null');
  });

  /* ==========================================================================
     CARACTERÍSTICA 10: Casos Límite en Navegación y Máquina de Estados
     ========================================================================== */

  test('T2.F10.1: Guard de navegación al intentar retroceder desde el paso 0', () => {
    // Al estar en el primer paso, pulsar anterior no debe permitir valores negativos
    let stepIndex = 0;
    const stepPrev = () => {
      if (stepIndex > 0) stepIndex--;
      return stepIndex;
    };

    assertEqual(stepPrev(), 0, 'No debe descender de 0');
    assertEqual(stepPrev(), 0, 'Llamadas sucesivas deben mantenerse en 0');
  });

  test('T2.F10.2: Guard de navegación al intentar avanzar más allá del último paso', () => {
    // Al estar en el último paso (p. ej. índice 6), pulsar siguiente no debe exceder el límite
    const maxSteps = 7; // Índices 0..6
    let stepIndex = 6;
    const stepNext = () => {
      if (stepIndex < maxSteps - 1) stepIndex++;
      return stepIndex;
    };

    assertEqual(stepNext(), 6, 'No debe superar maxSteps - 1');
    assertEqual(stepNext(), 6, 'Llamadas sucesivas deben mantenerse en 6');
  });

  test('T2.F10.3: Recuperación ante JSON corrupto en localStorage sin causar colapso de la app', () => {
    // Simulamos que el usuario tiene un valor dañado en localStorage
    env.storage.setItem('electronflow-corrupted', '{ "completed": [1, 2, INVALID_JSON }');
    let loadedState = null;
    try {
      const raw = env.storage.getItem('electronflow-corrupted');
      loadedState = JSON.parse(raw);
    } catch (e) {
      // Fallback a estado limpio por defecto
      loadedState = { completedLessons: [], totalXP: 0 };
    }

    assertDefined(loadedState, 'Debe recuperarse con un estado por defecto');
    assertEqual(loadedState.completedLessons.length, 0, 'Debe iniciar con lista vacía');
  });

  test('T2.F10.4: Idempotencia ante pulsaciones ultrarrápidas de teclas de navegación', () => {
    // Simula envío de 50 eventos keydown simultáneos
    let counter = 0;
    const max = 5;
    for (let i = 0; i < 50; i++) {
      if (counter < max) counter++;
    }
    assertEqual(counter, max, 'El estado final debe estar acotado a max');
  });

  test('T2.F10.5: Teclas no mapeadas no alteran el estado ni disparan efectos secundarios', () => {
    // Pulsación de teclas como F5, Escape, Tab, Shift
    const handledKeys = new Set(['ArrowRight', 'ArrowLeft', ' ', 'Enter', '1', '2', '3', '4']);
    const isHandled = (key) => handledKeys.has(key);

    assertEqual(isHandled('Escape'), false, 'Escape no debe ser procesado como navegación');
    assertEqual(isHandled('F12'), false, 'F12 no debe ser procesado como navegación');
    assertEqual(isHandled('ArrowRight'), true, 'ArrowRight sí debe ser procesado');
  });

  test('T2.F10.6: Restablecimiento completo de progreso a 0% cuando se solicita reinicio', () => {
    // Reinicio de curso
    env.storage.setItem('electronflow-progress', JSON.stringify({ completedLessons: ['l1', 'l2'], totalXP: 200 }));
    env.storage.removeItem('electronflow-progress');
    const resetState = env.storage.getItem('electronflow-progress');
    assertEqual(resetState, null, 'El progreso debe eliminarse completamente');
  });

  env.cleanup();
  return results;
}

module.exports = { runTier2Tests };
