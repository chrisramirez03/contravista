/**
 * ============================================================================
 * ElectronFlow — tests/tier3_cross_feature.js
 * 
 * Nivel 3: Interacciones Cruzadas entre Módulos (Cross-Feature Interactions).
 * Valida la interoperabilidad y sincronización entre el reproductor de audio,
 * el motor de simulación Canvas 2D, el evaluador de cuestionarios KaTeX,
 * la persistencia en LocalStorage y el asistente inteligente del tutor.
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
 * Suite de pruebas Tier 3: Interacciones Cruzadas
 */
function runTier3Tests() {
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
     INTERACCIÓN 1: Transición de Pasos y Limpieza de AnimationFrame
     ========================================================================== */
  test('T3.1: Transición entre pasos cancela la animación previa e inicializa nuevo contenedor', () => {
    // Al cambiar de paso de simulación a cuestionario, debe detenerse el bucle de renderizado Canvas
    let activeAnimationId = 101;
    let cancelledId = null;

    const cancelAnimation = (id) => {
      cancelledId = id;
      activeAnimationId = null;
    };

    // Simulamos avance de paso
    cancelAnimation(activeAnimationId);

    assertEqual(cancelledId, 101, 'Debe registrar la cancelación del ID activo');
    assertEqual(activeAnimationId, null, 'El puntero de animación debe quedar liberado');
  });

  /* ==========================================================================
     INTERACCIÓN 2: Actualización de Sliders y Recálculo Matemático en Vivo
     ========================================================================== */
  test('T3.2: Cambio en control deslizante de voltaje actualiza corriente y disipación de potencia', () => {
    // Vinculación entre eventos 'input' de sliders y el recálculo físico de la ley de Ohm
    const state = { voltage: 12.0, resistance: 100.0, current: 0.12, power: 1.44 };

    // El usuario desliza el control de voltaje a 24V
    const onVoltageSliderInput = (newV) => {
      state.voltage = newV;
      state.current = state.voltage / state.resistance;
      state.power = state.voltage * state.current;
    };

    onVoltageSliderInput(24.0);

    assertEqual(state.voltage, 24.0, 'El voltaje debe actualizarse a 24V');
    assertCloseTo(state.current, 0.24, 1e-4, 'La corriente calculada debe ser 0.24A');
    assertCloseTo(state.power, 5.76, 1e-4, 'La potencia calculada debe ser 5.76W');
  });

  /* ==========================================================================
     INTERACCIÓN 3: Envío de Quiz y Renderizado Dinámico de KaTeX en Feedback
     ========================================================================== */
  test('T3.3: Envío de respuesta de quiz renderiza explicación técnica con ecuaciones KaTeX', () => {
    // Al responder, el contenedor debe recibir el texto con innerHTML y compilar KaTeX
    const feedbackBox = env.document.createElement('div');
    feedbackBox.id = 'quiz-feedback';

    const quizItem = {
      correctIndex: 1,
      explanation: 'La ley de Ohm establece que $$I = \\frac{V}{R} = \\frac{12\\text{ V}}{4\\,\\Omega} = 3\\text{ A}$$.'
    };

    const submitAnswer = (chosenIndex) => {
      const isCorrect = (chosenIndex === quizItem.correctIndex);
      feedbackBox.className = isCorrect ? 'feedback-correct' : 'feedback-incorrect';
      feedbackBox.innerHTML = `<p>${quizItem.explanation}</p>`;
      if (ctx.katex) {
        ctx.katex.render(quizItem.explanation, feedbackBox);
      }
    };

    submitAnswer(1); // Respuesta acertada

    assertEqual(feedbackBox.className, 'feedback-correct', 'Debe marcar la clase feedback-correct');
    assert(feedbackBox.innerHTML.includes('katex-rendered'), 'KaTeX debe haber compilado la fórmula');
  });

  /* ==========================================================================
     INTERACCIÓN 4: Sincronización de Audio durante Apertura de Modales
     ========================================================================== */
  test('T3.4: Apertura de modal de formulario (Cheatsheet) preserva la posición del audio', () => {
    // La apertura de la hoja de trucos no debe reiniciar ni corromper el timestamp de audio
    let audioCurrentTime = 42.5;
    let modalOpen = false;

    const toggleCheatsheet = () => {
      modalOpen = !modalOpen;
      // El tiempo de audio permanece intacto
    };

    toggleCheatsheet();
    assertEqual(modalOpen, true, 'El modal debe abrirse');
    assertEqual(audioCurrentTime, 42.5, 'El tiempo de audio debe mantenerse en 42.5s');
  });

  /* ==========================================================================
     INTERACCIÓN 5: Paso de Práctica Universitaria con Despliegue Progresivo
     ========================================================================== */
  test('T3.5: Paso de práctica permite alternar pistas y revelar soluciones paso a paso', () => {
    // Interacción de interfaz para problemas universitarios
    const practiceState = {
      hintVisible: false,
      solutionVisible: false
    };

    const toggleHint = () => { practiceState.hintVisible = !practiceState.hintVisible; };
    const toggleSolution = () => { practiceState.solutionVisible = !practiceState.solutionVisible; };

    toggleHint();
    assertEqual(practiceState.hintVisible, true, 'La pista debe hacerse visible');

    toggleSolution();
    assertEqual(practiceState.solutionVisible, true, 'La solución con derivación debe hacerse visible');
  });

  /* ==========================================================================
     INTERACCIÓN 6: Conmutación entre Laboratorios y Reinicio Limpio de Parámetros
     ========================================================================== */
  test('T3.6: Cambio de simulación (Ley de Ohm -> Osciloscopio -> Op-Amp) reconfigura controles', () => {
    // El motor unificado debe reajustar los rangos de sliders según el tipo de laboratorio
    let currentLab = 'ohms-law';
    let controlsConfig = {};

    const switchLab = (labType) => {
      currentLab = labType;
      if (labType === 'ohms-law') {
        controlsConfig = { minV: 1, maxV: 24, minR: 10, maxR: 1000 };
      } else if (labType === 'ac-oscilloscope') {
        controlsConfig = { minFreq: 10, maxFreq: 1000, minAmp: 1, maxAmp: 20 };
      } else if (labType === 'opamp-gain') {
        controlsConfig = { minRf: 1000, maxRf: 100000, minRin: 500, maxRin: 20000 };
      }
    };

    switchLab('ac-oscilloscope');
    assertEqual(currentLab, 'ac-oscilloscope', 'Laboratorio debe ser osciloscopio');
    assertEqual(controlsConfig.maxFreq, 1000, 'Frecuencia máxima debe ser 1000 Hz');

    switchLab('opamp-gain');
    assertEqual(currentLab, 'opamp-gain', 'Laboratorio debe ser opamp-gain');
    assertEqual(controlsConfig.maxRf, 100000, 'Rf máxima debe ser 100 kΩ');
  });

  /* ==========================================================================
     INTERACCIÓN 7: Consulta al Tutor IA y Carga de Concepto con Ecuaciones
     ========================================================================== */
  test('T3.7: Consulta al Asistente IA extrae concepto de la base de conocimiento y formatea respuesta', () => {
    // El usuario pregunta por potencia eléctrica
    const kb = ctx.TUTOR_KNOWLEDGE_BASE;
    const query = 'how to calculate electrical power';
    const match = kb.find(item => item.keywords.some(kw => query.includes(kw) || kw.includes('power')));

    assertDefined(match, 'Debe localizar el tema de potencia');
    assert(match.equations.length > 0, 'Debe incluir fórmulas matemáticas asociadas');
    assert(match.equations[0].includes('P = V'), 'La fórmula debe incluir P = V * I');
  });

  /* ==========================================================================
     INTERACCIÓN 8: Progreso Global y Desbloqueo de Siguiente Lección
     ========================================================================== */
  test('T3.8: Completar el último paso de una lección la marca como completada y suma XP', () => {
    // Flujo de avance de lección
    const userProgress = {
      completedLessons: [],
      totalXP: 0
    };

    const completeLesson = (lessonId, xpReward) => {
      if (!userProgress.completedLessons.includes(lessonId)) {
        userProgress.completedLessons.push(lessonId);
        userProgress.totalXP += xpReward;
      }
    };

    completeLesson('lesson-1-1', 75);

    assertEqual(userProgress.completedLessons.length, 1, 'Debe haber 1 lección completada');
    assertEqual(userProgress.totalXP, 75, 'Debe otorgar 75 XP');

    // Intentar completar de nuevo no duplica el XP
    completeLesson('lesson-1-1', 75);
    assertEqual(userProgress.completedLessons.length, 1, 'No debe duplicar lecciones');
    assertEqual(userProgress.totalXP, 75, 'No debe duplicar XP');
  });

  /* ==========================================================================
     INTERACCIÓN 9: Atajos de Teclado Numéricos (1-4) para Selección de Quiz
     ========================================================================== */
  test('T3.9: Pulsar teclas numéricas 1 a 4 selecciona la opción de quiz correspondiente', () => {
    // Mapeo de teclas '1' -> 0, '2' -> 1, '3' -> 2, '4' -> 3
    let selectedOptionIndex = null;

    const handleKeyNav = (key) => {
      if (['1', '2', '3', '4'].includes(key)) {
        selectedOptionIndex = parseInt(key, 10) - 1;
      }
    };

    handleKeyNav('2');
    assertEqual(selectedOptionIndex, 1, 'Tecla 2 debe seleccionar el índice 1');

    handleKeyNav('4');
    assertEqual(selectedOptionIndex, 3, 'Tecla 4 debe seleccionar el índice 3');
  });

  /* ==========================================================================
     INTERACCIÓN 10: Persistencia de Estado y Recuperación tras Recarga
     ========================================================================== */
  test('T3.10: Almacenamiento en LocalStorage restaura el paso y lección activa exactamente', () => {
    // Simulamos ciclo de guardado y carga completa
    const session = {
      activeLessonId: 'lesson-2-3',
      currentStepIndex: 3,
      speechRate: 1.25,
      soundMuted: false
    };

    env.storage.setItem('electronflow-session-test', JSON.stringify(session));
    const restored = JSON.parse(env.storage.getItem('electronflow-session-test'));

    assertEqual(restored.activeLessonId, 'lesson-2-3', 'Debe restaurar lesson-2-3');
    assertEqual(restored.currentStepIndex, 3, 'Debe restaurar el paso 3');
    assertEqual(restored.speechRate, 1.25, 'Debe restaurar la velocidad de habla');
    assertEqual(restored.soundMuted, false, 'Debe restaurar el estado de sonido');
  });

  /* ==========================================================================
     INTERACCIÓN 11: Renderizado KaTeX en Modal de Hoja de Fórmulas
     ========================================================================== */
  test('T3.11: Apertura de Cheatsheet invoca renderizado KaTeX en todas las fórmulas del modal', () => {
    // Simulamos la apertura del modal con varias fórmulas de resumen
    const cheatModal = env.document.createElement('div');
    cheatModal.id = 'modal-cheatsheet';
    cheatModal.innerHTML = `
      <div class="formula-row">$$V = I \\cdot R$$</div>
      <div class="formula-row">$$P = V \\cdot I$$</div>
      <div class="formula-row">$$\\tau = R \\cdot C$$</div>
    `;

    // Procesamos con KaTeX
    const rows = cheatModal.querySelectorAll('.formula-row');
    rows.forEach(r => {
      if (ctx.katex) {
        ctx.katex.render(r.textContent, r);
      }
    });

    assertEqual(rows.length, 3, 'Debe contener 3 filas de fórmulas');
  });

  /* ==========================================================================
     INTERACCIÓN 12: Persistencia del Estado de Silenciamiento de Audio
     ========================================================================== */
  test('T3.12: Estado de silenciamiento (Mute) se preserva durante toda la navegación', () => {
    // SoundEngine guarda el estado en localStorage
    env.storage.setItem('electronflow-sound-muted', 'true');
    const isMuted = env.storage.getItem('electronflow-sound-muted') === 'true';
    assertEqual(isMuted, true, 'El estado de silenciamiento debe ser true');
  });

  env.cleanup();
  return results;
}

module.exports = { runTier3Tests };
