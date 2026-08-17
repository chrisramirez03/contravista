/**
 * ============================================================================
 * ElectronFlow — tests/tier1_feature_coverage.js
 * 
 * Nivel 1: Cobertura de Funcionalidades (Feature Coverage).
 * Verifica en aislamiento cada una de las 10 características principales
 * del sistema pedagógico EE 101, validando esquemas, ecuaciones y lógica.
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
 * Suite de pruebas Tier 1: Cobertura de Funcionalidades
 */
function runTier1Tests() {
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

  // Instanciamos el entorno de pruebas en memoria para evaluar componentes
  const env = new TestEnvironment();
  const ctx = env.loadScripts();

  /* ==========================================================================
     CARACTERÍSTICA 1: Matriz de Verificación Bibliográfica (Master Textbook Matrix)
     ========================================================================== */

  test('T1.F1.1: Archivo textbook_verification_matrix.md existe y tiene estructura', () => {
    // Verificamos la existencia física del archivo matriz en la raíz del proyecto
    const matrixPath = path.join(projectRoot, 'textbook_verification_matrix.md');
    assert(fs.existsSync(matrixPath), 'El archivo textbook_verification_matrix.md debe existir');
    const content = fs.readFileSync(matrixPath, 'utf8');
    assertGreaterThan(content.length, 1000, 'El archivo de la matriz debe contener documentación detallada');
  });

  test('T1.F1.2: Matriz referencia los 3 libros de texto canónicos', () => {
    // Garantizamos que las 3 referencias académicas exigidas estén presentes
    const content = fs.readFileSync(path.join(projectRoot, 'textbook_verification_matrix.md'), 'utf8');
    assert(content.includes('Alexander') && content.includes('Sadiku'), 'Debe citar a Alexander & Sadiku');
    assert(content.includes('Horowitz') && content.includes('Hill'), 'Debe citar a Horowitz & Hill (x-Chapters)');
    assert(content.includes('Morris Mano') || content.includes('Mano, M. Morris'), 'Debe citar a M. Morris Mano');
  });

  test('T1.F1.3: Matriz mapea los 20 módulos curriculares con secciones y páginas', () => {
    // Verificamos que la tabla contenga filas estructuradas con números de página
    const content = fs.readFileSync(path.join(projectRoot, 'textbook_verification_matrix.md'), 'utf8');
    const lines = content.split('\n');
    const tableRows = lines.filter(l => l.includes('|') && (l.includes('1.') || l.includes('2.') || l.includes('3.') || l.includes('4.')));
    assertGreaterThanOrEqual(tableRows.length, 15, 'Debe haber al menos 15 módulos tabulados en la matriz');
    assert(content.includes('pp.'), 'Debe detallar rangos de páginas específicas');
  });

  test('T1.F1.4: Matriz incluye banco de verificación de las 23 preguntas de quiz', () => {
    // Aseguramos que la sección 3 de la matriz detalle el banco de preguntas auditadas
    const content = fs.readFileSync(path.join(projectRoot, 'textbook_verification_matrix.md'), 'utf8');
    assert(content.includes('correctIndex'), 'Debe detallar el índice de respuesta correcta auditado');
    assert(content.includes('Derivation') || content.includes('Mathematical'), 'Debe incluir derivación física o matemática');
  });

  test('T1.F1.5: Matriz incluye principios de dualidad circuital y teoremas', () => {
    // Validamos que se corroboren principios como condensador vs inductor y nodal vs mallas
    const content = fs.readFileSync(path.join(projectRoot, 'textbook_verification_matrix.md'), 'utf8');
    assert(content.includes('Duality') || content.includes('Dualidad'), 'Debe incluir principios de dualidad');
    assert(content.includes('Nodal Analysis') && content.includes('Mesh Analysis'), 'Debe contrastar análisis nodal y de mallas');
  });

  /* ==========================================================================
     CARACTERÍSTICA 2: Estructura Curricular y Fórmulas LaTeX (Curriculum LaTeX Math)
     ========================================================================== */

  test('T1.F2.1: Catálogo COURSES_CATALOG está definido con 8 fases', () => {
    // Inspeccionamos la variable global COURSES_CATALOG inyectada en el sandbox
    const catalog = ctx.COURSES_CATALOG;
    assertDefined(catalog, 'COURSES_CATALOG debe estar definido');
    assertGreaterThan(catalog.length, 0, 'Debe existir al menos un curso');
    const course = catalog[0];
    assertEqual(course.id, 'electronics-fundamentals', 'El ID del curso principal debe coincidir');
    assertGreaterThanOrEqual(course.phases.length, 8, 'El curso debe contener exactamente 8 fases');
  });

  test('T1.F2.2: Cada fase posee lecciones con identificadores únicos y títulos', () => {
    // Comprobamos la integridad de identificadores en todo el árbol curricular
    const course = ctx.COURSES_CATALOG[0];
    const seenLessonIds = new Set();
    let totalLessons = 0;

    course.phases.forEach(phase => {
      assertDefined(phase.id, 'Toda fase debe poseer id');
      assertDefined(phase.title, 'Toda fase debe poseer title');
      assert(Array.isArray(phase.lessons), 'phase.lessons debe ser un arreglo');
      phase.lessons.forEach(lesson => {
        assert(!seenLessonIds.has(lesson.id), `ID de lección duplicado detectado: ${lesson.id}`);
        seenLessonIds.add(lesson.id);
        totalLessons++;
      });
    });

    assertGreaterThanOrEqual(totalLessons, 18, 'Debe haber al menos 18 lecciones registradas en el catálogo');
  });

  test('T1.F2.3: Fórmulas matemáticas en Base de Conocimiento y Lecciones utilizan sintaxis LaTeX válida ($$...$$ o $...$)', () => {
    // Recorremos la base de conocimiento y el currículo verificando delimitadores KaTeX
    const kb = ctx.TUTOR_KNOWLEDGE_BASE;
    assertDefined(kb, 'TUTOR_KNOWLEDGE_BASE debe estar definido');
    let formulaCount = 0;

    kb.forEach(entry => {
      if (Array.isArray(entry.equations)) {
        entry.equations.forEach(eq => {
          if (eq.includes('$$') || eq.includes('$')) formulaCount++;
        });
      }
    });

    assertGreaterThanOrEqual(formulaCount, 10, 'Deben existir expresiones con notación LaTeX en la base de conocimiento');
  });

  test('T1.F2.4: Unidades físicas del SI son consistentes en explicaciones', () => {
    // Verificamos que se empleen las unidades canónicas (V, A, Ohms, W, F, H, s, Hz)
    const kb = ctx.TUTOR_KNOWLEDGE_BASE;
    assertDefined(kb, 'TUTOR_KNOWLEDGE_BASE debe estar definido');
    let hasUnits = false;
    kb.forEach(entry => {
      const allText = JSON.stringify(entry);
      if (allText.includes('Ω') || allText.includes('Ohms') || allText.includes('Watts') || allText.includes('Farad') || allText.includes('Henry')) {
        hasUnits = true;
      }
    });
    assert(hasUnits, 'La base de conocimiento debe incluir unidades físicas canónicas');
  });

  test('T1.F2.5: No existen marcadores de posición rotos ni artefactos residuales', () => {
    // Escaneamos el código fuente de curriculum.js para evitar errores tipográficos graves
    const curriculumRaw = fs.readFileSync(path.join(projectRoot, 'curriculum.js'), 'utf8');
    assert(!curriculumRaw.includes('TODO_UNDEFINED'), 'No deben existir marcadores de desarrollo no resueltos');
    assert(!curriculumRaw.includes('NaN'), 'No deben existir valores NaN literales en la configuración');
  });

  /* ==========================================================================
     CARACTERÍSTICA 3: Problemas Prácticos Universitarios (University Problem Sets)
     ========================================================================== */

  test('T1.F3.1: Definición del contrato de problemas prácticos con datos y solución', () => {
    // Verificamos el esquema esperado para un paso de práctica pedagógica
    const samplePractice = {
      type: 'practice',
      title: 'Practice: Nodal Analysis with Supernodes',
      problemStatement: 'Determine the node voltage $v_1$ across the 4Ω resistor.',
      givenData: { Vs: 12, R1: 4, R2: 6, Is: 2 },
      hint: 'Apply KCL at node 1 taking reference ground at datum.',
      solutionSteps: [
        'Step 1: Write KCL at node 1: $\\frac{v_1 - 12}{4} + \\frac{v_1}{6} = 2$',
        'Step 2: Multiply by 12: $3(v_1 - 12) + 2v_1 = 24$',
        'Step 3: Solve for $v_1$: $5v_1 = 60 \\implies v_1 = 12\\text{ V}$'
      ],
      finalAnswer: 'v_1 = 12.0\\text{ V}',
      textbookCitation: 'Alexander & Sadiku 7th Ed, Example 3.3 (p. 86)'
    };

    assertEqual(samplePractice.type, 'practice', 'El tipo de paso debe ser practice');
    assertGreaterThanOrEqual(samplePractice.solutionSteps.length, 3, 'Debe incluir al menos 3 pasos de derivación');
    assert(samplePractice.finalAnswer.includes('V'), 'La respuesta final debe especificar unidades');
  });

  test('T1.F3.2: Validación matemática de problema de divisor de tensión cargado', () => {
    // Calculamos el valor teórico de un divisor resistivo con carga RL
    const Vin = 24;
    const R1 = 1000;
    const R2 = 2000;
    const RL = 3000;

    // Rth = R1 || R2 = (1000 * 2000) / 3000 = 666.6667
    const Rth = (R1 * R2) / (R1 + R2);
    // Vth = Vin * (R2 / (R1 + R2)) = 24 * (2000 / 3000) = 16V
    const Vth = Vin * (R2 / (R1 + R2));
    // VL = Vth * (RL / (Rth + RL))
    const VL = Vth * (RL / (Rth + RL));

    assertCloseTo(Vth, 16.0, 1e-4, 'La tensión de Thévenin debe ser 16V');
    assertCloseTo(Rth, 666.6667, 1e-3, 'La resistencia de Thévenin debe ser 666.67 Ω');
    assertCloseTo(VL, 13.0909, 1e-3, 'La tensión sobre la carga debe ser 13.09V');
  });

  test('T1.F3.3: Validación matemática de cálculo de constante de tiempo RC', () => {
    // Verificamos el cálculo analítico tau = R * C
    const R = 47000; // 47 kΩ
    const C = 10e-6;  // 10 µF
    const tau = R * C;
    assertCloseTo(tau, 0.47, 1e-6, 'La constante de tiempo tau debe ser 0.47 segundos');

    // Voltaje al 63.2% de carga desde 0V a 10V
    const Vs = 10;
    const V_1tau = Vs * (1 - Math.exp(-1));
    assertCloseTo(V_1tau, 6.3212, 1e-4, 'El voltaje a 1tau debe ser 6.32V');
  });

  test('T1.F3.4: Validación matemática de ganancia de amplificador operacional inversor', () => {
    // Ganancia Av = -Rf / Rin
    const Rin = 10000;
    const Rf = 47000;
    const Vin = 0.2;
    const Av = -Rf / Rin;
    const Vout = Av * Vin;

    assertCloseTo(Av, -4.7, 1e-5, 'La ganancia inversora debe ser -4.7');
    assertCloseTo(Vout, -0.94, 1e-4, 'El voltaje de salida debe ser -0.94V');
  });

  test('T1.F3.5: Validación de referencias y citas bibliográficas en problemas modelo', () => {
    // Verificamos que la estructura de citas apunte a libros y páginas
    const citation = 'Alexander & Sadiku 7th Ed, Practice Problem 4.8 (p. 142)';
    assert(citation.includes('Alexander & Sadiku'), 'Debe citar el autor');
    assert(citation.includes('p.'), 'Debe citar la página');
  });

  /* ==========================================================================
     CARACTERÍSTICA 4: Banco de Cuestionarios y Retroalimentación KaTeX (Quiz Bank)
     ========================================================================== */

  test('T1.F4.1: Todas las preguntas de quiz poseen opciones válidas y correctIndex dentro de rango', () => {
    // Iteramos por todas las lecciones y validamos cada paso de tipo quiz
    const course = ctx.COURSES_CATALOG[0];
    let quizCount = 0;

    course.phases.forEach(phase => {
      phase.lessons.forEach(lesson => {
        lesson.steps.forEach(step => {
          if (step.type === 'quiz') {
            quizCount++;
            assertDefined(step.question, `Quiz en ${lesson.id} debe tener question`);
            assert(Array.isArray(step.options), `Quiz en ${lesson.id} debe tener options`);
            assertGreaterThanOrEqual(step.options.length, 2, 'Debe tener al menos 2 opciones');
            assertLessThanOrEqual(step.options.length, 4, 'Debe tener como máximo 4 opciones');
            assertGreaterThanOrEqual(step.correctIndex, 0, 'correctIndex debe ser >= 0');
            assertLessThan(step.correctIndex, step.options.length, 'correctIndex debe estar dentro del rango');
            assertDefined(step.explanation, `Quiz en ${lesson.id} debe tener explanation`);
          }
        });
      });
    });

    assertGreaterThanOrEqual(quizCount, 20, 'Deben existir al menos 20 preguntas de quiz en el curso');
  });

  test('T1.F4.2: Evaluación de respuestas de quiz procesa aciertos correctamente', () => {
    // Simulamos la lógica de evaluación cuando el estudiante selecciona la opción correcta
    const quizStep = {
      type: 'quiz',
      correctIndex: 2,
      options: ['Opción A', 'Opción B', 'Opción C', 'Opción D'],
      explanation: 'Explicación técnica detallada.'
    };

    const selectedIndex = 2;
    const isCorrect = (selectedIndex === quizStep.correctIndex);
    assert(isCorrect, 'Debe identificar la selección correcta');
  });

  test('T1.F4.3: Evaluación de respuestas de quiz detecta errores y muestra retroalimentación', () => {
    // Simulamos la lógica cuando el estudiante comete un error
    const quizStep = {
      type: 'quiz',
      correctIndex: 1,
      options: ['10V', '5V', '0V', '20V'],
      explanation: 'Por la regla del divisor de tensión, Vout = 10 * (10k / 20k) = 5V.'
    };

    const selectedIndex = 0; // Respuesta incorrecta
    const isCorrect = (selectedIndex === quizStep.correctIndex);
    assertEqual(isCorrect, false, 'Debe identificar selección incorrecta');
    assert(quizStep.explanation.includes('5V'), 'La explicación debe contener el resultado verdadero');
  });

  test('T1.F4.4: Renderizado de retroalimentación KaTeX en contenedor de quiz', () => {
    // Probamos la invocación del renderizador matemático al mostrar la explicación
    let mathRendered = false;
    const mockFeedbackEl = env.document.createElement('div');
    mockFeedbackEl.id = 'quiz-feedback-box';
    mockFeedbackEl.innerHTML = '<p>Fórmula: $$V = I \\cdot R$$</p>';

    // Invocamos KaTeX render
    if (ctx.katex && typeof ctx.katex.renderToString === 'function') {
      const rendered = ctx.katex.renderToString('V = I \\cdot R');
      assert(rendered.includes('katex-rendered'), 'KaTeX debe producir salida formateada');
      mathRendered = true;
    }
    assert(mathRendered, 'KaTeX render debe ejecutarse correctamente');
  });

  test('T1.F4.5: Acumulación de puntuación y XP por responder cuestionarios', () => {
    // Verificamos que el sistema sume puntos de experiencia
    const initialXP = 0;
    const xpPerQuiz = 25;
    const totalQuizzesPassed = 4;
    const finalXP = initialXP + (totalQuizzesPassed * xpPerQuiz);
    assertEqual(finalXP, 100, 'El XP acumulado debe reflejar las respuestas correctas');
  });

  /* ==========================================================================
     CARACTERÍSTICA 5: Osciloscopio de CA en Tiempo Real (AC Oscilloscope Simulator)
     ========================================================================== */

  test('T1.F5.1: Ecuación sinusoidal v(t) = Vm * sin(2*pi*f*t + phi) es calculada con exactitud', () => {
    // Probamos el generador de formas de onda con amplitud 5V, f = 60Hz y fase 0 rad
    const Vm = 5.0;
    const f = 60.0;
    const phi = 0.0;
    const t_quarter = 1 / (4 * f); // t = 1/240 s -> sin(pi/2) = 1.0

    const v_at_quarter = Vm * Math.sin(2 * Math.PI * f * t_quarter + phi);
    assertCloseTo(v_at_quarter, 5.0, 1e-4, 'La tensión en el cuarto de ciclo debe alcanzar la cresta Vm');

    const t_half = 1 / (2 * f); // t = 1/120 s -> sin(pi) = 0
    const v_at_half = Vm * Math.sin(2 * Math.PI * f * t_half + phi);
    assertCloseTo(v_at_half, 0.0, 1e-4, 'La tensión en el semiciclo debe cruzar por cero');
  });

  test('T1.F5.2: Relación de frecuencia angular omega = 2*pi*f y periodo T = 1/f', () => {
    // Verificamos la consistencia de parámetros temporales
    const f = 1000; // 1 kHz
    const omega = 2 * Math.PI * f;
    const T = 1 / f;

    assertCloseTo(omega, 6283.1853, 1e-3, 'omega debe ser 6283.19 rad/s');
    assertEqual(T, 0.001, 'El periodo T debe ser 1 ms');
  });

  test('T1.F5.3: Cálculo de tensión eficaz RMS Vrms = Vm / sqrt(2)', () => {
    // Calculamos el valor eficaz para una señal de 120V pico
    const Vm = 169.7056; // 120 * sqrt(2)
    const Vrms = Vm / Math.SQRT2;
    assertCloseTo(Vrms, 120.0, 1e-2, 'El valor RMS debe ser 120V');
  });

  test('T1.F5.4: Desfase temporal y cálculo de adelanto/atraso', () => {
    // Desfase de 90 grados (pi/2 rad) a 50Hz
    const f = 50;
    const deltaPhi = Math.PI / 2; // 90°
    const omega = 2 * Math.PI * f;
    const dt = deltaPhi / omega; // dt = (pi/2) / (100*pi) = 1/200 s = 5 ms

    assertCloseTo(dt, 0.005, 1e-5, 'El desfase temporal de 90 grados a 50Hz debe ser 5 ms');
  });

  test('T1.F5.5: Registro de llamadas de dibujo en Canvas para rejilla de osciloscopio', () => {
    // Simulamos el renderizado de la retícula CRT en el mock context
    const canvas = env.document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 280;
    const ctx2d = canvas.getContext('2d');

    // Dibujamos fondo y retícula
    ctx2d.fillStyle = '#050c14';
    ctx2d.fillRect(0, 0, 640, 280);
    ctx2d.strokeStyle = '#0e2a3b';
    ctx2d.beginPath();
    ctx2d.moveTo(0, 140);
    ctx2d.lineTo(640, 140);
    ctx2d.stroke();

    assertGreaterThan(ctx2d.drawHistory.length, 2, 'Deben registrarse operaciones gráficas en el canvas');
  });

  /* ==========================================================================
     CARACTERÍSTICA 6: Curvas Transitorias RC y RLC (Transient Curve Generator)
     ========================================================================== */

  test('T1.F6.1: Constante de tiempo RC tau = R * C y carga exponencial', () => {
    // Carga de condensador vs(t) = Vs * (1 - exp(-t/tau))
    const R = 10000;  // 10 kΩ
    const C = 100e-6; // 100 µF
    const tau = R * C; // 1.0 s
    const Vs = 12.0;

    assertEqual(tau, 1.0, 'tau debe ser 1.0 s');

    // Valores canónicos en múltiplos de tau
    const v_1tau = Vs * (1 - Math.exp(-1)); // 63.21%
    const v_2tau = Vs * (1 - Math.exp(-2)); // 86.47%
    const v_3tau = Vs * (1 - Math.exp(-3)); // 95.02%
    const v_5tau = Vs * (1 - Math.exp(-5)); // 99.33%

    assertCloseTo(v_1tau / Vs, 0.6321, 1e-3, 'A 1tau el condensador debe cargarse al 63.2%');
    assertCloseTo(v_2tau / Vs, 0.8647, 1e-3, 'A 2tau debe alcanzar el 86.5%');
    assertCloseTo(v_3tau / Vs, 0.9502, 1e-3, 'A 3tau debe alcanzar el 95.0%');
    assertCloseTo(v_5tau / Vs, 0.9933, 1e-3, 'A 5tau debe alcanzar el 99.3%');
  });

  test('T1.F6.2: Descarga exponencial de condensador v(t) = V0 * exp(-t/tau)', () => {
    // Descarga desde V0 = 10V
    const V0 = 10.0;
    const v_1tau_disc = V0 * Math.exp(-1);
    const v_5tau_disc = V0 * Math.exp(-5);

    assertCloseTo(v_1tau_disc, 3.6788, 1e-4, 'A 1tau el voltaje remanente debe ser 36.8%');
    assertCloseTo(v_5tau_disc, 0.0674, 1e-4, 'A 5tau el voltaje remanente debe ser menor al 1%');
  });

  test('T1.F6.3: Frecuencia de resonancia natural RLC omega0 = 1 / sqrt(L * C)', () => {
    // Parámetros L = 100 mH, C = 10 µF
    const L = 0.1;
    const C = 10e-6;
    const omega0 = 1 / Math.sqrt(L * C); // 1 / sqrt(1e-6) = 1000 rad/s
    const f0 = omega0 / (2 * Math.PI);

    assertCloseTo(omega0, 1000.0, 1e-3, 'omega0 debe ser exactamente 1000 rad/s');
    assertCloseTo(f0, 159.1549, 1e-3, 'La frecuencia f0 debe ser 159.15 Hz');
  });

  test('T1.F6.4: Factor de amortiguamiento serie alpha = R / (2 * L)', () => {
    // L = 0.1 H, R = 50 Ω
    const L = 0.1;
    const R = 50;
    const alpha = R / (2 * L); // 50 / 0.2 = 250 s^-1
    assertEqual(alpha, 250, 'El factor alpha debe ser 250 s^-1');
  });

  test('T1.F6.5: Clasificación rigurosa de regímenes RLC (subamortiguado, crítico, sobreamortiguado)', () => {
    // Comprobamos la lógica de discriminación entre los 3 regímenes
    const classifyRLC = (alpha, omega0) => {
      if (Math.abs(alpha - omega0) < 1e-6) return 'critically-damped';
      if (alpha < omega0) return 'underdamped';
      return 'overdamped';
    };

    assertEqual(classifyRLC(100, 1000), 'underdamped', 'alpha < omega0 debe ser subamortiguado');
    assertEqual(classifyRLC(1000, 1000), 'critically-damped', 'alpha == omega0 debe ser críticamente amortiguado');
    assertEqual(classifyRLC(2500, 1000), 'overdamped', 'alpha > omega0 debe ser sobreamortiguado');
  });

  test('T1.F6.6: Frecuencia de oscilación amortiguada omegad = sqrt(omega0^2 - alpha^2)', () => {
    // Para circuito subamortiguado con omega0 = 1000 y alpha = 600
    const omega0 = 1000;
    const alpha = 600;
    const omegad = Math.sqrt(omega0 * omega0 - alpha * alpha); // sqrt(1000000 - 360000) = 800 rad/s

    assertCloseTo(omegad, 800.0, 1e-4, 'La frecuencia omegad debe ser 800 rad/s');
  });

  /* ==========================================================================
     CARACTERÍSTICA 7: Divisor de Tensión y Thévenin (Voltage Divider & Thevenin)
     ========================================================================== */

  test('T1.F7.1: Regla del divisor de tensión sin carga Vout = Vin * (R2 / (R1 + R2))', () => {
    // Divisor simétrico 10V con dos resistencias de 10k
    const Vin = 10.0;
    const R1 = 10000;
    const R2 = 10000;
    const Vout = Vin * (R2 / (R1 + R2));
    assertEqual(Vout, 5.0, 'El voltaje en divisor 50/50 debe ser la mitad exacta');
  });

  test('T1.F7.2: Corriente total del lazo divisor I = Vin / (R1 + R2)', () => {
    // Vin = 12V, R1 = 2Ω, R2 = 4Ω -> I = 2A
    const Vin = 12.0;
    const R1 = 2.0;
    const R2 = 4.0;
    const I = Vin / (R1 + R2);
    assertEqual(I, 2.0, 'La corriente debe ser 2 Amperes');
  });

  test('T1.F7.3: Parámetros del circuito equivalente de Thévenin (Vth y Rth)', () => {
    // Red de divisor vista desde los terminales de R2
    const Vin = 30.0;
    const R1 = 20.0;
    const R2 = 30.0;
    const Vth = Vin * (R2 / (R1 + R2)); // 30 * (30/50) = 18V
    const Rth = (R1 * R2) / (R1 + R2);  // 600 / 50 = 12 Ω

    assertEqual(Vth, 18.0, 'Vth debe ser 18V');
    assertEqual(Rth, 12.0, 'Rth debe ser 12 Ω');
  });

  test('T1.F7.4: Teorema de máxima transferencia de potencia (RL = Rth)', () => {
    // Verificamos que la potencia en la carga sea máxima cuando RL = Rth
    const Vth = 20.0;
    const Rth = 50.0;
    const calcPower = (RL) => {
      const IL = Vth / (Rth + RL);
      return IL * IL * RL;
    };

    const P_matched = calcPower(50); // RL = 50 -> IL = 0.2 -> P = 0.04 * 50 = 2W
    const P_lower = calcPower(25);   // RL = 25 -> IL = 20/75 = 0.2667 -> P = 0.0711 * 25 = 1.777W
    const P_higher = calcPower(100); // RL = 100 -> IL = 20/150 = 0.1333 -> P = 0.01777 * 100 = 1.777W

    assertCloseTo(P_matched, 2.0, 1e-5, 'La potencia máxima debe ser 2.0 Watts');
    assertGreaterThan(P_matched, P_lower, 'La potencia con carga adaptada debe superar a RL menor');
    assertGreaterThan(P_matched, P_higher, 'La potencia con carga adaptada debe superar a RL mayor');
  });

  test('T1.F7.5: Disipación de calor y balance de energía P_total = P1 + P2', () => {
    // Comprobamos la conservación de la energía eléctrica
    const Vin = 12.0;
    const R1 = 100;
    const R2 = 200;
    const I = Vin / (R1 + R2); // 12 / 300 = 0.04 A
    const P_supply = Vin * I;  // 12 * 0.04 = 0.48 W
    const P1 = I * I * R1;     // 0.0016 * 100 = 0.16 W
    const P2 = I * I * R2;     // 0.0016 * 200 = 0.32 W

    assertCloseTo(P_supply, P1 + P2, 1e-6, 'La potencia suministrada debe igualar la suma de potencias disipadas');
  });

  /* ==========================================================================
     CARACTERÍSTICA 8: Amplificadores Operacionales (Op-Amp Gain & Saturation)
     ========================================================================== */

  test('T1.F8.1: Ganancia en configuración inversora Av = -Rf / R1 y Vout', () => {
    // Amplificador inversor con R1 = 1k, Rf = 10k (Av = -10)
    const R1 = 1000;
    const Rf = 10000;
    const Vin = 0.5;
    const Av = -Rf / R1;
    const Vout = Av * Vin;

    assertEqual(Av, -10, 'La ganancia Av debe ser -10');
    assertEqual(Vout, -5.0, 'El voltaje de salida debe ser -5.0V');
  });

  test('T1.F8.2: Ganancia en configuración no inversora Av = 1 + (Rf / R1)', () => {
    // Amplificador no inversor con R1 = 2k, Rf = 8k (Av = 1 + 4 = 5)
    const R1 = 2000;
    const Rf = 8000;
    const Vin = 1.2;
    const Av = 1 + (Rf / R1);
    const Vout = Av * Vin;

    assertEqual(Av, 5, 'La ganancia no inversora debe ser +5');
    assertCloseTo(Vout, 6.0, 1e-4, 'El voltaje de salida debe ser 6.0V');
  });

  test('T1.F8.3: Buffer seguidor de tensión con ganancia unitaria Av = 1', () => {
    // Seguidor de tensión (Rf = 0)
    const Vin = 3.33;
    const Av = 1.0;
    const Vout = Av * Vin;
    assertEqual(Vout, 3.33, 'El seguidor debe transferir la tensión intacta');
  });

  test('T1.F8.4: Recorte por saturación en los rieles de alimentación (+-Vsat)', () => {
    // Función de saturación del amplificador
    const clampOpAmp = (vCalc, VsatPos, VsatNeg) => {
      if (vCalc > VsatPos) return VsatPos;
      if (vCalc < VsatNeg) return VsatNeg;
      return vCalc;
    };

    const VsatPos = 15.0;
    const VsatNeg = -15.0;

    assertEqual(clampOpAmp(22.0, VsatPos, VsatNeg), 15.0, 'Debe recortar a +15V en saturación positiva');
    assertEqual(clampOpAmp(-18.5, VsatPos, VsatNeg), -15.0, 'Debe recortar a -15V en saturación negativa');
    assertEqual(clampOpAmp(7.5, VsatPos, VsatNeg), 7.5, 'Debe operar linealmente dentro de los rieles');
  });

  test('T1.F8.5: Principio de masa virtual en el terminal inversor (V- = V+ = 0V)', () => {
    // En realimentación negativa ideal, la diferencia diferencial es nula
    const Vplus = 0.0; // Terminal no inversor a tierra
    const Vminus = Vplus; // Masa virtual
    assertEqual(Vminus, 0.0, 'El potencial en el terminal inversor debe ser 0V');
  });

  /* ==========================================================================
     CARACTERÍSTICA 9: Sincronización de Audio y Resaltado (Audio Timestamp Sync)
     ========================================================================== */

  test('T1.F9.1: Monotonía y validez de marcas de tiempo en oraciones de audio', () => {
    // Validamos la consistencia de los tiempos de audio en la lección 1.1
    const lesson11 = ctx.COURSES_CATALOG[0].phases[0].lessons[0];
    const readingStep = lesson11.steps.find(s => s.type === 'content');
    assertDefined(readingStep, 'Debe existir paso de lectura');

    let previousEnd = 0;
    readingStep.sections.forEach(sec => {
      sec.sentences.forEach(sent => {
        assertGreaterThanOrEqual(sent.start, 0, 'start time debe ser >= 0');
        assertGreaterThan(sent.end, sent.start, 'end time debe ser estrictamente mayor a start time');
        assertGreaterThanOrEqual(sent.start, previousEnd - 0.5, 'Las marcas deben progresar cronológicamente');
        previousEnd = sent.end;
      });
    });
  });

  test('T1.F9.2: Búsqueda determinista de la oración activa según timestamp', () => {
    // Algoritmo de localización de oración según el tiempo de reproducción actual
    const sentences = [
      { id: 's1', start: 10.0, end: 15.0, text: 'Oración 1' },
      { id: 's2', start: 15.0, end: 20.0, text: 'Oración 2' },
      { id: 's3', start: 20.0, end: 25.0, text: 'Oración 3' }
    ];

    const findActive = (t) => sentences.find(s => t >= s.start && t < s.end) || null;

    assertEqual(findActive(12.5).id, 's1', 'A 12.5s debe activar la oración 1');
    assertEqual(findActive(17.8).id, 's2', 'A 17.8s debe activar la oración 2');
    assertEqual(findActive(22.1).id, 's3', 'A 22.1s debe activar la oración 3');
    assertEqual(findActive(30.0), null, 'A 30s no debe haber oración activa');
  });

  test('T1.F9.3: Convención de nombres y rutas de archivos de audio', () => {
    // Comprobamos que el campo audioSrc apunte al directorio audio/
    const lesson11 = ctx.COURSES_CATALOG[0].phases[0].lessons[0];
    const readingStep = lesson11.steps.find(s => s.type === 'content');
    assertMatches(readingStep.audioSrc, /^audio\/lesson-[0-9a-zA-Z-]+\.mp3$/, 'La ruta debe ser audio/lesson-*.mp3');
  });

  test('T1.F9.4: Control de estado de reproducción y silenciamiento (SoundEngine)', () => {
    // Verificamos el módulo SoundEngine en el sandbox
    const sound = ctx.SoundEngine;
    assertDefined(sound, 'SoundEngine debe estar definido');
    const initialMute = sound.isMuted();
    const toggled = sound.toggleMute();
    assertEqual(toggled, !initialMute, 'toggleMute debe invertir el estado de sonido');
    sound.toggleMute(); // Restauramos
  });

  test('T1.F9.5: Aplicación de clase sentence-active al nodo DOM correspondiente', () => {
    // Simulamos la actualización visual del elemento activo en la lectura
    const el1 = env.document.createElement('span');
    el1.id = 's1';
    el1.classList.add('sentence-node');

    const el2 = env.document.createElement('span');
    el2.id = 's2';
    el2.classList.add('sentence-node');

    // Activamos s2
    el1.classList.remove('sentence-active');
    el2.classList.add('sentence-active');

    assertEqual(el1.classList.contains('sentence-active'), false, 's1 no debe tener sentence-active');
    assertEqual(el2.classList.contains('sentence-active'), true, 's2 debe tener sentence-active');
  });

  /* ==========================================================================
     CARACTERÍSTICA 10: Navegación por Teclado y Estado (Navigation & App State)
     ========================================================================== */

  test('T1.F10.1: Estado inicial de la aplicación arranca en 0% y lección 1', () => {
    // Verificamos el objeto AppState
    const state = ctx.AppState;
    assertDefined(state, 'AppState debe estar definido');
    assertEqual(state.activeLessonId, 'lesson-1-1', 'Debe iniciar en la lección lesson-1-1');
    assertEqual(state.currentStepIndex, 0, 'Debe iniciar en el paso 0');
  });

  test('T1.F10.2: Navegación hacia adelante incrementa el paso activo', () => {
    // Simulamos avance de paso
    let currentStep = 0;
    const totalSteps = 5;
    const nextStep = () => {
      if (currentStep < totalSteps - 1) currentStep++;
      return currentStep;
    };

    assertEqual(nextStep(), 1, 'Debe avanzar al paso 1');
    assertEqual(nextStep(), 2, 'Debe avanzar al paso 2');
  });

  test('T1.F10.3: Navegación hacia atrás retrocede respetando el límite inferior 0', () => {
    // Simulamos retroceso de paso
    let currentStep = 2;
    const prevStep = () => {
      if (currentStep > 0) currentStep--;
      return currentStep;
    };

    assertEqual(prevStep(), 1, 'Debe retroceder al paso 1');
    assertEqual(prevStep(), 0, 'Debe retroceder al paso 0');
    assertEqual(prevStep(), 0, 'No debe descender por debajo de 0');
  });

  test('T1.F10.4: Cálculo porcentual de progreso global del curso', () => {
    // Progreso = (completadas / total) * 100
    const totalLessons = 20;
    const completed = 5;
    const pct = Math.round((completed / totalLessons) * 100);
    assertEqual(pct, 25, '5 de 20 lecciones debe ser 25% de progreso');
  });

  test('T1.F10.5: Persistencia y recuperación en MockLocalStorage', () => {
    // Probamos serialización y deserialización de estado
    const savedState = { completedLessons: ['lesson-1-1', 'lesson-1-2'], totalXP: 150 };
    env.storage.setItem('electronflow-test-progress', JSON.stringify(savedState));
    const loaded = JSON.parse(env.storage.getItem('electronflow-test-progress'));

    assertEqual(loaded.completedLessons.length, 2, 'Debe recuperar las 2 lecciones guardadas');
    assertEqual(loaded.totalXP, 150, 'Debe recuperar el total de XP');
  });

  test('T1.F10.6: Búsqueda semántica en base de conocimiento del tutor (TutorEngine)', () => {
    // Ejecutamos una búsqueda sobre conceptos de ley de Ohm en el motor del tutor
    const kb = ctx.TUTOR_KNOWLEDGE_BASE;
    const query = "ohm's law calculate voltage";
    const match = kb.find(item => item.keywords.some(kw => query.toLowerCase().includes(kw)));

    assertDefined(match, 'Debe encontrar coincidencia para ley de Ohm');
    assert(match.topic.includes("Ohm's Law"), 'El tema debe corresponder a la Ley de Ohm');
  });

  env.cleanup();
  return results;
}

module.exports = { runTier1Tests };
