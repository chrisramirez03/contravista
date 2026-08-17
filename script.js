/* ============================================
   ElectronFlow — script.js (v13: Multi-Lab Simulation & Master Curriculum Engine)
   
   Motor interactivo, renderizado declarativo, reproductor con Read-Along,
   y laboratorios dinámicos de Canvas para todos los temas de EE 101.
   ============================================ */

/* ============================================
   1. SISTEMA DE ICONOS VECTORIALES SVG
   ============================================ */

var ICONS = {
  zap: '<svg class="svg-icon" viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="currentColor"/></svg>',
  star: '<svg class="svg-icon" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="currentColor"/></svg>',
  flame: '<svg class="svg-icon" viewBox="0 0 24 24"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 17c1.38 0 2.5-1.12 2.5-2.5 0-.61-.22-1.17-.58-1.61L12 11.5l-.92 1.39c-.36.44-.58 1-.58 1.61z" fill="currentColor"/><path d="M12 2c-.5 2-2 4-4 6-2.5 2.5-3.5 5.5-3.5 8.5a7.5 7.5 0 0 0 15 0c0-4-2-7-4.5-9.5-1.5-1.5-2.5-3.5-3-5z"/></svg>',
  volumeOn: '<svg class="svg-icon" viewBox="0 0 24 24"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>',
  volumeOff: '<svg class="svg-icon" viewBox="0 0 24 24"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>',
  book: '<svg class="svg-icon" viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
  bulb: '<svg class="svg-icon" viewBox="0 0 24 24"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5.76.76 1.23 1.52 1.41 2.5h6.18z"/></svg>',
  lab: '<svg class="svg-icon" viewBox="0 0 24 24"><path d="M10 2v7.31L4.15 19.5A2 2 0 0 0 5.89 22h12.22a2 2 0 0 0 1.74-2.5L14 9.31V2"/><line x1="8.5" y1="2" x2="15.5" y2="2"/><line x1="7" y1="15" x2="17" y2="15"/></svg>',
  checkSquare: '<svg class="svg-icon" viewBox="0 0 24 24"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>',
  cards: '<svg class="svg-icon" viewBox="0 0 24 24"><rect x="2" y="6" width="16" height="14" rx="2"/><path d="M6 2h14a2 2 0 0 1 2 2v12"/></svg>',
  trophy: '<svg class="svg-icon" viewBox="0 0 24 24"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.45 1-1 1H8c-.55 0-1 .45-1 1v1c0 .55.45 1 1 1h8c.55 0 1-.45 1-1v-1c0-.55-.45-1-1-1h-1c-.55 0-1-.45-1-1v-2.34"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/></svg>',
  check: '<svg class="svg-icon" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>',
  clock: '<svg class="svg-icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
  refresh: '<svg class="svg-icon" viewBox="0 0 24 24"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>',
  arrowRight: '<svg class="svg-icon" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>',
  chevronDown: '<svg class="svg-icon" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>',
  chevronRight: '<svg class="svg-icon" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>'
};


/* ============================================
   2. MOTOR DE AUDIO PROCEDIMENTAL (EFECTOS $0)
   ============================================ */

