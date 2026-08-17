/* ============================================
   ElectronFlow — tutor_knowledge_base.js
   
   Base de Conocimiento Indexada con Fórmulas LaTeX (KaTeX 2D):
   Este archivo proporciona respuestas deterministas locales ($0 de costo en tokens)
   para el asistente de IA, fundamentadas rigurosamente en la bibliografía estándar:
   - Alexander & Sadiku: "Fundamentals of Electric Circuits" (7ma Edición)
   - Horowitz & Hill: "The Art of Electronics: The x-Chapters" (AoE / x-Chapters)
   - M. Morris Mano: "Digital Design" (6ta Edición)
   ============================================ */

/* 
   Estructura de la base de conocimiento:
   Cada elemento contiene palabras clave en minúsculas para coincidencia semántica rápida,
   citas exactas del libro, resumen técnico, fórmulas matemáticas en LaTeX KaTeX y
   puntos clave de diseño práctico de ingeniería.
*/

var TUTOR_KNOWLEDGE_BASE = [
  /* ==========================================================
     FASE 1: FUNDAMENTOS ABSOLUTOS Y LEYES DE CD (MÓDULOS 1.1 - 1.4)
     ========================================================== */
  {
    keywords: ["what is electricity", "charge", "coulomb", "electron", "drift velocity", "current definition", "voltage definition", "potential difference", "carga", "electricidad"],
    book: "Fundamentals of Electric Circuits (Alexander & Sadiku)",
    section: "Chapter 1.1–1.4 (pp. 2–10)",
    topic: "Electric Charge, Current & Potential Difference",
    summary: "Electric charge is an intrinsic property of subatomic matter. Current is the time rate of charge flow through a cross-sectional area, and voltage is the energy required to move a unit charge through an element.",
    equations: [
      "$$q(t) = \\int_{-\\infty}^{t} i(\\tau) d\\tau \\quad [\\text{Coulombs, C}]$$",
      "$$i(t) = \\frac{dq(t)}{dt} \\quad [\\text{Amperes, A} = \\text{C/s}]$$",
      "$$v(t) = \\frac{dw(t)}{dq} \\quad [\\text{Volts, V} = \\text{J/C}]$$",
      "$$e = 1.6022 \\times 10^{-19} \\text{ C (Charge of one electron)}$$"
    ],
    keyPoints: [
      "Conductors possess a high density of free valence electrons that drift under an applied electric field.",
      "Direct Current (DC) remains constant over time; Alternating Current (AC) varies sinusoidally.",
      "Voltage is the cause (electrical potential pressure), and Current is the resulting physical effect."
    ]
  },
  {
    keywords: ["ohm's law", "ohms law", "voltage current resistance", "v=ir", "calculate voltage", "calculate current", "calculate resistance", "conductance", "resistor"],
    book: "Fundamentals of Electric Circuits (Alexander & Sadiku)",
    section: "Chapter 2.2 (pp. 30–35)",
    topic: "Ohm's Law & Physical Resistance",
    summary: "Ohm's law states that the voltage across a linear conducting resistor is directly proportional to the current flowing through it. The constant of proportionality R is resistance in Ohms (Ω).",
    equations: [
      "$$V = I \\cdot R \\quad [\\text{Volts, V}]$$",
      "$$I = \\frac{V}{R} \\quad [\\text{Amperes, A}] \\quad\\text{and}\\quad R = \\frac{V}{I} \\quad [\\Omega]$$",
      "$$G = \\frac{1}{R} = \\frac{I}{V} \\quad [\\text{Conductance in Siemens, S}]$$"
    ],
    keyPoints: [
      "Linear resistor: Produces a straight-line IV characteristic curve passing through the origin.",
      "Short circuit: An element with resistance approaching zero ($R = 0\\,\\Omega$), yielding zero voltage ($V = 0\\text{ V}$) for any finite current.",
      "Open circuit: An element with resistance approaching infinity ($R = \\infty\\,\\Omega$), yielding zero current ($I = 0\\text{ A}$) for any finite voltage."
    ]
  },
  {
    keywords: ["power", "watt's law", "watts law", "heat dissipation", "p=vi", "i^2r", "v^2/r", "power rating", "joule heating", "derating"],
    book: "Fundamentals of Electric Circuits (Alexander & Sadiku)",
    section: "Chapter 1.5 & 2.2 (pp. 10–13, 33–34)",
    topic: "Electrical Power and Energy Dissipation",
    summary: "Power is the time rate of expending or absorbing energy, measured in Watts (W). In a resistor, electrical energy is converted irreversibly into thermal heat dissipation via Joule heating.",
    equations: [
      "$$P = V \\cdot I \\quad [\\text{Watts, W}]$$",
      "$$P = I^2 R = \\frac{V^2}{R} \\quad [\\text{Resistive Power Dissipation}]$$",
      "$$w = \\int_{0}^{t} p(\\tau) d\\tau \\quad [\\text{Energy in Joules, J}]$$"
    ],
    keyPoints: [
      "Passive Sign Convention: If current enters the positive (+) terminal of an element, power is absorbed ($P > 0$). If entering the negative (-) terminal, power is delivered/supplied ($P < 0$).",
      "Conservation of Energy (Tellegen's Theorem): The algebraic sum of power in any closed circuit at any instant is identically zero ($\\sum P = 0$).",
      "Hardware Derating Rule: Always operate resistors at $\\le 50\\%$ of their rated wattage (e.g., use a $0.5\\text{W}$ resistor for a $0.2\\text{W}$ dissipation)."
    ]
  },
  {
    keywords: ["kcl", "kirchhoff's current law", "node law", "junction law", "current entering node", "charge conservation"],
    book: "Fundamentals of Electric Circuits (Alexander & Sadiku)",
    section: "Chapter 2.4 (pp. 37–40)",
    topic: "Kirchhoff's Current Law (KCL)",
    summary: "Kirchhoff's Current Law states that the algebraic sum of currents entering a node (or a closed boundary) is zero. It is a direct physical consequence of the Conservation of Electric Charge.",
    equations: [
      "$$\\sum I_{\\text{in}} = \\sum I_{\\text{out}}$$",
      "$$\\sum_{k=1}^{N} i_k(t) = 0 \\quad \\text{(at every node or closed surface)}$$"
    ],
    keyPoints: [
      "Charge cannot accumulate or vanish at a discrete electrical node.",
      "KCL applies to any generalized closed surface (supernode) as well as individual wiring junction nodes.",
      "KCL provides the mathematical foundation for Nodal Analysis."
    ]
  },
  {
    keywords: ["kvl", "kirchhoff's voltage law", "loop law", "voltage drop sum", "energy conservation"],
    book: "Fundamentals of Electric Circuits (Alexander & Sadiku)",
    section: "Chapter 2.4 (pp. 40–44)",
    topic: "Kirchhoff's Voltage Law (KVL)",
    summary: "Kirchhoff's Voltage Law states that the algebraic sum of all voltages around any closed loop or mesh is identically zero. It is a direct consequence of the Conservation of Energy in a conservative electric field.",
    equations: [
      "$$\\sum V_{\\text{rises}} = \\sum V_{\\text{drops}}$$",
      "$$\\sum_{m=1}^{M} v_m(t) = 0 \\quad \\text{(around any closed loop path)}$$"
    ],
    keyPoints: [
      "Energy gained by a charge traversing potential rises equals the energy dissipated traversing potential drops.",
      "KVL is independent of the circuit element types (linear, non-linear, active, or passive).",
      "KVL provides the mathematical foundation for Mesh Analysis."
    ]
  },
  {
    keywords: ["voltage divider", "voltage division", "series resistors", "loading effect", "potentiometer"],
    book: "Fundamentals of Electric Circuits (Alexander & Sadiku)",
    section: "Chapter 2.5 (pp. 44–47)",
    topic: "Series Resistors & Voltage Division",
    summary: "For series-connected resistors across a total voltage $V_{\\text{in}}$, the current is identical through all elements, and voltages divide in direct proportion to individual resistances.",
    equations: [
      "$$R_{\\text{eq}} = R_1 + R_2 + \\dots + R_n = \\sum_{k=1}^n R_k \\quad [\\Omega]$$",
      "$$V_{\\text{out}} = V_{\\text{in}} \\cdot \\left(\\frac{R_2}{R_1 + R_2}\\right) \\quad [\\text{Voltage Divider Rule}]$$"
    ],
    keyPoints: [
      "If $R_1 = R_2$, the voltage divides exactly in half: $V_{\\text{out}} = V_{\\text{in}} / 2$.",
      "Loading Effect: Connecting a finite load resistance $R_L$ in parallel with $R_2$ draws current and drags $V_{\\text{out}}$ down unless buffered by an op-amp follower ($A_v = 1$).",
      "Series equivalent resistance is always strictly greater than the largest individual resistor in the chain."
    ]
  },
  {
    keywords: ["current divider", "current division", "parallel resistors", "parallel equivalent"],
    book: "Fundamentals of Electric Circuits (Alexander & Sadiku)",
    section: "Chapter 2.6 (pp. 47–52)",
    topic: "Parallel Resistors & Current Division",
    summary: "For parallel-connected resistors connected across a total current $I_{\\text{total}}$, the voltage across all branches is identical, and current divides inversely with branch resistance.",
    equations: [
      "$$\\frac{1}{R_{\\text{eq}}} = \\frac{1}{R_1} + \\frac{1}{R_2} \\implies R_{\\text{eq}} = \\frac{R_1 \\cdot R_2}{R_1 + R_2} \\quad [\\Omega]$$",
      "$$I_1 = I_{\\text{total}} \\cdot \\left(\\frac{R_2}{R_1 + R_2}\\right) \\quad\\text{and}\\quad I_2 = I_{\\text{total}} \\cdot \\left(\\frac{R_1}{R_1 + R_2}\\right) \\quad [\\text{A}]$$"
    ],
    keyPoints: [
      "The current through branch 1 features the opposite resistor $R_2$ in the numerator of the divider formula.",
      "Parallel equivalent resistance is always strictly smaller than the smallest branch resistor.",
      "For $N$ identical resistors $R$ in parallel, $R_{\\text{eq}} = R / N$."
    ]
  },
  {
    keywords: ["topologies", "branches", "nodes", "loops", "ground", "earth ground", "chassis ground", "0v reference"],
    book: "Fundamentals of Electric Circuits (Alexander & Sadiku)",
    section: "Chapter 2.3 & 3.2 (pp. 35–37, 81–82)",
    topic: "Circuit Topologies, Graph Elements & Ground Reference",
    summary: "A circuit network graph consists of branches $b$, nodes $n$, and independent loops $l$. Ground represents the reference datum node assigned an electrical potential of 0 Volts.",
    equations: [
      "$$b = l + n - 1 \\quad [\\text{Fundamental Network Topology Theorem}]$$",
      "$$l = b - n + 1 \\quad [\\text{Number of Independent Mesh Equations}]$$",
      "$$V_{\\text{node}} = v_n - v_{\\text{ground}} = v_n - 0 = v_n \\quad [\\text{V}]$$"
    ],
    keyPoints: [
      "Earth Ground: A physical safety connection to the soil via a copper rod to divert fault currents.",
      "Signal / Chassis Ground: A common low-impedance copper return path that establishes the $0\\text{ V}$ baseline for signal voltages.",
      "Every circuit requires exactly 1 datum ground node, leaving $(n - 1)$ independent node voltage unknowns."
    ]
  },

  /* ==========================================================
     FASE 2: ANÁLISIS SISTEMÁTICO DE REDES Y TEOREMAS (MÓDULOS 1.5 - 1.8)
     ========================================================== */
  {
    keywords: ["nodal analysis", "supernode", "node voltages", "reference node", "kcl method"],
    book: "Fundamentals of Electric Circuits (Alexander & Sadiku)",
    section: "Chapter 3.2 & 3.3 (pp. 81–92)",
    topic: "Nodal Analysis & Supernodes",
    summary: "Nodal analysis uses non-reference node voltages as circuit variables by applying KCL to non-reference nodes. Branch currents are expressed via Ohm's law as potential differences divided by branch resistance.",
    equations: [
      "$$i = \\frac{v_{\\text{from}} - v_{\\text{to}}}{R} \\quad [\\text{Branch Current Equation}]$$",
      "$$\\sum_{k} \\frac{v_j - v_k}{R_{jk}} = I_{\\text{source}} \\quad [\\text{KCL at Node } j]$$",
      "$$v_2 - v_1 = V_{\\text{source}} \\quad [\\text{Supernode Constraint Equation}]$$"
    ],
    keyPoints: [
      "A circuit with $n$ nodes requires exactly $(n - 1)$ independent linear equations.",
      "Supernode: Formed when an ideal voltage source is connected between two non-reference nodes. Enclose the source in a generalized boundary, apply KCL to the outer perimeter, and write 1 internal constraint equation.",
      "Works universally on both planar and non-planar circuits."
    ]
  },
  {
    keywords: ["mesh analysis", "supermesh", "mesh currents", "loop analysis", "kvl method", "planar circuits"],
    book: "Fundamentals of Electric Circuits (Alexander & Sadiku)",
    section: "Chapter 3.4 & 3.5 (pp. 93–103)",
    topic: "Mesh Analysis & Supermeshes",
    summary: "Mesh analysis applies KVL around planar circuit meshes using assigned circulating mesh currents. It is strictly applicable only to planar circuits (circuits drawable with zero crossing wires).",
    equations: [
      "$$(R_1 + R_2) i_1 - R_2 i_2 = V_{\\text{source}} \\quad [\\text{Mesh Matrix Row}]$$",
      "$$i_2 - i_1 = I_{\\text{source}} \\quad [\\text{Supermesh Constraint Equation}]$$"
    ],
    keyPoints: [
      "Mesh: An elementary loop that contains no other internal closed loops.",
      "Supermesh: Formed when an ideal current source is shared between two adjacent meshes. Bypass the current source branch to write one combined KVL loop, supplemented by the source constraint equation.",
      "Non-planar circuits cannot be analyzed using mesh analysis; nodal analysis must be used instead."
    ]
  },
  {
    keywords: ["superposition", "linearity", "source transformation", "independent sources", "homogeneity"],
    book: "Fundamentals of Electric Circuits (Alexander & Sadiku)",
    section: "Chapter 4.1–4.4 (pp. 126–133)",
    topic: "Linearity, Superposition & Source Transformations",
    summary: "The Superposition theorem states that the voltage or current through any element in a linear bilateral network equals the algebraic sum of the individual responses produced by each independent source acting alone.",
    equations: [
      "$$V_{\\text{total}} = \\sum_{k=1}^N V_k \\quad\\text{and}\\quad I_{\\text{total}} = \\sum_{k=1}^N I_k$$",
      "$$V_s = I_s \\cdot R_s \\iff I_s = \\frac{V_s}{R_s} \\quad [\\text{Source Transformation Equivalence}]$$"
    ],
    keyPoints: [
      "Deactivating Voltage Sources: Set $V_s = 0\\text{ V} \\implies$ Replace with a zero-resistance Short Circuit (solid wire).",
      "Deactivating Current Sources: Set $I_s = 0\\text{ A} \\implies$ Replace with an infinite-resistance Open Circuit (cut branch).",
      "CRITICAL: Superposition cannot be applied directly to non-linear quantities like Power ($P \\ne P_1 + P_2$). Total current/voltage must be calculated first before computing $P = I^2 R$."
    ]
  },
  {
    keywords: ["thevenin", "thevenin's theorem", "thevenin equivalent", "vth", "rth", "norton", "norton equivalent", "in", "rn"],
    book: "Fundamentals of Electric Circuits (Alexander & Sadiku)",
    section: "Chapter 4.5–4.7 (pp. 133–147)",
    topic: "Thévenin's & Norton's Equivalent Circuits",
    summary: "Thévenin's theorem states that any linear two-terminal circuit can be replaced by an equivalent ideal voltage source $V_{\\text{Th}}$ in series with a resistor $R_{\\text{Th}}$. Norton's theorem replaces it with an equivalent current source $I_N$ in parallel with $R_{\\text{Th}}$.",
    equations: [
      "$$V_{\\text{Th}} = v_{oc} \\quad [\\text{Open-Circuit Voltage}]$$",
      "$$I_N = i_{sc} \\quad [\\text{Short-Circuit Current}]$$",
      "$$R_{\\text{Th}} = R_N = \\frac{v_{oc}}{i_{sc}} = R_{\\text{in}} \\quad [\\text{with independent sources turned off}]$$",
      "$$I_L = \\frac{V_{\\text{Th}}}{R_{\\text{Th}} + R_L} \\quad [\\text{Load Current}]$$"
    ],
    keyPoints: [
      "To find $R_{\\text{Th}}$ with independent sources only: Deactivate voltage sources (shorts) and current sources (opens), then calculate equivalent resistance looking into the terminals.",
      "Thévenin and Norton circuits are exact duals related by source transformation: $V_{\\text{Th}} = I_N R_{\\text{Th}}$.",
      "Simplifies complex multi-loop circuits into a simple 1-loop voltage divider for any connected load $R_L$."
    ]
  },
  {
    keywords: ["maximum power transfer", "matched load", "pmax", "efficiency", "impedance matching"],
    book: "Fundamentals of Electric Circuits (Alexander & Sadiku)",
    section: "Chapter 4.8 (pp. 147–150)",
    topic: "Maximum Power Transfer Theorem",
    summary: "Maximum power is delivered from a linear source to a resistive load when the load resistance $R_L$ exactly equals the internal Thévenin resistance $R_{\\text{Th}}$ of the driving network.",
    equations: [
      "$$R_L = R_{\\text{Th}} \\quad [\\text{Maximum Power Condition}]$$",
      "$$P_{\\text{max}} = \\frac{V_{\\text{Th}}^2}{4 R_{\\text{Th}}} \\quad [\\text{Watts, W}]$$",
      "$$\\eta = \\frac{P_{\\text{load}}}{P_{\\text{total}}} = \\frac{I^2 R_L}{I^2 (R_{\\text{Th}} + R_L)} = 50\\% \\quad [\\text{Efficiency at Max Power}]$$"
    ],
    keyPoints: [
      "At maximum power transfer, exactly half the total generated power is delivered to the load and half is dissipated internally as heat inside $R_{\\text{Th}}$.",
      "Vital in RF transmission lines, antennas, audio speakers, and sensor interfaces where maximizing signal power is paramount.",
      "Power utility grids operate at $R_L \\gg R_{\\text{Th}}$ to maximize electrical transmission efficiency ($\\eta > 95\\%$) rather than total power transfer."
    ]
  },

  /* ==========================================================
     FASE 3: COMPONENTES REACTIVOS PASIVOS (MÓDULOS 2.1 - 2.2)
     ========================================================== */
  {
    keywords: ["capacitor", "capacitance", "electric field", "dv/dt", "dielectric", "farad", "capacitive energy"],
    book: "Fundamentals of Electric Circuits (Alexander & Sadiku)",
    section: "Chapter 6.1–6.3 (pp. 214–226)",
    topic: "Capacitor Physics & Dynamic Laws",
    summary: "A capacitor stores energy in an electrostatic field between conductive plates separated by a dielectric. Current is proportional to the time rate of change of voltage.",
    equations: [
      "$$q(t) = C \\cdot v(t) \\implies i(t) = C \\frac{dv(t)}{dt} \\quad [\\text{Amperes, A}]$$",
      "$$v(t) = \\frac{1}{C}\\int_{t_0}^{t} i(\\tau) d\\tau + v(t_0) \\quad [\\text{Volts, V}]$$",
      "$$w(t) = \\frac{1}{2} C v^2(t) \\quad [\\text{Stored Electrostatic Energy in Joules, J}]$$",
      "$$C_{\\text{parallel}} = \\sum_{k=1}^n C_k \\quad\\text{and}\\quad \\frac{1}{C_{\\text{series}}} = \\sum_{k=1}^n \\frac{1}{C_k} \\quad [\\text{F}]$$"
    ],
    keyPoints: [
      "DC Steady-State: In DC where $dv/dt = 0$, capacitor current $i = 0$ (Acts as an Open Circuit).",
      "Voltage Continuity: The voltage across a capacitor cannot change instantaneously ($v(0^+) = v(0^-)$) because an instantaneous jump requires infinite current ($i = C(\\Delta V / 0) = \\infty$).",
      "Capacitances add in parallel (opposite to resistors)."
    ]
  },
  {
    keywords: ["inductor", "inductance", "magnetic field", "di/dt", "back emf", "henry", "flyback", "inductive kick"],
    book: "Fundamentals of Electric Circuits (Alexander & Sadiku)",
    section: "Chapter 6.4–6.5 (pp. 226–236)",
    topic: "Inductor Physics & Dynamic Laws",
    summary: "An inductor stores energy in a magnetic field generated by current flowing through a coil. Voltage is proportional to the time rate of change of current, opposing changes in current via Lenz's Law.",
    equations: [
      "$$\\lambda(t) = L \\cdot i(t) \\implies v(t) = L \\frac{di(t)}{dt} \\quad [\\text{Volts, V}]$$",
      "$$i(t) = \\frac{1}{L}\\int_{t_0}^{t} v(\\tau) d\\tau + i(t_0) \\quad [\\text{Amperes, A}]$$",
      "$$w(t) = \\frac{1}{2} L i^2(t) \\quad [\\text{Stored Magnetic Energy in Joules, J}]$$",
      "$$L_{\\text{series}} = \\sum_{k=1}^n L_k \\quad\\text{and}\\quad \\frac{1}{L_{\\text{parallel}}} = \\sum_{k=1}^n \\frac{1}{L_k} \\quad [\\text{H}]$$"
    ],
    keyPoints: [
      "DC Steady-State: In DC where $di/dt = 0$, inductor voltage $v = 0$ (Acts as a Short Circuit / solid wire).",
      "Current Continuity: The current through an inductor cannot change instantaneously ($i(0^+) = i(0^-)$).",
      "Inductive Flyback: Abruptly interrupting current ($di/dt \\to -\\infty$) generates a destructive high-voltage spike ($v = -L di/dt$) requiring a parallel flyback clamping diode."
    ]
  },

  /* ==========================================================
     FASE 4: CIRCUITOS TRANSITORIOS Y RESONANCIA (MÓDULOS 2.3 - 2.4)
     ========================================================== */
  {
    keywords: ["rc circuit", "time constant", "tau", "exponential charging", "transient", "step response", "5 tau", "discharging"],
    book: "Fundamentals of Electric Circuits (Alexander & Sadiku)",
    section: "Chapter 7.1–7.5 (pp. 252–299)",
    topic: "First-Order RC Transients & Time Constants",
    summary: "First-order RC circuits are governed by a first-order ordinary differential equation. When excited by a DC step input, voltages and currents transition exponentially characterized by the time constant $\\tau = RC$.",
    equations: [
      "$$\\tau = R \\cdot C \\quad [\\text{Time Constant in seconds, s}]$$",
      "$$v(t) = V_s + \\left(V_0 - V_s\\right)e^{-t/\\tau} = V_s\\left(1 - e^{-t/\\tau}\\right) \\quad [\\text{Step Charging, } V_0=0]$$",
      "$$v(t) = V_0 e^{-t/\\tau} \\quad [\\text{Natural Discharging}]$$",
      "$$t_r = \\tau \\ln(9) \\approx 2.197\\tau \\quad [10\\% \\text{ to } 90\\% \\text{ Rise Time}]$$"
    ],
    keyPoints: [
      "$1\\tau$: Capacitor reaches $1 - e^{-1} = 63.2\\%$ of final supply voltage.",
      "$3\\tau$: Capacitor reaches $1 - e^{-3} = 95.0\\%$ of final voltage.",
      "$5\\tau$: Capacitor reaches $1 - e^{-5} = 99.33\\%$, universally treated as steady state in hardware engineering."
    ]
  },
  {
    keywords: ["rlc circuit", "resonance", "damping", "overdamped", "critically damped", "underdamped", "natural frequency", "omega0", "alpha"],
    book: "Fundamentals of Electric Circuits (Alexander & Sadiku)",
    section: "Chapter 8.1–8.6 (pp. 312–359)",
    topic: "Second-Order RLC Circuits & Natural Resonance",
    summary: "Second-order circuits contain both $L$ and $C$ storage elements, leading to a second-order ODE with characteristic roots governed by undamped resonant frequency $\\omega_0$ and damping factor $\\alpha$.",
    equations: [
      "$$\\omega_0 = \\frac{1}{\\sqrt{L \\cdot C}} \\quad [\\text{Undamped Resonant Frequency in rad/s}]$$",
      "$$\\alpha_{\\text{series}} = \\frac{R}{2L} \\quad\\text{and}\\quad \\alpha_{\\text{parallel}} = \\frac{1}{2RC} \\quad [\\text{Damping Factor in } \\text{s}^{-1} / \\text{Np/s}]$$",
      "$$s_{1,2} = -\\alpha \\pm \\sqrt{\\alpha^2 - \\omega_0^2} \\quad [\\text{Characteristic Roots}]$$",
      "$$\\omega_d = \\sqrt{\\omega_0^2 - \\alpha^2} \\quad [\\text{Damped Natural Frequency}]$$"
    ],
    keyPoints: [
      "Overdamped ($\\alpha > \\omega_0$): Two distinct real negative roots. Sluggish exponential decay with zero ringing.",
      "Critically Damped ($\\alpha = \\omega_0$): Repeated real root $s = -\\alpha$. Fastest possible settling to equilibrium without voltage overshoot ($x(t) = (A_1 + A_2 t)e^{-\\alpha t}$).",
      "Underdamped ($\\alpha < \\omega_0$): Complex conjugate roots $s = -\\alpha \\pm j\\omega_d$. Oscillatory sinusoidal ringing decaying exponentially ($e^{-\\alpha t}\\cos\\omega_d t$)."
    ]
  },

  /* ==========================================================
     FASE 5: RÉGIMEN PERMANENTE SENOIDAL Y FASORES (MÓDULOS 3.1 - 3.2)
     ========================================================== */
  {
    keywords: ["phasor", "impedance", "ac circuits", "complex impedance", "j omega", "sinusoid", "euler", "eli the ice man", "reactance"],
    book: "Fundamentals of Electric Circuits (Alexander & Sadiku)",
    section: "Chapter 9.1–9.7 (pp. 368–416)",
    topic: "Phasors and AC Complex Impedance",
    summary: "Phasors transform time-domain sinusoidal differential equations into algebraic equations in the complex frequency domain using Euler's identity ($e^{j\\theta} = \\cos\\theta + j\\sin\\theta$).",
    equations: [
      "$$v(t) = V_m \\cos(\\omega t + \\phi) \\longleftrightarrow \\mathbf{V} = V_m \\angle \\phi = V_m e^{j\\phi} \\quad [\\text{Phasor Form}]$$",
      "$$\\mathbf{V} = \\mathbf{I} \\cdot \\mathbf{Z} \\quad [\\text{AC Ohm's Law in Phasor Domain}]$$",
      "$$\\mathbf{Z}_R = R \\angle 0^\\circ \\quad [\\Omega]$$",
      "$$\\mathbf{Z}_L = j\\omega L = \\omega L \\angle +90^\\circ \\quad [\\Omega]$$",
      "$$\\mathbf{Z}_C = \\frac{1}{j\\omega C} = -\\frac{j}{\\omega C} = \\frac{1}{\\omega C} \\angle -90^\\circ \\quad [\\Omega]$$"
    ],
    keyPoints: [
      "ELI the ICE man: In an Inductor (L), Voltage (E) leads Current (I) by $+90^\\circ$. In a Capacitor (C), Current (I) leads Voltage (E) by $+90^\\circ$.",
      "Impedances in series and parallel combine with identical algebraic rules as DC resistances.",
      "As frequency $\\omega \\to \\infty$, $|\\mathbf{Z}_L| \\to \\infty$ (open) and $|\\mathbf{Z}_C| \\to 0$ (short)."
    ]
  },
  {
    keywords: ["ac power", "real power", "reactive power", "apparent power", "complex power", "power factor", "var", "va", "watts", "power triangle", "power factor correction"],
    book: "Fundamentals of Electric Circuits (Alexander & Sadiku)",
    section: "Chapter 11.1–11.8 (pp. 456–503)",
    topic: "AC Power, Complex Power & Power Factor Correction",
    summary: "In AC circuits, power consists of Real Power P (doing useful work), Reactive Power Q (oscillating in magnetic/electric fields), and Apparent Power S. Power Factor represents the transmission efficiency.",
    equations: [
      "$$P = V_{\\text{rms}} I_{\\text{rms}} \\cos(\\theta_v - \\theta_i) \\quad [\\text{Real Power in Watts, W}]$$",
      "$$Q = V_{\\text{rms}} I_{\\text{rms}} \\sin(\\theta_v - \\theta_i) \\quad [\\text{Reactive Power in VAR}]$$",
      "$$S = |\\mathbf{S}| = V_{\\text{rms}} I_{\\text{rms}} = \\sqrt{P^2 + Q^2} \\quad [\\text{Apparent Power in VA}]$$",
      "$$\\mathbf{S} = \\mathbf{V}_{\\text{rms}} \\mathbf{I}_{\\text{rms}}^* = P + jQ \\quad [\\text{Complex Power in VA}]$$",
      "$$PF = \\cos(\\theta_v - \\theta_i) = \\frac{P}{S} \\quad [\\text{Power Factor, } 0 \\le PF \\le 1.0]$$",
      "$$C = \\frac{P(\\tan\\theta_1 - \\tan\\theta_2)}{\\omega V_{\\text{rms}}^2} \\quad [\\text{PF Correction Shunt Capacitor in Farads}]$$"
    ],
    keyPoints: [
      "Strict Engineering SI Units: Real Power in Watts (W), Reactive Power in Volt-Amperes Reactive (VAR), Apparent/Complex Power in Volt-Amperes (VA).",
      "Lagging Power Factor: Current lags voltage (inductive load, $+Q$). Leading Power Factor: Current leads voltage (capacitive load, $-Q$).",
      "Power Factor Correction: Placing shunt capacitor banks across inductive motor loads supplies local $-Q$, canceling lagging VARs and raising $PF \\to 1.0$ without changing real active power $P$."
    ]
  },

  /* ==========================================================
     FASE 6: FILTROS PASIVOS Y RESPUESTA EN FRECUENCIA (MÓDULO 3.3)
     ========================================================== */
  {
    keywords: ["filter", "passive filter", "low pass filter", "high pass filter", "band pass", "notch filter", "cutoff frequency", "fc", "bode plot", "decibels", "half power"],
    book: "Fundamentals of Electric Circuits (Alexander & Sadiku)",
    section: "Chapter 14.1–14.7 (pp. 612–662)",
    topic: "Passive Filters & Bode Frequency Response",
    summary: "Passive filters use resistor-capacitor networks to pass desired signal frequencies while attenuating unwanted frequency bands. The cutoff frequency $f_c$ marks the $-3\\text{ dB}$ half-power transition point.",
    equations: [
      "$$f_c = \\frac{1}{2\\pi R C} \\quad [\\text{Cutoff Frequency in Hertz, Hz}]$$",
      "$$\\mathbf{H}_{\\text{LPF}}(\\omega) = \\frac{1}{1 + j\\omega RC} = \\frac{1}{1 + j(\\omega / \\omega_c)} \\quad [\\text{Low-Pass Transfer Function}]$$",
      "$$\\mathbf{H}_{\\text{HPF}}(\\omega) = \\frac{j\\omega RC}{1 + j\\omega RC} = \\frac{j(\\omega / \\omega_c)}{1 + j(\\omega / \\omega_c)} \\quad [\\text{High-Pass Transfer Function}]$$",
      "$$|\\mathbf{H}(f_c)| = \\frac{1}{\\sqrt{2}} \\approx 0.7071 \\implies 20\\log_{10}\\left(\\frac{1}{\\sqrt{2}}\\right) = -3.01\\text{ dB} \\quad [\\text{Half-Power Point}]$$",
      "$$\\text{Roll-off Rate} = -20\\text{ dB/decade} = -6\\text{ dB/octave (per pole)}$$"
    ],
    keyPoints: [
      "Low-Pass Filter (LPF): Resistor in series, Capacitor to ground. Passes DC up to $f_c$; attenuates high frequencies.",
      "High-Pass Filter (HPF): Capacitor in series, Resistor to ground. Blocks DC offset; passes high frequencies above $f_c$.",
      "At $f = f_c$, the output power is exactly $50\\%$ of input power ($P_{\\text{out}} = \\frac{1}{2} P_{\\text{in}}$), and phase shift is $\\pm 45^\\circ$."
    ]
  },

  /* ==========================================================
     FASE 7: AMPLIFICADORES OPERACIONALES (MÓDULOS 4.1 - 4.2)
     ========================================================== */
  {
    keywords: ["op-amp", "op amp", "operational amplifier", "golden rules", "virtual ground", "virtual short", "open loop gain", "differential gain"],
    book: "Fundamentals of Electric Circuits (Alexander & Sadiku)",
    section: "Chapter 5.1–5.4 (pp. 174–184)",
    topic: "The Ideal Operational Amplifier & Golden Rules",
    summary: "An ideal op-amp is an active high-gain differential voltage amplifier. Under negative feedback in its linear operating region, it enforces the two fundamental Golden Rules.",
    equations: [
      "$$i_+ = i_- = 0 \\quad [\\text{Golden Rule 1: Zero Input Current, } R_{\\text{in}} = \\infty]$$",
      "$$v_+ = v_- \\quad [\\text{Golden Rule 2: Virtual Short under Negative Feedback}]$$",
      "$$v_{\\text{out}} = A(v_+ - v_-) \\quad [\\text{with Open-Loop Gain } A \\to \\infty]$$",
      "$$-V_{\\text{sat}} \\le v_{\\text{out}} \\le +V_{\\text{sat}} \\quad [\\text{Power Supply Rail Saturation Bounds}]$$"
    ],
    keyPoints: [
      "Virtual Ground: If the non-inverting terminal ($v_+$) is connected to $0\\text{ V}$ ground, negative feedback forces the inverting terminal ($v_-$) to also be at $0\\text{ V}$.",
      "Golden Rule 2 applies ONLY when negative feedback is present and the output is not saturated to the power rails ($\pm V_{\\text{sat}}$).",
      "Ideal Parameters: $R_{\\text{in}} = \\infty\\,\\Omega$, $R_{\\text{out}} = 0\\,\\Omega$, $A = \\infty$, $\\text{Bandwidth} = \\infty$, Offset Voltage $V_{os} = 0\\text{ V}$."
    ]
  },
  {
    keywords: ["inverting amplifier", "non-inverting amplifier", "voltage follower", "buffer", "op-amp gain", "summing amplifier", "difference amplifier"],
    book: "Fundamentals of Electric Circuits (Alexander & Sadiku)",
    section: "Chapter 5.4–5.8 (pp. 181–214)",
    topic: "Inverting, Non-Inverting & Buffer Amplifiers",
    summary: "By adding resistive negative feedback networks around an op-amp, precise linear amplifier stages are created whose closed-loop gain depends exclusively on external resistor ratios.",
    equations: [
      "$$A_{v\\text{(inv)}} = -\\frac{R_f}{R_1} \\implies v_{\\text{out}} = -\\left(\\frac{R_f}{R_1}\\right) v_{\\text{in}} \\quad [\\text{Inverting Amplifier Gain}]$$",
      "$$A_{v\\text{(non-inv)}} = 1 + \\frac{R_f}{R_1} \\implies v_{\\text{out}} = \\left(1 + \\frac{R_f}{R_1}\\right) v_{\\text{in}} \\quad [\\text{Non-Inverting Gain}]$$",
      "$$A_v = 1 \\quad [\\text{Unity-Gain Voltage Follower / Buffer, } R_f = 0, R_1 = \\infty]$$",
      "$$v_{\\text{out}} = -\\left(\\frac{R_f}{R_1}v_1 + \\frac{R_f}{R_2}v_2 + \\dots + \\frac{R_f}{R_n}v_n\\right) \\quad [\\text{Summing Amplifier}]$$"
    ],
    keyPoints: [
      "Inverting Amplifier: Provides a $180^\\circ$ phase inversion (negative gain); input impedance equals $R_1$.",
      "Non-Inverting Amplifier: Preserves signal polarity; possesses near-infinite input impedance ($R_{\\text{in}} \\approx \\infty$).",
      "Voltage Follower Buffer ($A_v = 1$): Eliminates sensor loading effects by coupling a high-impedance source to a low-impedance load with zero voltage drop."
    ]
  },

  /* ==========================================================
     FASE 8: SEMICONDUCTORES Y CRAFT DE HARDWARE REAL (MÓDULOS 4.5 - 4.7)
     ========================================================== */
  {
    keywords: ["diode", "pn junction", "zener", "rectifier", "bridge rectifier", "forward voltage", "vf", "shockley", "ripple voltage"],
    book: "Fundamentals of Electric Circuits & The Art of Electronics",
    section: "Sadiku Ch. 2.2, 8.11; AoE Ch. 1.6, 9x.1",
    topic: "PN Diodes, Zener Regulators & Bridge Rectifiers",
    summary: "A semiconductor PN diode conducts current in only one direction once forward bias exceeds threshold $V_f \\approx 0.7\\text{V}$. Zener diodes exploit controlled reverse breakdown for voltage regulation.",
    equations: [
      "$$i_D = I_S \\left(e^{\\frac{v_D}{n V_T}} - 1\\right) \\quad [\\text{Shockley Diode Equation}]$$",
      "$$V_T = \\frac{k T}{q} \\approx 25.85\\text{ mV at } 300\\text{ K} \\quad [\\text{Thermal Voltage}]$$",
      "$$V_{\\text{peak, out}} = V_{\\text{peak, in}} - 2V_f \\quad [\\text{Full-Wave Bridge Rectifier Drop}]$$",
      "$$V_{\\text{ripple}} = \\frac{I_{\\text{load}}}{2 f_{\\text{line}} C} \\quad [\\text{Peak-to-Peak Filter Ripple Voltage}]$$"
    ],
    keyPoints: [
      "Standard Silicon Diode: $V_f \\approx 0.6\\text{V} - 0.7\\text{V}$. Schottky Diode: $V_f \\approx 0.2\\text{V} - 0.3\\text{V}$ (fast recovery).",
      "Zener Regulation: In reverse bias, a Zener diode maintains a constant voltage $V_Z$ across its terminals as long as $I_Z \\ge I_{ZK}$.",
      "Full-Wave Bridge: Four diodes arranged in a bridge conduct on alternating half-cycles, converting AC into pulsating DC."
    ]
  },
  {
    keywords: ["transistor", "bjt", "mosfet", "transistor switch", "beta", "rds(on)", "vgs(th)", "saturation", "gate charge", "conduction loss"],
    book: "The Art of Electronics (The x-Chapters) (Horowitz & Hill)",
    section: "Chapters 2x & 3x (pp. 79–270); Mano Appendix",
    topic: "Transistors: BJTs and MOSFETs as Electronic Switches",
    summary: "BJTs are current-controlled switches ($I_c = \\beta I_b$); MOSFETs are voltage-controlled switches ($V_{GS}$) with capacitive insulated gates ($I_G = 0$) and ultra-low conduction on-resistance $R_{DS(\\text{on})}$.",
    equations: [
      "$$I_c = \\beta \\cdot I_b \\quad [\\text{BJT Active Mode Current Gain, } \\beta \\approx 100-300]$$",
      "$$V_{CE(\\text{sat})} \\approx 0.1\\text{V} - 0.2\\text{V} \\quad [\\text{BJT Fully Saturated Switch}]$$",
      "$$P_{\\text{loss}} = I_D^2 \\cdot R_{DS(\\text{on})} \\quad [\\text{MOSFET Conduction Loss in Watts}]$$",
      "$$P_{\\text{switch}} = f_{\\text{sw}} \\cdot \\frac{1}{2} V_{DD} I_D \\left(t_{\\text{rise}} + t_{\\text{fall}}\\right) \\quad [\\text{Dynamic Switching Loss}]$$"
    ],
    keyPoints: [
      "MOSFET Gate Insulation: Silicon dioxide ($\\text{SiO}_2$) creates an open-circuit gate ($I_G \\equiv 0\\text{ A}$ DC), drastically reducing driver power compared to BJTs.",
      "MOSFET Conduction: When $V_{GS} > V_{GS(\\text{th})}$, the channel conducts with low resistance $R_{DS(\\text{on})}$ (often $< 10\\text{ m}\\Omega$).",
      "BJT Saturation: To use a BJT as a saturated switch, overdrive the base current ($I_b \\ge I_c / 10$) to force $V_{CE} \\to V_{CE(\\text{sat})} \\approx 0.2\\text{V}$."
    ]
  },
  {
    keywords: ["bypass capacitor", "decoupling capacitor", "0.1uf", "ground plane", "floating cmos", "flyback diode", "trace inductance", "horowitz and hill rules", "pcb craft"],
    book: "The Art of Electronics: The x-Chapters (Horowitz & Hill)",
    section: "Chapters 1x.1–1x.3, 2x.4, 9x.25 (pp. 20–30, 88–92); Mano Ch. 10",
    topic: "Real-World Engineering Craft & Decoupling Rules",
    summary: "Hardware craft rules bridge textbook theory and physical PCB reality, mitigating parasitic trace inductance ($L di/dt$), ground loops, electrostatic pickup, and inductive flyback destruction.",
    equations: [
      "$$V_{\\text{droop}} = L_{\\text{trace}} \\cdot \\left(\\frac{di}{dt}\\right) \\quad [\\text{Parasitic PCB Voltage Droop}]$$",
      "$$C_{\\text{bypass}} \\ge 0.1\\,\\mu\\text{F} = 100\\text{ nF} \\quad [\\text{Low-ESR X7R Ceramic Cap}]$$",
      "$$V_{\\text{clamp}} = V_{\\text{supply}} + V_f \\approx V_{\\text{supply}} + 0.7\\text{ V} \\quad [\\text{Inductive Flyback Clamping}]$$",
      "$$W_{\\text{coil}} = \\frac{1}{2} L I^2 \\quad [\\text{Dissipated Magnetic Energy in Joules}]$$"
    ],
    keyPoints: [
      "Rule 1 (Bypass Capacitor): Place a $0.1\\,\\mu\\text{F}$ ($100\\text{nF}$) ceramic capacitor within $3\\text{ mm}$ of EVERY IC power pin to supply instantaneous switching current.",
      "Rule 2 (Ground Plane): Use an unbroken copper ground plane on the PCB to minimize ground loop return inductance and radiated EMI noise.",
      "Rule 3 (Floating CMOS): NEVER leave unused CMOS logic gate inputs floating (open). Always tie them to $V_{DD}$ or Ground directly or through a $10\\text{ k}\\Omega$ pull-up/pull-down resistor (Mano Ch. 10).",
      "Rule 4 (Flyback Diode): Always place an anti-parallel clamping diode across inductive relays, solenoids, and DC motor coils to prevent high-voltage $L(di/dt)$ destruction."
    ]
  }
];