var SoundEngine = (function() {
  var audioCtx = null;
  var isMuted = localStorage.getItem("electronflow-sound-muted") === "true";

  function getContext() {
    if (!audioCtx) {
      var AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === "suspended") {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function playTone(freq, type, duration, gainValue, startDelay) {
    if (isMuted) return;
    var ctx = getContext();
    if (!ctx) return;

    startDelay = startDelay || 0;
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();

    osc.type = type || "sine";
    osc.frequency.setValueAtTime(freq, ctx.currentTime + startDelay);

    gain.gain.setValueAtTime(0.001, ctx.currentTime + startDelay);
    gain.gain.exponentialRampToValueAtTime(gainValue || 0.15, ctx.currentTime + startDelay + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + startDelay + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime + startDelay);
    osc.stop(ctx.currentTime + startDelay + duration);
  }

  return {
    playSuccess: function() {
      if (isMuted) return;
      playTone(523.25, "sine", 0.18, 0.12, 0.00);
      playTone(659.25, "sine", 0.18, 0.12, 0.08);
      playTone(783.99, "sine", 0.30, 0.15, 0.16);
    },

    playError: function() {
      if (isMuted) return;
      playTone(220.00, "triangle", 0.14, 0.12, 0.00);
      playTone(196.00, "triangle", 0.22, 0.12, 0.10);
    },

    playClick: function() {
      if (isMuted) return;
      playTone(800, "sine", 0.04, 0.04, 0.00);
    },

    playFlip: function() {
      if (isMuted) return;
      playTone(440, "sine", 0.08, 0.06, 0.00);
      playTone(554.37, "sine", 0.08, 0.06, 0.04);
    },

    playComplete: function() {
      if (isMuted) return;
      playTone(523.25, "sine", 0.16, 0.12, 0.00);
      playTone(659.25, "sine", 0.16, 0.12, 0.10);
      playTone(783.99, "sine", 0.16, 0.12, 0.20);
      playTone(1046.50, "sine", 0.40, 0.18, 0.30);
    },

    isMuted: function() { return isMuted; },

    toggleMute: function() {
      isMuted = !isMuted;
      localStorage.setItem("electronflow-sound-muted", isMuted ? "true" : "false");
      return isMuted;
    }
  };
})();


/* ============================================
   3. ILUSTRACIONES VECTORIALES SVG DE ALTA PRECISIÓN
   ============================================ */

var SVG_ILLUSTRATIONS = {
  atom: '<svg viewBox="0 0 520 240" xmlns="http://www.w3.org/2000/svg" class="step-svg">'
    + '<rect width="520" height="240" fill="#f8fafc" rx="8"/>'
    + '<ellipse cx="190" cy="120" rx="120" ry="60" fill="none" stroke="#cbd5e1" stroke-width="1.5" stroke-dasharray="5 4"/>'
    + '<ellipse cx="190" cy="120" rx="80" ry="110" fill="none" stroke="#cbd5e1" stroke-width="1.5" stroke-dasharray="5 4" transform="rotate(55 190 120)"/>'
    + '<ellipse cx="190" cy="120" rx="80" ry="110" fill="none" stroke="#cbd5e1" stroke-width="1.5" stroke-dasharray="5 4" transform="rotate(-55 190 120)"/>'
    + '<circle cx="190" cy="120" r="28" fill="#e2e8f0" stroke="#94a3b8" stroke-width="1.5"/>'
    + '<circle cx="182" cy="112" r="7" fill="#f43f5e"/><text x="182" y="115" text-anchor="middle" font-size="9" font-weight="700" fill="white" font-family="Plus Jakarta Sans">+</text>'
    + '<circle cx="198" cy="112" r="7" fill="#f43f5e"/><text x="198" y="115" text-anchor="middle" font-size="9" font-weight="700" fill="white" font-family="Plus Jakarta Sans">+</text>'
    + '<circle cx="190" cy="128" r="7" fill="#f43f5e"/><text x="190" y="131" text-anchor="middle" font-size="9" font-weight="700" fill="white" font-family="Plus Jakarta Sans">+</text>'
    + '<circle cx="178" cy="125" r="6.5" fill="#64748b"/><text x="178" y="128" text-anchor="middle" font-size="8" font-weight="600" fill="white" font-family="Plus Jakarta Sans">n</text>'
    + '<circle cx="202" cy="125" r="6.5" fill="#64748b"/><text x="202" y="128" text-anchor="middle" font-size="8" font-weight="600" fill="white" font-family="Plus Jakarta Sans">n</text>'
    + '<circle cx="190" cy="106" r="6.5" fill="#64748b"/><text x="190" y="109" text-anchor="middle" font-size="8" font-weight="600" fill="white" font-family="Plus Jakarta Sans">n</text>'
    + '<circle cx="310" cy="120" r="6.5" fill="#2563eb"/><text x="310" y="123" text-anchor="middle" font-size="9" font-weight="700" fill="white" font-family="Plus Jakarta Sans">−</text>'
    + '<circle cx="125" cy="50" r="6.5" fill="#2563eb"/><text x="125" y="53" text-anchor="middle" font-size="9" font-weight="700" fill="white" font-family="Plus Jakarta Sans">−</text>'
    + '<circle cx="245" cy="195" r="6.5" fill="#2563eb"/><text x="245" y="198" text-anchor="middle" font-size="9" font-weight="700" fill="white" font-family="Plus Jakarta Sans">−</text>'
    + '<text x="190" y="166" text-anchor="middle" font-size="11" font-weight="700" fill="#475569" font-family="Plus Jakarta Sans">Nucleus</text>'
    + '<line x1="318" y1="120" x2="350" y2="120" stroke="#2563eb" stroke-width="1.5"/>'
    + '<text x="358" y="124" font-size="12" font-weight="700" fill="#2563eb" font-family="Plus Jakarta Sans">Electron (e⁻)</text>'
    + '<rect x="360" y="30" width="140" height="74" rx="6" fill="white" stroke="#e2e8f0" stroke-width="1"/>'
    + '<circle cx="375" cy="46" r="5" fill="#f43f5e"/><text x="388" y="50" font-size="11" font-weight="600" fill="#334155" font-family="Plus Jakarta Sans">Proton (+)</text>'
    + '<circle cx="375" cy="66" r="5" fill="#64748b"/><text x="388" y="70" font-size="11" font-weight="600" fill="#334155" font-family="Plus Jakarta Sans">Neutron (0)</text>'
    + '<circle cx="375" cy="86" r="5" fill="#2563eb"/><text x="388" y="90" font-size="11" font-weight="600" fill="#334155" font-family="Plus Jakarta Sans">Electron (−)</text>'
    + '</svg>',

  voltageAnalogy: '<svg viewBox="0 0 520 220" xmlns="http://www.w3.org/2000/svg" class="step-svg">'
    + '<rect width="520" height="220" fill="#f8fafc" rx="8"/>'
    + '<rect x="24" y="20" width="220" height="180" rx="8" fill="white" stroke="#e2e8f0" stroke-width="1.5"/>'
    + '<text x="134" y="44" text-anchor="middle" font-size="12" font-weight="800" fill="#0284c7" font-family="Plus Jakarta Sans">Water System (Intuition)</text>'
    + '<rect x="40" y="60" width="50" height="70" rx="4" fill="#e0f2fe" stroke="#38bdf8" stroke-width="1.5"/>'
    + '<rect x="42" y="80" width="46" height="48" fill="#7dd3fc" opacity="0.6"/>'
    + '<text x="65" y="108" text-anchor="middle" font-size="9" font-weight="700" fill="#0369a1" font-family="Plus Jakarta Sans">High P</text>'
    + '<path d="M 90 110 L 220 110 L 220 140 L 40 140 L 40 130" fill="none" stroke="#38bdf8" stroke-width="10" stroke-linejoin="round"/>'
    + '<text x="155" y="100" text-anchor="middle" font-size="10" font-weight="700" fill="#0284c7" font-family="Plus Jakarta Sans">Water Flow →</text>'
    + '<text x="134" y="168" text-anchor="middle" font-size="11" font-weight="800" fill="#0284c7" font-family="Plus Jakarta Sans">Pressure pushes water</text>'
    + '<text x="134" y="186" text-anchor="middle" font-size="10" fill="#64748b" font-family="Plus Jakarta Sans">Pump / Gravity = Pressure</text>'
    + '<circle cx="260" cy="110" r="16" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="1"/>'
    + '<text x="260" y="115" text-anchor="middle" font-size="14" font-weight="800" fill="#475569" font-family="Plus Jakarta Sans">≡</text>'
    + '<rect x="276" y="20" width="220" height="180" rx="8" fill="white" stroke="#e2e8f0" stroke-width="1.5"/>'
    + '<text x="386" y="44" text-anchor="middle" font-size="12" font-weight="800" fill="#d97706" font-family="Plus Jakarta Sans">Electrical Circuit (Reality)</text>'
    + '<rect x="292" y="70" width="40" height="60" rx="3" fill="#fef3c7" stroke="#f59e0b" stroke-width="1.5"/>'
    + '<text x="312" y="95" text-anchor="middle" font-size="10" font-weight="800" fill="#b45309" font-family="Plus Jakarta Sans">+ 9V −</text>'
    + '<text x="312" y="112" text-anchor="middle" font-size="8" font-weight="600" fill="#b45309" font-family="Plus Jakarta Sans">Battery</text>'
    + '<path d="M 332 80 L 470 80 L 470 140 L 292 140 L 292 130" fill="none" stroke="#2563eb" stroke-width="3" stroke-linejoin="round"/>'
    + '<circle cx="380" cy="80" r="3.5" fill="#2563eb"/><circle cx="430" cy="80" r="3.5" fill="#2563eb"/>'
    + '<text x="400" y="70" text-anchor="middle" font-size="10" font-weight="700" fill="#2563eb" font-family="Plus Jakarta Sans">Current (I) →</text>'
    + '<text x="386" y="168" text-anchor="middle" font-size="11" font-weight="800" fill="#d97706" font-family="Plus Jakarta Sans">Voltage pushes electrons</text>'
    + '<text x="386" y="186" text-anchor="middle" font-size="10" fill="#64748b" font-family="Plus Jakarta Sans">1 Volt = 1 Joule per Coulomb</text>'
    + '</svg>'
};


/* ============================================
   4. ESTADO GLOBAL DE LA APLICACIÓN
   ============================================ */

var AppState = {
  currentView: "lesson",
  activeCourseId: "electronics-fundamentals",
  activeLessonId: "lesson-1-1",
  currentStepIndex: 0,
  speechRate: parseFloat(localStorage.getItem("electronflow-speech-rate")) || 1.0,
  activeAudio: null,
  activeAudioPlaying: false,
  audioAnimFrameId: null,
  expandedLessons: { "lesson-1-1": true },
  /* Estado unificado para todos los simuladores de circuitos */
  circuitState: {
    /* 1. Ley de Ohm y circuito DC básico */
    voltage: 12,
    resistance: 100,
    resistance2: 100,
    capacitance: 10,
    switchClosed: true,

    /* 2. Divisor de voltaje y efecto de carga Thévenin */
    vIn: 12,
    r1: 100,
    r2: 100,
    rLoad: 200,
    loadConnected: true,

    /* 3. Respuesta transitoria RC y RLC de segundo orden */
    rcR: 1000,           // Resistencia en Ohmios (1 kΩ)
    rcC: 10,             // Capacitancia en microFaradios (10 µF)
    rlcL: 100,           // Inductancia en miliHenrys (100 mH)
    rcVs: 10,            // Voltaje de fuente DC (10 V)
    rcCharging: true,    // Modo: carga por escalón (true) o descarga natural (false)
    transientMode: "rc", // Modo de visualización: "rc" o "rlc"

    /* 4. Osciloscopio de fósforo AC en tiempo real */
    acVm: 5.0,           // Amplitud pico de voltaje Vm (V)
    acFreq: 60,          // Frecuencia f (Hz)
    acPhase: 0,          // Ángulo de fase phi en grados
    acTimeDiv: 5.0,      // Base de tiempo en ms/div
    acVoltsDiv: 2.0,     // Sensibilidad vertical en V/div
    acDualTrace: true,   // Habilitación de canal dual (CH1 voltaje, CH2 corriente/ref)
    acRunning: true,     // Estado de ejecución / congelamiento del osciloscopio

    /* 5. Amplificador operacional con saturación de rieles */
    opampMode: "inverting", // Modo: "inverting" o "non-inverting"
    opampRf: 20,            // Resistencia de retroalimentación en kΩ
    opampRin: 10,           // Resistencia de entrada en kΩ
    opampVinAmp: 2.0,       // Amplitud pico de señal senoidal de entrada (V)
    opampVsat: 13.5         // Riel de saturación de salida ±Vsat (V)
  },
  progress: loadProgress()
};

function loadProgress() {
  var saved = localStorage.getItem("electronflow-progress");
  if (saved) {
    try { return JSON.parse(saved); } catch (e) {}
  }
  return { xp: 0, streak: 1, lastVisit: new Date().toISOString(), completedLessons: [] };
}

function saveProgress() {
  localStorage.setItem("electronflow-progress", JSON.stringify(AppState.progress));
}

function resetProgress() {
  AppState.progress = { xp: 0, streak: 1, lastVisit: new Date().toISOString(), completedLessons: [] };
  saveProgress();
  updateStatsDisplay();
  updateSidebarProgressMeter();
  renderOutline();
}


/* ============================================
   5. BÚSQUEDA Y GESTIÓN DE VISTAS
   ============================================ */

function getActiveCourse() {
  if (typeof COURSES_CATALOG === "undefined") return null;
  return COURSES_CATALOG.find(function(c) { return c.id === AppState.activeCourseId; }) || COURSES_CATALOG[0];
}

function findLessonById(lessonId) {
  var course = getActiveCourse();
  if (!course || !course.phases) return null;

  for (var i = 0; i < course.phases.length; i++) {
    var phase = course.phases[i];
    for (var j = 0; j < phase.lessons.length; j++) {
      if (phase.lessons[j].id === lessonId) {
        return { course: course, phase: phase, lesson: phase.lessons[j] };
      }
    }
  }
  return null;
}

function getNextLesson(currentLessonId) {
  var course = getActiveCourse();
  if (!course || !course.phases) return null;

  var allLessons = [];
  course.phases.forEach(function(phase) {
    if (phase.lessons) {
      phase.lessons.forEach(function(lesson) {
        allLessons.push(lesson);
      });
    }
  });

  for (var i = 0; i < allLessons.length; i++) {
    if (allLessons[i].id === currentLessonId) {
      if (i + 1 < allLessons.length) {
        return allLessons[i + 1];
      }
      break;
    }
  }
  return null;
}

function isLessonCompleted(lessonId) {
  return AppState.progress.completedLessons.indexOf(lessonId) !== -1;
}

function getActiveSteps() {
  var result = findLessonById(AppState.activeLessonId);
  return result && result.lesson.steps ? result.lesson.steps : [];
}

function stopCurrentAudio() {
  if (AppState.audioAnimFrameId) {
    cancelAnimationFrame(AppState.audioAnimFrameId);
    AppState.audioAnimFrameId = null;
  }
  if (AppState.activeAudio) {
    AppState.activeAudio.pause();
    AppState.activeAudio = null;
  }
  if (typeof window !== "undefined" && window.speechSynthesis && typeof window.speechSynthesis.cancel === "function") {
    window.speechSynthesis.cancel();
  }
  AppState.activeAudioPlaying = false;

  var allSentences = document.querySelectorAll(".sentence-node");
  allSentences.forEach(function(s) { s.classList.remove("active-sentence"); });

  var waveform = document.getElementById("audio-waveform");
  if (waveform) waveform.classList.remove("active");

  var playBtns = document.querySelectorAll(".btn-audio-play");
  playBtns.forEach(function(btn) {
    btn.classList.remove("playing");
    btn.innerHTML = '<svg class="svg-icon" viewBox="0 0 24 24"><polygon points="6,4 20,12 6,20" fill="currentColor"/></svg>';
  });
}

function showDashboardView() {
  AppState.currentView = "dashboard";
  stopCurrentAudio();

  /* Cancelar cualquier animación de simulador activa para evitar fugas de memoria o ciclos fantasma en GPU */
  if (typeof SimulatorEngine !== "undefined" && SimulatorEngine.stop) {
    SimulatorEngine.stop();
  } else if (window.electronAnimationId) {
    cancelAnimationFrame(window.electronAnimationId);
    window.electronAnimationId = null;
  }

  var appLayout = document.getElementById("app-layout");
  var stepNav = document.getElementById("step-nav");
  var sidebar = document.getElementById("sidebar");
  var breadcrumb = document.getElementById("header-breadcrumb");
  var keyboardBar = document.getElementById("keyboard-hints-bar");
  var btnCheatsheet = document.getElementById("btn-open-cheatsheet");
  var btnSound = document.getElementById("btn-sound-toggle");

  if (appLayout) appLayout.classList.add("dashboard-mode");
  if (stepNav) stepNav.classList.add("hidden");
  if (sidebar) {
    sidebar.classList.remove("open");
    sidebar.classList.add("closed");
  }
  if (keyboardBar) keyboardBar.classList.add("hidden");
  if (btnCheatsheet) btnCheatsheet.style.display = "none";
  if (btnSound) btnSound.style.display = "none";
  if (breadcrumb) breadcrumb.textContent = "Dashboard • Course Catalog";

  renderDashboard();
}

function showLessonView(courseId, lessonId) {
  AppState.currentView = "lesson";
  stopCurrentAudio();

  /* Cancelar cualquier bucle de renderizado activo antes de cargar nueva lección */
  if (typeof SimulatorEngine !== "undefined" && SimulatorEngine.stop) {
    SimulatorEngine.stop();
  } else if (window.electronAnimationId) {
    cancelAnimationFrame(window.electronAnimationId);
    window.electronAnimationId = null;
  }

  if (courseId) AppState.activeCourseId = courseId;
  if (lessonId) {
    AppState.activeLessonId = lessonId;
    AppState.expandedLessons[lessonId] = true;
  }
  AppState.currentStepIndex = 0;

  var appLayout = document.getElementById("app-layout");
  var stepNav = document.getElementById("step-nav");
  var sidebar = document.getElementById("sidebar");
  var keyboardBar = document.getElementById("keyboard-hints-bar");
  var btnCheatsheet = document.getElementById("btn-open-cheatsheet");
  var btnSound = document.getElementById("btn-sound-toggle");

  if (appLayout) appLayout.classList.remove("dashboard-mode");
  if (stepNav) stepNav.classList.remove("hidden");
  if (sidebar) sidebar.classList.remove("closed");
  if (keyboardBar) keyboardBar.classList.remove("hidden");
  if (btnCheatsheet) btnCheatsheet.style.display = "";
  if (btnSound) btnSound.style.display = "";

  renderOutline();
  renderCurrentStep();
  updateNavButtons();
  updateSidebarProgressMeter();
}


/* ============================================
   6. DASHBOARD / CATÁLOGO PRINCIPAL
   ============================================ */

function renderDashboard() {
  var container = document.getElementById("step-container");
  container.innerHTML = "";

  var course = getActiveCourse();
  if (!course) return;

  var view = document.createElement("div");
  view.className = "dashboard-view";

  var hero = document.createElement("div");
  hero.className = "dashboard-hero";

  var heroLeft = document.createElement("div");
  heroLeft.className = "dashboard-hero-left";

  var tag = document.createElement("div");
  tag.className = "dashboard-hero-tag";
  tag.innerHTML = ICONS.zap + " Resume Current Track";

  var h1 = document.createElement("h1");
  h1.textContent = course.title;

  var desc = document.createElement("p");
  desc.className = "dashboard-hero-desc";
  desc.textContent = course.description;

  var progressWrap = document.createElement("div");
  progressWrap.className = "dashboard-hero-progress";

  var completedCount = AppState.progress.completedLessons.length;
  var totalCount = course.totalLessons || 24;
  var pct = Math.round((completedCount / totalCount) * 100);

  progressWrap.innerHTML = '<div class="hero-progress-labels"><span>Track Progress</span><span>' + completedCount + ' / ' + totalCount + ' Lessons (' + pct + '%)</span></div>'
    + '<div class="hero-progress-bar-bg"><div class="hero-progress-bar-fill" style="width: ' + Math.max(pct, 8) + '%"></div></div>';

  heroLeft.appendChild(tag);
  heroLeft.appendChild(h1);
  heroLeft.appendChild(desc);
  heroLeft.appendChild(progressWrap);

  var heroRight = document.createElement("div");
  heroRight.className = "dashboard-hero-right";

  var resumeBtn = document.createElement("button");
  resumeBtn.className = "btn btn-primary btn-resume";
  resumeBtn.innerHTML = 'Continue Track ' + ICONS.arrowRight;
  resumeBtn.addEventListener("click", function() {
    SoundEngine.playClick();
    showLessonView(course.id, AppState.activeLessonId || "lesson-1-1");
  });

  heroRight.appendChild(resumeBtn);
  hero.appendChild(heroLeft);
  hero.appendChild(heroRight);
  view.appendChild(hero);

  var sectionHeader = document.createElement("div");
  sectionHeader.className = "dashboard-section-header";
  sectionHeader.innerHTML = '<h2 class="dashboard-section-title">Academic & Engineering Tracks</h2>';
  view.appendChild(sectionHeader);

  var grid = document.createElement("div");
  grid.className = "courses-grid";

  COURSES_CATALOG.forEach(function(c) {
    var card = document.createElement("div");
    card.className = "course-card";

    var top = document.createElement("div");
    top.className = "course-card-top";

    var badgeRow = document.createElement("div");
    badgeRow.className = "course-card-badge-row";

    var iconBadge = document.createElement("div");
    iconBadge.className = "course-icon-badge";
    iconBadge.innerHTML = ICONS[c.icon] || ICONS.book;

    var statusTag = document.createElement("span");
    statusTag.className = "course-status-tag " + (c.status === "active" ? "status-active" : "status-upcoming");
    statusTag.textContent = (c.status === "active" ? "Active Curriculum" : "Coming Soon");

    badgeRow.appendChild(iconBadge);
    badgeRow.appendChild(statusTag);

    var title = document.createElement("h3");
    title.className = "course-card-title";
    title.textContent = c.title;

    var cdesc = document.createElement("p");
    cdesc.className = "course-card-desc";
    cdesc.textContent = c.description;

    top.appendChild(badgeRow);
    top.appendChild(title);
    top.appendChild(cdesc);

    var bottom = document.createElement("div");
    bottom.className = "course-card-bottom";

    var meta = document.createElement("div");
    meta.className = "course-card-meta";
    meta.innerHTML = ICONS.clock + ' <span>' + c.estimatedHours + '</span> • <span>' + c.totalXP + ' XP</span>';

    var actionBtn = document.createElement("button");
    actionBtn.className = "btn " + (c.status === "active" ? "btn-primary" : "btn-outline") + " btn-card-action";
    actionBtn.textContent = (c.status === "active" ? "Open Track" : "Preview");

    actionBtn.addEventListener("click", function(e) {
      e.stopPropagation();
      SoundEngine.playClick();
      if (c.status === "active") {
        showLessonView(c.id, "lesson-1-1");
      }
    });

    bottom.appendChild(meta);
    bottom.appendChild(actionBtn);

    card.appendChild(top);
    card.appendChild(bottom);

    if (c.status === "active") {
      card.addEventListener("click", function() {
        SoundEngine.playClick();
        showLessonView(c.id, "lesson-1-1");
      });
    }

    grid.appendChild(card);
  });

  view.appendChild(grid);
  container.appendChild(view);
}


/* ============================================
   7. TOAST DE XP FLOTANTE
   ============================================ */

function showXPToast(amount) {
  var toast = document.getElementById("xp-toast");
  if (!toast) return;

  toast.innerHTML = ICONS.star + " +" + amount + " XP";
  toast.classList.add("show");

  setTimeout(function() {
    toast.classList.remove("show");
  }, 1500);
}


/* ============================================
   8. BARRA DE PROGRESO SEGMENTADA
   ============================================ */

function renderProgressBar() {
  var container = document.getElementById("progress-segments");
  var textEl = document.getElementById("progress-text");
  if (!container) return;

  var steps = getActiveSteps();
  container.innerHTML = "";

  steps.forEach(function(step, i) {
    var seg = document.createElement("div");
    seg.className = "progress-segment";

    if (i < AppState.currentStepIndex) {
      seg.classList.add("completed");
    } else if (i === AppState.currentStepIndex) {
      seg.classList.add("active");
    }

    container.appendChild(seg);
  });

  if (textEl) {
    textEl.textContent = "Step " + (AppState.currentStepIndex + 1) + " of " + steps.length;
  }
}


/* ============================================
   9. RENDERIZADO DEL SIDEBAR COMPLETO
   ============================================ */

function renderOutline() {
  var treeContainer = document.getElementById("sidebar-curriculum-tree");
  if (!treeContainer) return;
  treeContainer.innerHTML = "";

  var course = getActiveCourse();
  if (!course || !course.phases) return;

  course.phases.forEach(function(phase) {
    var phaseBlock = document.createElement("div");
    phaseBlock.className = "sidebar-phase-block";

    var phaseTitle = document.createElement("div");
    phaseTitle.className = "sidebar-phase-title";
    phaseTitle.textContent = phase.title;
    phaseBlock.appendChild(phaseTitle);

    phase.lessons.forEach(function(lesson) {
      var isCurrentLesson = (lesson.id === AppState.activeLessonId);
      var isCompleted = isLessonCompleted(lesson.id);
      var isExpanded = Boolean(AppState.expandedLessons[lesson.id]);

      var lessonItem = document.createElement("div");
      lessonItem.className = "sidebar-lesson-item" + (isCurrentLesson ? " active" : "") + (isCompleted ? " completed" : "");

      var left = document.createElement("div");
      left.className = "lesson-left";
      left.innerHTML = '<span class="lesson-chevron">' + (isExpanded ? ICONS.chevronDown : ICONS.chevronRight) + '</span>'
        + '<span>' + lesson.title + '</span>';

      var badge = document.createElement("span");
      badge.className = "lesson-badge-tag";
      badge.textContent = isCompleted ? "✓ Done" : (lesson.duration || "20m");

      lessonItem.appendChild(left);
      lessonItem.appendChild(badge);

      /* Al hacer clic en el encabezado de la lección:
         - Si no es la lección activa: la activa y la expande.
         - Si ya es la lección activa: alterna entre expandir y comprimir. */
      lessonItem.addEventListener("click", function() {
        SoundEngine.playClick();
        if (lesson.id !== AppState.activeLessonId) {
          AppState.expandedLessons[lesson.id] = true;
          showLessonView(course.id, lesson.id);
        } else {
          AppState.expandedLessons[lesson.id] = !AppState.expandedLessons[lesson.id];
          renderOutline();
        }
      });

      phaseBlock.appendChild(lessonItem);

      /* Si la lección está expandida y tiene pasos, renderizar la lista de pasos */
      if (isExpanded && lesson.steps && lesson.steps.length > 0) {
        var sublist = document.createElement("ul");
        sublist.className = "sidebar-steps-sublist";

        lesson.steps.forEach(function(step, sIndex) {
          var subLi = document.createElement("li");
          subLi.className = "sidebar-substep-item";

          if (isCurrentLesson && sIndex === AppState.currentStepIndex) {
            subLi.classList.add("active");
          } else if (isCurrentLesson && sIndex < AppState.currentStepIndex) {
            subLi.classList.add("completed");
          }

          var stepIconKey = "book";
          if (step.type === "animation") stepIconKey = "lab";
          else if (step.type === "keypoint") stepIconKey = "bulb";
          else if (step.type === "quiz") stepIconKey = "checkSquare";
          else if (step.type === "flashcard") stepIconKey = "cards";
          else if (step.type === "practice") stepIconKey = "book";
          else if (step.type === "complete") stepIconKey = "trophy";

          var iconEl = document.createElement("span");
          iconEl.className = "substep-icon";
          iconEl.innerHTML = ICONS[stepIconKey] || ICONS.book;

          var label = document.createElement("span");
          label.textContent = step.title || step.categoryLabel || "Step " + (sIndex + 1);

          subLi.appendChild(iconEl);
          subLi.appendChild(label);

          subLi.addEventListener("click", function(e) {
            e.stopPropagation();
            SoundEngine.playClick();
            if (lesson.id !== AppState.activeLessonId) {
              AppState.activeLessonId = lesson.id;
              AppState.expandedLessons[lesson.id] = true;
              AppState.currentStepIndex = sIndex;
              renderCurrentStep();
              renderOutline();
              updateNavButtons();
            } else {
              AppState.currentStepIndex = sIndex;
              renderCurrentStep();
              renderOutline();
              updateNavButtons();
            }
          });

          sublist.appendChild(subLi);
        });

        phaseBlock.appendChild(sublist);
      }
    });

    treeContainer.appendChild(phaseBlock);
  });
}

function updateSidebarProgressMeter() {
  var pctEl = document.getElementById("sidebar-progress-pct");
  var fillEl = document.getElementById("sidebar-meter-fill");
  var countEl = document.getElementById("sidebar-lessons-count");
  var xpEl = document.getElementById("sidebar-xp-earned");

  var course = getActiveCourse();
  var total = course ? (course.totalLessons || 20) : 20;
  var done = AppState.progress.completedLessons.length;
  var pct = Math.round((done / total) * 100);

  if (pctEl) pctEl.textContent = pct + "%";
  if (fillEl) fillEl.style.width = Math.max(pct, done > 0 ? pct : 0) + "%";
  if (countEl) countEl.textContent = done + " of " + total + " Complete";
  if (xpEl) xpEl.textContent = (AppState.progress.xp || (done * 75)) + " XP";
}


/* ============================================
   10. INSIGNIAS Y REPRODUCTOR DE AUDIO SINCRONIZADO
   ============================================ */

function createEditorialBadge(step) {
  var badge = document.createElement("div");
  badge.className = "editorial-badge badge-" + (step.category || "reading");

  var dot = document.createElement("span");
  dot.className = "badge-dot";

  var text = document.createElement("span");
  text.textContent = step.categoryLabel || "Reading";

  badge.appendChild(dot);
  badge.appendChild(text);
  return badge;
}

function formatTime(seconds) {
  var m = Math.floor(seconds / 60);
  var s = Math.floor(seconds % 60);
  return m + ":" + (s < 10 ? "0" : "") + s;
}

function createAudioPlayerBar(step) {
  var bar = document.createElement("div");
  bar.className = "audio-player-bar";

  var left = document.createElement("div");
  left.className = "audio-player-left";

  var playBtn = document.createElement("button");
  playBtn.className = "btn-audio-play";
  playBtn.title = "Play / Pause voice narration";
  playBtn.innerHTML = '<svg class="svg-icon" viewBox="0 0 24 24"><polygon points="6,4 20,12 6,20" fill="currentColor"/></svg>';

  var info = document.createElement("div");
  info.className = "audio-info";

  var label = document.createElement("div");
  label.className = "audio-label";

  var labelText = document.createElement("span");
  labelText.textContent = "Listen to chapter";

  var waveform = document.createElement("div");
  waveform.className = "audio-waveform";
  waveform.id = "audio-waveform";
  waveform.innerHTML = '<span class="wave-bar"></span><span class="wave-bar"></span><span class="wave-bar"></span><span class="wave-bar"></span>';

  var timePill = document.createElement("span");
  timePill.className = "audio-time-pill";
  timePill.id = "audio-time-pill";
  timePill.textContent = "0:00 / " + (step.durationEstimate || "2:25");

  label.appendChild(labelText);
  label.appendChild(waveform);
  label.appendChild(timePill);

  var subtext = document.createElement("div");
  subtext.className = "audio-subtext";
  subtext.textContent = "Click any sentence to listen from that spot • Studio Neural Audio";

  info.appendChild(label);
  info.appendChild(subtext);

  left.appendChild(playBtn);
  left.appendChild(info);

  var right = document.createElement("div");
  right.className = "audio-player-right";

  var speedLabel = document.createElement("span");
  speedLabel.className = "speed-badge-label";
  speedLabel.textContent = "Speed:";

  var group = document.createElement("div");
  group.className = "speed-pill-group";

  var speeds = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];
  speeds.forEach(function(sp) {
    var pill = document.createElement("button");
    pill.className = "speed-pill" + (AppState.speechRate === sp ? " active" : "");
    pill.textContent = (sp === 1.0 ? "1x" : sp + "x");
    pill.setAttribute("data-speed", sp);

    pill.addEventListener("click", function() {
      SoundEngine.playClick();
      AppState.speechRate = sp;
      localStorage.setItem("electronflow-speech-rate", sp.toString());

      var allPills = group.querySelectorAll(".speed-pill");
      allPills.forEach(function(p) { p.classList.remove("active"); });
      pill.classList.add("active");

      if (AppState.activeAudio) {
        AppState.activeAudio.playbackRate = sp;
      }
    });

    group.appendChild(pill);
  });

  right.appendChild(speedLabel);
  right.appendChild(group);

  bar.appendChild(left);
  bar.appendChild(right);

  if (step.audioSrc) {
    var audio = new Audio(step.audioSrc);
    audio.playbackRate = AppState.speechRate;

    /* Sincronización de alta precisión a 60 FPS mediante requestAnimationFrame */
    function updateAudioHighlight() {
      if (!AppState.activeAudioPlaying || !audio) return;

      var curr = audio.currentTime;
      if (timePill && audio.duration) {
        timePill.textContent = formatTime(curr) + " / " + formatTime(audio.duration);
      }

      var sentenceSpans = document.querySelectorAll(".sentence-node");
      var activeSpan = null;

      for (var i = 0; i < sentenceSpans.length; i++) {
        var span = sentenceSpans[i];
        var start = parseFloat(span.getAttribute("data-start"));
        var end = parseFloat(span.getAttribute("data-end"));
        var nextStart = (i + 1 < sentenceSpans.length) ? parseFloat(sentenceSpans[i + 1].getAttribute("data-start")) : (end + 3.0);

        if (!isNaN(start) && curr >= (start - 0.05)) {
          if (curr < (nextStart - 0.02) || (!isNaN(end) && curr <= end + 0.25)) {
            activeSpan = span;
            break;
          }
        }
      }

      sentenceSpans.forEach(function(s) {
        if (s === activeSpan) {
          if (!s.classList.contains("active-sentence")) {
            s.classList.add("active-sentence");
          }
        } else {
          s.classList.remove("active-sentence");
        }
      });

      AppState.audioAnimFrameId = requestAnimationFrame(updateAudioHighlight);
    }

    audio.addEventListener("ended", function() {
      if (AppState.audioAnimFrameId) {
        cancelAnimationFrame(AppState.audioAnimFrameId);
        AppState.audioAnimFrameId = null;
      }
      AppState.activeAudioPlaying = false;
      playBtn.classList.remove("playing");
      playBtn.innerHTML = '<svg class="svg-icon" viewBox="0 0 24 24"><polygon points="6,4 20,12 6,20" fill="currentColor"/></svg>';
      if (waveform) waveform.classList.remove("active");
      var sentenceSpans = document.querySelectorAll(".sentence-node");
      sentenceSpans.forEach(function(s) { s.classList.remove("active-sentence"); });
    });

    audio.addEventListener("pause", function() {
      if (AppState.audioAnimFrameId) {
        cancelAnimationFrame(AppState.audioAnimFrameId);
        AppState.audioAnimFrameId = null;
      }
    });

    playBtn.addEventListener("click", function() {
      if (AppState.activeAudioPlaying) {
        audio.pause();
        if (AppState.audioAnimFrameId) {
          cancelAnimationFrame(AppState.audioAnimFrameId);
          AppState.audioAnimFrameId = null;
        }
        AppState.activeAudioPlaying = false;
        playBtn.classList.remove("playing");
        playBtn.innerHTML = '<svg class="svg-icon" viewBox="0 0 24 24"><polygon points="6,4 20,12 6,20" fill="currentColor"/></svg>';
        if (waveform) waveform.classList.remove("active");
      } else {
        stopCurrentAudio();
        AppState.activeAudio = audio;
        audio.playbackRate = AppState.speechRate;
        audio.play().then(function() {
          AppState.activeAudioPlaying = true;
          playBtn.classList.add("playing");
          playBtn.innerHTML = '<svg class="svg-icon" viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16" fill="currentColor"/><rect x="14" y="4" width="4" height="16" fill="currentColor"/></svg>';
          if (waveform) waveform.classList.add("active");
          if (AppState.audioAnimFrameId) cancelAnimationFrame(AppState.audioAnimFrameId);
          AppState.audioAnimFrameId = requestAnimationFrame(updateAudioHighlight);
        }).catch(function(err) {
          fallbackSpeech(step, playBtn, waveform);
        });
      }
    });

    AppState.activeAudio = audio;
  } else {
    playBtn.addEventListener("click", function() {
      fallbackSpeech(step, playBtn, waveform);
    });
  }

  return bar;
}

function fallbackSpeech(step, playBtn, waveform) {
  if (AppState.activeAudioPlaying) {
    window.speechSynthesis.cancel();
    AppState.activeAudioPlaying = false;
    if (playBtn) {
      playBtn.classList.remove("playing");
      playBtn.innerHTML = '<svg class="svg-icon" viewBox="0 0 24 24"><polygon points="6,4 20,12 6,20" fill="currentColor"/></svg>';
    }
    if (waveform) waveform.classList.remove("active");
  } else {
    window.speechSynthesis.cancel();

    var fullText = (step.title ? step.title + ". " : "");
    if (step.sections) {
      step.sections.forEach(function(sec) {
        fullText += (sec.title ? sec.title + ". " : "");
        if (sec.sentences) {
          sec.sentences.forEach(function(s) { fullText += s.text + " "; });
        } else if (sec.body) {
          fullText += sec.body.join(". ");
        }
      });
    }

    var utterance = new SpeechSynthesisUtterance(fullText);
    utterance.rate = AppState.speechRate;

    utterance.onstart = function() {
      AppState.activeAudioPlaying = true;
      if (playBtn) {
        playBtn.classList.add("playing");
        playBtn.innerHTML = '<svg class="svg-icon" viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16" fill="currentColor"/><rect x="14" y="4" width="4" height="16" fill="currentColor"/></svg>';
      }
      if (waveform) waveform.classList.add("active");
    };

    utterance.onend = function() {
      AppState.activeAudioPlaying = false;
      if (playBtn) {
        playBtn.classList.remove("playing");
        playBtn.innerHTML = '<svg class="svg-icon" viewBox="0 0 24 24"><polygon points="6,4 20,12 6,20" fill="currentColor"/></svg>';
      }
      if (waveform) waveform.classList.remove("active");
    };

    window.speechSynthesis.speak(utterance);
  }
}


/* ============================================
   11. RENDERIZADO DE PASOS Y MATEMÁTICAS (KaTeX)
   ============================================ */

function renderMath(targetElement) {
  var el = targetElement || document.body;
  /* 1. Intento primario con auto-render de KaTeX en navegadores */
  if (typeof renderMathInElement === "function") {
    try {
      renderMathInElement(el, {
        delimiters: [
          { left: "$$", right: "$$", display: true },
          { left: "$", right: "$", display: false },
          { left: "\\(", right: "\\)", display: false },
          { left: "\\[", right: "\\]", display: true }
        ],
        ignoredTags: ["script", "noscript", "style", "textarea", "pre", "code"],
        throwOnError: false
      });
    } catch (e) {
      console.warn("KaTeX render error:", e);
    }
  } else if (typeof katex !== "undefined" && typeof katex.renderToString === "function") {
    /* 2. Respaldo determinista para entornos de testing y DOM sandbox */
    try {
      if (el && el.innerHTML) {
        var html = el.innerHTML;
        html = html.replace(/\$\$([\s\S]+?)\$\$/g, function(match, tex) {
          try {
            return katex.renderToString(tex, { displayMode: true, throwOnError: false });
          } catch (e) { return match; }
        });
        html = html.replace(/\$([^\$\n]+?)\$/g, function(match, tex) {
          try {
            return katex.renderToString(tex, { displayMode: false, throwOnError: false });
          } catch (e) { return match; }
        });
        el.innerHTML = html;
      }
    } catch (e) {
      console.warn("KaTeX fallback render error:", e);
    }
  }
}

function renderCurrentStep(lesson, stepIndex) {
  /* Permitir actualización opcional de lección e índice de paso para invocaciones programáticas */
  if (lesson) {
    AppState.activeLessonId = typeof lesson === "string" ? lesson : lesson.id;
  }
  if (typeof stepIndex === "number") {
    AppState.currentStepIndex = stepIndex;
  }

  var container = document.getElementById("step-container");
  container.innerHTML = "";

  stopCurrentAudio();

  if (window.electronAnimationId) {
    cancelAnimationFrame(window.electronAnimationId);
    window.electronAnimationId = null;
  }

  var steps = getActiveSteps();
  var step = steps[AppState.currentStepIndex];
  if (!step) return;

  var result = findLessonById(AppState.activeLessonId);
  if (result) {
    document.getElementById("header-breadcrumb").innerHTML =
      result.course.title + " &rsaquo; " + result.phase.title + " &rsaquo; " + result.lesson.title;
  }

  renderProgressBar();

  switch (step.type) {
    case "content":   renderStepContent(container, step); break;
    case "animation": renderStepAnimation(container, step); break;
    case "keypoint":  renderStepKeypoint(container, step); break;
    case "quiz":      renderStepQuiz(container, step); break;
    case "flashcard": renderStepFlashcard(container, step); break;
    case "practice":  renderStepPractice(container, step); break;
    case "complete":  renderStepComplete(container, step); break;
  }

  if (step.type !== "quiz" && step.type !== "complete" && step.type !== "flashcard") {
    var continueBtn = createContinueButton();
    if (continueBtn) container.appendChild(continueBtn);
  }

  /* Renderizar fórmulas matemáticas 2D con KaTeX */
  renderMath(container);
}

function createContinueButton() {
  var steps = getActiveSteps();
  var isLast = AppState.currentStepIndex >= steps.length - 1;
  if (isLast) return null;

  var footer = document.createElement("div");
  footer.className = "step-footer";

  var btn = document.createElement("button");
  btn.className = "btn btn-continue";
  btn.innerHTML = 'Continue to Next Step ' + ICONS.arrowRight;
  btn.addEventListener("click", function() {
    SoundEngine.playClick();
    goToNextStep();
  });

  footer.appendChild(btn);
  return footer;
}


/* --- Paso: Capítulo de lectura con oraciones interactivas (Read-Along) --- */
function renderStepContent(container, step) {
  var card = document.createElement("div");
  card.className = "step-content";

  card.appendChild(createEditorialBadge(step));

  var h2 = document.createElement("h2");
  h2.textContent = step.title || "";
  card.appendChild(h2);

  if (step.subtitle) {
    var sub = document.createElement("p");
    sub.className = "step-subtitle";
    sub.textContent = step.subtitle;
    card.appendChild(sub);
  }

  var audioBar = createAudioPlayerBar(step);
  card.appendChild(audioBar);

  if (step.sections && step.sections.length > 0) {
    step.sections.forEach(function(sec) {
      var secWrapper = document.createElement("div");
      secWrapper.className = "content-section";

      if (sec.title) {
        var secTitle = document.createElement("h3");
        secTitle.className = "content-section-title";
        secTitle.textContent = sec.title;
        secWrapper.appendChild(secTitle);
      }

      if (sec.sentences && sec.sentences.length > 0) {
        var p = document.createElement("p");
        sec.sentences.forEach(function(sObj) {
          var span = document.createElement("span");
          span.className = "sentence-node";
          span.id = sObj.id;
          if (typeof sObj.start !== "undefined") span.setAttribute("data-start", sObj.start);
          if (typeof sObj.end !== "undefined") span.setAttribute("data-end", sObj.end);
          span.title = "Click to listen from here" + (typeof sObj.start !== "undefined" ? " (Jump to " + sObj.start + "s)" : "");
          span.textContent = sObj.text + " ";

          span.addEventListener("click", function() {
            SoundEngine.playClick();
            if (AppState.activeAudio) {
              AppState.activeAudio.currentTime = sObj.start;
              if (!AppState.activeAudioPlaying) {
                AppState.activeAudio.play().then(function() {
                  AppState.activeAudioPlaying = true;
                  var playBtn = document.querySelector(".btn-audio-play");
                  if (playBtn) {
                    playBtn.classList.add("playing");
                    playBtn.innerHTML = '<svg class="svg-icon" viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16" fill="currentColor"/><rect x="14" y="4" width="4" height="16" fill="currentColor"/></svg>';
                  }
                  var waveform = document.getElementById("audio-waveform");
                  if (waveform) waveform.classList.add("active");
                });
              }
              var all = document.querySelectorAll(".sentence-node");
              all.forEach(function(s) { s.classList.remove("active-sentence"); });
              span.classList.add("active-sentence");
            }
          });

          p.appendChild(span);
        });
        secWrapper.appendChild(p);
      } else if (sec.body) {
        sec.body.forEach(function(pText) {
          var p = document.createElement("p");
          p.textContent = pText;
          secWrapper.appendChild(p);
        });
      }

      if (sec.illustration && SVG_ILLUSTRATIONS[sec.illustration]) {
        var illWrapper = document.createElement("div");
        illWrapper.className = "step-illustration";
        illWrapper.innerHTML = SVG_ILLUSTRATIONS[sec.illustration];
        secWrapper.appendChild(illWrapper);
      }

      if (sec.comparison) {
        var compGrid = document.createElement("div");
        compGrid.className = "diagram-comparison-grid";

        ["left", "right"].forEach(function(side) {
          var data = sec.comparison[side];
          if (!data) return;

          var compCard = document.createElement("div");
          compCard.className = "comparison-card theme-" + (data.theme || "blue");

          var compHeader = document.createElement("div");
          compHeader.className = "comparison-header";
          compHeader.innerHTML = '<span class="comparison-badge">' + data.badge + '</span>';

          var compTitle = document.createElement("h4");
          compTitle.className = "comparison-title";
          compTitle.textContent = data.title;

          var compDesc = document.createElement("p");
          compDesc.className = "comparison-desc";
          compDesc.textContent = data.desc;

          var bulletList = document.createElement("ul");
          bulletList.className = "comparison-bullets";
          if (data.bullets) {
            data.bullets.forEach(function(b) {
              var li = document.createElement("li");
              li.className = "comparison-bullet-item";
              li.innerHTML = '<span class="bullet-icon">' + ICONS.check + '</span><span>' + b + '</span>';
              bulletList.appendChild(li);
            });
          }

          compCard.appendChild(compHeader);
          compCard.appendChild(compTitle);
          compCard.appendChild(compDesc);
          compCard.appendChild(bulletList);
          compGrid.appendChild(compCard);
        });

        secWrapper.appendChild(compGrid);
      }

      if (sec.image) {
        var imgFig = document.createElement("div");
        imgFig.className = "diagram-image-figure";
        imgFig.innerHTML = '<img src="' + sec.image.src + '" alt="' + (sec.image.alt || "") + '" class="image-figure-img"/>'
          + '<div class="image-figure-caption"><span>' + sec.image.caption + '</span>'
          + (sec.image.source ? '<small>' + sec.image.source + '</small>' : '') + '</div>';
        secWrapper.appendChild(imgFig);
      }

      if (sec.callout) {
        var callout = document.createElement("div");
        callout.className = "pedagogical-callout";
        var calloutIcon = ICONS[sec.callout.icon] || ICONS.bulb;
        callout.innerHTML = '<span class="callout-icon-wrapper">' + calloutIcon + '</span><div>' + sec.callout.text + '</div>';
        secWrapper.appendChild(callout);
      }

      card.appendChild(secWrapper);
    });
  }

  if (step.summary && step.summary.length > 0) {
    var summaryCard = document.createElement("div");
    summaryCard.className = "content-summary-card";

    var summaryTitle = document.createElement("div");
    summaryTitle.className = "content-summary-title";
    summaryTitle.innerHTML = ICONS.star + " Key Takeaways";

    var ul = document.createElement("ul");
    ul.className = "summary-list";
    step.summary.forEach(function(item) {
      var li = document.createElement("li");
      li.innerHTML = item;
      ul.appendChild(li);
    });

    summaryCard.appendChild(summaryTitle);
    summaryCard.appendChild(ul);
    card.appendChild(summaryCard);
  }

  container.appendChild(card);
}


/* --- Paso: Concepto clave --- */
function renderStepKeypoint(container, step) {
  var card = document.createElement("div");
  card.className = "step-keypoint";

  var iconBadge = document.createElement("div");
  iconBadge.className = "keypoint-icon-badge";
  iconBadge.innerHTML = ICONS[step.icon] || ICONS.bulb;

  var body = document.createElement("div");
  body.className = "keypoint-body";

  body.appendChild(createEditorialBadge(step));

  var h3 = document.createElement("h3");
  h3.textContent = step.title;
  body.appendChild(h3);

  var p = document.createElement("p");
  p.textContent = step.body;
  body.appendChild(p);

  card.appendChild(iconBadge);
  card.appendChild(body);
  container.appendChild(card);
}


/* --- Paso: Simulador interactivo de circuito --- */
/* --- Paso: Simulador interactivo de circuito --- */
function renderStepAnimation(container, step) {
  var card = document.createElement("div");
  card.className = "step-animation";

  var header = document.createElement("div");
  header.className = "animation-header";
  header.appendChild(createEditorialBadge(step));

  var h2 = document.createElement("h2");
  h2.textContent = step.title;
  header.appendChild(h2);

  var desc = document.createElement("p");
  desc.className = "animation-desc";
  desc.textContent = step.description;
  header.appendChild(desc);
  card.appendChild(header);

  var labType = step.labType || "electron-flow";
  var wrapper = document.createElement("div");
  /* Aplicar estilo CRT cuando se visualiza el osciloscopio para emular fósforo analógico */
  wrapper.className = (labType === "ac-oscilloscope") ? "canvas-wrapper crt-screen" : "canvas-wrapper";

  var canvas = document.createElement("canvas");
  canvas.id = "electron-canvas";
  canvas.width = 640;
  canvas.height = (labType === "ac-oscilloscope" || labType === "rc-transient" || labType === "rlc-transient" || labType === "rlc-resonance") ? 300 : 280;
  wrapper.appendChild(canvas);
  card.appendChild(wrapper);

  var controls = document.createElement("div");
  controls.className = "animation-controls";

  var cs = AppState.circuitState;

  if (labType === "ac-oscilloscope") {
    /* Controles para osciloscopio senoidal de fósforo con traza dual */
    controls.innerHTML = ''
      + '<div class="control-row">'
      + '  <div class="slider-group"><label class="slider-label">Amplitude (Vm): <strong id="lab-osc-vm-val">' + cs.acVm.toFixed(1) + ' V</strong></label>'
      + '    <input type="range" id="slider-osc-vm" class="voltage-slider" min="1" max="20" step="0.5" value="' + cs.acVm + '"/></div>'
      + '  <div class="slider-group"><label class="slider-label">Frequency (f): <strong id="lab-osc-freq-val">' + cs.acFreq + ' Hz</strong></label>'
      + '    <input type="range" id="slider-osc-freq" class="voltage-slider" min="10" max="150" step="5" value="' + cs.acFreq + '"/></div>'
      + '</div>'
      + '<div class="control-row">'
      + '  <div class="slider-group"><label class="slider-label">Phase (φ): <strong id="lab-osc-phase-val">' + cs.acPhase + '°</strong></label>'
      + '    <input type="range" id="slider-osc-phase" class="voltage-slider" min="-180" max="180" step="15" value="' + cs.acPhase + '"/></div>'
      + '  <div class="slider-group"><label class="slider-label">Volts/Div: <strong id="lab-osc-vdiv-val">' + cs.acVoltsDiv.toFixed(1) + ' V/div</strong></label>'
      + '    <input type="range" id="slider-osc-vdiv" class="voltage-slider" min="0.5" max="5.0" step="0.5" value="' + cs.acVoltsDiv + '"/></div>'
      + '  <div class="slider-group"><label class="slider-label">Time/Div: <strong id="lab-osc-tdiv-val">' + cs.acTimeDiv.toFixed(1) + ' ms/div</strong></label>'
      + '    <input type="range" id="slider-osc-tdiv" class="voltage-slider" min="1.0" max="20.0" step="1.0" value="' + cs.acTimeDiv + '"/></div>'
      + '</div>'
      + '<div class="control-row">'
      + '  <button class="switch-toggle-btn ' + (cs.acDualTrace ? "closed" : "open") + '" id="btn-osc-dual">'
      + '    ' + ICONS.zap + ' <span id="label-osc-dual">CH2 Trace: ' + (cs.acDualTrace ? "ENABLED (Current)" : "DISABLED") + '</span>'
      + '  </button>'
      + '  <button class="switch-toggle-btn ' + (cs.acRunning ? "closed" : "open") + '" id="btn-osc-run">'
      + '    ' + (cs.acRunning ? ICONS.zap + " Sweep: RUNNING" : ICONS.refresh + " Sweep: PAUSED (Frozen)")
      + '  </button>'
      + '</div>'
      + '<div class="telemetry-grid">'
      + '  <div class="telemetry-card"><span class="telemetry-label">V_RMS (CH1)</span><span class="telemetry-val" id="telemetry-osc-vrms">' + (cs.acVm / Math.SQRT2).toFixed(2) + ' V</span></div>'
      + '  <div class="telemetry-card"><span class="telemetry-label">V_PP (CH1)</span><span class="telemetry-val" id="telemetry-osc-vpp">' + (2 * cs.acVm).toFixed(2) + ' V</span></div>'
      + '  <div class="telemetry-card"><span class="telemetry-label">Frequency</span><span class="telemetry-val" id="telemetry-osc-freq">' + cs.acFreq + ' Hz</span></div>'
      + '  <div class="telemetry-card"><span class="telemetry-label">Period (T)</span><span class="telemetry-val" id="telemetry-osc-period">' + (1000 / cs.acFreq).toFixed(2) + ' ms</span></div>'
      + '  <div class="telemetry-card"><span class="telemetry-label">Angular (ω)</span><span class="telemetry-val" id="telemetry-osc-omega">' + (2 * Math.PI * cs.acFreq).toFixed(1) + ' rad/s</span></div>'
      + '</div>';
  } else if (labType === "rc-transient" || labType === "rlc-transient" || labType === "rlc-resonance") {
    /* Controles para análisis transitorio de primer orden RC y segundo orden RLC */
    var isRLC = (labType === "rlc-transient" || labType === "rlc-resonance" || cs.transientMode === "rlc");
    var tauMs = (cs.rcR * (cs.rcC * 1e-6) * 1000).toFixed(2);
    controls.innerHTML = ''
      + '<div class="control-row">'
      + '  <div class="lab-mode-selector">'
      + '    <button class="lab-mode-btn ' + (!isRLC ? "active" : "") + '" id="btn-mode-rc">1st-Order RC Circuit</button>'
      + '    <button class="lab-mode-btn ' + (isRLC ? "active" : "") + '" id="btn-mode-rlc">2nd-Order RLC Damping</button>'
      + '  </div>'
      + '  <button class="switch-toggle-btn ' + (cs.rcCharging ? "closed" : "open") + '" id="btn-rc-step">'
      + '    ' + (cs.rcCharging ? ICONS.zap + " Input: STEP CHARGE (Vs)" : ICONS.refresh + " Input: NATURAL DISCHARGE (0V)")
      + '  </button>'
      + '</div>'
      + '<div class="control-row">'
      + '  <div class="slider-group"><label class="slider-label">Resistor (R): <strong id="lab-rc-r-val">' + (cs.rcR >= 1000 ? (cs.rcR / 1000).toFixed(1) + ' kΩ' : cs.rcR + ' Ω') + '</strong></label>'
      + '    <input type="range" id="slider-rc-r" class="voltage-slider" min="50" max="5000" step="50" value="' + cs.rcR + '"/></div>'
      + '  <div class="slider-group"><label class="slider-label">Capacitor (C): <strong id="lab-rc-c-val">' + cs.rcC + ' µF</strong></label>'
      + '    <input type="range" id="slider-rc-c" class="voltage-slider" min="1" max="100" step="1" value="' + cs.rcC + '"/></div>'
      + '</div>'
      + '<div class="control-row">'
      + '  <div class="slider-group" id="group-rc-l" style="' + (isRLC ? "" : "display:none;") + '"><label class="slider-label">Inductor (L): <strong id="lab-rc-l-val">' + cs.rlcL + ' mH</strong></label>'
      + '    <input type="range" id="slider-rc-l" class="voltage-slider" min="10" max="500" step="10" value="' + cs.rlcL + '"/></div>'
      + '  <div class="slider-group"><label class="slider-label">Supply (Vs): <strong id="lab-rc-vs-val">' + cs.rcVs + ' V</strong></label>'
      + '    <input type="range" id="slider-rc-vs" class="voltage-slider" min="1" max="24" step="1" value="' + cs.rcVs + '"/></div>'
      + '</div>'
      + '<div class="telemetry-grid">'
      + '  <div class="telemetry-card"><span class="telemetry-label">Time Const (τ)</span><span class="telemetry-val" id="telemetry-rc-tau">' + tauMs + ' ms</span></div>'
      + '  <div class="telemetry-card"><span class="telemetry-label">Steady State (5τ)</span><span class="telemetry-val" id="telemetry-rc-5tau">' + (tauMs * 5).toFixed(2) + ' ms</span></div>'
      + '  <div class="telemetry-card"><span class="telemetry-label">Natural Freq (ω0)</span><span class="telemetry-val" id="telemetry-rc-w0">---</span></div>'
      + '  <div class="telemetry-card"><span class="telemetry-label">Damping (ζ)</span><span class="telemetry-val" id="telemetry-rc-zeta">---</span></div>'
      + '  <div class="telemetry-card"><span class="telemetry-label">Regime</span><span class="telemetry-val" id="telemetry-rc-regime"><span class="regime-badge regime-critical">' + (isRLC ? "RLC SECOND ORDER" : "1ST ORDER RC") + '</span></span></div>'
      + '</div>';
  } else if (labType === "opamp-gain") {
    /* Controles para amplificador operacional inversor y no inversor con recorte */
    var isInv = (cs.opampMode === "inverting");
    var av = isInv ? (-cs.opampRf / cs.opampRin) : (1 + cs.opampRf / cs.opampRin);
    controls.innerHTML = ''
      + '<div class="control-row">'
      + '  <div class="lab-mode-selector">'
      + '    <button class="lab-mode-btn ' + (isInv ? "active" : "") + '" id="btn-opamp-inv">Inverting (Av = −Rf / Rin)</button>'
      + '    <button class="lab-mode-btn ' + (!isInv ? "active" : "") + '" id="btn-opamp-noninv">Non-Inverting (Av = 1 + Rf / R1)</button>'
      + '  </div>'
      + '</div>'
      + '<div class="control-row">'
      + '  <div class="slider-group"><label class="slider-label">Feedback (Rf): <strong id="lab-opamp-rf-val">' + cs.opampRf + ' kΩ</strong></label>'
      + '    <input type="range" id="slider-opamp-rf" class="voltage-slider" min="1" max="50" step="1" value="' + cs.opampRf + '"/></div>'
      + '  <div class="slider-group"><label class="slider-label">Input (Rin): <strong id="lab-opamp-rin-val">' + cs.opampRin + ' kΩ</strong></label>'
      + '    <input type="range" id="slider-opamp-rin" class="voltage-slider" min="1" max="25" step="1" value="' + cs.opampRin + '"/></div>'
      + '</div>'
      + '<div class="control-row">'
      + '  <div class="slider-group"><label class="slider-label">Input Signal (Vin): <strong id="lab-opamp-vin-val">' + cs.opampVinAmp.toFixed(1) + ' Vpk</strong></label>'
      + '    <input type="range" id="slider-opamp-vin" class="voltage-slider" min="0.5" max="8.0" step="0.5" value="' + cs.opampVinAmp + '"/></div>'
      + '  <div class="slider-group"><label class="slider-label">Rails (±Vsat): <strong id="lab-opamp-vsat-val">±' + cs.opampVsat.toFixed(1) + ' V</strong></label>'
      + '    <input type="range" id="slider-opamp-vsat" class="voltage-slider" min="5.0" max="15.0" step="0.5" value="' + cs.opampVsat + '"/></div>'
      + '</div>'
      + '<div class="telemetry-grid">'
      + '  <div class="telemetry-card"><span class="telemetry-label">Gain (Av)</span><span class="telemetry-val" id="telemetry-opamp-av">' + av.toFixed(2) + '</span></div>'
      + '  <div class="telemetry-card"><span class="telemetry-label">Input Peak</span><span class="telemetry-val" id="telemetry-opamp-vin">' + cs.opampVinAmp.toFixed(2) + ' V</span></div>'
      + '  <div class="telemetry-card"><span class="telemetry-label">Ideal Output Peak</span><span class="telemetry-val" id="telemetry-opamp-vtheory">' + Math.abs(av * cs.opampVinAmp).toFixed(2) + ' V</span></div>'
      + '  <div class="telemetry-card"><span class="telemetry-label">Actual Peak</span><span class="telemetry-val" id="telemetry-opamp-vout">' + Math.min(Math.abs(av * cs.opampVinAmp), cs.opampVsat).toFixed(2) + ' V</span></div>'
      + '  <div class="telemetry-card"><span class="telemetry-label">State</span><span class="telemetry-val" id="telemetry-opamp-status"><span class="regime-badge ' + (Math.abs(av * cs.opampVinAmp) > cs.opampVsat ? "regime-saturated" : "regime-linear") + '">' + (Math.abs(av * cs.opampVinAmp) > cs.opampVsat ? "SATURATED" : "LINEAR") + '</span></span></div>'
      + '</div>';
  } else if (labType === "voltage-divider") {
    /* Controles para divisor de voltaje y análisis de carga Thévenin */
    controls.innerHTML = ''
      + '<div class="control-row">'
      + '  <div class="slider-group"><label class="slider-label">Source (Vin): <strong id="lab-vd-vin-val">' + cs.vIn + ' V</strong></label>'
      + '    <input type="range" id="slider-vd-vin" class="voltage-slider" min="1" max="24" step="1" value="' + cs.vIn + '"/></div>'
      + '  <div class="slider-group"><label class="slider-label">Resistor R1: <strong id="lab-r1-val">' + cs.r1 + ' Ω</strong></label>'
      + '    <input type="range" id="slider-r1" class="voltage-slider" min="10" max="500" step="10" value="' + cs.r1 + '"/></div>'
      + '</div>'
      + '<div class="control-row">'
      + '  <div class="slider-group"><label class="slider-label">Resistor R2: <strong id="lab-r2-val">' + cs.r2 + ' Ω</strong></label>'
      + '    <input type="range" id="slider-r2" class="voltage-slider" min="10" max="500" step="10" value="' + cs.r2 + '"/></div>'
      + '  <div class="slider-group"><label class="slider-label">Load (RL): <strong id="lab-vd-rl-val">' + cs.rLoad + ' Ω</strong></label>'
      + '    <input type="range" id="slider-vd-rl" class="voltage-slider" min="20" max="1000" step="10" value="' + cs.rLoad + '"/></div>'
      + '</div>'
      + '<div class="control-row">'
      + '  <button class="switch-toggle-btn ' + (cs.loadConnected ? "closed" : "open") + '" id="btn-vd-load-toggle">'
      + '    ' + (cs.loadConnected ? ICONS.zap + " Load Resistor (RL): CONNECTED" : ICONS.refresh + " Load Resistor (RL): OPEN CIRCUIT (Unloaded)")
      + '  </button>'
      + '</div>'
      + '<div class="telemetry-grid">'
      + '  <div class="telemetry-card"><span class="telemetry-label">V_OUT (Loaded)</span><span class="telemetry-val" id="telemetry-vd-vout">-- V</span></div>'
      + '  <div class="telemetry-card"><span class="telemetry-label">V_UNLOADED (Open)</span><span class="telemetry-val" id="telemetry-vd-vopen">-- V</span></div>'
      + '  <div class="telemetry-card"><span class="telemetry-label">Voltage Sag (ΔV)</span><span class="telemetry-val" id="telemetry-vd-sag">--</span></div>'
      + '  <div class="telemetry-card"><span class="telemetry-label">Thévenin R_Th</span><span class="telemetry-val" id="telemetry-vd-rth">-- Ω</span></div>'
      + '  <div class="telemetry-card"><span class="telemetry-label">Total Current</span><span class="telemetry-val" id="telemetry-vd-itot">-- mA</span></div>'
      + '</div>';
  } else {
    /* ohms-law / electron-flow por defecto */
    controls.innerHTML = ''
      + '<div class="control-row">'
      + '  <div class="slider-group"><label class="slider-label">Voltage (V): <strong id="lab-v-val">' + cs.voltage + ' V</strong></label>'
      + '    <input type="range" id="slider-v" class="voltage-slider" min="0" max="24" step="1" value="' + cs.voltage + '"/></div>'
      + '  <div class="slider-group"><label class="slider-label">Resistance (R): <strong id="lab-r-val">' + cs.resistance + ' Ω</strong></label>'
      + '    <input type="range" id="slider-r" class="voltage-slider" min="10" max="500" step="10" value="' + cs.resistance + '"/></div>'
      + '</div>'
      + '<div class="control-row">'
      + '  <button class="switch-toggle-btn ' + (cs.switchClosed ? "closed" : "open") + '" id="btn-lab-switch">'
      + '    ' + (cs.switchClosed ? ICONS.zap + " Switch: CLOSED" : ICONS.refresh + " Switch: OPEN")
      + '  </button>'
      + '</div>'
      + '<div class="telemetry-grid">'
      + '  <div class="telemetry-card"><span class="telemetry-label">Voltage (V)</span><span class="telemetry-val" id="telemetry-v">' + cs.voltage.toFixed(1) + ' V</span></div>'
      + '  <div class="telemetry-card"><span class="telemetry-label">Current (I)</span><span class="telemetry-val" id="telemetry-i">' + ((cs.voltage / cs.resistance) * 1000).toFixed(1) + ' mA</span></div>'
      + '  <div class="telemetry-card"><span class="telemetry-label">Power (P)</span><span class="telemetry-val" id="telemetry-p">' + (Math.pow(cs.voltage, 2) / cs.resistance).toFixed(2) + ' W</span></div>'
      + '  <div class="telemetry-card"><span class="telemetry-label">Loop State</span><span class="telemetry-val" id="telemetry-state">' + (cs.switchClosed ? "CLOSED" : "OPEN") + '</span></div>'
      + '</div>';
  }

  card.appendChild(controls);
  container.appendChild(card);

  /* Iniciar simulación y enlazar eventos con pequeño retraso para garantizar montaje en DOM */
  setTimeout(function() {
    setupLabEventListeners(labType);
    startCircuitSimulation(labType);
  }, 50);
}

/* Configuración de escuchadores de eventos para todos los laboratorios */
function setupLabEventListeners(labType) {
  var cs = AppState.circuitState;

  if (labType === "ac-oscilloscope") {
    /* Eventos para osciloscopio AC */
    var sVm = document.getElementById("slider-osc-vm");
    var sFreq = document.getElementById("slider-osc-freq");
    var sPhase = document.getElementById("slider-osc-phase");
    var sVdiv = document.getElementById("slider-osc-vdiv");
    var sTdiv = document.getElementById("slider-osc-tdiv");
    var btnDual = document.getElementById("btn-osc-dual");
    var btnRun = document.getElementById("btn-osc-run");

    if (sVm) {
      sVm.addEventListener("input", function() {
        cs.acVm = parseFloat(this.value);
        var lbl = document.getElementById("lab-osc-vm-val");
        if (lbl) lbl.textContent = cs.acVm.toFixed(1) + " V";
      });
    }
    if (sFreq) {
      sFreq.addEventListener("input", function() {
        cs.acFreq = parseInt(this.value, 10);
        var lbl = document.getElementById("lab-osc-freq-val");
        if (lbl) lbl.textContent = cs.acFreq + " Hz";
      });
    }
    if (sPhase) {
      sPhase.addEventListener("input", function() {
        cs.acPhase = parseInt(this.value, 10);
        var lbl = document.getElementById("lab-osc-phase-val");
        if (lbl) lbl.textContent = cs.acPhase + "°";
      });
    }
    if (sVdiv) {
      sVdiv.addEventListener("input", function() {
        cs.acVoltsDiv = parseFloat(this.value);
        var lbl = document.getElementById("lab-osc-vdiv-val");
        if (lbl) lbl.textContent = cs.acVoltsDiv.toFixed(1) + " V/div";
      });
    }
    if (sTdiv) {
      sTdiv.addEventListener("input", function() {
        cs.acTimeDiv = parseFloat(this.value);
        var lbl = document.getElementById("lab-osc-tdiv-val");
        if (lbl) lbl.textContent = cs.acTimeDiv.toFixed(1) + " ms/div";
      });
    }
    if (btnDual) {
      btnDual.addEventListener("click", function() {
        cs.acDualTrace = !cs.acDualTrace;
        SoundEngine.playClick();
        this.className = "switch-toggle-btn " + (cs.acDualTrace ? "closed" : "open");
        var span = document.getElementById("label-osc-dual");
        if (span) span.textContent = "CH2 Trace: " + (cs.acDualTrace ? "ENABLED (Current)" : "DISABLED");
      });
    }
    if (btnRun) {
      btnRun.addEventListener("click", function() {
        cs.acRunning = !cs.acRunning;
        SoundEngine.playClick();
        this.className = "switch-toggle-btn " + (cs.acRunning ? "closed" : "open");
        this.innerHTML = (cs.acRunning ? ICONS.zap + " Sweep: RUNNING" : ICONS.refresh + " Sweep: PAUSED (Frozen)");
      });
    }
  } else if (labType === "rc-transient" || labType === "rlc-transient" || labType === "rlc-resonance") {
    /* Eventos para transitorios RC y RLC */
    var btnRc = document.getElementById("btn-mode-rc");
    var btnRlc = document.getElementById("btn-mode-rlc");
    var btnStep = document.getElementById("btn-rc-step");
    var sR = document.getElementById("slider-rc-r");
    var sC = document.getElementById("slider-rc-c");
    var sL = document.getElementById("slider-rc-l");
    var sVs = document.getElementById("slider-rc-vs");
    var groupL = document.getElementById("group-rc-l");

    if (btnRc && btnRlc) {
      btnRc.addEventListener("click", function() {
        cs.transientMode = "rc";
        SoundEngine.playClick();
        btnRc.classList.add("active");
        btnRlc.classList.remove("active");
        if (groupL) groupL.style.display = "none";
      });
      btnRlc.addEventListener("click", function() {
        cs.transientMode = "rlc";
        SoundEngine.playClick();
        btnRlc.classList.add("active");
        btnRc.classList.remove("active");
        if (groupL) groupL.style.display = "flex";
      });
    }
    if (btnStep) {
      btnStep.addEventListener("click", function() {
        cs.rcCharging = !cs.rcCharging;
        SoundEngine.playClick();
        this.className = "switch-toggle-btn " + (cs.rcCharging ? "closed" : "open");
        this.innerHTML = (cs.rcCharging ? ICONS.zap + " Input: STEP CHARGE (Vs)" : ICONS.refresh + " Input: NATURAL DISCHARGE (0V)");
      });
    }
    if (sR) {
      sR.addEventListener("input", function() {
        cs.rcR = parseFloat(this.value);
        var lbl = document.getElementById("lab-rc-r-val");
        if (lbl) lbl.textContent = cs.rcR >= 1000 ? (cs.rcR / 1000).toFixed(1) + " kΩ" : cs.rcR + " Ω";
      });
    }
    if (sC) {
      sC.addEventListener("input", function() {
        cs.rcC = parseFloat(this.value);
        var lbl = document.getElementById("lab-rc-c-val");
        if (lbl) lbl.textContent = cs.rcC + " µF";
      });
    }
    if (sL) {
      sL.addEventListener("input", function() {
        cs.rlcL = parseFloat(this.value);
        var lbl = document.getElementById("lab-rc-l-val");
        if (lbl) lbl.textContent = cs.rlcL + " mH";
      });
    }
    if (sVs) {
      sVs.addEventListener("input", function() {
        cs.rcVs = parseFloat(this.value);
        var lbl = document.getElementById("lab-rc-vs-val");
        if (lbl) lbl.textContent = cs.rcVs + " V";
      });
    }
  } else if (labType === "opamp-gain") {
    /* Eventos para amplificador operacional */
    var btnInv = document.getElementById("btn-opamp-inv");
    var btnNonInv = document.getElementById("btn-opamp-noninv");
    var sRf = document.getElementById("slider-opamp-rf");
    var sRin = document.getElementById("slider-opamp-rin");
    var sVin = document.getElementById("slider-opamp-vin");
    var sVsat = document.getElementById("slider-opamp-vsat");

    if (btnInv && btnNonInv) {
      btnInv.addEventListener("click", function() {
        cs.opampMode = "inverting";
        SoundEngine.playClick();
        btnInv.classList.add("active");
        btnNonInv.classList.remove("active");
      });
      btnNonInv.addEventListener("click", function() {
        cs.opampMode = "non-inverting";
        SoundEngine.playClick();
        btnNonInv.classList.add("active");
        btnInv.classList.remove("active");
      });
    }
    if (sRf) {
      sRf.addEventListener("input", function() {
        cs.opampRf = parseFloat(this.value);
        var lbl = document.getElementById("lab-opamp-rf-val");
        if (lbl) lbl.textContent = cs.opampRf + " kΩ";
      });
    }
    if (sRin) {
      sRin.addEventListener("input", function() {
        cs.opampRin = parseFloat(this.value);
        var lbl = document.getElementById("lab-opamp-rin-val");
        if (lbl) lbl.textContent = cs.opampRin + " kΩ";
      });
    }
    if (sVin) {
      sVin.addEventListener("input", function() {
        cs.opampVinAmp = parseFloat(this.value);
        var lbl = document.getElementById("lab-opamp-vin-val");
        if (lbl) lbl.textContent = cs.opampVinAmp.toFixed(1) + " Vpk";
      });
    }
    if (sVsat) {
      sVsat.addEventListener("input", function() {
        cs.opampVsat = parseFloat(this.value);
        var lbl = document.getElementById("lab-opamp-vsat-val");
        if (lbl) lbl.textContent = "±" + cs.opampVsat.toFixed(1) + " V";
      });
    }
  } else if (labType === "voltage-divider") {
    /* Eventos para divisor de voltaje */
    var sVinVd = document.getElementById("slider-vd-vin");
    var sR1 = document.getElementById("slider-r1");
    var sR2 = document.getElementById("slider-r2");
    var sRl = document.getElementById("slider-vd-rl");
    var btnLoad = document.getElementById("btn-vd-load-toggle");

    if (sVinVd) {
      sVinVd.addEventListener("input", function() {
        cs.vIn = parseFloat(this.value);
        var lbl = document.getElementById("lab-vd-vin-val");
        if (lbl) lbl.textContent = cs.vIn + " V";
      });
    }
    if (sR1) {
      sR1.addEventListener("input", function() {
        cs.r1 = parseFloat(this.value);
        cs.resistance = cs.r1; // Compatibilidad
        var lbl = document.getElementById("lab-r1-val");
        if (lbl) lbl.textContent = cs.r1 + " Ω";
      });
    }
    if (sR2) {
      sR2.addEventListener("input", function() {
        cs.r2 = parseFloat(this.value);
        cs.resistance2 = cs.r2; // Compatibilidad
        var lbl = document.getElementById("lab-r2-val");
        if (lbl) lbl.textContent = cs.r2 + " Ω";
      });
    }
    if (sRl) {
      sRl.addEventListener("input", function() {
        cs.rLoad = parseFloat(this.value);
        var lbl = document.getElementById("lab-vd-rl-val");
        if (lbl) lbl.textContent = cs.rLoad + " Ω";
      });
    }
    if (btnLoad) {
      btnLoad.addEventListener("click", function() {
        cs.loadConnected = !cs.loadConnected;
        SoundEngine.playClick();
        this.className = "switch-toggle-btn " + (cs.loadConnected ? "closed" : "open");
        this.innerHTML = (cs.loadConnected ? ICONS.zap + " Load Resistor (RL): CONNECTED" : ICONS.refresh + " Load Resistor (RL): OPEN CIRCUIT (Unloaded)");
      });
    }
  } else {
    /* Eventos para ley de Ohm / flujo de electrones */
    var sV = document.getElementById("slider-v") || document.getElementById("voltage-slider");
    var sR = document.getElementById("slider-r");
    var btnSwitch = document.getElementById("btn-lab-switch");

    if (sV) {
      sV.addEventListener("input", function() {
        cs.voltage = parseFloat(this.value);
        var lbl = document.getElementById("lab-v-val") || document.getElementById("voltage-value");
        if (lbl) lbl.textContent = cs.voltage + " V";
      });
    }
    if (sR) {
      sR.addEventListener("input", function() {
        cs.resistance = parseFloat(this.value);
        var lbl = document.getElementById("lab-r-val");
        if (lbl) lbl.textContent = cs.resistance + " Ω";
      });
    }
    if (btnSwitch) {
      btnSwitch.addEventListener("click", function() {
        cs.switchClosed = !cs.switchClosed;
        SoundEngine.playClick();
        this.className = "switch-toggle-btn " + (cs.switchClosed ? "closed" : "open");
        this.innerHTML = (cs.switchClosed ? ICONS.zap + " Switch: CLOSED" : ICONS.refresh + " Switch: OPEN");
      });
    }
  }
}


/* --- Paso: Quiz interactivo --- */
function renderStepQuiz(container, step) {
  var card = document.createElement("div");
  card.className = "step-quiz";

  var headerRow = document.createElement("div");
  headerRow.className = "quiz-header-row";
  headerRow.appendChild(createEditorialBadge(step));

  var badge = document.createElement("span");
  badge.className = "quiz-badge";
  badge.innerHTML = ICONS.star + " +" + step.xp + " XP";
  headerRow.appendChild(badge);
  card.appendChild(headerRow);

  var h2 = document.createElement("h2");
  h2.textContent = step.question;
  card.appendChild(h2);

  var prompt = document.createElement("p");
  prompt.className = "quiz-prompt";
  prompt.textContent = step.prompt;
  card.appendChild(prompt);

  var divider = document.createElement("div");
  divider.className = "quiz-divider";
  card.appendChild(divider);

  var answersLabel = document.createElement("p");
  answersLabel.className = "quiz-answers-label";
  answersLabel.textContent = "Possible Answers";
  card.appendChild(answersLabel);

  var answersHint = document.createElement("p");
  answersHint.className = "quiz-answers-hint";
  answersHint.textContent = "Select one answer";
  card.appendChild(answersHint);

  var optionsList = document.createElement("div");
  optionsList.className = "quiz-options-list";
  optionsList.setAttribute("class", "quiz-options-list");

  var answered = false;
  var selectedIndex = -1;

  step.options.forEach(function(optionText, i) {
    var option = document.createElement("div");
    option.className = "quiz-option";
    option.setAttribute("class", "quiz-option");

    var radio = document.createElement("span");
    radio.className = "quiz-radio";
    radio.setAttribute("class", "quiz-radio");

    var text = document.createElement("span");
    text.className = "quiz-option-text";
    text.setAttribute("class", "quiz-option-text");
    text.textContent = optionText;

    var key = document.createElement("span");
    key.className = "quiz-option-key";
    key.setAttribute("class", "quiz-option-key");
    key.textContent = "PRESS " + (i + 1);

    option.appendChild(radio);
    option.appendChild(text);
    option.appendChild(key);

    option.addEventListener("click", function() {
      if (answered) return;
      SoundEngine.playClick();
      var allOptions = optionsList.querySelectorAll(".quiz-option");
      allOptions.forEach(function(opt) {
        opt.classList.remove("selected");
      });
      option.classList.add("selected");
      selectedIndex = i;
      submitBtn.disabled = false;
    });

    optionsList.appendChild(option);
  });

  card.appendChild(optionsList);

  var actions = document.createElement("div");
  actions.className = "quiz-actions";
  actions.setAttribute("class", "quiz-actions");

  var submitBtn = document.createElement("button");
  submitBtn.className = "btn btn-primary";
  submitBtn.setAttribute("class", "btn btn-primary");
  submitBtn.textContent = "Submit Answer";
  submitBtn.disabled = true;

  var continueBtn = document.createElement("button");
  continueBtn.className = "btn btn-continue";
  continueBtn.setAttribute("class", "btn btn-continue");
  continueBtn.innerHTML = 'Continue ' + ICONS.arrowRight;
  continueBtn.style.display = "none";
  continueBtn.addEventListener("click", function() {
    SoundEngine.playClick();
    goToNextStep();
  });

  submitBtn.addEventListener("click", function() {
    if (answered || selectedIndex === -1) return;
    answered = true;

    var isCorrect = selectedIndex === step.correctIndex;

    var allOptions = optionsList.querySelectorAll(".quiz-option");
    allOptions.forEach(function(opt, idx) {
      opt.classList.add("disabled");
      if (idx === step.correctIndex) { opt.classList.add("correct"); }
      else if (idx === selectedIndex && !isCorrect) { opt.classList.add("wrong"); }
    });

    /* Usamos innerHTML e invocamos renderMath para formatear fórmulas matemáticas 2D en KaTeX dentro de la retroalimentación */
    feedback.innerHTML = step.explanation;
    feedback.className = "quiz-feedback show " + (isCorrect ? "correct" : "wrong");
    feedback.setAttribute("class", "quiz-feedback show " + (isCorrect ? "correct" : "wrong"));
    renderMath(feedback);

    if (isCorrect) {
      SoundEngine.playSuccess();
      addXP(step.xp || 50);
      showXPToast(step.xp || 50);
    } else {
      SoundEngine.playError();
    }

    submitBtn.style.display = "none";
    continueBtn.style.display = "inline-flex";
  });

  actions.appendChild(submitBtn);
  actions.appendChild(continueBtn);
  card.appendChild(actions);

  var feedback = document.createElement("div");
  feedback.className = "quiz-feedback";
  feedback.setAttribute("class", "quiz-feedback");
  card.appendChild(feedback);

  container.appendChild(card);
}


/* --- Paso: Flashcard --- */
function renderStepFlashcard(container, step) {
  var wrapper = document.createElement("div");
  wrapper.className = "step-flashcard";

  wrapper.appendChild(createEditorialBadge(step));

  var card = document.createElement("div");
  card.className = "flashcard-card";

  var inner = document.createElement("div");
  inner.className = "flashcard-inner";

  var front = document.createElement("div");
  front.className = "flashcard-front";
  var frontLabel = document.createElement("span");
  frontLabel.className = "flashcard-label";
  frontLabel.textContent = "Question (Active Recall)";
  var frontText = document.createElement("p");
  frontText.className = "flashcard-text";
  frontText.textContent = step.question;
  var tapHint = document.createElement("span");
  tapHint.className = "flashcard-tap-hint";
  tapHint.textContent = "Click card or press Space / Enter to flip";
  front.appendChild(frontLabel);
  front.appendChild(frontText);
  front.appendChild(tapHint);

  var back = document.createElement("div");
  back.className = "flashcard-back";
  var backLabel = document.createElement("span");
  backLabel.className = "flashcard-label";
  backLabel.textContent = "Answer";
  var backText = document.createElement("p");
  backText.className = "flashcard-text";
  backText.textContent = step.answer;
  back.appendChild(backLabel);
  back.appendChild(backText);

  inner.appendChild(front);
  inner.appendChild(back);
  card.appendChild(inner);

  var ratingActions = document.createElement("div");
  ratingActions.className = "flashcard-rating-actions";

  var btnReview = document.createElement("button");
  btnReview.className = "btn-review-again";
  btnReview.innerHTML = ICONS.refresh + " <span>Review Later</span>";
  btnReview.addEventListener("click", function(e) {
    e.stopPropagation();
    SoundEngine.playClick();
    goToNextStep();
  });

  var btnMastered = document.createElement("button");
  btnMastered.className = "btn-mastered";
  btnMastered.innerHTML = ICONS.check + " <span>Mastered (+15 XP)</span>";
  btnMastered.addEventListener("click", function(e) {
    e.stopPropagation();
    SoundEngine.playSuccess();
    addXP(15);
    showXPToast(15);
    goToNextStep();
  });

  ratingActions.appendChild(btnReview);
  ratingActions.appendChild(btnMastered);

  card.addEventListener("click", function() {
    card.classList.toggle("flipped");
    SoundEngine.playFlip();

    if (card.classList.contains("flipped")) {
      ratingActions.classList.add("show");
    }
  });

  wrapper.appendChild(card);
  wrapper.appendChild(ratingActions);
  container.appendChild(wrapper);
}


/* --- Paso: Problemas de práctica universitaria con derivaciones matemáticas --- */
/* Construye la interfaz estructurada para conjuntos de problemas de nivel universitario,
   incluyendo enunciado, parámetros dados, pista pedagógica desplegable, derivación paso a paso y cita textual */
function renderStepPractice(container, step) {
  /* Soportar llamada flexible con orden intercambiado de parámetros */
  if (container && container.type === "practice" && (!step || step.nodeType)) {
    var temp = container;
    container = step;
    step = temp;
  }
  if (!container) {
    container = document.getElementById("step-container");
  }
  if (!container || !step) return;

  var card = document.createElement("div");
  card.className = "step-practice practice-container";
  card.setAttribute("class", "step-practice practice-container");

  /* 1. Cabecera con insignia editorial y puntaje XP */
  var headerRow = document.createElement("div");
  headerRow.className = "practice-header-row";
  headerRow.setAttribute("class", "practice-header-row");
  headerRow.appendChild(createEditorialBadge(step));

  if (step.xp) {
    var xpBadge = document.createElement("span");
    xpBadge.className = "practice-xp-badge";
    xpBadge.setAttribute("class", "practice-xp-badge");
    xpBadge.innerHTML = ICONS.star + " +" + step.xp + " XP";
    headerRow.appendChild(xpBadge);
  }
  card.appendChild(headerRow);

  /* 2. Título del conjunto de problemas */
  var h2 = document.createElement("h2");
  h2.className = "practice-title";
  h2.setAttribute("class", "practice-title");
  h2.textContent = step.title || "University Problem Set";
  card.appendChild(h2);

  /* 3. Enunciado formal del problema con renderizado de párrafos y KaTeX */
  var statementDiv = document.createElement("div");
  statementDiv.className = "practice-statement";
  statementDiv.setAttribute("class", "practice-statement");
  if (step.problemStatement) {
    var paragraphs = step.problemStatement.split(/\n\n+/);
    paragraphs.forEach(function(para) {
      var p = document.createElement("p");
      p.innerHTML = para.replace(/\n/g, "<br/>");
      statementDiv.appendChild(p);
    });
  }
  card.appendChild(statementDiv);

  /* 4. Parámetros y condiciones dadas en cuadrícula estructurada */
  if (step.givenData && typeof step.givenData === "object" && Object.keys(step.givenData).length > 0) {
    var givenSection = document.createElement("div");
    givenSection.className = "practice-given-section";
    givenSection.setAttribute("class", "practice-given-section");

    var givenHeader = document.createElement("h4");
    givenHeader.className = "practice-section-heading";
    givenHeader.setAttribute("class", "practice-section-heading");
    givenHeader.innerHTML = ICONS.checkSquare + " <span>Parámetros y Condiciones Dadas (Given Data)</span>";
    givenSection.appendChild(givenHeader);

    var grid = document.createElement("div");
    grid.className = "practice-given-grid";
    grid.setAttribute("class", "practice-given-grid");

    Object.keys(step.givenData).forEach(function(key) {
      var item = document.createElement("div");
      item.className = "practice-given-item";
      item.setAttribute("class", "practice-given-item");

      var label = document.createElement("span");
      label.className = "given-item-label";
      label.setAttribute("class", "given-item-label");
      label.innerHTML = key;

      var val = document.createElement("span");
      val.className = "given-item-value";
      val.setAttribute("class", "given-item-value");
      val.innerHTML = step.givenData[key];

      item.appendChild(label);
      item.appendChild(val);
      grid.appendChild(item);
    });

    givenSection.appendChild(grid);
    card.appendChild(givenSection);
  }

  /* 5. Pista pedagógica desplegable para apoyo opcional */
  if (step.hint) {
    var hintWrapper = document.createElement("div");
    hintWrapper.className = "practice-hint-wrapper";
    hintWrapper.setAttribute("class", "practice-hint-wrapper");

    var hintBtn = document.createElement("button");
    hintBtn.className = "practice-hint-btn";
    hintBtn.setAttribute("class", "practice-hint-btn");
    hintBtn.type = "button";
    hintBtn.innerHTML = ICONS.bulb + ' <span>Ver Pista de Solución (Hint)</span> ' + ICONS.chevronDown;

    var hintBody = document.createElement("div");
    hintBody.className = "practice-hint-body";
    hintBody.setAttribute("class", "practice-hint-body");
    hintBody.style.display = "none";
    hintBody.innerHTML = '<div class="practice-hint-content">' + step.hint.replace(/\n/g, "<br/>") + '</div>';

    hintBtn.addEventListener("click", function() {
      SoundEngine.playClick();
      var isHidden = hintBody.style.display === "none";
      hintBody.style.display = isHidden ? "block" : "none";
      hintBtn.classList.toggle("open", isHidden);
      hintBtn.innerHTML = ICONS.bulb + ' <span>' + (isHidden ? "Ocultar Pista" : "Ver Pista de Solución (Hint)") + '</span> ' + (isHidden ? ICONS.chevronDown : ICONS.chevronRight);
      if (isHidden) {
        renderMath(hintBody);
      }
    });

    hintWrapper.appendChild(hintBtn);
    hintWrapper.appendChild(hintBody);
    card.appendChild(hintWrapper);
  }

  /* 6. Desarrollo matemático paso a paso con KaTeX 2D */
  if (step.solutionSteps && step.solutionSteps.length > 0) {
    var solutionCard = document.createElement("div");
    solutionCard.className = "practice-solution-card";
    solutionCard.setAttribute("class", "practice-solution-card");

    var solutionHeader = document.createElement("div");
    solutionHeader.className = "practice-solution-header";
    solutionHeader.setAttribute("class", "practice-solution-header");

    var solutionTitle = document.createElement("h3");
    solutionTitle.className = "practice-solution-title";
    solutionTitle.setAttribute("class", "practice-solution-title");
    solutionTitle.innerHTML = ICONS.book + " <span>Derivación Matemática Paso a Paso (Step-by-Step Derivation)</span>";
    solutionHeader.appendChild(solutionTitle);

    var toggleAllBtn = document.createElement("button");
    toggleAllBtn.className = "practice-toggle-steps-btn";
    toggleAllBtn.setAttribute("class", "practice-toggle-steps-btn");
    toggleAllBtn.type = "button";
    toggleAllBtn.innerHTML = ICONS.refresh + " <span>Alternar Derivaciones</span>";
    solutionHeader.appendChild(toggleAllBtn);

    solutionCard.appendChild(solutionHeader);

    var stepsContainer = document.createElement("div");
    stepsContainer.className = "practice-steps-container";
    stepsContainer.setAttribute("class", "practice-steps-container");

    step.solutionSteps.forEach(function(stepText, idx) {
      var stepItem = document.createElement("div");
      stepItem.className = "practice-step-item";
      stepItem.setAttribute("class", "practice-step-item");

      var stepItemHeader = document.createElement("div");
      stepItemHeader.className = "step-item-header";
      stepItemHeader.setAttribute("class", "step-item-header");

      var lines = stepText.split("\n");
      var firstLine = lines[0];
      var remainingText = lines.slice(1).join("\n");

      var stepNumberBadge = document.createElement("span");
      stepNumberBadge.className = "step-number-badge";
      stepNumberBadge.setAttribute("class", "step-number-badge");
      stepNumberBadge.textContent = "Paso " + (idx + 1);

      var stepHeadingText = document.createElement("span");
      stepHeadingText.className = "step-heading-text";
      stepHeadingText.setAttribute("class", "step-heading-text");
      stepHeadingText.innerHTML = firstLine.replace(/^Paso\s+\d+:\s*/i, "");

      stepItemHeader.appendChild(stepNumberBadge);
      stepItemHeader.appendChild(stepHeadingText);

      var stepBody = document.createElement("div");
      stepBody.className = "step-item-body";
      stepBody.setAttribute("class", "step-item-body");
      stepBody.innerHTML = remainingText ? remainingText.replace(/\n/g, "<br/>") : firstLine;

      stepItem.appendChild(stepItemHeader);
      stepItem.appendChild(stepBody);
      stepsContainer.appendChild(stepItem);
    });

    var areStepsVisible = true;
    toggleAllBtn.addEventListener("click", function() {
      SoundEngine.playClick();
      areStepsVisible = !areStepsVisible;
      stepsContainer.style.display = areStepsVisible ? "flex" : "none";
      toggleAllBtn.innerHTML = ICONS.refresh + " <span>" + (areStepsVisible ? "Ocultar Derivaciones" : "Mostrar Derivaciones") + "</span>";
    });

    solutionCard.appendChild(stepsContainer);
    card.appendChild(solutionCard);
  }

  /* 7. Recuadro de respuesta final verificada en unidades SI */
  if (step.finalAnswer) {
    var finalBox = document.createElement("div");
    finalBox.className = "practice-final-box";
    finalBox.setAttribute("class", "practice-final-box");

    var finalHeader = document.createElement("div");
    finalHeader.className = "practice-final-header";
    finalHeader.setAttribute("class", "practice-final-header");
    finalHeader.innerHTML = ICONS.check + " <span>Respuesta Final Verificada (SI Units)</span>";

    var finalContent = document.createElement("div");
    finalContent.className = "practice-final-content";
    finalContent.setAttribute("class", "practice-final-content");
    finalContent.innerHTML = step.finalAnswer;

    finalBox.appendChild(finalHeader);
    finalBox.appendChild(finalContent);
    card.appendChild(finalBox);
  }

  /* 8. Cita bibliográfica canónica */
  if (step.textbookCitation) {
    var citationBadge = document.createElement("div");
    citationBadge.className = "practice-citation-badge";
    citationBadge.setAttribute("class", "practice-citation-badge");
    citationBadge.innerHTML = '<span class="citation-icon">' + ICONS.book + '</span>'
      + '<span class="citation-label">Referencia Canónica de Libro de Texto:</span>'
      + '<span class="citation-text">' + step.textbookCitation + '</span>';
    card.appendChild(citationBadge);
  }

  container.appendChild(card);

  /* Renderizado de ecuaciones matemáticas 2D con KaTeX */
  renderMath(card);
}


/* --- Paso: Lección completa --- */
function renderStepComplete(container, step) {
  var card = document.createElement("div");
  card.className = "step-complete";

  var iconBadge = document.createElement("div");
  iconBadge.className = "complete-icon-badge";
  iconBadge.innerHTML = ICONS.trophy;

  var h2 = document.createElement("h2");
  h2.textContent = "Lesson Completed!";

  var p = document.createElement("p");
  p.textContent = "You've successfully mastered this module and advanced your engineering track.";

  var statsRow = document.createElement("div");
  statsRow.className = "complete-stats-row";

  var xpCard = document.createElement("div");
  xpCard.className = "complete-stat-card";
  xpCard.innerHTML = '<div class="stat-card-value">' + ICONS.star + ' ' + AppState.progress.xp + '</div><div class="stat-card-label">Total XP</div>';

  var streakCard = document.createElement("div");
  streakCard.className = "complete-stat-card";
  streakCard.innerHTML = '<div class="stat-card-value">' + ICONS.flame + ' ' + AppState.progress.streak + '</div><div class="stat-card-label">Day Streak</div>';

  statsRow.appendChild(xpCard);
  statsRow.appendChild(streakCard);

  var nextLesson = getNextLesson(AppState.activeLessonId);
  var nextLessonBtn = document.createElement("button");
  nextLessonBtn.className = "btn btn-primary";
  if (nextLesson) {
    nextLessonBtn.innerHTML = 'Continue to ' + nextLesson.title + ' ' + ICONS.arrowRight;
    nextLessonBtn.addEventListener("click", function() {
      SoundEngine.playClick();
      showLessonView(AppState.activeCourseId, nextLesson.id);
    });
  } else {
    nextLessonBtn.innerHTML = 'Complete Course & View Dashboard ' + ICONS.trophy;
    nextLessonBtn.addEventListener("click", function() {
      SoundEngine.playClick();
      showDashboardView();
    });
  }

  card.appendChild(iconBadge);
  card.appendChild(h2);
  card.appendChild(p);
  card.appendChild(statsRow);
  card.appendChild(nextLessonBtn);

  if (!isLessonCompleted(AppState.activeLessonId) && step.xp > 0) {
    completeLesson(AppState.activeLessonId);
    addXP(step.xp);
    showXPToast(step.xp);
    SoundEngine.playComplete();
    updateSidebarProgressMeter();
  }

  container.appendChild(card);
}


/* ============================================
   12. MOTOR UNIFICADO DE SIMULACIÓN Y VISUALIZADORES (SimulatorEngine)
   ============================================ */

var SimulatorEngine = (function() {
  /* Control de ciclo de animación y referencias */
  var animFrameId = null;
  var currentType = null;
  var simClock = 0;

  /* Partículas electrónicas para simulación de corriente */
  var mainElectrons = [];
  var branch1Electrons = [];
  var branch2Electrons = [];

  /* Inicializa partículas para flujo en circuito cerrado */
  function initParticles(w, h) {
    mainElectrons = [];
    branch1Electrons = [];
    branch2Electrons = [];
    var perimeter = 2 * (w - 120) + 2 * (h - 100);
    for (var i = 0; i < 36; i++) {
      mainElectrons.push({ dist: (i / 36) * perimeter });
      branch1Electrons.push({ dist: (i / 36) * 200 });
      branch2Electrons.push({ dist: (i / 36) * 200 });
    }
  }

  /* Inicia el bucle de renderizado para el laboratorio especificado */
  function start(labType) {
    stop();
    currentType = labType || "electron-flow";

    var canvas = document.getElementById("electron-canvas");
    if (!canvas) return;
    var ctx = canvas.getContext("2d");
    var w = canvas.width;
    var h = canvas.height;

    initParticles(w, h);

    function frameLoop() {
      simClock += 0.016; // Incremento de tiempo aproximado a 60 FPS
      var cs = AppState.circuitState;

      switch (currentType) {
        case "ac-oscilloscope":
          drawACOscilloscope(ctx, w, h, cs);
          break;
        case "rc-transient":
        case "rlc-transient":
        case "rlc-resonance":
          drawRCTransient(ctx, w, h, cs);
          break;
        case "voltage-divider":
          drawVoltageDivider(ctx, w, h, cs);
          break;
        case "opamp-gain":
          drawOpAmpCircuit(ctx, w, h, cs);
          break;
        case "ohms-law":
        case "electron-flow":
        default:
          drawOhmsLawCircuit(ctx, w, h, cs);
          break;
      }

      animFrameId = requestAnimationFrame(frameLoop);
      window.electronAnimationId = animFrameId;
    }

    animFrameId = requestAnimationFrame(frameLoop);
    window.electronAnimationId = animFrameId;
  }

  /* Detiene limpiamente el bucle para liberar recursos de la GPU */
  function stop() {
    if (animFrameId) {
      cancelAnimationFrame(animFrameId);
      animFrameId = null;
    }
    if (window.electronAnimationId) {
      cancelAnimationFrame(window.electronAnimationId);
      window.electronAnimationId = null;
    }
  }

  /* =========================================================================
     A. Osciloscopio de Fósforo AC en Tiempo Real (ac-oscilloscope)
     Modelo: v(t) = Vm * sin(2*pi*f*t + phi) con retícula CRT de 8x10 divisiones
     ========================================================================= */
  function drawACOscilloscope(ctx, w, h, cs) {
    ctx.clearRect(0, 0, w, h);

    /* 1. Fondo de fósforo con gradiente de tubo de rayos catódicos (CRT) */
    var bgGrad = ctx.createRadialGradient(w / 2, h / 2, 20, w / 2, h / 2, w / 1.4);
    bgGrad.addColorStop(0, "#052219");
    bgGrad.addColorStop(1, "#02110c");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    /* 2. Retícula de 8 divisiones verticales y 10 horizontales */
    var divX = w / 10;
    var divY = h / 8;

    ctx.strokeStyle = "rgba(16, 185, 129, 0.20)";
    ctx.lineWidth = 1;
    for (var x = 0; x <= w; x += divX) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (var y = 0; y <= h; y += divY) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    /* 3. Ejes centrales con marcas de graduación subdivididas */
    ctx.strokeStyle = "rgba(16, 185, 129, 0.65)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, h / 2);
    ctx.lineTo(w, h / 2);
    ctx.moveTo(w / 2, 0);
    ctx.lineTo(w / 2, h);
    ctx.stroke();

    /* Sub-marcas de graduación en ejes principales */
    ctx.strokeStyle = "rgba(16, 185, 129, 0.50)";
    ctx.lineWidth = 1;
    for (var gx = 0; gx <= w; gx += divX / 5) {
      ctx.beginPath();
      ctx.moveTo(gx, h / 2 - 3);
      ctx.lineTo(gx, h / 2 + 3);
      ctx.stroke();
    }
    for (var gy = 0; gy <= h; gy += divY / 5) {
      ctx.beginPath();
      ctx.moveTo(w / 2 - 3, gy);
      ctx.lineTo(w / 2 + 3, gy);
      ctx.stroke();
    }

    /* 4. Trazado de ondas senoidales v1(t) y v2(t) */
    var secPerScreen = (10 * cs.acTimeDiv) / 1000;
    var pxPerVolt = (h / 8) / cs.acVoltsDiv;
    var omega = 2 * Math.PI * cs.acFreq;
    var phiRad = (cs.acPhase * Math.PI) / 180;
    var tOffset = cs.acRunning ? simClock : 0;

    /* Canal 2 (Referencia o corriente con desfase cuadrantal de -90°) */
    if (cs.acDualTrace) {
      ctx.beginPath();
      ctx.strokeStyle = "#fbbf24"; // Traza ámbar brillante
      ctx.lineWidth = 2.0;
      ctx.shadowColor = "#fbbf24";
      ctx.shadowBlur = 6;

      for (var i = 0; i < w; i++) {
        var t2 = (i / w) * secPerScreen + tOffset;
        var v2 = (cs.acVm * 0.70) * Math.sin(omega * t2 + phiRad - (Math.PI / 2));
        var y2 = h / 2 - v2 * pxPerVolt;
        if (i === 0) ctx.moveTo(i, y2);
        else ctx.lineTo(i, y2);
      }
      ctx.stroke();
    }

    /* Canal 1 (Voltaje principal de entrada) */
    ctx.beginPath();
    ctx.strokeStyle = "#38bdf8"; // Traza cian fosforescente
    ctx.lineWidth = 2.5;
    ctx.shadowColor = "#38bdf8";
    ctx.shadowBlur = 8;

    var vCenter = 0;
    for (var j = 0; j < w; j++) {
      var t1 = (j / w) * secPerScreen + tOffset;
      var v1 = cs.acVm * Math.sin(omega * t1 + phiRad);
      var y1 = h / 2 - v1 * pxPerVolt;
      if (j === 0) ctx.moveTo(j, y1);
      else ctx.lineTo(j, y1);

      if (j === Math.floor(w / 2)) {
        vCenter = v1;
      }
    }
    ctx.stroke();
    ctx.shadowBlur = 0; // Restaurar sombras inmediatamente para rendimiento

    /* 5. Punto de muestreo instantáneo en retícula central */
    var probeY = h / 2 - vCenter * pxPerVolt;
    ctx.fillStyle = "#38bdf8";
    ctx.beginPath();
    ctx.arc(w / 2, probeY, 4, 0, Math.PI * 2);
    ctx.fill();

    /* 6. Panel de telemetría superior integrado en pantalla */
    var vRms = cs.acVm / Math.SQRT2;
    var vPp = 2 * cs.acVm;
    var periodMs = (1000 / cs.acFreq).toFixed(2);

    ctx.fillStyle = "rgba(4, 20, 15, 0.85)";
    ctx.fillRect(8, 8, 360, 48);
    ctx.strokeStyle = "rgba(16, 185, 129, 0.4)";
    ctx.strokeRect(8, 8, 360, 48);

    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 11px Plus Jakarta Sans, monospace";
    ctx.textAlign = "left";
    ctx.fillText("CH1: " + cs.acVoltsDiv.toFixed(1) + "V/DIV  |  TB: " + cs.acTimeDiv.toFixed(1) + "ms/DIV  |  " + (cs.acDualTrace ? "CH2: ON" : "CH2: OFF"), 16, 26);
    ctx.fillStyle = "#a7f3d0";
    ctx.fillText("Vpp=" + vPp.toFixed(2) + "V  Vrms=" + vRms.toFixed(2) + "V  f=" + cs.acFreq + "Hz (T=" + periodMs + "ms)  φ=" + cs.acPhase + "°", 16, 44);

    /* Actualizar valores en tarjetas del DOM */
    var domVrms = document.getElementById("telemetry-osc-vrms");
    var domVpp = document.getElementById("telemetry-osc-vpp");
    var domFreq = document.getElementById("telemetry-osc-freq");
    var domPeriod = document.getElementById("telemetry-osc-period");
    var domOmega = document.getElementById("telemetry-osc-omega");
    if (domVrms) domVrms.textContent = vRms.toFixed(2) + " V";
    if (domVpp) domVpp.textContent = vPp.toFixed(2) + " V";
    if (domFreq) domFreq.textContent = cs.acFreq + " Hz";
    if (domPeriod) domPeriod.textContent = periodMs + " ms";
    if (domOmega) domOmega.textContent = (omega).toFixed(1) + " rad/s";
  }

  /* =========================================================================
     B. Generador de Respuesta Transitoria RC y RLC de Segundo Orden (rc-transient)
     Modelo RC: vC(t) = Vs(1 - e^(-t/tau))  |  Modelo RLC con amortiguamiento zeta
     ========================================================================= */
  function drawRCTransient(ctx, w, h, cs) {
    ctx.clearRect(0, 0, w, h);

    /* 1. Fondo de gráfico de laboratorio */
    ctx.fillStyle = "#091226";
    ctx.fillRect(0, 0, w, h);

    var padLeft = 65;
    var padRight = 25;
    var padTop = 30;
    var padBottom = 45;
    var plotW = w - padLeft - padRight;
    var plotH = h - padTop - padBottom;

    /* 2. Cuadrícula matemática de referencia */
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 1;
    for (var kx = 0; kx <= 6; kx++) {
      var gx = padLeft + (kx / 6) * plotW;
      ctx.beginPath();
      ctx.moveTo(gx, padTop);
      ctx.lineTo(gx, padTop + plotH);
      ctx.stroke();
    }
    for (var ky = 0; ky <= 4; ky++) {
      var gy = padTop + (ky / 4) * plotH;
      ctx.beginPath();
      ctx.moveTo(padLeft, gy);
      ctx.lineTo(padLeft + plotW, gy);
      ctx.stroke();
    }

    /* 3. Ejes cartesianos principales */
    ctx.strokeStyle = "#475569";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(padLeft, padTop);
    ctx.lineTo(padLeft, padTop + plotH);
    ctx.lineTo(padLeft + plotW, padTop + plotH);
    ctx.stroke();

    var isRLC = (cs.transientMode === "rlc" || currentType === "rlc-transient" || currentType === "rlc-resonance");

    if (isRLC) {
      /* --- Respuesta de Segundo Orden RLC Serie --- */
      var R = cs.rcR;
      var C = cs.rcC * 1e-6;
      var L = cs.rlcL * 1e-3;
      var Vs = cs.rcVs;

      var alpha = R / (2 * L);               // Factor de amortiguamiento Neper (Np/s)
      var omega0 = 1 / Math.sqrt(L * C);     // Frecuencia natural no amortiguada (rad/s)
      var zeta = alpha / omega0;             // Razón de amortiguamiento zeta

      var maxT = Math.max(6 / alpha, 8 * Math.PI / omega0, 0.002);

      /* Línea asintótica de voltaje de fuente Vs */
      var vsY = (padTop + plotH) - (Vs / Vs) * (plotH * 0.70);
      ctx.strokeStyle = "rgba(148, 163, 184, 0.35)";
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(padLeft, vsY);
      ctx.lineTo(padLeft + plotW, vsY);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = "#94a3b8";
      ctx.font = "10px Plus Jakarta Sans, sans-serif";
      ctx.textAlign = "right";
      ctx.fillText("Vs = " + Vs + "V", padLeft - 6, vsY + 4);

      /* Determinar régimen y trazar forma de onda correspondiente */
      var regimeName = "CRITICALLY DAMPED";
      var regimeClass = "regime-critical";
      var strokeColor = "#10b981";

      if (zeta < 0.999) {
        regimeName = "UNDERDAMPED (Ringing)";
        regimeClass = "regime-underdamped";
        strokeColor = "#38bdf8";
      } else if (zeta > 1.001) {
        regimeName = "OVERDAMPED (Sluggish)";
        regimeClass = "regime-overdamped";
        strokeColor = "#c084fc";
      }

      ctx.beginPath();
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 2.5;
      ctx.shadowColor = strokeColor;
      ctx.shadowBlur = 6;

      for (var px = 0; px <= plotW; px++) {
        var t = (px / plotW) * maxT;
        var vC = 0;

        if (zeta < 0.999) {
          /* Régimen subamortiguado con frecuencia amortiguada omegad */
          var omegad = Math.sqrt(omega0 * omega0 - alpha * alpha);
          vC = Vs * (1 - Math.exp(-alpha * t) * (Math.cos(omegad * t) + (alpha / omegad) * Math.sin(omegad * t)));
        } else if (zeta > 1.001) {
          /* Régimen sobreamortiguado con dos raíces reales */
          var beta = Math.sqrt(alpha * alpha - omega0 * omega0);
          var s1 = -alpha + beta;
          var s2 = -alpha - beta;
          vC = Vs * (1 - (s2 * Math.exp(s1 * t) - s1 * Math.exp(s2 * t)) / (s2 - s1));
        } else {
          /* Régimen críticamente amortiguado con retorno monótono óptimo */
          vC = Vs * (1 - (1 + alpha * t) * Math.exp(-alpha * t));
        }

        var curY = (padTop + plotH) - (vC / Vs) * (plotH * 0.70);
        if (px === 0) ctx.moveTo(padLeft + px, curY);
        else ctx.lineTo(padLeft + px, curY);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      /* Actualizar telemetría DOM */
      var domTau = document.getElementById("telemetry-rc-tau");
      var dom5Tau = document.getElementById("telemetry-rc-5tau");
      var domW0 = document.getElementById("telemetry-rc-w0");
      var domZeta = document.getElementById("telemetry-rc-zeta");
      var domRegime = document.getElementById("telemetry-rc-regime");
      if (domTau) domTau.textContent = "α = " + alpha.toFixed(1) + " Np/s";
      if (dom5Tau) dom5Tau.textContent = "Ts ≈ " + (4000 / alpha).toFixed(1) + " ms";
      if (domW0) domW0.textContent = omega0.toFixed(1) + " rad/s (" + (omega0 / (2 * Math.PI)).toFixed(1) + " Hz)";
      if (domZeta) domZeta.textContent = zeta.toFixed(2);
      if (domRegime) domRegime.innerHTML = '<span class="regime-badge ' + regimeClass + '">' + regimeName + '</span>';

      /* Leyenda de régimen en Canvas */
      ctx.fillStyle = strokeColor;
      ctx.font = "bold 11px Plus Jakarta Sans, sans-serif";
      ctx.textAlign = "left";
      ctx.fillText("RLC Regime: " + regimeName + "  (ζ = " + zeta.toFixed(2) + ", ω0 = " + omega0.toFixed(0) + " rad/s)", padLeft + 10, padTop + 20);

    } else {
      /* --- Respuesta Transitoria RC de Primer Orden --- */
      var tau = cs.rcR * (cs.rcC * 1e-6); // Constante tau = R * C (s)
      var maxTime = 6 * tau;

      /* Marcadores verticales para múltiplos de tau (1tau a 5tau) */
      var milestones = ["0", "1τ (63.2%)", "2τ (86.5%)", "3τ (95.0%)", "4τ (98.2%)", "5τ (99.3%)", "6τ"];
      ctx.font = "10px Plus Jakarta Sans, sans-serif";
      ctx.textAlign = "center";

      for (var k = 1; k <= 5; k++) {
        var markerX = padLeft + (k / 6) * plotW;
        ctx.strokeStyle = "rgba(148, 163, 184, 0.25)";
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(markerX, padTop);
        ctx.lineTo(markerX, padTop + plotH);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = "#64748b";
        ctx.fillText(milestones[k], markerX, padTop + plotH + 16);
      }

      /* Trazado de curva exponencial vC(t) */
      ctx.beginPath();
      ctx.strokeStyle = cs.rcCharging ? "#10b981" : "#f43f5e";
      ctx.lineWidth = 3;
      ctx.shadowColor = ctx.strokeStyle;
      ctx.shadowBlur = 6;

      for (var x = 0; x <= plotW; x++) {
        var tRc = (x / plotW) * maxTime;
        var vC_val = cs.rcCharging
          ? cs.rcVs * (1 - Math.exp(-tRc / tau))
          : cs.rcVs * Math.exp(-tRc / tau);
        var yRc = (padTop + plotH) - (vC_val / cs.rcVs) * plotH;

        if (x === 0) ctx.moveTo(padLeft + x, yRc);
        else ctx.lineTo(padLeft + x, yRc);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      /* Punto de animación que recorre la curva en tiempo real */
      var animT = (simClock % 4) / 4; // Bucle periódico de 4 segundos
      var curT = animT * maxTime;
      var curV = cs.rcCharging ? cs.rcVs * (1 - Math.exp(-curT / tau)) : cs.rcVs * Math.exp(-curT / tau);
      var dotX = padLeft + animT * plotW;
      var dotY = (padTop + plotH) - (curV / cs.rcVs) * plotH;

      ctx.fillStyle = "#f8fafc";
      ctx.beginPath();
      ctx.arc(dotX, dotY, 5, 0, Math.PI * 2);
      ctx.fill();

      /* Telemetría en pantalla */
      ctx.textAlign = "left";
      ctx.fillStyle = "#f8fafc";
      ctx.font = "bold 11px Plus Jakarta Sans, sans-serif";
      ctx.fillText("τ = R · C = " + (tau * 1000).toFixed(2) + " ms  |  Vs = " + cs.rcVs + " V", padLeft + 10, padTop + 18);
      ctx.fillStyle = cs.rcCharging ? "#10b981" : "#f43f5e";
      ctx.fillText("5τ = " + (5 * tau * 1000).toFixed(2) + " ms (99.3% Steady State) | v(t) = " + curV.toFixed(2) + "V", padLeft + 10, padTop + 34);

      /* Actualizar telemetría DOM */
      var domRcTau = document.getElementById("telemetry-rc-tau");
      var domRc5Tau = document.getElementById("telemetry-rc-5tau");
      var domRcW0 = document.getElementById("telemetry-rc-w0");
      var domRcZeta = document.getElementById("telemetry-rc-zeta");
      var domRcRegime = document.getElementById("telemetry-rc-regime");
      if (domRcTau) domRcTau.textContent = (tau * 1000).toFixed(2) + " ms";
      if (domRc5Tau) domRc5Tau.textContent = (5 * tau * 1000).toFixed(2) + " ms";
      if (domRcW0) domRcW0.textContent = "---";
      if (domRcZeta) domRcZeta.textContent = "---";
      if (domRcRegime) domRcRegime.innerHTML = '<span class="regime-badge regime-critical">1ST ORDER RC</span>';
    }
  }

  /* =========================================================================
     C. Divisor de Voltaje y Efecto de Carga Thévenin (voltage-divider)
     Vout = Vin * (R2 || RL) / (R1 + (R2 || RL))  |  RTh = R1 || R2
     ========================================================================= */
  function drawVoltageDivider(ctx, w, h, cs) {
    ctx.clearRect(0, 0, w, h);

    /* 1. Fondo de diagrama esquemático */
    ctx.fillStyle = "#091226";
    ctx.fillRect(0, 0, w, h);

    /* 2. Cálculos circuitales rigurosos */
    var vIn = cs.vIn;
    var r1 = cs.r1;
    var r2 = cs.r2;
    var rLoad = cs.rLoad;
    var isLoaded = cs.loadConnected;

    var vUnloaded = vIn * (r2 / (r1 + r2));
    var rTh = (r1 * r2) / (r1 + r2);

    var vOut = vUnloaded;
    var req2 = r2;
    var iTot = vIn / (r1 + r2);
    var i2 = iTot;
    var iL = 0;
    var sagPct = 0;

    if (isLoaded) {
      req2 = (r2 * rLoad) / (r2 + rLoad);
      iTot = vIn / (r1 + req2);
      vOut = iTot * req2;
      i2 = vOut / r2;
      iL = vOut / rLoad;
      sagPct = ((vUnloaded - vOut) / vUnloaded) * 100;
    }

    /* 3. Trazado de líneas esquemáticas de interconexión */
    ctx.strokeStyle = "#334155";
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    /* Bucle principal: Fuente a R1 */
    ctx.beginPath();
    ctx.moveTo(70, 140);
    ctx.lineTo(70, 50);
    ctx.lineTo(150, 50);
    ctx.stroke();

    /* De R1 a nodo central Vout */
    ctx.beginPath();
    ctx.moveTo(230, 50);
    ctx.lineTo(310, 50);
    ctx.stroke();

    /* Rama R2 (vertical) */
    ctx.beginPath();
    ctx.moveTo(310, 50);
    ctx.lineTo(310, 95);
    ctx.moveTo(310, 155);
    ctx.lineTo(310, 225);
    ctx.stroke();

    /* Rama RL (paralela con interruptor) */
    ctx.beginPath();
    ctx.moveTo(310, 50);
    ctx.lineTo(460, 50);
    ctx.lineTo(460, 75);
    if (isLoaded) {
      ctx.lineTo(460, 105);
    } else {
      ctx.moveTo(460, 75);
      ctx.lineTo(475, 90); // Interruptor abierto
    }
    ctx.moveTo(460, 105);
    ctx.lineTo(460, 105);
    ctx.moveTo(460, 165);
    ctx.lineTo(460, 225);
    ctx.stroke();

    /* Línea de retorno a tierra común */
    ctx.beginPath();
    ctx.moveTo(70, 140);
    ctx.lineTo(70, 225);
    ctx.lineTo(460, 225);
    ctx.stroke();

    /* 4. Dibujo de componentes físicos */

    /* Fuente DC */
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(54, 115, 32, 50);
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(54, 115, 32, 50);
    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 10px Plus Jakarta Sans, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("+ " + vIn + "V", 70, 138);
    ctx.fillText("−", 70, 154);

    /* Resistor R1 */
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(150, 36, 80, 28);
    ctx.strokeStyle = "#94a3b8";
    ctx.strokeRect(150, 36, 80, 28);
    ctx.fillStyle = "#f8fafc";
    ctx.fillText("R1: " + r1 + "Ω", 190, 53);

    /* Resistor R2 */
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(276, 95, 68, 60);
    ctx.strokeStyle = "#94a3b8";
    ctx.strokeRect(276, 95, 68, 60);
    ctx.fillStyle = "#f8fafc";
    ctx.fillText("R2", 310, 122);
    ctx.fillText(r2 + "Ω", 310, 138);

    /* Resistor de Carga RL */
    ctx.fillStyle = isLoaded ? "#1e293b" : "#0f172a";
    ctx.fillRect(426, 105, 68, 60);
    ctx.strokeStyle = isLoaded ? (sagPct > 15 ? "#f43f5e" : "#10b981") : "#475569";
    ctx.strokeRect(426, 105, 68, 60);
    ctx.fillStyle = isLoaded ? "#f8fafc" : "#64748b";
    ctx.fillText("LOAD RL", 460, 132);
    ctx.fillText(rLoad + "Ω", 460, 148);

    /* 5. Nodo de voltaje central Vout */
    ctx.fillStyle = "#10b981";
    ctx.beginPath();
    ctx.arc(310, 50, 6, 0, Math.PI * 2);
    ctx.fill();

    /* Etiqueta flotante de Vout */
    ctx.fillStyle = "rgba(15, 23, 42, 0.9)";
    ctx.fillRect(260, 14, 100, 22);
    ctx.strokeStyle = "#10b981";
    ctx.lineWidth = 1;
    ctx.strokeRect(260, 14, 100, 22);
    ctx.fillStyle = "#10b981";
    ctx.font = "bold 11px Plus Jakarta Sans, monospace";
    ctx.textAlign = "center";
    ctx.fillText("Vout = " + vOut.toFixed(2) + "V", 310, 29);

    /* 6. Panel de telemetría inferior */
    ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
    ctx.fillRect(10, 240, w - 20, 32);
    ctx.strokeStyle = "#334155";
    ctx.strokeRect(10, 240, w - 20, 32);

    ctx.fillStyle = "#94a3b8";
    ctx.font = "11px Plus Jakarta Sans, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("V(no-load)=" + vUnloaded.toFixed(2) + "V  |  V(loaded)=" + vOut.toFixed(2) + "V  |  Sag=" + sagPct.toFixed(1) + "%  |  R_Th=" + rTh.toFixed(1) + "Ω  |  Itot=" + (iTot * 1000).toFixed(1) + "mA", 20, 260);

    /* Actualizar tarjetas en el DOM */
    var domVout = document.getElementById("telemetry-vd-vout");
    var domVopen = document.getElementById("telemetry-vd-vopen");
    var domSag = document.getElementById("telemetry-vd-sag");
    var domRth = document.getElementById("telemetry-vd-rth");
    var domItot = document.getElementById("telemetry-vd-itot");
    if (domVout) domVout.textContent = vOut.toFixed(2) + " V";
    if (domVopen) domVopen.textContent = vUnloaded.toFixed(2) + " V";
    if (domSag) domSag.textContent = (vUnloaded - vOut).toFixed(2) + " V (" + sagPct.toFixed(1) + "%)";
    if (domRth) domRth.textContent = rTh.toFixed(1) + " Ω";
    if (domItot) domItot.textContent = (iTot * 1000).toFixed(1) + " mA";
  }

  /* =========================================================================
     D. Amplificador Operacional Inversor/No Inversor con Saturación (opamp-gain)
     Inversor: Av = -Rf / Rin  |  No inversor: Av = 1 + Rf / R1  |  Recorte a ±Vsat
     ========================================================================= */
  function drawOpAmpCircuit(ctx, w, h, cs) {
    ctx.clearRect(0, 0, w, h);

    /* 1. Fondo general */
    ctx.fillStyle = "#091226";
    ctx.fillRect(0, 0, w, h);

    var isInv = (cs.opampMode === "inverting");
    var Av = isInv ? (-cs.opampRf / cs.opampRin) : (1 + cs.opampRf / cs.opampRin);
    var vIdealPeak = Math.abs(Av * cs.opampVinAmp);
    var vActualPeak = Math.min(vIdealPeak, cs.opampVsat);
    var isSaturated = vIdealPeak > cs.opampVsat;

    /* 2. Zona Izquierda (x: 0 a 300): Esquemático de Op-Amp */
    ctx.strokeStyle = "#334155";
    ctx.lineWidth = 2;

    /* Símbolo triangular del Amplificador Operacional */
    ctx.beginPath();
    ctx.moveTo(110, 65);
    ctx.lineTo(210, 130);
    ctx.lineTo(110, 195);
    ctx.closePath();
    ctx.fillStyle = "#1e293b";
    ctx.fill();
    ctx.strokeStyle = "#64748b";
    ctx.stroke();

    /* Terminales de entrada (- y +) */
    ctx.fillStyle = "#f8fafc";
    ctx.font = "bold 13px Plus Jakarta Sans, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("−", 125, 98);
    ctx.fillText("+", 125, 168);

    /* Rieles de alimentación ±Vsat */
    ctx.fillStyle = "#ef4444";
    ctx.font = "10px Plus Jakarta Sans, sans-serif";
    ctx.fillText("+" + cs.opampVsat.toFixed(1) + "V", 160, 52);
    ctx.fillStyle = "#3b82f6";
    ctx.fillText("−" + cs.opampVsat.toFixed(1) + "V", 160, 218);

    /* Trazado de conexiones del esquema */
    ctx.strokeStyle = "#475569";
    ctx.lineWidth = 2;

    if (isInv) {
      /* Modo inversor: Vin entra por terminal (-) a través de Rin */
      ctx.beginPath();
      ctx.moveTo(25, 95);
      ctx.lineTo(50, 95);
      ctx.moveTo(90, 95);
      ctx.lineTo(110, 95);
      ctx.stroke();

      /* Resistor Rin */
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(50, 85, 40, 20);
      ctx.strokeStyle = "#94a3b8";
      ctx.strokeRect(50, 85, 40, 20);
      ctx.fillStyle = "#cbd5e1";
      ctx.font = "9px Plus Jakarta Sans, sans-serif";
      ctx.fillText(cs.opampRin + "k", 70, 99);

      /* Terminal (+) a tierra */
      ctx.beginPath();
      ctx.moveTo(85, 165);
      ctx.lineTo(110, 165);
      ctx.stroke();
      ctx.fillText("GND", 70, 169);
    } else {
      /* Modo no inversor: Vin entra directo a terminal (+) */
      ctx.beginPath();
      ctx.moveTo(25, 165);
      ctx.lineTo(110, 165);
      ctx.stroke();

      /* Terminal (-) a tierra por Rin */
      ctx.beginPath();
      ctx.moveTo(50, 95);
      ctx.lineTo(110, 95);
      ctx.moveTo(50, 95);
      ctx.lineTo(50, 140);
      ctx.stroke();
      ctx.fillText("GND", 50, 155);
    }

    /* Bucle de retroalimentación Rf */
    ctx.beginPath();
    ctx.moveTo(100, 95);
    ctx.lineTo(100, 35);
    ctx.lineTo(135, 35);
    ctx.moveTo(185, 35);
    ctx.lineTo(230, 35);
    ctx.lineTo(230, 130);
    ctx.moveTo(210, 130);
    ctx.lineTo(280, 130);
    ctx.stroke();

    /* Resistor Rf */
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(135, 25, 50, 20);
    ctx.strokeStyle = "#94a3b8";
    ctx.strokeRect(135, 25, 50, 20);
    ctx.fillStyle = "#cbd5e1";
    ctx.font = "9px Plus Jakarta Sans, sans-serif";
    ctx.fillText("Rf: " + cs.opampRf + "k", 160, 39);

    /* Texto de ganancia y salida */
    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 11px Plus Jakarta Sans, sans-serif";
    ctx.fillText("Av = " + Av.toFixed(2), 160, 245);
    ctx.fillText("Vout", 260, 120);

    /* 3. Zona Derecha (x: 320 a 620): Osciloscopio de formas de onda y saturación */
    var scopeX = 320;
    var scopeY = 20;
    var scopeW = 300;
    var scopeH = 220;

    ctx.fillStyle = "#041410";
    ctx.fillRect(scopeX, scopeY, scopeW, scopeH);
    ctx.strokeStyle = "#0d4a38";
    ctx.strokeRect(scopeX, scopeY, scopeW, scopeH);

    /* Eje central 0V */
    ctx.strokeStyle = "rgba(16, 185, 129, 0.4)";
    ctx.beginPath();
    ctx.moveTo(scopeX, scopeY + scopeH / 2);
    ctx.lineTo(scopeX + scopeW, scopeY + scopeH / 2);
    ctx.stroke();

    /* Líneas de saturación de rieles (+Vsat y -Vsat) */
    var railPx = (scopeH / 2) * 0.75;
    ctx.strokeStyle = "rgba(244, 63, 94, 0.5)";
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(scopeX, scopeY + scopeH / 2 - railPx);
    ctx.lineTo(scopeX + scopeW, scopeY + scopeH / 2 - railPx);
    ctx.moveTo(scopeX, scopeY + scopeH / 2 + railPx);
    ctx.lineTo(scopeX + scopeW, scopeY + scopeH / 2 + railPx);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = "#f43f5e";
    ctx.font = "9px Plus Jakarta Sans, sans-serif";
    ctx.textAlign = "right";
    ctx.fillText("+Vsat (" + cs.opampVsat.toFixed(1) + "V)", scopeX + scopeW - 6, scopeY + scopeH / 2 - railPx - 4);
    ctx.fillText("−Vsat (" + cs.opampVsat.toFixed(1) + "V)", scopeX + scopeW - 6, scopeY + scopeH / 2 + railPx + 12);

    /* Trazado de señal de entrada Vin(t) en cian */
    ctx.beginPath();
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 1.8;
    for (var k1 = 0; k1 <= scopeW; k1++) {
      var tIn = (k1 / scopeW) * 4 * Math.PI + simClock * 4;
      var valIn = cs.opampVinAmp * Math.sin(tIn);
      var yIn = scopeY + scopeH / 2 - (valIn / cs.opampVsat) * railPx;
      if (k1 === 0) ctx.moveTo(scopeX + k1, yIn);
      else ctx.lineTo(scopeX + k1, yIn);
    }
    ctx.stroke();

    /* Trazado de señal de salida Vout(t) con recorte (clipping) en ámbar */
    ctx.beginPath();
    ctx.strokeStyle = isSaturated ? "#f59e0b" : "#10b981";
    ctx.lineWidth = 2.5;
    ctx.shadowColor = ctx.strokeStyle;
    ctx.shadowBlur = 6;

    for (var k2 = 0; k2 <= scopeW; k2++) {
      var tOut = (k2 / scopeW) * 4 * Math.PI + simClock * 4;
      var idealOut = Av * cs.opampVinAmp * Math.sin(tOut);
      /* Recorte matemático estricto en rieles ±Vsat */
      var actualOut = Math.max(-cs.opampVsat, Math.min(cs.opampVsat, idealOut));
      var yOut = scopeY + scopeH / 2 - (actualOut / cs.opampVsat) * railPx;
      if (k2 === 0) ctx.moveTo(scopeX + k2, yOut);
      else ctx.lineTo(scopeX + k2, yOut);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;

    /* Indicador de estado de recorte en pantalla */
    ctx.fillStyle = isSaturated ? "#f43f5e" : "#10b981";
    ctx.font = "bold 10px Plus Jakarta Sans, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(isSaturated ? "⚠ SATURATED (CLIPPING)" : "✓ LINEAR REGIME", scopeX + 10, scopeY + 16);

    /* Actualizar tarjetas en el DOM */
    var domAv = document.getElementById("telemetry-opamp-av");
    var domVin = document.getElementById("telemetry-opamp-vin");
    var domVtheory = document.getElementById("telemetry-opamp-vtheory");
    var domVoutPk = document.getElementById("telemetry-opamp-vout");
    var domStatus = document.getElementById("telemetry-opamp-status");
    if (domAv) domAv.textContent = Av.toFixed(2);
    if (domVin) domVin.textContent = cs.opampVinAmp.toFixed(2) + " V";
    if (domVtheory) domVtheory.textContent = vIdealPeak.toFixed(2) + " V";
    if (domVoutPk) domVoutPk.textContent = vActualPeak.toFixed(2) + " V";
    if (domStatus) {
      domStatus.innerHTML = '<span class="regime-badge ' + (isSaturated ? "regime-saturated" : "regime-linear") + '">' + (isSaturated ? "SATURATED" : "LINEAR") + '</span>';
    }
  }

  /* =========================================================================
     E. Circuito DC Básico y Ley de Ohm (ohms-law / electron-flow)
     I = V / R  |  P = V * I  |  Animación de electrones libres
     ========================================================================= */
  function drawOhmsLawCircuit(ctx, w, h, cs) {
    var v = cs.voltage || 12;
    var r = cs.resistance || 100;
    var isClosed = cs.switchClosed;

    var current = isClosed ? (v / r) : 0;
    var power = current * v;
    var speed = isClosed ? Math.min(current * 40, 15) : 0;

    var padX = 60;
    var padY = 50;
    var rectW = w - 2 * padX;
    var rectH = h - 2 * padY;
    var perimeter = 2 * (rectW + rectH);

    ctx.clearRect(0, 0, w, h);

    /* Trazado de conductor */
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 14;
    ctx.lineJoin = "round";
    ctx.strokeRect(padX, padY, rectW, rectH);

    ctx.strokeStyle = "#0f172a";
    ctx.lineWidth = 10;
    ctx.strokeRect(padX, padY, rectW, rectH);

    /* Batería DC */
    var batX = padX;
    var batY = padY + rectH / 2;

    ctx.fillStyle = "#1e293b";
    ctx.fillRect(batX - 16, batY - 24, 32, 48);
    ctx.fillStyle = "#3b82f6";
    ctx.fillRect(batX - 14, batY - 22, 28, 20);
    ctx.fillStyle = "#ef4444";
    ctx.fillRect(batX - 14, batY + 2, 28, 20);

    ctx.fillStyle = "white";
    ctx.font = "bold 10px Plus Jakarta Sans, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("−", batX, batY - 8);
    ctx.fillText("+", batX, batY + 16);

    ctx.fillStyle = "#94a3b8";
    ctx.font = "10px Plus Jakarta Sans, sans-serif";
    ctx.fillText("DC SOURCE (" + v.toFixed(1) + "V)", batX, batY + 38);

    /* Componente de carga (Resistor) */
    var bulbX = padX + rectW;
    var bulbY = padY + rectH / 2;

    ctx.fillStyle = "#334155";
    ctx.fillRect(bulbX - 14, bulbY - 30, 28, 60);
    ctx.strokeStyle = power > 1.0 ? "#ef4444" : "#94a3b8";
    ctx.lineWidth = 2;
    ctx.strokeRect(bulbX - 14, bulbY - 30, 28, 60);

    ctx.fillStyle = "white";
    ctx.font = "bold 10px Plus Jakarta Sans, sans-serif";
    ctx.fillText(r + " Ω", bulbX, bulbY + 4);

    ctx.fillStyle = power > 1.0 ? "#f87171" : "#94a3b8";
    ctx.font = "9px Plus Jakarta Sans, sans-serif";
    ctx.fillText("P = " + power.toFixed(2) + " W", bulbX, bulbY + 45);

    /* Interruptor */
    var swX = padX + rectW / 2;
    var swY = padY;

    ctx.fillStyle = "#0b1329";
    ctx.fillRect(swX - 25, swY - 8, 50, 16);

    ctx.strokeStyle = isClosed ? "#10b981" : "#f43f5e";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(swX - 16, swY, 4, 0, Math.PI * 2);
    ctx.arc(swX + 16, swY, 4, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(swX - 16, swY);
    if (isClosed) {
      ctx.lineTo(swX + 16, swY);
    } else {
      ctx.lineTo(swX + 12, swY - 14);
    }
    ctx.stroke();

    /* Panel de telemetría inferior */
    var infoX = padX + rectW / 2;
    var infoY = padY + rectH;

    ctx.fillStyle = "#0b1329";
    ctx.fillRect(infoX - 80, infoY - 14, 160, 28);
    ctx.strokeStyle = "#334155";
    ctx.lineWidth = 1;
    ctx.strokeRect(infoX - 80, infoY - 14, 160, 28);

    ctx.fillStyle = isClosed ? "#10b981" : "#94a3b8";
    ctx.font = "bold 11px Plus Jakarta Sans, sans-serif";
    ctx.fillText("I = " + (current * 1000).toFixed(1) + " mA (" + current.toFixed(3) + " A)", infoX, infoY + 4);

    /* Partículas Electrónicas */
    function getPointOnCircuit(dist) {
      var d = dist % perimeter;
      if (d < 0) d += perimeter;

      if (d < rectW) {
        return { x: padX + d, y: padY };
      } else if (d < rectW + rectH) {
        return { x: padX + rectW, y: padY + (d - rectW) };
      } else if (d < 2 * rectW + rectH) {
        return { x: padX + rectW - (d - rectW - rectH), y: padY + rectH };
      } else {
        return { x: padX, y: padY + rectH - (d - 2 * rectW - rectH) };
      }
    }

    mainElectrons.forEach(function(e) {
      if (isClosed) {
        e.dist += speed;
      }
      var pt = getPointOnCircuit(e.dist);

      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = "#60a5fa";
      ctx.fill();

      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 7, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(96, 165, 250, 0.25)";
      ctx.fill();
    });

    /* Actualizar telemetría DOM */
    var domV = document.getElementById("telemetry-v");
    var domI = document.getElementById("telemetry-i");
    var domP = document.getElementById("telemetry-p");
    var domState = document.getElementById("telemetry-state");
    if (domV) domV.textContent = v.toFixed(1) + " V";
    if (domI) domI.textContent = (current * 1000).toFixed(1) + " mA";
    if (domP) domP.textContent = power.toFixed(2) + " W";
    if (domState) domState.textContent = isClosed ? "CLOSED" : "OPEN";
  }

  return {
    start: start,
    stop: stop
  };
})();

/* Enrutador de compatibilidad para inicio de simulación */
function startCircuitSimulation(labType) {
  SimulatorEngine.start(labType);
}


/* ============================================
   13. NAVEGACIÓN PASO A PASO
   ============================================ */

function goToNextStep() {
  var steps = getActiveSteps();
  if (AppState.currentStepIndex < steps.length - 1) {
    AppState.currentStepIndex++;
    renderCurrentStep();
    renderOutline();
    updateNavButtons();
    scrollMainToTop();
  }
}

function goToPrevStep() {
  if (AppState.currentStepIndex > 0) {
    AppState.currentStepIndex--;
    renderCurrentStep();
    renderOutline();
    updateNavButtons();
    scrollMainToTop();
  }
}

function updateNavButtons() {
  var steps = getActiveSteps();
  var btnPrev = document.getElementById("btn-prev");
  var btnNext = document.getElementById("btn-next");
  if (btnPrev) btnPrev.disabled = (AppState.currentStepIndex === 0);
  if (btnNext) btnNext.disabled = (AppState.currentStepIndex >= steps.length - 1);
}

function scrollMainToTop() {
  var main = document.getElementById("main-content");
  if (main) main.scrollTo({ top: 0, behavior: "smooth" });
}


/* ============================================
   14. PROGRESO Y GAMIFICACIÓN
   ============================================ */

function addXP(amount) {
  AppState.progress.xp += amount;
  saveProgress();
  updateStatsDisplay();
}

function completeLesson(lessonId) {
  if (isLessonCompleted(lessonId)) return;
  AppState.progress.completedLessons.push(lessonId);
  saveProgress();
}

function updateStreak() {
  var today = new Date().toDateString();
  var last = AppState.progress.lastVisit;
  if (last === today) return;

  if (last) {
    var diff = Math.floor((new Date(today) - new Date(last)) / 86400000);
    AppState.progress.streak = (diff === 1) ? AppState.progress.streak + 1 : 1;
  } else {
    AppState.progress.streak = 1;
  }

  AppState.progress.lastVisit = today;
  saveProgress();
}

function updateStatsDisplay() {
  var xpVal = AppState.progress.xp || 0;
  var streakVal = AppState.progress.streak || 1;

  var userXp = document.getElementById("user-xp");
  var xpText = document.getElementById("xp-text");
  var sidebarXp = document.getElementById("sidebar-xp-earned");

  if (userXp) userXp.textContent = xpVal;
  if (xpText) xpText.textContent = xpVal + " XP";
  if (sidebarXp) sidebarXp.textContent = xpVal + " XP";

  var streakCount = document.getElementById("streak-count");
  var streakText = document.getElementById("streak-text");
  if (streakCount) streakCount.textContent = streakVal;
  if (streakText) streakText.textContent = streakVal + (streakVal === 1 ? " Day" : " Days");
}


/* ============================================
   15. INICIALIZACIÓN DE ICONOS DE CABECERA
   ============================================ */

function initHeaderIcons() {
  var logoIcon = document.getElementById("logo-icon-svg");
  var xpIcon = document.getElementById("xp-icon-svg");
  var streakIcon = document.getElementById("streak-icon-svg");
  var soundIcon = document.getElementById("sound-icon-wrapper");
  var toolIcon = document.getElementById("tool-icon-svg");
  var modalTitleIcon = document.getElementById("modal-title-icon");

  if (logoIcon) logoIcon.innerHTML = ICONS.zap;
  if (xpIcon) xpIcon.innerHTML = ICONS.star;
  if (streakIcon) streakIcon.innerHTML = ICONS.flame;
  if (soundIcon) soundIcon.innerHTML = SoundEngine.isMuted() ? ICONS.volumeOff : ICONS.volumeOn;
  if (toolIcon) toolIcon.innerHTML = ICONS.zap;
  if (modalTitleIcon) modalTitleIcon.innerHTML = ICONS.zap;
}


/* ============================================
   16. CONFIGURACIÓN DE EVENTOS Y MODALES
   ============================================ */

function setupNavigationEvents() {
  var logoBtn = document.getElementById("btn-logo-home");
  if (logoBtn) {
    logoBtn.addEventListener("click", function() {
      SoundEngine.playClick();
      showDashboardView();
    });
  }

  var btnPrev = document.getElementById("btn-prev");
  var btnNext = document.getElementById("btn-next");
  var btnOutline = document.getElementById("btn-outline");

  if (btnPrev) {
    btnPrev.addEventListener("click", function() {
      SoundEngine.playClick();
      goToPrevStep();
    });
  }

  if (btnNext) {
    btnNext.addEventListener("click", function() {
      SoundEngine.playClick();
      goToNextStep();
    });
  }

  if (btnOutline) {
    btnOutline.addEventListener("click", function() {
      SoundEngine.playClick();
      var sidebar = document.getElementById("sidebar");
      if (!sidebar) return;
      if (window.innerWidth <= 900) {
        sidebar.classList.toggle("open");
      } else {
        sidebar.classList.toggle("closed");
      }
    });
  }

  var openCheatBtn = document.getElementById("btn-open-cheatsheet");
  var closeCheatBtn = document.getElementById("btn-close-cheatsheet");
  var modal = document.getElementById("modal-cheatsheet") || document.getElementById("cheatsheet-modal");

  if (openCheatBtn && modal) {
    openCheatBtn.addEventListener("click", function() {
      SoundEngine.playClick();
      modal.classList.add("open");
      renderMath(modal);
    });
  }

  if (closeCheatBtn && modal) {
    closeCheatBtn.addEventListener("click", function() {
      SoundEngine.playClick();
      modal.classList.remove("open");
    });
  }

  if (modal) {
    modal.addEventListener("click", function(e) {
      if (e.target === modal) {
        modal.classList.remove("open");
      }
    });
  }

  var soundBtn = document.getElementById("btn-sound-toggle");
  if (soundBtn) {
    soundBtn.addEventListener("click", function() {
      var muted = SoundEngine.toggleMute();
      this.classList.toggle("muted", muted);
      var soundIcon = document.getElementById("sound-icon-wrapper");
      var soundText = document.getElementById("sound-text");
      if (soundIcon) soundIcon.innerHTML = muted ? ICONS.volumeOff : ICONS.volumeOn;
      if (soundText) soundText.textContent = muted ? "Sound OFF" : "Sound ON";
    });
    if (SoundEngine.isMuted()) {
      soundBtn.classList.add("muted");
      var soundText = document.getElementById("sound-text");
      if (soundText) soundText.textContent = "Sound OFF";
    }
  }

  document.addEventListener("keydown", function(e) {
    if (AppState.currentView === "dashboard") return;

    if (e.key === "Escape") {
      if (modal && modal.classList.contains("open")) {
        modal.classList.remove("open");
        return;
      }
      var tutorDrawer = document.getElementById("tutor-drawer");
      if (tutorDrawer && tutorDrawer.classList.contains("open")) {
        if (typeof TutorEngine !== "undefined") TutorEngine.closeDrawer();
        return;
      }
    }

    if (e.key === "ArrowRight") { goToNextStep(); }
    if (e.key === "ArrowLeft") { goToPrevStep(); }

    if (e.key === "Enter") {
      var tutorInput = document.getElementById("tutor-input-field");
      if (tutorInput && document.activeElement === tutorInput) {
        return; // Allow tutor input to handle enter
      }

      e.preventDefault();

      var continueBtn = document.querySelector(".btn-continue");
      if (continueBtn && continueBtn.style.display !== "none" && continueBtn.offsetParent !== null) {
        continueBtn.click();
        return;
      }

      var submitBtn = document.querySelector(".quiz-actions .btn-primary");
      if (submitBtn && !submitBtn.disabled && submitBtn.style.display !== "none") {
        submitBtn.click();
        return;
      }

      var flashcard = document.querySelector(".flashcard-card");
      if (flashcard) {
        flashcard.click();
        return;
      }
    }

    if (e.key === " " || e.code === "Space") {
      var tutorInput = document.getElementById("tutor-input-field");
      if (tutorInput && document.activeElement === tutorInput) {
        return; // Allow typing space in tutor input
      }
      var card = document.querySelector(".flashcard-card");
      if (card) {
        e.preventDefault();
        card.click();
      }
    }

    var numKey = parseInt(e.key, 10);
    if (numKey >= 1 && numKey <= 4) {
      var tutorInput = document.getElementById("tutor-input-field");
      if (tutorInput && document.activeElement === tutorInput) {
        return; // Allow typing numbers in tutor input
      }
      var quizOptions = document.querySelectorAll(".quiz-option:not(.disabled)");
      if (quizOptions.length > 0 && numKey <= quizOptions.length) {
        quizOptions[numKey - 1].click();
      }
    }
  });
}


/* ============================================
   17. GESTIÓN DEL ASISTENTE ACADÉMICO (TUTOR)
   ============================================ */

function setupTutorDrawerEvents() {
  var openBtn = document.getElementById("btn-open-tutor");
  var closeBtn = document.getElementById("btn-close-tutor");
  var overlay = document.getElementById("tutor-overlay");
  var input = document.getElementById("tutor-input-field");
  var sendBtn = document.getElementById("btn-send-tutor");
  var thread = document.getElementById("tutor-messages-thread");
  var suggestedPills = document.querySelectorAll(".suggested-pill");

  if (openBtn) {
    openBtn.addEventListener("click", function() {
      SoundEngine.playClick();
      if (typeof TutorEngine !== "undefined") {
        TutorEngine.toggleDrawer();
        if (input) setTimeout(function() { input.focus(); }, 150);
      }
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", function() {
      SoundEngine.playClick();
      if (typeof TutorEngine !== "undefined") TutorEngine.closeDrawer();
    });
  }

  if (overlay) {
    overlay.addEventListener("click", function() {
      if (typeof TutorEngine !== "undefined") TutorEngine.closeDrawer();
    });
  }

  var modeBtns = document.querySelectorAll(".tutor-mode-btn");
  modeBtns.forEach(function(btn) {
    btn.addEventListener("click", function() {
      SoundEngine.playClick();
      var mode = this.getAttribute("data-mode") || "auto";
      modeBtns.forEach(function(b) { b.classList.remove("active"); });
      this.classList.add("active");
      if (typeof TutorEngine !== "undefined") {
        TutorEngine.setMode(mode);
      }
    });
  });

  suggestedPills.forEach(function(pill) {
    pill.addEventListener("click", function() {
      var query = this.getAttribute("data-q") || this.textContent;
      if (input) input.value = query;
      handleSendTutorMessage();
    });
  });

  if (sendBtn) {
    sendBtn.addEventListener("click", handleSendTutorMessage);
  }

  if (input) {
    input.addEventListener("keydown", function(e) {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSendTutorMessage();
      }
    });
  }

  async function handleSendTutorMessage() {
    if (!input || typeof TutorEngine === "undefined") return;
    var query = input.value.trim();
    if (!query) return;

    input.value = "";
    SoundEngine.playClick();

    /* 1. Mensaje de usuario */
    var userMsg = document.createElement("div");
    userMsg.className = "tutor-message msg-user";
    userMsg.innerHTML = '<div class="msg-avatar">👤</div><div class="msg-bubble"><p>' + escapeHtml(query) + '</p></div>';
    thread.appendChild(userMsg);
    thread.scrollTop = thread.scrollHeight;

    /* 2. Burbuja de carga */
    var loadingMsg = document.createElement("div");
    loadingMsg.className = "tutor-message msg-assistant";
    loadingMsg.innerHTML = '<div class="msg-avatar">⚡</div><div class="msg-bubble"><p class="tutor-loading-dots">Consulting textbook corpus...</p></div>';
    thread.appendChild(loadingMsg);
    thread.scrollTop = thread.scrollHeight;

    /* 3. Consulta al motor híbrido */
    try {
      var result = await TutorEngine.ask(query);
      loadingMsg.innerHTML = '<div class="msg-avatar">⚡</div><div class="msg-bubble">' + result.html + '</div>';
      renderMath(loadingMsg);
    } catch (err) {
      loadingMsg.innerHTML = '<div class="msg-avatar">⚡</div><div class="msg-bubble"><p>Error: ' + err.message + '</p></div>';
      SoundEngine.playError();
    }

    thread.scrollTop = thread.scrollHeight;
  }
}

function escapeHtml(text) {
  var div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}


/* ============================================
   18. INICIALIZACIÓN DE LA APLICACIÓN
   ============================================ */

function initApp() {
  initHeaderIcons();
  resetProgress();

  showLessonView("electronics-fundamentals", "lesson-1-1");

  setupNavigationEvents();
  setupTutorDrawerEvents();
}

document.addEventListener("DOMContentLoaded", initApp);
