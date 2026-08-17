/* ============================================
   ElectronFlow — curriculum.js (Master EE 101 Curriculum)
   
   Estructura Curricular Completa de Ingeniería Eléctrica y Electrónica (EE 101)
   Basado en la literatura académica canónica:
   - "Fundamentals of Electric Circuits" (Alexander & Sadiku, 7ma Edición)
   - "The Art of Electronics (The x-Chapters)" (Horowitz & Hill)
   - "Digital Design" (M. Morris Mano, 6ta Edición)
   - Estándares universitarios (MIT 6.002, Stanford EE 101, Berkeley EECS 16A)
   ============================================ */

/*
   Catálogo maestro del curso:
   Define las 8 fases y los 20 módulos de aprendizaje, garantizando que cada fórmula
   se exprese en sintaxis KaTeX 2D ($...$$ para bloque y $...$ para línea) con unidades del SI.
*/

var COURSES_CATALOG = [
  {
    id: "electronics-fundamentals",
    title: "Electronics Fundamentals (EE 101)",
    category: "Hardware & Circuit Physics",
    description: "The complete university curriculum: from atomic charges, Ohm's law, and network theorems to AC phasors, resonance, op-amps, and discrete semiconductors.",
    icon: "zap",
    status: "active",
    totalLessons: 20,
    totalXP: 2600,
    estimatedHours: "12 hrs",
    phases: [
      /* ==========================================================
         FASE 1: FUNDAMENTOS ABSOLUTOS Y LEYES DE CD
         ========================================================== */
      {
        id: "phase-1",
        title: "Phase 1: Absolute Fundamentals & DC Laws",
        lessons: [
          /* --- LECCIÓN 1-1: What is Electricity? --- */
          {
            id: "lesson-1-1",
            title: "1.1 What is Electricity?",
            subtitle: "Understanding the atomic foundation of charge carriers and potential difference.",
            duration: "15 min",
            steps: [
              {
                type: "content",
                category: "reading",
                categoryLabel: "Reading Chapter • 4 min",
                title: "The Foundations of Electricity",
                subtitle: "How subatomic particles, atomic bonds, and voltage create electrical flow.",
                durationEstimate: "2:25",
                audioSrc: "audio/lesson-1-1.mp3",
                sections: [
                  {
                    title: "1. The Atomic Blueprint",
                    sentences: [
                      { id: "s1", text: "Everything in the physical universe is composed of atoms.", start: 15.96, end: 19.8 },
                      { id: "s2", text: "Your phone screen, your body, and copper wiring are all built from billions of these microscopic building blocks.", start: 19.8, end: 27.12 },
                      { id: "s3", text: "Every atom contains a dense central nucleus packed with positively charged protons and neutral neutrons.", start: 27.12, end: 33.86 },
                      { id: "s4", text: "Orbiting around this nucleus at high speeds are tiny, negatively charged particles called electrons.", start: 33.86, end: 40.4 },
                      { id: "s5", text: "In normal stable matter, positive protons and negative electrons balance out.", start: 40.4, end: 45.94 },
                      { id: "s6", text: "Electricity occurs when electrons break free from their orbits and move.", start: 45.94, end: 50.81 }
                    ],
                    illustration: "atom",
                    callout: {
                      icon: "bulb",
                      text: "<strong>Core Law:</strong> In normal stable matter, positive protons and negative electrons balance out. Electricity occurs when valence electrons break free ($e = -1.6022 \\times 10^{-19}\\text{ C}$) and drift under an electric field to create current: $i(t) = \\frac{dq(t)}{dt} \\quad [\\text{Amperes, A}]$"
                    }
                  },
                  {
                    title: "2. Conductors vs. Insulators",
                    sentences: [
                      { id: "s7", text: "Why does electricity flow easily through metal wiring, but get stopped cold by plastic or rubber?", start: 54.75, end: 61.06 },
                      { id: "s8", text: "In conductive materials like copper, silver, and gold, the outermost electrons are held very loosely.", start: 61.06, end: 68.17 },
                      { id: "s9", text: "They can easily hop between neighboring atoms to form an electric current.", start: 68.17, end: 72.76 },
                      { id: "s10", text: "In insulators like rubber, glass, and plastic, electrons are locked tightly to their nuclei.", start: 72.76, end: 79.42 },
                      { id: "s11", text: "Even with high electrical force, they refuse to flow.", start: 79.42, end: 83.49 },
                      { id: "s12", text: "That is why electrical cables use copper wire on the inside to conduct power, surrounded by flexible rubber on the outside to keep you safe.", start: 83.49, end: 92.01 }
                    ],
                    comparison: {
                      left: {
                        theme: "blue",
                        badge: "Conductor",
                        title: "Copper, Silver & Gold",
                        desc: "Outer electrons (valence electrons) are held loosely and hop easily between neighboring atoms.",
                        bullets: [
                          "Free valence electrons roam across the lattice ($n \\approx 10^{28}\\text{ m}^{-3}$)",
                          "Minimal electrical resistance ($R \\approx 0\\,\\Omega$)",
                          "Used for circuit traces, wires, and contacts"
                        ]
                      },
                      right: {
                        theme: "rose",
                        badge: "Insulator",
                        title: "Rubber, Glass & Plastic",
                        desc: "Outer electrons are tightly locked in stable atomic bonds and refuse to move.",
                        bullets: [
                          "Electrons bound tightly to atomic nuclei",
                          "High electrical resistance ($R > 10^{12}\\,\\Omega$)",
                          "Used for wire jackets, PCB substrates, and safety"
                        ]
                      }
                    },
                    callout: {
                      icon: "zap",
                      text: "<strong>Real-World Design:</strong> Electrical cables use low-resistivity copper on the inside to conduct current $i = \\frac{dq}{dt}$, surrounded by high-breakdown insulating rubber on the outside for safety."
                    }
                  },
                  {
                    title: "3. Voltage: The Electrical Pressure",
                    sentences: [
                      { id: "s13", text: "Electrons will not flow through a wire on their own.", start: 96.06, end: 99.78 },
                      { id: "s14", text: "They need a force pushing them.", start: 99.78, end: 102.19 },
                      { id: "s15", text: "Think of water in a pipe: without water pressure from a pump or elevated water tower, the water just sits still.", start: 102.19, end: 109.44 },
                      { id: "s16", text: "Voltage, measured in Volts, is that electrical pressure provided by a battery or power supply.", start: 109.44, end: 115.86 },
                      { id: "s17", text: "The higher the voltage, the stronger the push, and the more current flows through the circuit.", start: 115.86, end: 121.34 },
                      { id: "s18", text: "Remember the golden rule: Voltage is the cause, and Current is the effect.", start: 121.34, end: 126.75 }
                    ],
                    illustration: "voltageAnalogy",
                    callout: {
                      icon: "bulb",
                      text: "<strong>The Cause-and-Effect Rule:</strong> Voltage is the <em>cause</em> (energy per unit charge $v = \\frac{dw}{dq}$ in Volts, $\\text{V} = \\text{J/C}$), and Current is the <em>effect</em> (moving charges $i = \\frac{dq}{dt}$ in Amperes). Without voltage, net current cannot flow."
                    }
                  }
                ],
                summary: [
                  "<strong>Electricity = Moving Electrons:</strong> The flow of charge carriers ($i = \\frac{dq}{dt}$) through a conductor.",
                  "<strong>Conductors enable flow:</strong> Metals have free valence electrons; insulators lock them down.",
                  "<strong>Voltage provides the push:</strong> Measured in Volts ($1\\text{ V} = 1\\text{ Joule / Coulomb}$), driving current through closed loops."
                ]
              },
              {
                type: "animation",
                category: "simulation",
                categoryLabel: "Interactive Lab",
                labType: "electron-flow",
                title: "Hands-On Circuit: Voltage & Flow",
                description: "Interact with the battery voltage slider and toggle the switch. Observe how voltage directly impacts current and bulb brightness."
              },
              {
                type: "quiz",
                category: "quiz",
                categoryLabel: "Knowledge Check",
                xp: 50,
                question: "If you increase the voltage across a circuit, what happens to the electron flow?",
                prompt: "Consider the water pressure analogy when choosing your answer.",
                options: [
                  "Electron flow speeds up — more voltage means a stronger push",
                  "Electron flow slows down — voltage creates resistance",
                  "Nothing changes — voltage does not affect electron speed",
                  "The electrons reverse direction and flow backward"
                ],
                correctIndex: 0,
                explanation: "Correct! Voltage is electrical pressure ($v = dw/dq$). Increasing voltage pushes charge carriers (electrons) more vigorously, increasing electric current ($I = V/R$)."
              },
              {
                type: "quiz",
                category: "quiz",
                categoryLabel: "Knowledge Check",
                xp: 50,
                question: "Which subatomic particle is primarily responsible for electrical current in conductors?",
                prompt: "Select the particle that orbits the nucleus and carries negative charge.",
                options: [
                  "Protons — positive particles locked in the nucleus",
                  "Neutrons — neutral particles in the nucleus",
                  "Electrons — negative particles orbiting the nucleus",
                  "Photons — particles of light"
                ],
                correctIndex: 2,
                explanation: "Correct! Electrons are lightweight and loosely bound in metals, allowing them to drift from atom to atom and create electric current ($i = dq/dt$)."
              },
              {
                type: "flashcard",
                category: "flashcard",
                categoryLabel: "Active Recall",
                question: "What is the flow of electric charge (electrons) through a conductor called?",
                answer: "Electric Current ($I$) — measured in Amperes (A), where $1\\text{ A} = 1\\text{ Coulomb / second}$ ($i = \\frac{dq}{dt}$)."
              },
              {
                type: "flashcard",
                category: "flashcard",
                categoryLabel: "Active Recall",
                question: "What is Voltage, and what unit is it measured in?",
                answer: "Voltage is the electrical potential difference (energy per unit charge) that drives current. It is measured in Volts (V), where $1\\text{ V} = 1\\text{ Joule / Coulomb}$ ($v = \\frac{dw}{dq}$)."
              },
              {
                type: "complete",
                category: "complete",
                categoryLabel: "Milestone",
                xp: 30
              }
            ]
          },

          /* --- LECCIÓN 1-2: Voltage, Current, Resistance & Power (Ohm's & Watt's Law) --- */
          {
            id: "lesson-1-2",
            title: "1.2 Voltage, Current, Resistance & Power",
            subtitle: "Mastering Ohm's Law (V = I·R), Watt's Law (P = V·I), and energy dissipation.",
            duration: "20 min",
            steps: [
              {
                type: "content",
                category: "reading",
                categoryLabel: "Reading Chapter • 5 min",
                title: "Ohm's Law and Electrical Power",
                subtitle: "The fundamental triad: Volts, Amperes, and Ohms.",
                durationEstimate: "2:40",
                audioSrc: "audio/lesson-1-2.mp3",
                sections: [
                  {
                    title: "1. The Triad: Voltage, Current, and Resistance",
                    sentences: [
                      { id: "s2_1", text: "Every circuit in existence is governed by the relationship between three quantities: Voltage, Current, and Resistance.", start: 0.1, end: 7.2 },
                      { id: "s2_2", text: "Voltage (V) is the push, measured in Volts.", start: 7.2, end: 11.5 },
                      { id: "s2_3", text: "Current (I) is the flow rate of charge, measured in Amperes or Amps.", start: 11.5, end: 17.2 },
                      { id: "s2_4", text: "Resistance (R) is the opposition to that flow, measured in Ohms (Ω).", start: 17.2, end: 23.4 },
                      { id: "s2_5", text: "In 1827, German physicist Georg Ohm proved that current is directly proportional to voltage and inversely proportional to resistance.", start: 23.4, end: 33.1 }
                    ],
                    comparison: {
                      left: {
                        theme: "blue",
                        badge: "Ohm's Law",
                        title: "V = I × R",
                        desc: "If you know any two variables, you can calculate the third instantly.",
                        bullets: [
                          "$$V = I \\cdot R \\quad [\\text{Find Voltage in Volts}]$$",
                          "$$I = \\frac{V}{R} \\quad [\\text{Find Current in Amps}]$$",
                          "$$R = \\frac{V}{I} \\quad [\\text{Find Resistance in } \\Omega]$$"
                        ]
                      },
                      right: {
                        theme: "rose",
                        badge: "Watt's Law",
                        title: "P = V × I = I²·R",
                        desc: "Power is the rate at which electrical energy is converted into work or heat.",
                        bullets: [
                          "$$P = V \\cdot I \\quad [\\text{Watts} = \\text{Volts} \\times \\text{Amps}]$$",
                          "$$P = I^2 R \\quad [\\text{Joule heating in resistors}]$$",
                          "$$P = \\frac{V^2}{R} \\quad [\\text{Voltage stress on components}]$$"
                        ]
                      }
                    },
                    callout: {
                      icon: "bulb",
                      text: "<strong>The Hydraulic Analogy:</strong> Think of a garden hose. Voltage is the water pressure from the faucet, Current is the volume flow rate ($i = dq/dt$), and Resistance is squeezing the nozzle ($R = V/I$)."
                    }
                  },
                  {
                    title: "2. Power, Heat Dissipation, and Component Ratings",
                    sentences: [
                      { id: "s2_6", text: "Whenever electric current flows through a resistance, electrical energy is converted into heat.", start: 33.5, end: 41.2 },
                      { id: "s2_7", text: "This power dissipation is measured in Watts (W).", start: 41.2, end: 45.8 },
                      { id: "s2_8", text: "Standard through-hole resistors are typically rated for 1/4 Watt (0.25W) or 1/2 Watt (0.5W).", start: 45.8, end: 54.6 },
                      { id: "s2_9", text: "If you push 10 Volts across a 100 Ohm resistor, the power dissipated is P = V² / R = 100 / 100 = 1 Watt.", start: 54.6, end: 65.4 },
                      { id: "s2_10", text: "A standard quarter-watt resistor in that circuit will quickly overheat, smoke, and burn out.", start: 65.4, end: 73.8 }
                    ],
                    callout: {
                      icon: "zap",
                      text: "<strong>Golden Rule of Hardware Design:</strong> Always de-rate resistors by at least 50%. If $P = \\frac{V^2}{R} = \\frac{(10\\text{ V})^2}{100\\,\\Omega} = 1.0\\text{ W}$, a standard $0.25\\text{ W}$ resistor will burn out. Always select a resistor with power rating $\\ge 2\\times P_{\\text{dissipated}}$"
                    }
                  }
                ],
                summary: [
                  "<strong>Ohm's Law:</strong> $V = I \\cdot R \\iff I = \\frac{V}{R} \\iff R = \\frac{V}{I}$.",
                  "<strong>Watt's Law:</strong> $P = V \\cdot I = I^2 R = \\frac{V^2}{R} \\quad [\\text{Watts, W}]$.",
                  "<strong>Component Power Limits:</strong> Always verify that resistor power dissipation does not exceed component wattage ratings."
                ]
              },
              {
                type: "animation",
                category: "simulation",
                categoryLabel: "Interactive Lab",
                labType: "ohms-law",
                title: "Hands-On Lab: Ohm's Law & Power Dissipation",
                description: "Adjust the Voltage (0–24V) and Resistance (10Ω–1000Ω) sliders. Watch Current (I) and Power (P) recalculate live while the resistor heats up."
              },
              {
                type: "quiz",
                category: "quiz",
                categoryLabel: "Knowledge Check",
                xp: 50,
                question: "A 12V automotive battery is connected across a 4Ω headlight bulb. How much current flows?",
                prompt: "Use Ohm's Law: I = V / R.",
                options: [
                  "48 Amperes (A)",
                  "3 Amperes (A)",
                  "0.33 Amperes (A)",
                  "16 Amperes (A)"
                ],
                correctIndex: 1,
                explanation: "Correct! Using $I = \\frac{V}{R} = \\frac{12\\text{ V}}{4\\,\\Omega} = 3\\text{ Amperes (A)}$. The power consumed is $P = V \\cdot I = 12\\text{ V} \\times 3\\text{ A} = 36\\text{ Watts}$."
              },
              {
                type: "quiz",
                category: "quiz",
                categoryLabel: "Knowledge Check",
                xp: 50,
                question: "If 2 Amperes flow through a 100Ω power resistor, how much heat power is dissipated?",
                prompt: "Use Watt's Law: P = I² · R.",
                options: [
                  "200 Watts (W)",
                  "400 Watts (W)",
                  "50 Watts (W)",
                  "20 Watts (W)"
                ],
                correctIndex: 1,
                explanation: "Correct! Using $P = I^2 R = (2\\text{ A})^2 \\times 100\\,\\Omega = 4 \\times 100 = 400\\text{ Watts}$. This requires a dedicated high-power ceramic resistor with a heatsink!"
              },
              {
                type: "flashcard",
                category: "flashcard",
                categoryLabel: "Active Recall",
                question: "What are the three algebraic forms of Ohm's Law?",
                answer: "1) $V = I \\cdot R$ (Find Voltage)\n2) $I = \\frac{V}{R}$ (Find Current)\n3) $R = \\frac{V}{I}$ (Find Resistance)"
              },
              {
                type: "flashcard",
                category: "flashcard",
                categoryLabel: "Active Recall",
                question: "What is the formula for electrical power in terms of current and resistance?",
                answer: "$P = I^2 R \\quad [\\text{Watts, W}]$. Alternatively, $P = V \\cdot I = \\frac{V^2}{R}$."
              },
              {
                type: "complete",
                category: "complete",
                categoryLabel: "Milestone",
                xp: 30
              }
            ]
          },

          /* --- LECCIÓN 1-3: Kirchhoff's Laws & Resistor Networks --- */
          {
            id: "lesson-1-3",
            title: "1.3 Kirchhoff's Laws & Resistor Networks",
            subtitle: "Kirchhoff's Current Law (KCL), Voltage Law (KVL), Series/Parallel, and Voltage Dividers.",
            duration: "25 min",
            steps: [
              {
                type: "content",
                category: "reading",
                categoryLabel: "Reading Chapter • 5 min",
                title: "KCL, KVL, and Resistor Networks",
                subtitle: "The fundamental conservation laws governing all electrical networks.",
                durationEstimate: "2:50",
                audioSrc: "audio/lesson-1-3.mp3",
                sections: [
                  {
                    title: "1. Kirchhoff's Current Law (KCL) & Voltage Law (KVL)",
                    sentences: [
                      { id: "s3_1", text: "In 1845, Gustav Kirchhoff formulated two laws that allow us to solve any electrical circuit, no matter how complex.", start: 0.1, end: 8.4 },
                      { id: "s3_2", text: "Kirchhoff's Current Law states that the sum of all currents entering a junction node must equal the sum of currents leaving it.", start: 8.4, end: 18.2 },
                      { id: "s3_3", text: "Charge cannot build up or vanish at a point: sum of currents entering equals sum of currents leaving.", start: 18.2, end: 24.8 },
                      { id: "s3_4", text: "Kirchhoff's Voltage Law states that the algebraic sum of all voltages around any closed loop must equal zero.", start: 24.8, end: 35.6 }
                    ],
                    comparison: {
                      left: {
                        theme: "blue",
                        badge: "KCL (Nodes)",
                        title: "Current Conservation",
                        desc: "Currents entering a junction = currents leaving.",
                        bullets: [
                          "$\\sum I_{\\text{in}} = \\sum I_{\\text{out}}$ at every node",
                          "Based on Conservation of Electric Charge",
                          "Forms the basis for Nodal Analysis"
                        ]
                      },
                      right: {
                        theme: "rose",
                        badge: "KVL (Loops)",
                        title: "Energy Conservation",
                        desc: "Voltage rises = Voltage drops around any loop.",
                        bullets: [
                          "$\\sum V_{\\text{loop}} = 0$ around any closed path",
                          "Based on Conservation of Energy",
                          "Forms the basis for Mesh Analysis"
                        ]
                      }
                    }
                  },
                  {
                    title: "2. The Voltage Divider Rule",
                    sentences: [
                      { id: "s3_5", text: "When two resistors are connected in series across a voltage source, the voltage divides between them proportionally to their resistance.", start: 35.8, end: 46.2 },
                      { id: "s3_6", text: "The output voltage across R2 is proportional to the total resistance.", start: 46.2, end: 54.0 },
                      { id: "s3_7", text: "Voltage dividers are widely used to create reference voltages, bias transistors, and read analog sensors like potentiometers and thermistors.", start: 54.0, end: 65.5 }
                    ],
                    callout: {
                      icon: "bulb",
                      text: "<strong>Voltage Divider Formula:</strong> $V_{\\text{out}} = V_{\\text{in}} \\cdot \\left(\\frac{R_2}{R_1 + R_2}\\right)$. If $R_1 = R_2$, the voltage divides exactly in half ($V_{\\text{out}} = \\frac{V_{\\text{in}}}{2}$)."
                    }
                  }
                ],
                summary: [
                  "<strong>KCL (Node Law):</strong> $\\sum I_{\\text{in}} = \\sum I_{\\text{out}}$ (Conservation of Charge).",
                  "<strong>KVL (Loop Law):</strong> $\\sum V_{\\text{loop}} = 0$ (Conservation of Energy).",
                  "<strong>Series Equivalent:</strong> $R_{\\text{eq}} = R_1 + R_2 + \\dots + R_n$.",
                  "<strong>Parallel Equivalent:</strong> $\\frac{1}{R_{\\text{eq}}} = \\frac{1}{R_1} + \\frac{1}{R_2} \\implies R_{\\text{eq}} = \\frac{R_1 R_2}{R_1 + R_2}$.",
                  "<strong>Voltage Divider:</strong> $V_{\\text{out}} = V_{\\text{in}} \\cdot \\left(\\frac{R_2}{R_1 + R_2}\\right)$."
                ]
              },
              {
                type: "animation",
                category: "simulation",
                categoryLabel: "Interactive Lab",
                labType: "voltage-divider",
                title: "Hands-On Lab: Interactive Voltage Divider",
                description: "Adjust R1 and R2 in real-time. Watch how the intermediate node voltage Vout changes and observe the current division."
              },
              {
                type: "quiz",
                category: "quiz",
                categoryLabel: "Knowledge Check",
                xp: 50,
                question: "Two 10kΩ resistors are connected in series across a 10V power supply. What is the output voltage taken across the bottom resistor?",
                prompt: "Apply the Voltage Divider formula with identical resistor values.",
                options: [
                  "10 Volts",
                  "5 Volts",
                  "2.5 Volts",
                  "0 Volts"
                ],
                correctIndex: 1,
                explanation: "Correct! When two equal resistors are in series, the voltage divides equally in half: $10\\text{ V} \\times \\left(\\frac{10\\text{ k}\\Omega}{20\\text{ k}\\Omega}\\right) = 5.0\\text{ V}$."
              },
              {
                type: "quiz",
                category: "quiz",
                categoryLabel: "Knowledge Check",
                xp: 50,
                question: "What is the equivalent resistance of two 100Ω resistors connected in parallel?",
                prompt: "Use the parallel formula: Req = (R1 × R2) / (R1 + R2).",
                options: [
                  "200 Ω",
                  "100 Ω",
                  "50 Ω",
                  "25 Ω"
                ],
                correctIndex: 2,
                explanation: "Correct! In parallel, identical resistors halve the total resistance: $R_{\\text{eq}} = \\frac{100 \\times 100}{100 + 100} = \\frac{10{,}000}{200} = 50\\,\\Omega$."
              },
              {
                type: "flashcard",
                category: "flashcard",
                categoryLabel: "Active Recall",
                question: "State Kirchhoff's Current Law (KCL) in your own words.",
                answer: "The total electric current entering any circuit node (junction) must equal the total electric current leaving that node ($\\sum I_{\\text{in}} = \\sum I_{\\text{out}}$)."
              },
              {
                type: "flashcard",
                category: "flashcard",
                categoryLabel: "Active Recall",
                question: "What is the formula for equivalent resistance of two resistors in parallel?",
                answer: "$R_{\\text{eq}} = \\frac{R_1 \\cdot R_2}{R_1 + R_2} \\quad\\text{or}\\quad \\frac{1}{R_{\\text{eq}}} = \\frac{1}{R_1} + \\frac{1}{R_2}$."
              },
              {
                type: "complete",
                category: "complete",
                categoryLabel: "Milestone",
                xp: 30
              }
            ]
          },

          /* --- LECCIÓN 1-4: Circuit Topologies, Nodes & Ground Reference --- */
          {
            id: "lesson-1-4",
            title: "1.4 Circuit Topologies, Nodes & Ground",
            subtitle: "Essential nodes, branches, independent loops, planar circuits, and earth vs chassis ground.",
            duration: "15 min",
            steps: [
              {
                type: "content",
                category: "reading",
                categoryLabel: "Reading Chapter • 4 min",
                title: "Topologies, Nodes, and Ground",
                subtitle: "How to read, label, and partition complex circuit schematics.",
                durationEstimate: "2:15",
                audioSrc: "audio/lesson-1-4.mp3",
                sections: [
                  {
                    title: "1. Defining Branches, Nodes, and Loops",
                    sentences: [
                      { id: "s4_1", text: "Before analyzing any circuit, an engineer must identify its topological elements.", start: 0.1, end: 6.5 },
                      { id: "s4_2", text: "A branch represents any single two-terminal component, such as a resistor or voltage source.", start: 6.5, end: 14.2 },
                      { id: "s4_3", text: "A node is the point of connection between two or more branches.", start: 14.2, end: 19.8 },
                      { id: "s4_4", text: "A loop is any closed path in a circuit formed by starting at a node, passing through elements, and returning to the same node without passing through any node more than once.", start: 19.8, end: 32.5 },
                      { id: "s4_5", text: "A network with b branches, n nodes, and l independent loops satisfies the fundamental topology theorem: b = l + n - 1.", start: 32.5, end: 44.0 }
                    ],
                    callout: {
                      icon: "bulb",
                      text: "<strong>The Fundamental Network Theorem:</strong> $b = l + n - 1 \\implies l = b - n + 1$. This theorem defines the exact number of independent KCL ($n - 1$) and KVL ($l$) equations required to solve any network."
                    }
                  },
                  {
                    title: "2. The Concept of Ground (0V Reference)",
                    sentences: [
                      { id: "s4_6", text: "Voltage is always a relative measurement between two points.", start: 44.2, end: 49.5 },
                      { id: "s4_7", text: "To simplify circuit schematics, engineers define a common reference node called Ground, assigned a potential of 0 Volts.", start: 49.5, end: 59.8 },
                      { id: "s4_8", text: "All other node voltages are measured with respect to this 0V ground point.", start: 59.8, end: 66.2 }
                    ],
                    comparison: {
                      left: {
                        theme: "blue",
                        badge: "Earth Ground",
                        title: "Physical Earth (Safety)",
                        desc: "Direct physical connection to the soil via a copper rod.",
                        bullets: [
                          "Protects against lightning and insulation faults",
                          "Carries fault current to trip circuit breakers",
                          "Symbol: 3 descending horizontal lines"
                        ]
                      },
                      right: {
                        theme: "rose",
                        badge: "Signal Ground",
                        title: "Chassis / 0V Reference",
                        desc: "Common reference return path for circuit signals.",
                        bullets: [
                          "$0\\text{ V}$ reference for DC power and signal processing",
                          "Often connected to metallic chassis enclosure",
                          "Prevents floating voltage offsets"
                        ]
                      }
                    }
                  }
                ],
                summary: [
                  "<strong>Branch ($b$):</strong> Any single two-terminal element (resistor, battery, diode).",
                  "<strong>Node ($n$):</strong> Point where two or more branches connect.",
                  "<strong>Independent Loops ($l$):</strong> $l = b - n + 1$.",
                  "<strong>Network Topology Formula:</strong> $b = l + n - 1$.",
                  "<strong>Ground:</strong> The $0\\text{ V}$ reference datum against which all circuit potentials $v_n$ are measured."
                ]
              },
              {
                type: "quiz",
                category: "quiz",
                categoryLabel: "Knowledge Check",
                xp: 50,
                question: "A circuit contains 5 branches (b = 5) and 3 nodes (n = 3). How many independent loops (l) exist?",
                prompt: "Use the topology theorem: b = l + n - 1.",
                options: [
                  "1 loop",
                  "2 loops",
                  "3 loops",
                  "4 loops"
                ],
                correctIndex: 2,
                explanation: "Correct! Rearranging $b = l + n - 1$ gives $l = b - n + 1 = 5 - 3 + 1 = 3$ independent loops."
              },
              {
                type: "flashcard",
                category: "flashcard",
                categoryLabel: "Active Recall",
                question: "Why do engineers assign a Ground node (0V) in circuit schematics?",
                answer: "Ground establishes a universal $0\\text{ V}$ datum. Instead of tracking two-point differences $V_{ab}$, every node is defined by a single potential $v_a$ relative to Ground."
              },
              {
                id: "practice-1-1",
                type: "practice",
                category: "practice",
                categoryLabel: "University Problem Set",
                xp: 100,
                title: "University Problem Set: Systematic DC Nodal & Mesh Analysis in Resistor Networks",
                problemStatement: "Un circuito de corriente directa con múltiples mallas y nodos está alimentado por una fuente ideal $V_s = 48.0\\text{ V}$. La red contiene cinco resistores: $R_1 = 4.0\\,\\Omega$ en serie con una sub-red formada por $R_2 = 12.0\\,\\Omega$ en paralelo con la rama constituida por $R_3 = 7.0\\,\\Omega$ en serie con el par paralelo $R_4 = 10.0\\,\\Omega$ y $R_5 = 10.0\\,\\Omega$.\n\nDetermine mediante análisis nodal sistemático (KCL) y reducción de red:\n1. La resistencia equivalente total $R_{\\text{eq}}$ vista por la fuente.\n2. La corriente total $I_{\\text{total}}$ suministrada por la fuente de 48V.\n3. La tensión en el nodo principal $V_A$ y la corriente de rama $I_{R2}$.\n4. La potencia disipada en $R_2$ ($P_{R2}$) y la potencia total suministrada por la fuente.",
                givenData: {
                  "Voltaje de fuente (V_s)": "48.0 V",
                  "Resistor de entrada (R_1)": "4.0 \\Omega",
                  "Resistor en derivación (R_2)": "12.0 \\Omega",
                  "Resistor de rama (R_3)": "7.0 \\Omega",
                  "Resistores terminales (R_4, R_5)": "10.0 \\Omega \\text{ cada uno}"
                },
                hint: "Reduzca primero la combinación paralelo terminal $R_4 \\parallel R_5$, súmela en serie con $R_3$, y calcule el paralelo resultante con $R_2$. Finalmente sume $R_1$ en serie.",
                solutionSteps: [
                  "Paso 1: Reducción del par paralelo terminal $R_4 \\parallel R_5$:\n$R_{45} = \\frac{R_4 \\cdot R_5}{R_4 + R_5} = \\frac{10.0\\,\\Omega \\cdot 10.0\\,\\Omega}{10.0\\,\\Omega + 10.0\\,\\Omega} = 5.0\\,\\Omega$",
                  "Paso 2: Resistencia equivalente de la rama en serie $R_{345}$ y su paralelo con $R_2$:\n$R_{345} = R_3 + R_{45} = 7.0\\,\\Omega + 5.0\\,\\Omega = 12.0\\,\\Omega$\n$R_{\\text{p}} = \\frac{R_2 \\cdot R_{345}}{R_2 + R_{345}} = \\frac{12.0\\,\\Omega \\cdot 12.0\\,\\Omega}{12.0\\,\\Omega + 12.0\\,\\Omega} = 6.0\\,\\Omega$",
                  "Paso 3: Cálculo de la resistencia equivalente total $R_{\\text{eq}}$ y corriente suministrada $I_{\\text{total}}$:\n$R_{\\text{eq}} = R_1 + R_{\\text{p}} = 4.0\\,\\Omega + 6.0\\,\\Omega = 10.0\\,\\Omega$\n$I_{\\text{total}} = \\frac{V_s}{R_{\\text{eq}}} = \\frac{48.0\\text{ V}}{10.0\\,\\Omega} = 4.80\\text{ A}$",
                  "Paso 4: Tensión en el nodo principal $V_A$ y corriente a través de $R_2$:\n$V_A = V_s - I_{\\text{total}} \\cdot R_1 = 48.0\\text{ V} - (4.80\\text{ A})(4.0\\,\\Omega) = 48.0\\text{ V} - 19.2\\text{ V} = 28.8\\text{ V}$\n$I_{R2} = \\frac{V_A}{R_2} = \\frac{28.8\\text{ V}}{12.0\\,\\Omega} = 2.40\\text{ A}$",
                  "Paso 5: Potencia disipada en $R_2$ y balance total de potencia suministrada (Teorema de Tellegen):\n$P_{R2} = \\frac{V_A^2}{R_2} = \\frac{(28.8\\text{ V})^2}{12.0\\,\\Omega} = \\frac{829.44}{12.0} = 69.12\\text{ W}$\n$P_{\\text{total}} = V_s \\cdot I_{\\text{total}} = 48.0\\text{ V} \\cdot 4.80\\text{ A} = 230.40\\text{ W}$"
                ],
                finalAnswer: "$$R_{\\text{eq}} = 10.0\\,\\Omega, \\quad I_{\\text{total}} = 4.80\\text{ A}, \\quad V_A = 28.8\\text{ V}, \\quad P_{R2} = 69.12\\text{ W}, \\quad P_{\\text{total}} = 230.40\\text{ W}$$",
                textbookCitation: "Alexander & Sadiku 7th Ed, Cap. 2 y 3, Prob. 2.11 / 3.14 (pp. 53, 98)"
              },
              {
                type: "complete",
                category: "complete",
                categoryLabel: "Milestone",
                xp: 30
              }
            ]
          }
        ]
      },

      /* ==========================================================
         FASE 2: ANÁLISIS SISTEMÁTICO DE REDES Y TEOREMAS
         ========================================================== */
      {
        id: "phase-2",
        title: "Phase 2: Systematic Network Analysis & Theorems",
        lessons: [
          /* --- LECCIÓN 1-5: Nodal Analysis --- */
          {
            id: "lesson-1-5",
            title: "1.5 Nodal Analysis (The KCL Method)",
            subtitle: "Formulating node voltage equations, reference nodes, and handling supernodes.",
            duration: "25 min",
            steps: [
              {
                type: "content",
                category: "reading",
                categoryLabel: "Reading Chapter • 5 min",
                title: "Nodal Analysis and Supernodes",
                subtitle: "The most powerful systematic technique for solving multi-node circuits.",
                durationEstimate: "2:45",
                audioSrc: "audio/lesson-1-5.mp3",
                sections: [
                  {
                    title: "1. The Nodal Analysis Algorithm",
                    sentences: [
                      { id: "s5_1", text: "Nodal analysis provides a general procedure for analyzing a circuit using node voltages as the circuit variables.", start: 0.1, end: 8.5 },
                      { id: "s5_2", text: "First, select a reference node (Ground, 0V).", start: 8.5, end: 13.0 },
                      { id: "s5_3", text: "Second, label the non-reference node voltages as v1, v2, up to vn-1.", start: 13.0, end: 19.5 },
                      { id: "s5_4", text: "Third, apply Kirchhoff's Current Law to each non-reference node, expressing branch currents using Ohm's Law: i = (vhigh - vlow) / R.", start: 19.5, end: 31.0 },
                      { id: "s5_5", text: "Fourth, solve the resulting system of simultaneous linear equations to determine all unknown node voltages.", start: 31.0, end: 39.5 }
                    ],
                    callout: {
                      icon: "bulb",
                      text: "<strong>Node Equation Standard Form:</strong> At node 1: $\\frac{v_1 - v_2}{R_1} + \\frac{v_1 - 0}{R_2} = I_{\\text{source}}$. Sum of outgoing branch currents equals sum of incoming source currents."
                    }
                  },
                  {
                    title: "2. The Supernode Concept",
                    sentences: [
                      { id: "s5_6", text: "What happens when an ideal voltage source is connected between two non-reference nodes?", start: 39.8, end: 46.5 },
                      { id: "s5_7", text: "The current through the voltage source is unknown, making standard KCL impossible at either individual node.", start: 46.5, end: 55.0 },
                      { id: "s5_8", text: "To solve this, we enclose the voltage source and its two nodes inside a generalized boundary called a Supernode.", start: 55.0, end: 64.0 },
                      { id: "s5_9", text: "We apply KCL to the entire supernode perimeter, and use the source constraint equation v2 - v1 = Vsource as our supplementary equation.", start: 64.0, end: 76.5 }
                    ],
                    comparison: {
                      left: {
                        theme: "blue",
                        badge: "Standard Node",
                        title: "Current Sources & Resistors",
                        desc: "Apply KCL directly.",
                        bullets: [
                          "$$\\sum I_{\\text{outgoing}} = 0$$",
                          "$$i = \\frac{v_a - v_b}{R}$$",
                          "1 independent equation per node"
                        ]
                      },
                      right: {
                        theme: "rose",
                        badge: "Supernode",
                        title: "Floating Voltage Source",
                        desc: "Enclose source in generalized bubble.",
                        bullets: [
                          "KCL on outer perimeter",
                          "Constraint: $v_b - v_a = V_{\\text{source}}$",
                          "Combines 2 nodes into 1 supernode"
                        ]
                      }
                    }
                  }
                ],
                summary: [
                  "<strong>Nodal Analysis:</strong> Uses $(n - 1)$ non-reference node voltages as variables by applying KCL.",
                  "<strong>Branch Current Equation:</strong> $i = \\frac{v_{\\text{from}} - v_{\\text{to}}}{R}$.",
                  "<strong>Supernode:</strong> Formed when a voltage source is connected between two non-reference nodes; treated as a single composite node for KCL."
                ]
              },
              {
                type: "quiz",
                category: "quiz",
                categoryLabel: "Knowledge Check",
                xp: 50,
                question: "In nodal analysis, if a 12V independent voltage source is connected between Node 2 and Ground (0V), what is v2?",
                prompt: "A voltage source connected directly to reference ground fixes the node potential.",
                options: [
                  "v2 must be determined by solving KCL equations",
                  "v2 is fixed immediately at 12V",
                  "v2 is 0V",
                  "v2 is infinite"
                ],
                correctIndex: 1,
                explanation: "Correct! When a voltage source is tied between a node and ground, the node voltage is fixed directly: $v_2 = 12\\text{ V}$. This eliminates one unknown variable from the system of equations!"
              },
              {
                type: "flashcard",
                category: "flashcard",
                categoryLabel: "Active Recall",
                question: "What is a Supernode in nodal circuit analysis?",
                answer: "A supernode is created by enclosing an ideal voltage source connected between two non-reference nodes. KCL is applied to the perimeter of the supernode, supplemented by the constraint $v_2 - v_1 = V_s$."
              },
              {
                type: "complete",
                category: "complete",
                categoryLabel: "Milestone",
                xp: 30
              }
            ]
          },

          /* --- LECCIÓN 1-6: Mesh Analysis --- */
          {
            id: "lesson-1-6",
            title: "1.6 Mesh Analysis (The KVL Method)",
            subtitle: "Mesh loop currents, standard matrix equations, and handling supermeshes.",
            duration: "25 min",
            steps: [
              {
                type: "content",
                category: "reading",
                categoryLabel: "Reading Chapter • 5 min",
                title: "Mesh Analysis and Supermeshes",
                subtitle: "Applying KVL around planar circuit meshes.",
                durationEstimate: "2:30",
                audioSrc: "audio/lesson-1-6.mp3",
                sections: [
                  {
                    title: "1. Mesh Currents vs Branch Currents",
                    sentences: [
                      { id: "s6_1", text: "Mesh analysis is another powerful systematic method, but it is based on Kirchhoff's Voltage Law around planar meshes.", start: 0.1, end: 8.5 },
                      { id: "s6_2", text: "A mesh is a loop that does not contain any other loops within it — like the individual panes of a window frame.", start: 8.5, end: 17.0 },
                      { id: "s6_3", text: "Instead of tracking branch currents, we assign fictitious circulating mesh currents i1, i2, and i3 to each mesh.", start: 17.0, end: 26.5 },
                      { id: "s6_4", text: "The actual current through a shared branch is simply the difference between adjacent mesh currents: ibranch = i1 - i2.", start: 26.5, end: 36.0 }
                    ],
                    callout: {
                      icon: "bulb",
                      text: "<strong>Mesh Analysis Constraint:</strong> Mesh analysis only applies to <em>planar circuits</em> (circuits that can be drawn on a flat plane without crossing wires). For non-planar circuits, nodal analysis must be used."
                    }
                  }
                ],
                summary: [
                  "<strong>Mesh:</strong> An elementary loop that contains no other internal closed loops.",
                  "<strong>Mesh Current Matrix:</strong> $(R_1 + R_2) i_1 - R_2 i_2 = V_{\\text{source}}$.",
                  "<strong>Shared Resistors:</strong> Voltage drop across a shared branch is $(i_1 - i_2) R$.",
                  "<strong>Supermesh:</strong> Created when an ideal current source is shared between two meshes ($i_2 - i_1 = I_{\\text{source}}$)."
                ]
              },
              {
                type: "quiz",
                category: "quiz",
                categoryLabel: "Knowledge Check",
                xp: 50,
                question: "Can mesh analysis be used to solve a non-planar 3D circuit where wires cross with no planar layout?",
                prompt: "Recall the topological constraint of mesh analysis.",
                options: [
                  "Yes, mesh analysis works on any circuit topology",
                  "No, mesh analysis is strictly restricted to planar circuits; nodal analysis must be used instead",
                  "Yes, but only if all sources are DC",
                  "No, non-planar circuits cannot be solved by any method"
                ],
                correctIndex: 1,
                explanation: "Correct! Mesh analysis relies on defining non-overlapping planar meshes. Nodal analysis works universally on both planar and non-planar networks."
              },
              {
                type: "flashcard",
                category: "flashcard",
                categoryLabel: "Active Recall",
                question: "What is the difference between a loop and a mesh?",
                answer: "A loop is any closed path in a circuit. A mesh is an elementary loop that contains no other closed loops inside it (a single 'window pane')."
              },
              {
                type: "complete",
                category: "complete",
                categoryLabel: "Milestone",
                xp: 30
              }
            ]
          },

          /* --- LECCIÓN 1-7: Linearity, Superposition & Source Transformations --- */
          {
            id: "lesson-1-7",
            title: "1.7 Linearity, Superposition & Source Transformations",
            subtitle: "Multi-source circuit analysis and Norton ↔ Thevenin source conversion.",
            duration: "20 min",
            steps: [
              {
                type: "content",
                category: "reading",
                categoryLabel: "Reading Chapter • 4 min",
                title: "Superposition and Source Equivalence",
                subtitle: "Deconstructing complex multi-source networks into simple linear subproblems.",
                durationEstimate: "2:20",
                audioSrc: "audio/lesson-1-7.mp3",
                sections: [
                  {
                    title: "1. The Superposition Principle",
                    sentences: [
                      { id: "s7_1", text: "In any linear circuit containing multiple independent sources, the voltage or current through any element is the algebraic sum of the responses caused by each source acting alone.", start: 0.1, end: 13.5 },
                      { id: "s7_2", text: "To turn off a voltage source, replace it with a short circuit (0 Volts, a solid wire).", start: 13.5, end: 21.0 },
                      { id: "s7_3", text: "To turn off a current source, replace it with an open circuit (0 Amperes, a broken wire).", start: 21.0, end: 28.5 },
                      { id: "s7_4", text: "Calculate the output for each source individually, then add the partial results together.", start: 28.5, end: 36.0 }
                    ],
                    comparison: {
                      left: {
                        theme: "blue",
                        badge: "Deactivating Voltage Source",
                        title: "Short Circuit (0V)",
                        desc: "Replace with a continuous zero-resistance wire.",
                        bullets: [
                          "$$V = 0\\text{ Volts}$$",
                          "Current can still flow freely through it",
                          "Solid jumper wire"
                        ]
                      },
                      right: {
                        theme: "rose",
                        badge: "Deactivating Current Source",
                        title: "Open Circuit (0A)",
                        desc: "Remove the branch completely.",
                        bullets: [
                          "$$I = 0\\text{ Amperes}$$",
                          "Voltage can still exist across terminals",
                          "Cut wire / infinite resistance"
                        ]
                      }
                    }
                  }
                ],
                summary: [
                  "<strong>Superposition Theorem:</strong> Total linear response = $\\sum V_k$ or $\\sum I_k$.",
                  "<strong>Turn Off Voltage Source:</strong> Replace with Short Circuit ($0\\text{ V}$ wire).",
                  "<strong>Turn Off Current Source:</strong> Replace with Open Circuit ($0\\text{ A}$ cut branch).",
                  "<strong>Source Transformation:</strong> $V_s = I_s \\cdot R \\iff I_s = \\frac{V_s}{R}$."
                ]
              },
              {
                type: "quiz",
                category: "quiz",
                categoryLabel: "Knowledge Check",
                xp: 50,
                question: "When applying the Superposition Theorem, how do you deactivate an independent 5A current source?",
                prompt: "Recall what zero current (0A) represents physically.",
                options: [
                  "Replace it with a short circuit (solid wire)",
                  "Replace it with an open circuit (remove the branch)",
                  "Replace it with a 5Ω resistor",
                  "Leave it connected as is"
                ],
                correctIndex: 1,
                explanation: "Correct! To deactivate a current source, we set its current to $0\\text{ A}$, which corresponds to an open circuit (disconnecting the branch)."
              },
              {
                type: "flashcard",
                category: "flashcard",
                categoryLabel: "Active Recall",
                question: "Can Superposition be used to calculate electrical Power directly (P = P1 + P2)?",
                answer: "NO! Superposition only applies to linear quantities (Voltage and Current). Power is non-linear ($P = I^2 R = \\frac{V^2}{R}$). You must find total $V$ or $I$ first, then calculate power."
              },
              {
                type: "complete",
                category: "complete",
                categoryLabel: "Milestone",
                xp: 30
              }
            ]
          },

          /* --- LECCIÓN 1-8: Thevenin & Norton Equivalent Circuits --- */
          {
            id: "lesson-1-8",
            title: "1.8 Thevenin & Norton Equivalent Circuits",
            subtitle: "Finding VTh, RTh, IN, and the Maximum Power Transfer Theorem.",
            duration: "30 min",
            steps: [
              {
                type: "content",
                category: "reading",
                categoryLabel: "Reading Chapter • 6 min",
                title: "Thevenin and Norton Equivalents",
                subtitle: "Reducing any linear circuit to a single source and a single resistance.",
                durationEstimate: "2:55",
                audioSrc: "audio/lesson-1-8.mp3",
                sections: [
                  {
                    title: "1. Thevenin's & Norton's Theorems",
                    sentences: [
                      { id: "s8_1", text: "In 1883, French engineer Léon Charles Thévenin proved that any linear two-terminal circuit of resistors and sources can be replaced by an equivalent circuit consisting of a single voltage source VTh in series with a resistor RTh.", start: 0.1, end: 17.5 },
                      { id: "s8_2", text: "Similarly, Norton's theorem proves the same network can be replaced by an equivalent current source IN in parallel with a resistor RN.", start: 17.5, end: 28.5 },
                      { id: "s8_3", text: "VTh is the open-circuit voltage across terminals a-b.", start: 28.5, end: 34.0 },
                      { id: "s8_4", text: "IN is the short-circuit current flowing when a-b are connected.", start: 34.0, end: 40.2 },
                      { id: "s8_5", text: "The equivalent resistance is RTh = Voc / Isc.", start: 40.2, end: 46.5 }
                    ],
                    comparison: {
                      left: {
                        theme: "blue",
                        badge: "Thevenin Model",
                        title: "VTh in series with RTh",
                        desc: "Ideal for voltage-driven load analysis.",
                        bullets: [
                          "$$V_{\\text{Th}} = v_{oc} \\quad [\\text{Open-circuit voltage}]$$",
                          "$$R_{\\text{Th}} = \\frac{v_{oc}}{i_{sc}} \\quad [\\text{Equivalent resistance}]$$",
                          "$$I_L = \\frac{V_{\\text{Th}}}{R_{\\text{Th}} + R_L}$$"
                        ]
                      },
                      right: {
                        theme: "rose",
                        badge: "Norton Model",
                        title: "IN in parallel with RN",
                        desc: "Ideal for current-driven load analysis.",
                        bullets: [
                          "$$I_N = i_{sc} \\quad [\\text{Short-circuit current}]$$",
                          "$$R_N = R_{\\text{Th}}$$",
                          "$$I_N = \\frac{V_{\\text{Th}}}{R_{\\text{Th}}}$$"
                        ]
                      }
                    }
                  },
                  {
                    title: "2. The Maximum Power Transfer Theorem",
                    sentences: [
                      { id: "s8_6", text: "When connecting a load resistor RL to a practical power source with internal resistance RTh, how do you maximize the power delivered to the load?", start: 46.8, end: 57.5 },
                      { id: "s8_7", text: "Maximum power transfer occurs when the load resistance exactly equals the Thevenin resistance: RL = RTh.", start: 57.5, end: 67.2 },
                      { id: "s8_8", text: "The maximum power delivered is: Pmax = VTh² / (4 RTh).", start: 67.2, end: 74.8 }
                    ],
                    callout: {
                      icon: "bulb",
                      text: "<strong>Maximum Power Rule:</strong> Maximum power transfer occurs when $R_L = R_{\\text{Th}}$. At this matched condition, transfer efficiency is $\\eta = 50\\%$, and maximum delivered power is: $P_{\\text{max}} = \\frac{V_{\\text{Th}}^2}{4 R_{\\text{Th}}} \\quad [\\text{Watts, W}]$"
                    }
                  }
                ],
                summary: [
                  "<strong>Thevenin Equivalent:</strong> A single voltage source $V_{\\text{Th}} = v_{oc}$ in series with $R_{\\text{Th}}$.",
                  "<strong>Norton Equivalent:</strong> A single current source $I_N = i_{sc}$ in parallel with $R_{\\text{Th}}$.",
                  "<strong>Source Relation:</strong> $V_{\\text{Th}} = I_N R_{\\text{Th}}$.",
                  "<strong>Maximum Power Transfer:</strong> Achieved when $R_L = R_{\\text{Th}}$; $P_{\\text{max}} = \\frac{V_{\\text{Th}}^2}{4 R_{\\text{Th}}}$."
                ]
              },
              {
                type: "quiz",
                category: "quiz",
                categoryLabel: "Knowledge Check",
                xp: 50,
                question: "An audio amplifier has an output Thevenin resistance of RTh = 8Ω. For maximum power transfer, what impedance speaker should be connected?",
                prompt: "Apply the Maximum Power Transfer Theorem: RL = RTh.",
                options: [
                  "16 Ω speaker",
                  "8 Ω speaker",
                  "4 Ω speaker",
                  "0 Ω (a short circuit)"
                ],
                correctIndex: 1,
                explanation: "Correct! To achieve maximum power transfer, the speaker impedance must match the amplifier's internal Thevenin impedance: $R_L = R_{\\text{Th}} = 8\\,\\Omega$."
              },
              {
                type: "flashcard",
                category: "flashcard",
                categoryLabel: "Active Recall",
                question: "What is the formula for maximum power transfer delivered to a matched load RL = RTh?",
                answer: "$P_{\\text{max}} = \\frac{V_{\\text{Th}}^2}{4 R_{\\text{Th}}} \\quad [\\text{Watts, W}]$."
              },
              {
                id: "practice-2-1",
                type: "practice",
                category: "practice",
                categoryLabel: "University Problem Set",
                xp: 100,
                title: "University Problem Set: Thévenin-Norton Equivalence with Dependent Sources & Maximum Power",
                problemStatement: "Un circuito activo lineal contiene una fuente independiente $V_s = 30.0\\text{ V}$, un resistor $R_1 = 6.0\\,\\Omega$, un resistor $R_2 = 12.0\\,\\Omega$ y una fuente de tensión controlada por corriente (CCVS) $v_x = 2.0\\,i_1$, donde $i_1$ es la corriente de malla que circula por $R_1$.\n\nDetermine los parámetros del modelo equivalente entre las terminales de salida $(a, b)$:\n1. El voltaje de circuito abierto de Thévenin $V_{\\text{Th}} = V_{\\text{oc}}$.\n2. La corriente de cortocircuito de Norton $I_{\\text{N}} = I_{\\text{sc}}$.\n3. La resistencia equivalente de Thévenin $R_{\\text{Th}} = \\frac{V_{\\text{oc}}}{I_{\\text{sc}}}$.\n4. La máxima potencia $P_{\\text{max}}$ transferible a una carga resistiva adaptada $R_L = R_{\\text{Th}}$.",
                givenData: {
                  "Voltaje de fuente (V_s)": "30.0 V",
                  "Resistor R1": "6.0 \\Omega",
                  "Resistor R2": "12.0 \\Omega",
                  "Ganancia CCVS": "2.0 \\Omega \\quad (v_x = 2.0 i_1)"
                },
                hint: "Para circuitos con fuentes dependientes, no desactive la fuente dependiente. Calcule por separado el voltaje a circuito abierto $V_{\\text{oc}}$ y la corriente de cortocircuito $I_{\\text{sc}}$, y aplique $R_{\\text{Th}} = \\frac{V_{\\text{oc}}}{I_{\\text{sc}}}$.",
                solutionSteps: [
                  "Paso 1: Cálculo del voltaje de circuito abierto $V_{\\text{oc}}$ mediante LVK:\nAl estar las terminales $(a,b)$ abiertas, la corriente $i_1$ recorre la malla única cerrada:\n$V_s - i_1 R_1 - v_x - i_1 R_2 = 0 \\quad\\text{con } v_x = 2.0 i_1$\n$30.0 - 6.0 i_1 - 2.0 i_1 - 12.0 i_1 = 0 \\implies 20.0 i_1 = 30.0 \\implies i_1 = 1.50\\text{ A}$\n$V_{\\text{oc}} = v_x + i_1 R_2 = 2.0(1.50\\text{ A}) + (1.50\\text{ A})(12.0\\,\\Omega) = 3.0\\text{ V} + 18.0\\text{ V} = 21.0\\text{ V}$",
                  "Paso 2: Cálculo de la corriente de cortocircuito de Norton $I_{\\text{sc}}$:\nAl cortocircuitar las terminales $(a,b)$, el resistor $R_2$ queda en paralelo con un cortocircuito ($v_{ab} = 0$), por lo que toda la corriente $i_1$ fluye directamente a tierra:\n$V_s - i_1 R_1 - v_x = 0 \\implies 30.0 - 6.0 i_1 - 2.0 i_1 = 0$\n$8.0 i_1 = 30.0 \\implies i_1 = 3.75\\text{ A}$\n$I_{\\text{sc}} = I_{\\text{N}} = 3.75\\text{ A}$",
                  "Paso 3: Determinación de la resistencia de Thévenin $R_{\\text{Th}}$:\n$R_{\\text{Th}} = \\frac{V_{\\text{oc}}}{I_{\\text{sc}}} = \\frac{21.0\\text{ V}}{3.75\\text{ A}} = 5.60\\,\\Omega$",
                  "Paso 4: Teorema de Máxima Transferencia de Potencia ($R_L = R_{\\text{Th}} = 5.60\\,\\Omega$):\n$P_{\\text{max}} = \\frac{V_{\\text{Th}}^2}{4 R_{\\text{Th}}} = \\frac{(21.0\\text{ V})^2}{4 \\cdot 5.60\\,\\Omega} = \\frac{441.00}{22.40} = 19.6875\\text{ W} \\approx 19.69\\text{ W}$"
                ],
                finalAnswer: "$$V_{\\text{Th}} = 21.0\\text{ V}, \\quad I_{\\text{N}} = 3.75\\text{ A}, \\quad R_{\\text{Th}} = 5.60\\,\\Omega, \\quad P_{\\text{max}} = 19.69\\text{ W}$$",
                textbookCitation: "Alexander & Sadiku 7th Ed, Cap. 4, Ej. 4.9 y Prob. 4.39 (pp. 138-142)"
              },
              {
                type: "complete",
                category: "complete",
                categoryLabel: "Milestone",
                xp: 50
              }
            ]
          }
        ]
      },

      /* ==========================================================
         FASE 3: COMPONENTES REACTIVOS PASIVOS (CAPACITORES E INDUCTORES)
         ========================================================== */
      {
        id: "phase-3",
        title: "Phase 3: Capacitors & Inductors (Reactive Storage)",
        lessons: [
          /* --- LECCIÓN 2-1: Capacitors --- */
          {
            id: "lesson-2-1",
            title: "2.1 Capacitors & Electrostatic Storage",
            subtitle: "Dielectrics, i = C(dv/dt), electrostatic energy storage, and real-world capacitor types.",
            duration: "20 min",
            steps: [
              {
                type: "content",
                category: "reading",
                categoryLabel: "Reading Chapter • 5 min",
                title: "Capacitors and Electrostatic Fields",
                subtitle: "Storing energy in an electric field between conductive plates.",
                durationEstimate: "2:35",
                audioSrc: "audio/lesson-2-1.mp3",
                sections: [
                  {
                    title: "1. Capacitance Physics and the Differential Law",
                    sentences: [
                      { id: "s9_1", text: "A capacitor consists of two conducting plates separated by an insulating dielectric material.", start: 0.1, end: 8.0 },
                      { id: "s9_2", text: "When voltage is applied, positive charge accumulates on one plate and negative charge on the other, creating an electric field.", start: 8.0, end: 17.5 },
                      { id: "s9_3", text: "The fundamental relationship between current and voltage is: i = C × (dv / dt).", start: 17.5, end: 25.0 },
                      { id: "s9_4", text: "Current only flows through a capacitor when the voltage is changing.", start: 25.0, end: 31.0 },
                      { id: "s9_5", text: "In a steady-state DC circuit where voltage is constant (dv/dt = 0), a capacitor acts as an open circuit (i = 0).", start: 31.0, end: 41.5 }
                    ],
                    comparison: {
                      left: {
                        theme: "blue",
                        badge: "DC Steady-State",
                        title: "Open Circuit (i = 0)",
                        desc: "Blocks direct current completely.",
                        bullets: [
                          "$$\\frac{dv}{dt} = 0 \\implies i(t) = 0\\text{ A}$$",
                          "Holds stored voltage $V$",
                          "Acts as an open break"
                        ]
                      },
                      right: {
                        theme: "rose",
                        badge: "AC / Transients",
                        title: "Current Conducts",
                        desc: "Passes high-frequency AC signals.",
                        bullets: [
                          "Rapid voltage change $\\implies$ High current $i$",
                          "Impedance $|\\mathbf{Z}_C| = \\frac{1}{\\omega C}$ drops with frequency",
                          "Used for signal coupling & bypass"
                        ]
                      }
                    },
                    callout: {
                      icon: "bulb",
                      text: "<strong>Energy Stored in a Capacitor:</strong> $w(t) = \\frac{1}{2} C v^2(t) \\quad [\\text{Joules, J}]$. The voltage across a capacitor cannot change instantaneously ($v(0^+) = v(0^-)$), because an abrupt jump requires infinite current: $i = C \\frac{dv}{dt} \\to \\infty$"
                    }
                  }
                ],
                summary: [
                  "<strong>Capacitance Equations:</strong> $q(t) = C \\cdot v(t)$, and $i(t) = C \\frac{dv(t)}{dt}$.",
                  "<strong>Energy Stored:</strong> $w(t) = \\frac{1}{2} C v^2(t) \\quad [\\text{Joules, J}]$.",
                  "<strong>DC Behavior:</strong> Capacitor acts as an <strong>Open Circuit</strong> in DC steady-state ($i = 0$).",
                  "<strong>Parallel Capacitors:</strong> $C_{\\text{eq}} = C_1 + C_2 + \\dots + C_n$.",
                  "<strong>Series Capacitors:</strong> $\\frac{1}{C_{\\text{eq}}} = \\frac{1}{C_1} + \\frac{1}{C_2}$."
                ]
              },
              {
                type: "quiz",
                category: "quiz",
                categoryLabel: "Knowledge Check",
                xp: 50,
                question: "In a DC circuit that has been powered on for a long time (steady state), how does an ideal capacitor behave?",
                prompt: "Recall that in DC steady state, voltage does not change (dv/dt = 0).",
                options: [
                  "As a short circuit (0Ω wire)",
                  "As an open circuit (infinite resistance, zero current)",
                  "As a pure resistor of 100Ω",
                  "As an AC oscillator"
                ],
                correctIndex: 1,
                explanation: "Correct! Because $i(t) = C \\frac{dv(t)}{dt}$ and $\\frac{dv}{dt} = 0$ in DC steady state, the current through the capacitor is identically zero (Open Circuit)."
              },
              {
                type: "flashcard",
                category: "flashcard",
                categoryLabel: "Active Recall",
                question: "Why can the voltage across a capacitor NOT change instantaneously?",
                answer: "Because an instantaneous voltage step ($\\Delta t \\to 0$) requires infinite current ($i = C \\frac{dv}{dt} = \\infty$), which cannot be supplied by any finite physical energy source."
              },
              {
                type: "complete",
                category: "complete",
                categoryLabel: "Milestone",
                xp: 30
              }
            ]
          },

          /* --- LECCIÓN 2-2: Inductors --- */
          {
            id: "lesson-2-2",
            title: "2.2 Inductors & Magnetic Storage",
            subtitle: "Magnetic flux, v = L(di/dt), back-EMF, and inductive kick protection.",
            duration: "20 min",
            steps: [
              {
                type: "content",
                category: "reading",
                categoryLabel: "Reading Chapter • 5 min",
                title: "Inductors and Magnetic Fields",
                subtitle: "Storing energy in a magnetic field created by electric current.",
                durationEstimate: "2:40",
                audioSrc: "audio/lesson-2-2.mp3",
                sections: [
                  {
                    title: "1. Inductance Physics and Faraday's Law",
                    sentences: [
                      { id: "s10_1", text: "An inductor consists of a coil of conducting wire wound around a core of air, iron, or ferrite.", start: 0.1, end: 8.5 },
                      { id: "s10_2", text: "When current flows through the coil, a magnetic field builds up around it.", start: 8.5, end: 15.0 },
                      { id: "s10_3", text: "By Faraday's Law and Lenz's Law, any change in current induces an opposing voltage: v = L × (di / dt).", start: 15.0, end: 24.5 },
                      { id: "s10_4", text: "An inductor resists changes in current.", start: 24.5, end: 29.0 },
                      { id: "s10_5", text: "In a steady-state DC circuit where current is constant (di/dt = 0), an ideal inductor has zero voltage drop and acts as a Short Circuit.", start: 29.0, end: 41.5 }
                    ],
                    callout: {
                      icon: "zap",
                      text: "<strong>Inductive Kick (Flyback Spike):</strong> Abruptly disconnecting an energized inductor creates a dangerous reverse voltage spike ($v = -L \\frac{di}{dt} \\gg V_{\\text{supply}}$) that destroys transistors. A reverse-biased <em>flyback diode</em> must be placed anti-parallel across the coil to clamp the spike to $V_{\\text{clamp}} \\approx V_{\\text{supply}} + 0.7\\text{V}$."
                    }
                  }
                ],
                summary: [
                  "<strong>Inductance Equation:</strong> $v(t) = L \\frac{di(t)}{dt} \\quad [\\text{Volts, V}]$, measured in Henrys (H).",
                  "<strong>Energy Stored:</strong> $w(t) = \\frac{1}{2} L i^2(t) \\quad [\\text{Joules, J}]$.",
                  "<strong>DC Behavior:</strong> Inductor acts as a <strong>Short Circuit</strong> in DC steady-state ($v = 0$).",
                  "<strong>Continuity Rule:</strong> Current through an inductor cannot change instantaneously ($i(0^+) = i(0^-)$).",
                  "<strong>Series / Parallel:</strong> $L_{\\text{series}} = L_1 + L_2$, and $\\frac{1}{L_{\\text{parallel}}} = \\frac{1}{L_1} + \\frac{1}{L_2}$."
                ]
              },
              {
                type: "quiz",
                category: "quiz",
                categoryLabel: "Knowledge Check",
                xp: 50,
                question: "What protective component is placed across an inductive relay coil to suppress high-voltage flyback spikes?",
                prompt: "Consider how current needs a safe discharge path when switched off.",
                options: [
                  "A series resistor",
                  "A reverse-biased Flyback Diode across the coil",
                  "A larger battery",
                  "A blown fuse"
                ],
                correctIndex: 1,
                explanation: "Correct! A flyback diode (freewheeling diode) placed anti-parallel across the relay coil provides a safe recirculation path for the inductor current when the switch opens, clamping the voltage spike to ~0.7V."
              },
              {
                type: "flashcard",
                category: "flashcard",
                categoryLabel: "Active Recall",
                question: "How does an ideal inductor behave in DC steady-state?",
                answer: "As a Short Circuit (a zero-resistance solid wire), because $\\frac{di}{dt} = 0 \\implies v(t) = L(0) = 0\\text{ Volts}$."
              },
              {
                id: "practice-3-1",
                type: "practice",
                category: "practice",
                categoryLabel: "University Problem Set",
                xp: 100,
                title: "University Problem Set: Magnetic Energy Storage & Inductive Flyback Voltage Clamp",
                problemStatement: "Una bobina de relé electromecánico de $L = 250\\text{ mH}$ y resistencia interna de devanado $R_{\\text{coil}} = 24.0\\,\\Omega$ es energizada por una fuente de $V_{CC} = 12.0\\text{ V}$ controlada por un transistor conmutador.\n\n1. Calcule la corriente en estado estacionario de CD $I_0$ y la energía magnética $W_L$ almacenada en el inductor.\n2. Si el interruptor se abre y la corriente decae a cero en $\\Delta t = 0.50\\,\\mu\\text{s}$ sin protección snubber, calcule la sobretensión de fuerza contraelectromotriz (Back-EMF spike) $\\Delta V_L$.\n3. Con un diodo flyback de silicio ($V_F = 0.70\\text{ V}$) conectado en antiparalelo con la bobina, determine la tensión de pinzado segura $V_{\\text{clamp}}$ sobre el colector y la potencia disipada inicial en el lazo.",
                givenData: {
                  "Inductancia (L)": "250 mH = 0.250 H",
                  "Resistencia de devanado (R_coil)": "24.0 \\Omega",
                  "Voltaje de alimentación (V_CC)": "12.0 V",
                  "Tiempo de apertura sin protección (\\Delta t)": "0.50 \\mu\\text{s} = 5.0 \\times 10^{-7}\\text{ s}",
                  "Caída directa de diodo (V_F)": "0.70 V"
                },
                hint: "Aplique la ley de Faraday-Lenz $v_L(t) = L \\frac{di}{dt}$ y la energía $W_L = \\frac{1}{2} L I^2$. Al abrir el circuito, la corriente inductiva no puede cambiar instantáneamente ($i_L(0^+) = i_L(0^-)$).",
                solutionSteps: [
                  "Paso 1: Corriente en estado estacionario de CD y energía almacenada en el campo magnético:\nEn CD permanente, $\\frac{di}{dt} = 0$, por lo que el inductor actúa como cortocircuito puro ($v_L = 0$):\n$I_0 = \\frac{V_{CC}}{R_{\\text{coil}}} = \\frac{12.0\\text{ V}}{24.0\\,\\Omega} = 0.50\\text{ A}$\n$W_L = \\frac{1}{2} L I_0^2 = \\frac{1}{2} (0.250\\text{ H}) (0.50\\text{ A})^2 = 0.125 \\cdot 0.25 = 0.03125\\text{ J} = 31.25\\text{ mJ}$",
                  "Paso 2: Sobretensión inductiva no suprimida (Inductive Kickback Spike):\n$\\Delta V_L = -L \\frac{\\Delta i}{\\Delta t} = -(0.250\\text{ H}) \\left(\\frac{0 - 0.50\\text{ A}}{0.50 \\times 10^{-6}\\text{ s}}\\right) = +(0.250) \\cdot (1.0 \\times 10^6\\text{ A/s}) = +250,000\\text{ V} = +250\\text{ kV}$\nEsta severa sobretensión perfora el dieléctrico de los semiconductores destruyendo el transistor de conmutación.",
                  "Paso 3: Fijación segura de tensión (Clamping) con diodo flyback:\nAl apagarse el transistor, la corriente de la bobina continúa circulando por continuidad a través del diodo en polarización directa:\n$V_{\\text{clamp}} = V_{CC} + V_F = 12.0\\text{ V} + 0.70\\text{ V} = 12.70\\text{ V}$\n$P_{\\text{diode}} = V_F \\cdot I_0 = 0.70\\text{ V} \\cdot 0.50\\text{ A} = 0.350\\text{ W} = 350\\text{ mW}$\nLa energía magnética se extingue exponencialmente de manera segura con constante de tiempo $\\tau = L / R_{\\text{coil}} = 250\\text{ mH} / 24\\,\\Omega = 10.42\\text{ ms}$."
                ],
                finalAnswer: "$$I_0 = 0.50\\text{ A}, \\quad W_L = 31.25\\text{ mJ}, \\quad \\Delta V_L = +250\\text{ kV} \\text{ (sin diodo)}, \\quad V_{\\text{clamp}} = 12.70\\text{ V} \\text{ (con Flyback)}$$",
                textbookCitation: "Alexander & Sadiku 7th Ed, Cap. 6, Sec. 6.4-6.5; Horowitz & Hill (x-Chapters), Cap. 1x.3 (pp. 45-48)"
              },
              {
                type: "complete",
                category: "complete",
                categoryLabel: "Milestone",
                xp: 30
              }
            ]
          }
        ]
      },

      /* ==========================================================
         FASE 4: CIRCUITOS TRANSITORIOS Y RESONANCIA (RC, RL & RLC)
         ========================================================== */
      {
        id: "phase-4",
        title: "Phase 4: Dynamic Transients & Resonance",
        lessons: [
          /* --- LECCIÓN 2-3: First-Order RC Circuits --- */
          {
            id: "lesson-2-3",
            title: "2.3 First-Order RC Transients & Time Constants",
            subtitle: "RC step response, charging curves v(t) = V0(1 - e^-t/τ), and the time constant τ = RC.",
            duration: "25 min",
            steps: [
              {
                type: "content",
                category: "reading",
                categoryLabel: "Reading Chapter • 5 min",
                title: "First-Order RC Transients",
                subtitle: "Exponential charging and discharging dynamics.",
                durationEstimate: "2:40",
                audioSrc: "audio/lesson-2-3.mp3",
                sections: [
                  {
                    title: "1. The Time Constant (τ = RC)",
                    sentences: [
                      { id: "s11_1", text: "When a DC voltage source is connected to a series resistor and capacitor, the capacitor does not charge instantly.", start: 0.1, end: 9.0 },
                      { id: "s11_2", text: "Instead, the voltage rises exponentially according to the differential equation solution: v(t) = Vs × (1 - e^(-t / τ)).", start: 9.0, end: 19.5 },
                      { id: "s11_3", text: "The parameter tau (τ = R × C) is the circuit Time Constant, measured in seconds.", start: 19.5, end: 27.5 },
                      { id: "s11_4", text: "After one time constant (t = 1τ), the capacitor charges to 63.2% of its final voltage.", start: 27.5, end: 36.0 },
                      { id: "s11_5", text: "After five time constants (t = 5τ), the capacitor is over 99.3% charged, considered fully steady state.", start: 36.0, end: 46.5 }
                    ],
                    callout: {
                      icon: "bulb",
                      text: "<strong>The 5-Tau Rule of Thumb:</strong> In practical engineering, any first-order RC or RL circuit reaches steady-state after <strong>5τ</strong> ($v(5\\tau) = V_s(1 - e^{-5}) \\approx 99.33\\%\\text{ settled}$)."
                    }
                  }
                ],
                summary: [
                  "<strong>Time Constant:</strong> $\\tau = R \\cdot C \\quad [\\text{seconds, s}]$.",
                  "<strong>Charging Equation:</strong> $v(t) = V_s\\left(1 - e^{-t/\\tau}\\right)$.",
                  "<strong>Discharging Equation:</strong> $v(t) = V_0 e^{-t/\\tau}$.",
                  "<strong>Key Milestones:</strong> $1\\tau = 63.2\\%$, $3\\tau = 95.0\\%$, $5\\tau = 99.33\\%$ (steady state)."
                ]
              },
              {
                type: "animation",
                category: "simulation",
                categoryLabel: "Interactive Lab",
                labType: "rc-transient",
                title: "Hands-On Lab: RC Charging Oscilloscope",
                description: "Adjust R (1kΩ–100kΩ) and C (1µF–100µF). Toggle the charge/discharge switch and watch the exponential curve render live on the oscilloscope."
              },
              {
                type: "quiz",
                category: "quiz",
                categoryLabel: "Knowledge Check",
                xp: 50,
                question: "An RC circuit has a 10kΩ resistor and a 100µF capacitor. What is its time constant τ?",
                prompt: "Calculate τ = R × C (remember: 10k = 10,000Ω, 100µF = 0.0001F).",
                options: [
                  "1.0 second",
                  "0.1 seconds",
                  "10 seconds",
                  "0.01 seconds"
                ],
                correctIndex: 0,
                explanation: "Correct! $\\tau = R \\cdot C = 10{,}000\\,\\Omega \\times 0.0001\\text{ F} = 1.0\\text{ second}$. It takes approximately $5.0\\text{ seconds}$ ($5\\tau$) to fully charge."
              },
              {
                type: "flashcard",
                category: "flashcard",
                categoryLabel: "Active Recall",
                question: "What percentage of the supply voltage does a capacitor reach after exactly 1 time constant (t = τ)?",
                answer: "$63.2\\%$ of the supply voltage (since $1 - e^{-1} = 1 - 0.3679 = 0.6321$)."
              },
              {
                type: "complete",
                category: "complete",
                categoryLabel: "Milestone",
                xp: 30
              }
            ]
          },

          /* --- LECCIÓN 2-4: Second-Order RLC Circuits --- */
          {
            id: "lesson-2-4",
            title: "2.4 Second-Order RLC Circuits & Resonance",
            subtitle: "Natural frequency ω0, damping factor α, overdamped, critically damped, and underdamped responses.",
            duration: "25 min",
            steps: [
              {
                type: "content",
                category: "reading",
                categoryLabel: "Reading Chapter • 5 min",
                title: "Second-Order RLC Dynamics",
                subtitle: "Energy bouncing between electric and magnetic fields.",
                durationEstimate: "2:30",
                audioSrc: "audio/lesson-2-4.mp3",
                sections: [
                  {
                    title: "1. The Three Regimes of RLC Systems",
                    sentences: [
                      { id: "s12_1", text: "When a circuit contains both a capacitor and an inductor, energy oscillates back and forth between the capacitor's electric field and the inductor's magnetic field.", start: 0.1, end: 11.5 },
                      { id: "s12_2", text: "The undamped resonant frequency is: ω₀ = 1 / sqrt(L × C).", start: 11.5, end: 18.0 },
                      { id: "s12_3", text: "The resistor dissipates energy and provides damping, defined by alpha = R / (2L) for a series circuit.", start: 18.0, end: 27.5 },
                      { id: "s12_4", text: "If alpha is greater than ω₀, the circuit is Overdamped (sluggish, no oscillation).", start: 27.5, end: 35.0 },
                      { id: "s12_5", text: "If alpha equals ω₀, the circuit is Critically Damped (fastest settling with zero overshoot).", start: 35.0, end: 43.5 },
                      { id: "s12_6", text: "If alpha is less than ω₀, the circuit is Underdamped (oscillates and rings before settling).", start: 43.5, end: 52.0 }
                    ],
                    comparison: {
                      left: {
                        theme: "blue",
                        badge: "Critically Damped (α = ω0)",
                        title: "Fastest Settling",
                        desc: "Reaches target voltage fastest with zero ringing.",
                        bullets: [
                          "Ideal for power supplies & control systems",
                          "Zero overshoot ($\\alpha = \\omega_0$)",
                          "Series critical resistance: $R = 2\\sqrt{\\frac{L}{C}}$"
                        ]
                      },
                      right: {
                        theme: "rose",
                        badge: "Underdamped (α < ω0)",
                        title: "Resonant Ringing",
                        desc: "Oscillates at damped frequency ωd.",
                        bullets: [
                          "Damped oscillation: $\\omega_d = \\sqrt{\\omega_0^2 - \\alpha^2}$",
                          "Used in radio tuning tank circuits",
                          "Transient envelope: $e^{-\\alpha t} \\cos(\\omega_d t)$"
                        ]
                      }
                    }
                  }
                ],
                summary: [
                  "<strong>Resonant Frequency:</strong> $\\omega_0 = \\frac{1}{\\sqrt{L \\cdot C}} \\quad [\\text{rad/s}]$.",
                  "<strong>Series Damping:</strong> $\\alpha = \\frac{R}{2L} \\quad\\text{and}\\quad \\text{Parallel: } \\alpha = \\frac{1}{2RC} \\quad [\\text{s}^{-1}]$.",
                  "<strong>Overdamped ($\\alpha > \\omega_0$):</strong> Two real negative roots, sluggish rise.",
                  "<strong>Critically Damped ($\\alpha = \\omega_0$):</strong> Fastest recovery to equilibrium with zero overshoot.",
                  "<strong>Underdamped ($\\alpha < \\omega_0$):</strong> Complex conjugate roots, oscillatory sinusoidal ringing."
                ]
              },
              {
                type: "quiz",
                category: "quiz",
                categoryLabel: "Knowledge Check",
                xp: 50,
                question: "Which damping regime provides the fastest possible step response settling time without any voltage overshoot or ringing?",
                prompt: "Engineers design precision power regulators for this condition.",
                options: [
                  "Overdamped (α > ω0)",
                  "Critically Damped (α = ω0)",
                  "Underdamped (α < ω0)",
                  "Undamped (α = 0)"
                ],
                correctIndex: 1,
                explanation: "Correct! Critical damping ($\\alpha = \\omega_0$) is the optimal design point: it returns to steady state in the minimum possible time without any oscillatory overshoot."
              },
              {
                type: "flashcard",
                category: "flashcard",
                categoryLabel: "Active Recall",
                question: "What is the formula for the undamped resonant frequency ω0 of an LC circuit?",
                answer: "$\\omega_0 = \\frac{1}{\\sqrt{L \\cdot C}} \\quad [\\text{rad/s}] \\implies f_0 = \\frac{1}{2\\pi\\sqrt{LC}} \\quad [\\text{Hz}]$."
              },
              {
                id: "practice-4-1",
                type: "practice",
                category: "practice",
                categoryLabel: "University Problem Set",
                xp: 100,
                title: "University Problem Set: First-Order RC Step Response & Second-Order RLC Damping",
                problemStatement: "Parte A (Transitorio RC de Primer Orden):\nUn capacitor $C = 47.0\\,\\mu\\text{F}$ con carga inicial $v_C(0^-) = -6.0\\text{ V}$ se conecta en $t = 0$ a una fuente escalón $V_s = +15.0\\text{ V}$ en serie con $R = 22.0\\text{ k}\\Omega$.\n1. Calcule la constante de tiempo $\\tau$.\n2. Deduzca la función temporal de tensión $v_C(t)$ para $t \\ge 0$.\n3. Calcule el tiempo exacto de cruce por cero $t_{\\text{zero}}$ ($v_C(t_{\\text{zero}}) = 0\\text{ V}$) y el voltaje en $t = 2.50\\text{ s}$.\n\nParte B (Régimen de Amortiguamiento RLC Serie):\nPara un circuito RLC serie con $L = 10.0\\text{ mH}$ y $C = 10.0\\text{ nF}$, calcule el valor exacto de la resistencia $R_{\\text{crit}}$ para lograr amortiguamiento crítico ($\\alpha = \\omega_0$).",
                givenData: {
                  "Resistencia RC (R)": "22.0 k\\Omega = 2.20 \\times 10^4 \\Omega",
                  "Capacitancia RC (C)": "47.0 \\mu\\text{F} = 4.70 \\times 10^{-5} \\text{F}",
                  "Voltaje inicial RC (v_0)": "-6.0 V",
                  "Voltaje final RC (V_s)": "+15.0 V",
                  "Inductancia RLC (L)": "10.0 mH = 0.010 H",
                  "Capacitancia RLC (C_rlc)": "10.0 nF = 1.0 \\times 10^{-8} \\text{F}"
                },
                hint: "Use la ecuación universal de primer orden: $v(t) = v(\\infty) + [v(0^+) - v(\\infty)]e^{-t/\\tau}$. En RLC serie, $\\omega_0 = 1/\\sqrt{LC}$ y $\\alpha = R/(2L)$.",
                solutionSteps: [
                  "Paso 1: Cálculo de la constante de tiempo $\\tau$ del circuito RC:\n$\\tau = R \\cdot C = (2.20 \\times 10^4\\,\\Omega)(4.70 \\times 10^{-5}\\text{ F}) = 1.034\\text{ s}$",
                  "Paso 2: Derivación de la ecuación de tensión transitoria con condición inicial negativa:\n$v_C(t) = v(\\infty) + [v(0^+) - v(\\infty)]e^{-t/\\tau}$\n$v_C(t) = 15.0 + [-6.0 - 15.0]e^{-t / 1.034} = 15.0 - 21.0\\,e^{-t / 1.034}\\text{ V} \\quad (t \\ge 0)$",
                  "Paso 3: Cálculo del tiempo de cruce por cero $t_{\\text{zero}}$ y valor en $t = 2.50\\text{ s}$:\n$0 = 15.0 - 21.0\\,e^{-t_{\\text{zero}} / 1.034} \\implies e^{-t_{\\text{zero}} / 1.034} = \\frac{15.0}{21.0} = \\frac{5}{7}$\n$t_{\\text{zero}} = -1.034 \\cdot \\ln\\left(\\frac{5}{7}\\right) = 1.034 \\cdot \\ln(1.40) = 1.034 \\cdot 0.33647 = 0.3479\\text{ s} \\approx 0.348\\text{ s}$\nPara $t = 2.50\\text{ s}$:\n$v_C(2.50) = 15.0 - 21.0\\,e^{-2.50 / 1.034} = 15.0 - 21.0\\,e^{-2.4178} = 15.0 - 21.0(0.08912) = 13.13\\text{ V}$",
                  "Paso 4: Determinación de la resistencia de amortiguamiento crítico $R_{\\text{crit}}$ en RLC serie:\n$\\omega_0 = \\frac{1}{\\sqrt{L \\cdot C}} = \\frac{1}{\\sqrt{(10^{-2}\\text{ H})(10^{-8}\\text{ F})}} = \\frac{1}{\\sqrt{10^{-10}}} = 100,000\\text{ rad/s} = 100\\text{ krad/s}$\nEn amortiguamiento crítico: $\\alpha = \\omega_0 \\implies \\frac{R_{\\text{crit}}}{2L} = \\omega_0$\n$R_{\\text{crit}} = 2 L \\omega_0 = 2 (0.010\\text{ H})(100,000\\text{ rad/s}) = 2,000\\,\\Omega = 2.0\\text{ k}\\Omega$"
                ],
                finalAnswer: "$$\\tau = 1.034\\text{ s}, \\quad v_C(t) = 15.0 - 21.0\\,e^{-t / 1.034}\\text{ V}, \\quad t_{\\text{zero}} = 0.348\\text{ s}, \\quad v_C(2.5\\text{ s}) = 13.13\\text{ V}, \\quad R_{\\text{crit}} = 2.0\\text{ k}\\Omega$$",
                textbookCitation: "Alexander & Sadiku 7th Ed, Cap. 7.5 y Cap. 8.3-8.5, Prob. 7.10 / 8.23 (pp. 272-275, 325-330)"
              },
              {
                type: "complete",
                category: "complete",
                categoryLabel: "Milestone",
                xp: 30
              }
            ]
          }
        ]
      },

      /* ==========================================================
         FASE 5: RÉGIMEN PERMANENTE SENOIDAL Y FASORES
         ========================================================== */
      {
        id: "phase-5",
        title: "Phase 5: AC Steady-State & Complex Phasors",
        lessons: [
          /* --- LECCIÓN 3-1: Sinusoids, Phasors & Impedance --- */
          {
            id: "lesson-3-1",
            title: "3.1 Sinusoids, Phasors & Complex Impedance",
            subtitle: "Transforming differential equations into algebra with Euler's formula and complex impedance Z.",
            duration: "30 min",
            steps: [
              {
                type: "content",
                category: "reading",
                categoryLabel: "Reading Chapter • 6 min",
                title: "Phasors and Complex Impedance",
                subtitle: "Solving AC circuits using complex numbers.",
                durationEstimate: "2:50",
                audioSrc: "audio/lesson-3-1.mp3",
                sections: [
                  {
                    title: "1. The Phasor Transformation",
                    sentences: [
                      { id: "s13_1", text: "Analyzing AC circuits with sine and cosine differential equations is extremely tedious.", start: 0.1, end: 7.5 },
                      { id: "s13_2", text: "By using Euler's formula: e^(j theta) = cos(theta) + j sin(theta), we transform time-domain sinusoids into complex vectors called Phasors.", start: 7.5, end: 19.0 },
                      { id: "s13_3", text: "A sinusoid v(t) = Vm cos(ω t + phi) becomes the phasor V = Vm ∠ phi.", start: 19.0, end: 27.5 },
                      { id: "s13_4", text: "In the phasor domain, resistors have impedance ZR = R.", start: 27.5, end: 32.5 },
                      { id: "s13_5", text: "Inductors have impedance ZL = j ω L, where voltage leads current by 90 degrees.", start: 32.5, end: 40.5 },
                      { id: "s13_6", text: "Capacitors have impedance ZC = 1 / (j ω C) = -j / (ω C), where current leads voltage by 90 degrees.", start: 40.5, end: 51.0 }
                    ],
                    comparison: {
                      left: {
                        theme: "blue",
                        badge: "Inductor (ZL = jωL)",
                        title: "Voltage Leads Current (ELI)",
                        desc: "Impedance increases with frequency.",
                        bullets: [
                          "$$\\mathbf{Z}_L = j\\omega L = \\omega L \\angle +90^\\circ$$",
                          "Blocks high-frequency AC ($|\\mathbf{Z}_L| \\to \\infty$)",
                          "Acts as short circuit at DC ($\\omega = 0$)"
                        ]
                      },
                      right: {
                        theme: "rose",
                        badge: "Capacitor (ZC = 1/jωC)",
                        title: "Current Leads Voltage (ICE)",
                        desc: "Impedance decreases with frequency.",
                        bullets: [
                          "$$\\mathbf{Z}_C = \\frac{1}{j\\omega C} = -\\frac{j}{\\omega C} = \\frac{1}{\\omega C}\\angle -90^\\circ$$",
                          "Passes high-frequency AC ($|\\mathbf{Z}_C| \\to 0$)",
                          "Acts as open circuit at DC ($\\omega = 0$)"
                        ]
                      }
                    },
                    callout: {
                      icon: "bulb",
                      text: "<strong>The Classic Mnemonic 'ELI the ICE man':</strong> In an Inductor ($L$), Voltage ($E$) leads Current ($I$) by $90^\\circ$ $\\implies$ <strong>ELI</strong>. In a Capacitor ($C$), Current ($I$) leads Voltage ($E$) by $90^\\circ$ $\\implies$ <strong>ICE</strong>."
                    }
                  }
                ],
                summary: [
                  "<strong>Phasor Representation:</strong> $\\mathbf{V} = V_m \\angle \\phi = V_m e^{j\\phi}$.",
                  "<strong>Ohm's Law in Phasor Domain:</strong> $\\mathbf{V} = \\mathbf{I} \\cdot \\mathbf{Z}$.",
                  "<strong>Resistor Impedance:</strong> $\\mathbf{Z}_R = R \\angle 0^\\circ \\quad [\\Omega]$.",
                  "<strong>Inductor Impedance:</strong> $\\mathbf{Z}_L = j\\omega L = \\omega L \\angle +90^\\circ \\quad [\\Omega]$.",
                  "<strong>Capacitor Impedance:</strong> $\\mathbf{Z}_C = \\frac{1}{j\\omega C} = \\frac{1}{\\omega C} \\angle -90^\\circ \\quad [\\Omega]$."
                ]
              },
              {
                type: "quiz",
                category: "quiz",
                categoryLabel: "Knowledge Check",
                xp: 50,
                question: "In an AC circuit operating at high frequency, what happens to the impedance of a capacitor (ZC = 1 / jωC)?",
                prompt: "Look at the denominator: as angular frequency ω becomes large...",
                options: [
                  "Impedance decreases toward 0Ω (acts like a short circuit to high frequency)",
                  "Impedance increases toward infinity (acts like an open circuit)",
                  "Impedance remains completely constant",
                  "The capacitor turns into an inductor"
                ],
                correctIndex: 0,
                explanation: "Correct! Because $|\\mathbf{Z}_C| = \\frac{1}{\\omega C}$, as frequency $\\omega$ increases, the denominator grows and impedance approaches zero ($0\\,\\Omega$). This is why capacitors shunt high-frequency noise directly to ground!"
              },
              {
                type: "flashcard",
                category: "flashcard",
                categoryLabel: "Active Recall",
                question: "What does the mnemonic 'ELI the ICE man' stand for in AC circuit analysis?",
                answer: "ELI: In an Inductor (L), Voltage (E) leads Current (I) by $+90^\\circ$.\nICE: In a Capacitor (C), Current (I) leads Voltage (E) by $+90^\\circ$."
              },
              {
                type: "complete",
                category: "complete",
                categoryLabel: "Milestone",
                xp: 30
              }
            ]
          },

          /* --- LECCIÓN 3-2: AC Power & Power Factor --- */
          {
            id: "lesson-3-2",
            title: "3.2 AC Power & Power Factor Correction",
            subtitle: "Real power P, reactive power Q, apparent power S, power factor cos(θ), and capacitor banks.",
            duration: "25 min",
            steps: [
              {
                type: "content",
                category: "reading",
                categoryLabel: "Reading Chapter • 5 min",
                title: "AC Power and Power Factor",
                subtitle: "Real power vs reactive power in AC electrical grids.",
                durationEstimate: "2:30",
                audioSrc: "audio/lesson-3-2.mp3",
                sections: [
                  {
                    title: "1. The Power Triangle: P, Q, and S",
                    sentences: [
                      { id: "s14_1", text: "In AC circuits with inductors and capacitors, voltage and current are out of phase.", start: 0.1, end: 7.5 },
                      { id: "s14_2", text: "Real Power P, measured in Watts, is the actual power converted into useful work and heat: P = Vrms × Irms × cos(theta).", start: 7.5, end: 18.0 },
                      { id: "s14_3", text: "Reactive Power Q, measured in VAR, is the power bouncing between the source and reactive fields: Q = Vrms × Irms × sin(theta).", start: 18.0, end: 29.5 },
                      { id: "s14_4", text: "Apparent Power S, measured in Volt-Amps (VA), is the vector combination: S = sqrt(P² + Q²).", start: 29.5, end: 38.0 },
                      { id: "s14_5", text: "The Power Factor is cos(theta) = P / S.", start: 38.0, end: 43.5 }
                    ],
                    callout: {
                      icon: "zap",
                      text: "<strong>Power Factor Correction:</strong> Industrial electric motors draw inductive reactive power ($+Q_L$). Utilities penalize factories with low power factors ($PF < 0.95$). Connecting parallel <strong>Capacitor Banks ($-Q_C$)</strong> cancels out lagging VARs, raising $PF \\to 1.0$ without changing real active work ($P$)."
                    }
                  }
                ],
                summary: [
                  "<strong>Real Power ($P$):</strong> $P = V_{\\text{rms}} I_{\\text{rms}} \\cos(\\theta_v - \\theta_i) \\quad [\\text{Watts, W}]$.",
                  "<strong>Reactive Power ($Q$):</strong> $Q = V_{\\text{rms}} I_{\\text{rms}} \\sin(\\theta_v - \\theta_i) \\quad [\\text{Volt-Amperes Reactive, VAR}]$.",
                  "<strong>Apparent Power ($S$):</strong> $S = V_{\\text{rms}} I_{\\text{rms}} = \\sqrt{P^2 + Q^2} \\quad [\\text{Volt-Amperes, VA}]$.",
                  "<strong>Complex Power ($\\mathbf{S}$):</strong> $\\mathbf{S} = \\mathbf{V}_{\\text{rms}} \\mathbf{I}_{\\text{rms}}^* = P + jQ \\quad [\\text{VA}]$.",
                  "<strong>Power Factor:</strong> $PF = \\cos(\\theta_v - \\theta_i) = \\frac{P}{S} \\quad (0 \\le PF \\le 1.0)$."
                ]
              },
              {
                type: "quiz",
                category: "quiz",
                categoryLabel: "Knowledge Check",
                xp: 50,
                question: "Why do electrical power utilities install capacitor banks in parallel with industrial motor loads?",
                prompt: "Motors create inductive lagging current. What does adding capacitance do?",
                options: [
                  "Capacitors supply reactive power to cancel inductive VARs, raising the power factor to near 1.0",
                  "Capacitors double the AC grid voltage",
                  "Capacitors convert AC power to DC",
                  "Capacitors act as safety fuses"
                ],
                correctIndex: 0,
                explanation: "Correct! Capacitors produce leading reactive power ($-Q_C$) which cancels out the lagging inductive reactive power ($+Q_L$) of motors, reducing total apparent current on transmission lines."
              },
              {
                type: "flashcard",
                category: "flashcard",
                categoryLabel: "Active Recall",
                question: "What is the Power Factor formula in AC circuits?",
                answer: "$\\text{Power Factor (PF)} = \\cos(\\theta) = \\frac{P}{S}$, where $P$ is Real Power in Watts (W) and $S$ is Apparent Power in Volt-Amperes (VA)."
              },
              {
                id: "practice-5-1",
                type: "practice",
                category: "practice",
                categoryLabel: "University Problem Set",
                xp: 100,
                title: "University Problem Set: AC Phasor Power Triangle & Power Factor Correction",
                problemStatement: "Una planta industrial monofásica opera con una tensión de red $V_{\\text{rms}} = 240.0\\text{ V}$ a frecuencia $f = 60.0\\text{ Hz}$ ($\\omega = 377.0\\text{ rad/s}$). La instalación absorbe una potencia activa real $P = 12.0\\text{ kW}$ con un factor de potencia inductivo en atraso $PF_1 = 0.650$.\n\n1. Calcule la potencia aparente $S_1$, la potencia reactiva $Q_1$ y la corriente de línea eficaz $I_{\\text{rms},1}$.\n2. Dimensione el banco de capacitores en paralelo $C_{\\text{comp}}$ necesario para elevar el factor de potencia a $PF_2 = 0.950$ en atraso.\n3. Calcule la nueva corriente de línea eficaz $I_{\\text{rms},2}$ y el porcentaje de reducción en las pérdidas por calentamiento de línea ($I^2 R$).",
                givenData: {
                  "Tensión de línea (V_rms)": "240.0 V",
                  "Frecuencia de red (f)": "60.0 Hz (\\omega = 377.0 rad/s)",
                  "Potencia activa real (P)": "12.0 kW = 12,000 W",
                  "Factor de potencia inicial (PF_1)": "0.650 en atraso",
                  "Factor de potencia objetivo (PF_2)": "0.950 en atraso"
                },
                hint: "Calcule los ángulos $\\theta_1 = \\arccos(0.650)$ y $\\theta_2 = \\arccos(0.950)$. La potencia reactiva suministrada por el banco de capacitores es $Q_C = P(\\tan\\theta_1 - \\tan\\theta_2) = \\omega C V_{\\text{rms}}^2$.",
                solutionSteps: [
                  "Paso 1: Cálculo de los parámetros del triángulo de potencias sin compensar:\n$\\theta_1 = \\arccos(0.650) = 49.458^\circ$\n$S_1 = \\frac{P}{PF_1} = \\frac{12.000\\text{ kW}}{0.650} = 18.4615\\text{ kVA} = 18,462\\text{ VA}$\n$Q_1 = P \\tan(\\theta_1) = 12.000\\text{ kW} \\cdot \\tan(49.458^\circ) = 12.000 \\cdot 1.1691 = 14.029\\text{ kVAR} = 14,029\\text{ VAR}$\n$I_{\\text{rms},1} = \\frac{S_1}{V_{\\text{rms}}} = \\frac{18,462\\text{ VA}}{240.0\\text{ V}} = 76.925\\text{ A}$",
                  "Paso 2: Determinación de la potencia reactiva objetivo con $PF_2 = 0.950$:\n$\\theta_2 = \\arccos(0.950) = 18.195^\circ$\n$Q_2 = P \\tan(\\theta_2) = 12.000\\text{ kW} \\cdot \\tan(18.195^\circ) = 12.000 \\cdot 0.32868 = 3.9442\\text{ kVAR} = 3,944\\text{ VAR}$\n$\\Delta Q = Q_1 - Q_2 = 14,029\\text{ VAR} - 3,944\\text{ VAR} = 10,085\\text{ VAR} = 10.085\\text{ kVAR}$",
                  "Paso 3: Dimensionamiento de la capacitancia de compensación $C_{\\text{comp}}$ en paralelo:\n$Q_C = \\omega C V_{\\text{rms}}^2 \\implies C_{\\text{comp}} = \\frac{Q_C}{\\omega V_{\\text{rms}}^2}$\n$C_{\\text{comp}} = \\frac{10,085\\text{ VAR}}{(377.0\\text{ rad/s}) \\cdot (240.0\\text{ V})^2} = \\frac{10,085}{377.0 \\cdot 57,600} = \\frac{10,085}{21,715,200} = 4.6442 \\times 10^{-4}\\text{ F} = 464.4\\,\\mu\\text{F}$",
                  "Paso 4: Corriente corregida y reducción en pérdidas de transmisión:\n$S_2 = \\frac{P}{PF_2} = \\frac{12.000\\text{ kW}}{0.950} = 12.6316\\text{ kVA} = 12,632\\text{ VA}$\n$I_{\\text{rms},2} = \\frac{S_2}{V_{\\text{rms}}} = \\frac{12,632\\text{ VA}}{240.0\\text{ V}} = 52.632\\text{ A}$\n$\\text{Reducción de corriente} = \\frac{76.925 - 52.632}{76.925} \\times 100\\% = 31.58\\%$\n$\\text{Reducción de pérdidas } I^2 R = 1 - \\left(\\frac{52.632}{76.925}\\right)^2 = 1 - 0.4681 = 53.19\\%$"
                ],
                finalAnswer: "$$S_1 = 18.46\\text{ kVA}, \\quad Q_1 = 14.03\\text{ kVAR}, \\quad C_{\\text{comp}} = 464.4\\,\\mu\\text{F}, \\quad I_{\\text{rms},2} = 52.63\\text{ A}, \\quad \\Delta P_{\\text{loss}} = -53.19\\%$$",
                textbookCitation: "Alexander & Sadiku 7th Ed, Cap. 9.5 y Cap. 11.8, Prob. 11.15 (pp. 479-482)"
              },
              {
                type: "complete",
                category: "complete",
                categoryLabel: "Milestone",
                xp: 30
              }
            ]
          }
        ]
      },

      /* ==========================================================
         FASE 6: FILTROS PASIVOS Y RESPUESTA EN FRECUENCIA
         ========================================================== */
      {
        id: "phase-6",
        title: "Phase 6: Resonance & Frequency Filters",
        lessons: [
          /* --- LECCIÓN 3-3: Frequency Filters & Bode Plots --- */
          {
            id: "lesson-3-3",
            title: "3.3 Passive Filters & Bode Plots",
            subtitle: "Low-pass, high-pass, band-pass, notch filters, cutoff frequency fc = 1/(2πRC), and decibel transfer functions.",
            duration: "25 min",
            steps: [
              {
                type: "content",
                category: "reading",
                categoryLabel: "Reading Chapter • 5 min",
                title: "Passive Filters and the Decibel Scale",
                subtitle: "Selecting and rejecting specific frequency bands.",
                durationEstimate: "2:40",
                audioSrc: "audio/lesson-3-3.mp3",
                sections: [
                  {
                    title: "1. Filter Topologies and Cutoff Frequency",
                    sentences: [
                      { id: "s15_1", text: "A frequency filter is a circuit designed to pass signals with desired frequencies while attenuating unwanted frequencies.", start: 0.1, end: 8.5 },
                      { id: "s15_2", text: "A Low-Pass Filter passes low frequencies from DC up to a cutoff frequency fc, and blocks high frequencies.", start: 8.5, end: 17.5 },
                      { id: "s15_3", text: "A High-Pass Filter blocks DC and low frequencies while passing high frequencies.", start: 17.5, end: 24.0 },
                      { id: "s15_4", text: "The cutoff frequency fc (the -3dB point) for a simple RC filter is: fc = 1 / (2 pi R C).", start: 24.0, end: 33.5 },
                      { id: "s15_5", text: "At the cutoff frequency, the output power drops to exactly 50% of the input power (a 3 decibel drop).", start: 33.5, end: 43.0 }
                    ],
                    comparison: {
                      left: {
                        theme: "blue",
                        badge: "RC Low-Pass Filter",
                        title: "Resistor Series, Capacitor Ground",
                        desc: "Passes DC to fc; attenuates high frequencies.",
                        bullets: [
                          "$$f_c = \\frac{1}{2\\pi R C} \\quad [\\text{Hz}]$$",
                          "Roll-off rate: $-20\\text{ dB/decade}$ ($-6\\text{ dB/octave}$)",
                          "Used for audio bass crossover, anti-aliasing"
                        ]
                      },
                      right: {
                        theme: "rose",
                        badge: "RC High-Pass Filter",
                        title: "Capacitor Series, Resistor Ground",
                        desc: "Blocks DC offset; passes AC signals above fc.",
                        bullets: [
                          "$$f_c = \\frac{1}{2\\pi R C} \\quad [\\text{Hz}]$$",
                          "Blocks DC bias voltages ($\\mathbf{H}(0) = 0$)",
                          "Used for microphone inputs, audio treble"
                        ]
                      }
                    }
                  }
                ],
                summary: [
                  "<strong>Cutoff Frequency:</strong> $f_c = \\frac{1}{2\\pi R C} \\quad [\\text{Hertz, Hz}]$.",
                  "<strong>The -3dB Half-Power Point:</strong> Output voltage drops to $|\\mathbf{H}(f_c)| = \\frac{1}{\\sqrt{2}} \\approx 70.71\\%$; power drops to $50\\%$ ($20\\log_{10}(1/\\sqrt{2}) = -3.01\\text{ dB}$).",
                  "<strong>First-Order Filter Roll-Off:</strong> $-20\\text{ dB per decade}$ ($-6\\text{ dB per octave}$).",
                  "<strong>Decibel Gain Formula:</strong> $G_{\\text{dB}} = 20 \\log_{10}\\left(\\frac{V_{\\text{out}}}{V_{\\text{in}}}\\right)$."
                ]
              },
              {
                type: "quiz",
                category: "quiz",
                categoryLabel: "Knowledge Check",
                xp: 50,
                question: "At the cutoff frequency fc of a low-pass filter, what is the output power relative to the maximum input power?",
                prompt: "Recall what -3dB represents in terms of power attenuation.",
                options: [
                  "100% (no change)",
                  "50% (half power / -3dB)",
                  "10% (-10dB)",
                  "0% (completely dead)"
                ],
                correctIndex: 1,
                explanation: "Correct! The cutoff frequency $f_c$ is formally defined as the half-power point ($-3\\text{ dB}$), where output power is $50\\%$ ($P_{\\text{out}} = \\frac{1}{2} P_{\\text{in}}$) and output voltage is $70.71\\%$ ($\\frac{1}{\\sqrt{2}}$) of maximum."
              },
              {
                type: "flashcard",
                category: "flashcard",
                categoryLabel: "Active Recall",
                question: "What is the formula for the cutoff frequency fc of a passive RC low-pass filter?",
                answer: "$f_c = \\frac{1}{2\\pi R C} \\quad [\\text{Hertz, Hz}]$."
              },
              {
                id: "practice-6-1",
                type: "practice",
                category: "practice",
                categoryLabel: "University Problem Set",
                xp: 100,
                title: "University Problem Set: Second-Order Bandpass RLC Filter Transfer Function & Bode Analysis",
                problemStatement: "Un filtro pasabanda pasivo RLC serie está constituido por un resistor $R = 50.0\\,\\Omega$, un inductor $L = 10.0\\text{ mH}$ y un capacitor $C = 10.0\\text{ nF}$, tomando la señal de salida $v_{\\text{out}}(t)$ sobre el resistor $R$.\n\n1. Determine la frecuencia angular de resonancia $\\omega_0$ (en rad/s) y la frecuencia central $f_0$ (en Hz).\n2. Calcule el Factor de Calidad $Q$ del filtro y el Ancho de Banda $B$ (en rad/s y en Hz).\n3. Calcule las frecuencias de corte de media potencia ($-3\\text{ dB}$) $\\omega_1$ y $\\omega_2$.\n4. Deduzca la magnitud de la función de transferencia $|\\mathbf{H}(j\\omega)|$ y su atenuación en decibeles a una octava por encima de la resonancia ($f = 2 f_0$).",
                givenData: {
                  "Resistencia (R)": "50.0 \\Omega",
                  "Inductancia (L)": "10.0 mH = 0.010 H",
                  "Capacitancia (C)": "10.0 nF = 1.0 \\times 10^{-8} \\text{F}"
                },
                hint: "En el filtro pasabanda serie con salida sobre $R$, la función de transferencia normalizada es $\\mathbf{H}(j\\omega) = \\frac{1}{1 + j Q (\\omega/\\omega_0 - \\omega_0/\\omega)}$. A la frecuencia de resonancia $\\omega_0$, la impedancia reactiva neta se anula y la ganancia es $|\\mathbf{H}| = 1$ ($0\\text{ dB}$).",
                solutionSteps: [
                  "Paso 1: Frecuencia angular de resonancia $\\omega_0$ y frecuencia central $f_0$:\n$\\omega_0 = \\frac{1}{\\sqrt{L \\cdot C}} = \\frac{1}{\\sqrt{(10^{-2}\\text{ H})(10^{-8}\\text{ F})}} = \\frac{1}{\\sqrt{10^{-10}}} = 100,000\\text{ rad/s} = 100\\text{ krad/s}$\n$f_0 = \\frac{\\omega_0}{2\\pi} = \\frac{100,000}{6.283185} = 15,915.5\\text{ Hz} \\approx 15.92\\text{ kHz}$",
                  "Paso 2: Factor de Calidad $Q$ y Ancho de Banda $B$:\n$Q = \\frac{\\omega_0 L}{R} = \\frac{(100,000\\text{ rad/s})(0.010\\text{ H})}{50.0\\,\\Omega} = \\frac{1,000}{50.0} = 20.0$\n$B_{\\text{rad}} = \\frac{\\omega_0}{Q} = \\frac{100,000\\text{ rad/s}}{20.0} = 5,000\\text{ rad/s}$\n$BW_{\\text{Hz}} = \\frac{B_{\\text{rad}}}{2\\pi} = \\frac{5,000}{6.283185} = 795.77\\text{ Hz} \\approx 795.8\\text{ Hz}$",
                  "Paso 3: Frecuencias de corte de media potencia ($-3\\text{ dB}$):\n$\\omega_{1,2} = \\omega_0 \\sqrt{1 + \\left(\\frac{1}{2Q}\\right)^2} \\mp \\frac{\\omega_0}{2Q} \\approx \\omega_0 \\mp \\frac{B}{2}$\n$\\omega_1 = 100,000 - 2,500 = 97,500\\text{ rad/s} \\quad (f_1 = 15.518\\text{ kHz})$\n$\\omega_2 = 100,000 + 2,500 = 102,500\\text{ rad/s} \\quad (f_2 = 16.313\\text{ kHz})$",
                  "Paso 4: Respuesta en magnitud y atenuación en decibeles a $\\omega = 2 \\omega_0 = 200\\text{ krad/s}$:\n$\\mathbf{H}(j 2\\omega_0) = \\frac{1}{1 + j Q \\left(2 - \\frac{1}{2}\\right)} = \\frac{1}{1 + j(20.0)(1.50)} = \\frac{1}{1 + j 30.0}$\n$|\\mathbf{H}(j 2\\omega_0)| = \\frac{1}{\\sqrt{1^2 + 30.0^2}} = \\frac{1}{\\sqrt{901}} = \\frac{1}{30.01666} = 0.033315$\n$|\\mathbf{H}|_{\\text{dB}} = 20 \\log_{10}(0.033315) = -29.55\\text{ dB}$"
                ],
                finalAnswer: "$$\\omega_0 = 100\\text{ krad/s}, \\quad f_0 = 15.92\\text{ kHz}, \\quad Q = 20.0, \\quad BW = 795.8\\text{ Hz}, \\quad |\\mathbf{H}(2f_0)|_{\\text{dB}} = -29.55\\text{ dB}$$",
                textbookCitation: "Alexander & Sadiku 7th Ed, Cap. 14.3-14.5, Ej. 14.7 (pp. 619-624); AoE Cap. 1x.5"
              },
              {
                type: "complete",
                category: "complete",
                categoryLabel: "Milestone",
                xp: 30
              }
            ]
          }
        ]
      },

      /* ==========================================================
         FASE 7: AMPLIFICADORES OPERACIONALES (OP-AMPS)
         ========================================================== */
      {
        id: "phase-7",
        title: "Phase 7: Operational Amplifiers (Op-Amps)",
        lessons: [
          /* --- LECCIÓN 4-1: The Ideal Op-Amp & Golden Rules --- */
          {
            id: "lesson-4-1",
            title: "4.1 The Ideal Op-Amp & Golden Rules",
            subtitle: "Virtual short v+ = v-, zero input current i+ = i- = 0, open-loop gain A = ∞, and feedback.",
            duration: "25 min",
            steps: [
              {
                type: "content",
                category: "reading",
                categoryLabel: "Reading Chapter • 5 min",
                title: "The Ideal Operational Amplifier",
                subtitle: "The Swiss Army knife of analog electronics.",
                durationEstimate: "2:35",
                audioSrc: "audio/lesson-4-1.mp3",
                sections: [
                  {
                    title: "1. The Two Golden Rules of Op-Amps",
                    sentences: [
                      { id: "s16_1", text: "An Operational Amplifier is a high-gain differential voltage amplifier with two inputs and one output.", start: 0.1, end: 8.5 },
                      { id: "s16_2", text: "When connected with negative feedback, an ideal op-amp obeys two simple Golden Rules.", start: 8.5, end: 15.5 },
                      { id: "s16_3", text: "Rule One: No current flows into either input terminal: i+ = 0 and i− = 0, because input impedance is infinite.", start: 15.5, end: 26.5 },
                      { id: "s16_4", text: "Rule Two: The negative feedback forces the differential input voltage to zero, creating a virtual short: v+ = v−.", start: 26.5, end: 38.0 },
                      { id: "s16_5", text: "With these two rules, analyzing complex op-amp amplifier circuits requires only basic nodal algebra.", start: 38.0, end: 47.0 }
                    ],
                    comparison: {
                      left: {
                        theme: "blue",
                        badge: "Golden Rule 1",
                        title: "Zero Input Current (i+ = i- = 0)",
                        desc: "Input impedance is virtually infinite.",
                        bullets: [
                          "$$i_+ = i_- = 0\\text{ A} \\quad (R_{\\text{in}} = \\infty)$$",
                          "Draws zero current from sensor signal",
                          "Eliminates sensor loading effects"
                        ]
                      },
                      right: {
                        theme: "rose",
                        badge: "Golden Rule 2",
                        title: "Virtual Short (v+ = v-)",
                        desc: "Negative feedback equalizes input potentials.",
                        bullets: [
                          "$$v_+ = v_- \\quad [\\text{Virtual Short}]$$",
                          "Virtual ground when $v_+ = 0\\text{ V}$",
                          "Requires active negative feedback loop"
                        ]
                      }
                    }
                  }
                ],
                summary: [
                  "<strong>Ideal Op-Amp Parameters:</strong> $R_{\\text{in}} = \\infty$, $R_{\\text{out}} = 0$, Open-loop gain $A = \\infty$, Bandwidth $BW = \\infty$.",
                  "<strong>Golden Rule 1:</strong> $i_+ = i_- = 0$ (no current enters the input pins).",
                  "<strong>Golden Rule 2:</strong> $v_+ = v_-$ (the inputs are at identical potential under negative feedback).",
                  "<strong>Supply Rail Bounds:</strong> $-V_{\\text{sat}} \\le v_{\\text{out}} \\le +V_{\\text{sat}}$."
                ]
              },
              {
                type: "quiz",
                category: "quiz",
                categoryLabel: "Knowledge Check",
                xp: 50,
                question: "Under negative feedback, what are the two Golden Rules of an ideal Op-Amp?",
                prompt: "Consider the input currents and the differential input voltage.",
                options: [
                  "i+ = i- = 0 (zero input current) and v+ = v- (virtual short)",
                  "i+ = 1A and v+ = 10V",
                  "Output voltage is always 0V",
                  "Gain is always equal to 1"
                ],
                correctIndex: 0,
                explanation: "Correct! The two Golden Rules of ideal op-amps are: 1) Zero current enters either input pin ($i_+ = i_- = 0$) and 2) The inputs have equal voltages ($v_+ = v_-$) due to negative feedback."
              },
              {
                type: "flashcard",
                category: "flashcard",
                categoryLabel: "Active Recall",
                question: "What is an Op-Amp 'Virtual Ground'?",
                answer: "When the non-inverting pin ($v_+$) is tied to Ground ($0\\text{ V}$) and negative feedback is present, Golden Rule 2 forces the inverting pin ($v_-$) to also be at $0\\text{ V}$, even though it is not physically wired to Ground."
              },
              {
                type: "complete",
                category: "complete",
                categoryLabel: "Milestone",
                xp: 30
              }
            ]
          },

          /* --- LECCIÓN 4-2: Inverting, Non-Inverting & Buffer Amplifiers --- */
          {
            id: "lesson-4-2",
            title: "4.2 Inverting, Non-Inverting & Buffer Amplifiers",
            subtitle: "Closed-loop gain formulas Av = -Rf/R1, Av = 1 + Rf/R1, and the unity-gain voltage follower.",
            duration: "25 min",
            steps: [
              {
                type: "content",
                category: "reading",
                categoryLabel: "Reading Chapter • 5 min",
                title: "Standard Op-Amp Configurations",
                subtitle: "Building precision gain blocks with negative feedback.",
                durationEstimate: "2:40",
                audioSrc: "audio/lesson-4-2.mp3",
                sections: [
                  {
                    title: "1. The Inverting and Non-Inverting Amplifiers",
                    sentences: [
                      { id: "s17_1", text: "The two most common linear amplifier topologies are the Inverting and Non-Inverting amplifiers.", start: 0.1, end: 8.0 },
                      { id: "s17_2", text: "In an Inverting Amplifier, the input signal connects through R1 to the inverting input, with feedback resistor Rf.", start: 8.0, end: 17.5 },
                      { id: "s17_3", text: "The closed-loop voltage gain is: Av = - (Rf / R1). The negative sign indicates a 180 degree phase inversion.", start: 17.5, end: 27.5 },
                      { id: "s17_4", text: "In a Non-Inverting Amplifier, the input connects directly to the non-inverting input.", start: 27.5, end: 34.0 },
                      { id: "s17_5", text: "The voltage gain is: Av = 1 + (Rf / R1), which is always positive and greater than or equal to one.", start: 34.0, end: 43.5 },
                      { id: "s17_6", text: "If Rf is zero and R1 is omitted, the gain is exactly 1. This is a Voltage Follower buffer with infinite input impedance and zero output impedance.", start: 43.5, end: 56.0 }
                    ],
                    comparison: {
                      left: {
                        theme: "blue",
                        badge: "Inverting Amplifier",
                        title: "Av = - (Rf / R1)",
                        desc: "Inverts signal polarity; input impedance is R1.",
                        bullets: [
                          "$$v_{\\text{out}} = -\\left(\\frac{R_f}{R_1}\\right) v_{\\text{in}}$$",
                          "Virtual ground ($0\\text{ V}$) at inverting node",
                          "Can achieve gains less than 1 ($R_f < R_1$)"
                        ]
                      },
                      right: {
                        theme: "rose",
                        badge: "Non-Inverting Amplifier",
                        title: "Av = 1 + (Rf / R1)",
                        desc: "Preserves signal polarity; infinite input impedance.",
                        bullets: [
                          "$$v_{\\text{out}} = \\left(1 + \\frac{R_f}{R_1}\\right) v_{\\text{in}}$$",
                          "Zero loading on source ($R_{\\text{in}} \\approx \\infty$)",
                          "Buffer follower mode: $R_f = 0 \\implies A_v = 1$"
                        ]
                      }
                    }
                  }
                ],
                summary: [
                  "<strong>Inverting Gain:</strong> $A_v = -\\frac{R_f}{R_1} \\implies v_{\\text{out}} = -\\left(\\frac{R_f}{R_1}\\right) v_{\\text{in}}$.",
                  "<strong>Non-Inverting Gain:</strong> $A_v = 1 + \\frac{R_f}{R_1} \\implies v_{\\text{out}} = \\left(1 + \\frac{R_f}{R_1}\\right) v_{\\text{in}}$.",
                  "<strong>Voltage Follower (Buffer):</strong> $A_v = 1$, $R_{\\text{in}} = \\infty$, $R_{\\text{out}} = 0$ — isolates weak high-impedance sensors from heavy low-impedance loads."
                ]
              },
              {
                type: "quiz",
                category: "quiz",
                categoryLabel: "Knowledge Check",
                xp: 50,
                question: "In an inverting op-amp amplifier, R1 = 10kΩ and Rf = 50kΩ. If Vin = 0.5V, what is Vout?",
                prompt: "Use the inverting gain formula: Vout = - (Rf / R1) × Vin.",
                options: [
                  "-2.5 Volts",
                  "+2.5 Volts",
                  "-5.0 Volts",
                  "+0.1 Volts"
                ],
                correctIndex: 0,
                explanation: "Correct! $A_v = -\\left(\\frac{50\\text{ k}\\Omega}{10\\text{ k}\\Omega}\\right) = -5$. $V_{\\text{out}} = -5 \\times 0.5\\text{ V} = -2.5\\text{ Volts}$."
              },
              {
                type: "flashcard",
                category: "flashcard",
                categoryLabel: "Active Recall",
                question: "What is the primary purpose of a unity-gain Voltage Follower buffer (Av = 1)?",
                answer: "To eliminate loading effects. It isolates a weak high-impedance signal source ($R_{\\text{source}} \\gg 0$) from a heavy low-impedance load without altering the signal voltage ($A_v = 1$)."
              },
              {
                id: "practice-7-1",
                type: "practice",
                category: "practice",
                categoryLabel: "University Problem Set",
                xp: 100,
                title: "University Problem Set: Precision Op-Amp Summing Integrator & Closed-Loop Bandwidth",
                problemStatement: "Un circuito integrador sumador de instrumentación utiliza un amplificador operacional ideal con retroalimentación negativa. El circuito posee dos canales de entrada: una tensión de polarización continua $v_1(t) = +2.00\\text{ V}$ conectada a través de $R_1 = 100.0\\text{ k}\\Omega$, y una señal de excitación $v_2(t) = +1.00\\text{ V}$ conectada a través de $R_2 = 50.0\\text{ k}\\Omega$. En el lazo de retroalimentación se conecta un capacitor $C_f = 0.220\\,\\mu\\text{F}$ en paralelo con un resistor de purga (bleeder reset resistor) $R_f = 1.00\\text{ M}\\Omega$.\n\n1. Formule la ecuación diferencial para la tensión de salida $v_{\\text{out}}(t)$ aplicando las Reglas de Oro en el nodo de tierra virtual ($v_- = 0\\text{ V}$).\n2. Para integración de rampa con $R_f \\to \\infty$, calcule la pendiente de salida $\\frac{dv_{\\text{out}}}{dt}$ cuando ambas entradas están activas.\n3. Determine la frecuencia de corte inferior de $-3\\text{ dB}$ ($f_{\\text{break}}$) introducida por el resistor $R_f$ para estabilizar la ganancia en continua y evitar la saturación.",
                givenData: {
                  "Resistor canal 1 (R_1)": "100.0 k\\Omega = 1.00 \\times 10^5 \\Omega",
                  "Resistor canal 2 (R_2)": "50.0 k\\Omega = 5.00 \\times 10^4 \\Omega",
                  "Capacitor de integración (C_f)": "0.220 \\mu\\text{F} = 2.20 \\times 10^{-7} \\text{F}",
                  "Resistor de purga (R_f)": "1.00 M\\Omega = 1.00 \\times 10^6 \\Omega",
                  "Tensiones de entrada": "v_1 = +2.00 V, \\quad v_2 = +1.00 V"
                },
                hint: "Aplique la Regla de Oro 1 ($i_- = i_+ = 0$) y la Regla de Oro 2 ($v_- = v_+ = 0\\text{ V}$). La suma de corrientes que entran al nodo inversor debe ser igual a la corriente total que sale hacia el lazo de retroalimentación.",
                solutionSteps: [
                  "Paso 1: Formulación nodal de KCL en el nodo inversor de tierra virtual ($v_- = 0\\text{ V}$):\n$\\frac{v_1 - 0}{R_1} + \\frac{v_2 - 0}{R_2} + C_f \\frac{d(v_{\\text{out}} - 0)}{dt} + \\frac{v_{\\text{out}} - 0}{R_f} = 0$\n$C_f \\frac{dv_{\\text{out}}}{dt} + \\frac{v_{\\text{out}}}{R_f} = -\\left(\\frac{v_1}{R_1} + \\frac{v_2}{R_2}\\right)$",
                  "Paso 2: Cálculo de la corriente de entrada total e integración de rampa:\n$i_1 = \\frac{2.00\\text{ V}}{100,000\\,\\Omega} = 20.0\\,\\mu\\text{A}, \\quad i_2 = \\frac{1.00\\text{ V}}{50,000\\,\\Omega} = 20.0\\,\\mu\\text{A}$\n$i_{\\text{in,total}} = i_1 + i_2 = 40.0\\,\\mu\\text{A} = 4.00 \\times 10^{-5}\\text{ A}$\n$\\frac{dv_{\\text{out}}}{dt} = -\\frac{i_{\\text{in,total}}}{C_f} = -\\frac{4.00 \\times 10^{-5}\\text{ A}}{2.20 \\times 10^{-7}\\text{ F}} = -181.818\\text{ V/s} = -0.1818\\text{ V/ms}$",
                  "Paso 3: Frecuencia de corte inferior de purga ($f_{\\text{break}}$) por polo en lazo cerrado:\n$f_{\\text{break}} = \\frac{1}{2\\pi R_f C_f} = \\frac{1}{2\\pi (10^6\\,\\Omega)(2.20 \\times 10^{-7}\\text{ F})} = \\frac{1}{2\\pi (0.220\\text{ s})} = \\frac{1}{1.3823\\text{ s}} = 0.7234\\text{ Hz} \\approx 0.723\\text{ Hz}$\nPara frecuencias $f \\gg 0.723\\text{ Hz}$ (como audio o señales de control), el circuito opera como un integrador puro con mínima distorsión de fase."
                ],
                finalAnswer: "$$\\frac{dv_{\\text{out}}}{dt} = -181.82\\text{ V/s}, \\quad i_{\\text{in,total}} = 40.0\\,\\mu\\text{A}, \\quad f_{\\text{break}} = 0.723\\text{ Hz}$$",
                textbookCitation: "Alexander & Sadiku 7th Ed, Cap. 5.5-5.8, Prob. 5.9 (pp. 192-196); Horowitz & Hill (AoE 3rd Ed), Cap. 4x"
              },
              {
                type: "complete",
                category: "complete",
                categoryLabel: "Milestone",
                xp: 30
              }
            ]
          }
        ]
      },

      /* ==========================================================
         FASE 8: SEMICONDUCTORES Y CRAFT DE HARDWARE REAL
         ========================================================== */
      {
        id: "phase-8",
        title: "Phase 8: Semiconductors & Real-World Engineering Craft",
        lessons: [
          /* --- LECCIÓN 4-5: Diodes, Rectifiers & Regulators --- */
          {
            id: "lesson-4-5",
            title: "4.5 Diodes, Zener Regulators & Rectifiers",
            subtitle: "PN junctions, forward drop Vf, reverse breakdown, bridge rectifiers, and Zener reference diodes.",
            duration: "25 min",
            steps: [
              {
                type: "content",
                category: "reading",
                categoryLabel: "Reading Chapter • 5 min",
                title: "Diodes and DC Rectification",
                subtitle: "One-way electron valves and voltage references.",
                durationEstimate: "2:40",
                audioSrc: "audio/lesson-4-5.mp3",
                sections: [
                  {
                    title: "1. PN Junction Physics and Diode Behavior",
                    sentences: [
                      { id: "s18_1", text: "A semiconductor diode is formed by joining P-type and N-type silicon.", start: 0.1, end: 6.5 },
                      { id: "s18_2", text: "It acts as a one-way valve for electric current.", start: 6.5, end: 10.5 },
                      { id: "s18_3", text: "When forward-biased (anode more positive than cathode), standard silicon diodes conduct with a constant forward voltage drop of approximately 0.7 Volts.", start: 10.5, end: 22.0 },
                      { id: "s18_4", text: "When reverse-biased, the diode blocks current completely up to its breakdown voltage.", start: 22.0, end: 28.5 },
                      { id: "s18_5", text: "Four diodes configured in a Full-Wave Bridge Rectifier convert alternating AC current into pulsating direct DC current.", start: 28.5, end: 39.0 }
                    ],
                    comparison: {
                      left: {
                        theme: "blue",
                        badge: "Standard Rectifier Diode (1N4001)",
                        title: "Forward Conduction (0.7V Drop)",
                        desc: "Blocks reverse current; passes forward current.",
                        bullets: [
                          "Forward threshold: $V_f \\approx 0.7\\text{ V}$ (Silicon)",
                          "Used in AC-to-DC power supplies",
                          "Reverse breakdown: $50\\text{ V}$ to $1000\\text{ V}$"
                        ]
                      },
                      right: {
                        theme: "rose",
                        badge: "Zener Diode (BZX55)",
                        title: "Controlled Reverse Breakdown",
                        desc: "Maintains a fixed constant voltage in reverse bias.",
                        bullets: [
                          "Operates stably in reverse breakdown region",
                          "Provides constant reference voltage ($V_Z = 5.1\\text{V}$)",
                          "Used in voltage regulators & overvoltage clamps"
                        ]
                      }
                    }
                  }
                ],
                summary: [
                  "<strong>Forward Bias:</strong> Conducts when $V_{\\text{anode}} - V_{\\text{cathode}} \\ge V_f \\approx 0.7\\text{ V}$.",
                  "<strong>Reverse Bias:</strong> Blocks current completely ($i_D \\approx -I_S$) until breakdown voltage.",
                  "<strong>Zener Diodes:</strong> Engineered to operate stably in reverse breakdown to establish reference voltages $V_{\\text{out}} = V_Z$.",
                  "<strong>Bridge Rectifier:</strong> Converts AC sine wave into continuous positive DC pulses ($V_{\\text{peak, out}} = V_{\\text{peak, in}} - 2V_f$)."
                ]
              },
              {
                type: "quiz",
                category: "quiz",
                categoryLabel: "Knowledge Check",
                xp: 50,
                question: "What is the typical forward voltage drop across a standard silicon PN junction diode when conducting?",
                prompt: "Recall the standard threshold for silicon PN junctions.",
                options: [
                  "0.0 Volts (ideal)",
                  "0.7 Volts",
                  "5.0 Volts",
                  "12.0 Volts"
                ],
                correctIndex: 1,
                explanation: "Correct! Silicon PN junction diodes require approximately $0.6\\text{V} - 0.7\\text{V}$ of forward bias to overcome the internal barrier potential."
              },
              {
                type: "flashcard",
                category: "flashcard",
                categoryLabel: "Active Recall",
                question: "How does a Zener diode function differently from a standard rectifier diode?",
                answer: "A standard diode is damaged by reverse breakdown. A Zener diode is specifically engineered to operate continuously in reverse breakdown, maintaining a precise, constant voltage ($V_{\\text{out}} = V_Z$) for voltage regulation."
              },
              {
                type: "complete",
                category: "complete",
                categoryLabel: "Milestone",
                xp: 30
              }
            ]
          },

          /* --- LECCIÓN 4-6: BJTs and MOSFETs --- */
          {
            id: "lesson-4-6",
            title: "4.6 Transistors: BJTs and MOSFETs as Switches",
            subtitle: "Current-controlled BJTs (β = Ic/Ib) vs voltage-controlled MOSFETs (Vgs, Rds(on)), and driving heavy loads.",
            duration: "30 min",
            steps: [
              {
                type: "content",
                category: "reading",
                categoryLabel: "Reading Chapter • 6 min",
                title: "Transistors as Electronic Switches",
                subtitle: "Controlling large electrical power with small micro-signals.",
                durationEstimate: "2:50",
                audioSrc: "audio/lesson-4-6.mp3",
                sections: [
                  {
                    title: "1. BJTs vs MOSFETs",
                    sentences: [
                      { id: "s19_1", text: "Transistors are the building blocks of all modern electronics, serving two main functions: switching and amplification.", start: 0.1, end: 9.0 },
                      { id: "s19_2", text: "Bipolar Junction Transistors (BJTs) are current-controlled devices.", start: 9.0, end: 14.5 },
                      { id: "s19_3", text: "A small base current Ib controls a large collector current Ic according to the current gain: Ic = beta × Ib.", start: 14.5, end: 24.5 },
                      { id: "s19_4", text: "MOSFETs are voltage-controlled devices.", start: 24.5, end: 29.0 },
                      { id: "s19_5", text: "A voltage applied between Gate and Source (VGS) opens a conductive channel between Drain and Source, with virtually zero gate current.", start: 29.0, end: 40.5 },
                      { id: "s19_6", text: "Because MOSFETs require no continuous gate current and have ultra-low on-resistance RDS(on), they dominate modern high-power switching.", start: 40.5, end: 52.0 }
                    ],
                    comparison: {
                      left: {
                        theme: "blue",
                        badge: "BJT (e.g. 2N3904)",
                        title: "Current-Controlled (Ib)",
                        desc: "Small base current controls collector current.",
                        bullets: [
                          "$$I_c = \\beta \\cdot I_b \\quad (\\beta \\approx 100-300)$$",
                          "Base-emitter forward drop: $V_{BE} \\approx 0.7\\text{ V}$",
                          "Saturation drop: $V_{CE(\\text{sat})} \\approx 0.2\\text{ V}$"
                        ]
                      },
                      right: {
                        theme: "rose",
                        badge: "MOSFET (e.g. IRFZ44N)",
                        title: "Voltage-Controlled (VGS)",
                        desc: "Gate voltage controls drain current; Igate = 0.",
                        bullets: [
                          "Turn-on threshold: $V_{GS(\\text{th})} \\approx 2\\text{V to } 4\\text{V}$",
                          "Zero static gate current ($I_G \\equiv 0\\text{ A}$)",
                          "Ultra-low ON-resistance: $R_{DS(\\text{on})} \\approx 5\\text{ m}\\Omega$"
                        ]
                      }
                    }
                  }
                ],
                summary: [
                  "<strong>BJT:</strong> Current-controlled device ($I_c = \\beta I_b$). In saturation, acts as a closed switch ($V_{CE(\\text{sat})} \\approx 0.2\\text{V}$).",
                  "<strong>MOSFET:</strong> Voltage-controlled device ($V_{GS}$). When $V_{GS} > V_{GS(\\text{th})}$, channel conducts with low resistance $R_{DS(\\text{on})}$.",
                  "<strong>Efficiency:</strong> MOSFETs dominate power electronics due to zero static gate drive power loss ($P_{\\text{gate}} = 0$)."
                ]
              },
              {
                type: "quiz",
                category: "quiz",
                categoryLabel: "Knowledge Check",
                xp: 50,
                question: "What is the primary advantage of a power MOSFET over a BJT when used as a high-speed electronic switch?",
                prompt: "Consider the control input: current vs voltage.",
                options: [
                  "MOSFET is voltage-controlled and draws zero static current at the gate, offering ultra-high efficiency",
                  "MOSFET is cheaper than copper wire",
                  "MOSFET only works with AC voltages",
                  "MOSFET produces more heat than a resistor"
                ],
                correctIndex: 0,
                explanation: "Correct! Because a MOSFET's gate is insulated by silicon dioxide (SiO2), it acts as a capacitor and draws zero continuous DC gate current ($I_G = 0$), drastically reducing driver power dissipation."
              },
              {
                type: "flashcard",
                category: "flashcard",
                categoryLabel: "Active Recall",
                question: "What does RDS(on) mean in a MOSFET datasheet?",
                answer: "$R_{DS(\\text{on})}$ is the internal drain-to-source resistance when the MOSFET is fully turned on into saturation. Lower $R_{DS(\\text{on})}$ (e.g. $5\\text{ m}\\Omega$) means lower $I^2 R$ conduction heat loss ($P = I_D^2 R_{DS(\\text{on})}$) and cooler operation."
              },
              {
                id: "practice-8-1",
                type: "practice",
                category: "practice",
                categoryLabel: "University Problem Set",
                xp: 100,
                title: "University Problem Set: BJT Switch Biasing, Saturation Factor & CMOS Logic Inverter",
                problemStatement: "Se diseña una etapa de conmutación de potencia con un transistor BJT NPN (2N2222A) para accionar una carga de relé $R_C = 120.0\\,\\Omega$ conectada a una fuente de alimentación $V_{CC} = +12.0\\text{ V}$. La señal de control proviene de una compuerta digital con niveles $V_{\\text{in,LOW}} = 0.0\\text{ V}$ y $V_{\\text{in,HIGH}} = +3.30\\text{ V}$.\nParámetros del BJT: ganancia mínima $\\beta_{\\text{min}} = 100$, caída base-emisor $V_{BE(\\text{sat})} = 0.70\\text{ V}$, y caída colector-emisor en saturación $V_{CE(\\text{sat})} = 0.20\\text{ V}$.\n\n1. Calcule la corriente de colector en saturación $I_{C(\\text{sat})}$ y la corriente de base mínima teórica $I_{B(\\text{min})}$.\n2. Aplicando un factor de sobre-excitación para saturación profunda (Forced Beta) $k_{\\text{sat}} = 3.0$ (es decir, $\\beta_{\\text{forced}} = \\frac{\\beta_{\\text{min}}}{3} = 33.33$) para garantizar estabilidad térmica según las reglas de diseño de Horowitz & Hill, calcule la resistencia de base requerida $R_B$.\n3. Calcule la disipación total de potencia en el BJT durante el estado de conducción ($P_{\\text{BJT}}$).\n4. Compare la potencia estática de entrada requerida respecto a un transistor MOSFET de enriquecimiento canal N equivalente ($I_G \\equiv 0\\text{ A}$).",
                givenData: {
                  "Voltaje de colector (V_CC)": "12.0 V",
                  "Resistencia de colector (R_C)": "120.0 \\Omega",
                  "Voltaje de entrada lógica (V_in)": "3.30 V",
                  "Caídas en saturación": "V_BE(sat) = 0.70 V, \\quad V_CE(sat) = 0.20 V",
                  "Ganancia de corriente (\\beta_min)": "100",
                  "Factor de sobre-excitación (k_sat)": "3.0 (\\beta_forced = 33.33)"
                },
                hint: "En saturación: $I_{C(\\text{sat})} = \\frac{V_{CC} - V_{CE(\\text{sat})}}{R_C}$. Para diseño industrial robusto, dimensione $I_{B(\\text{forced})} = k_{\\text{sat}} \\cdot \\frac{I_C}{\\beta_{\\text{min}}}$ y despeje $R_B = \\frac{V_{\\text{in}} - V_{BE(\\text{sat})}}{I_B}$.",
                solutionSteps: [
                  "Paso 1: Corriente de colector en saturación y base mínima teórica:\n$I_{C(\\text{sat})} = \\frac{V_{CC} - V_{CE(\\text{sat})}}{R_C} = \\frac{12.0\\text{ V} - 0.20\\text{ V}}{120.0\\,\\Omega} = \\frac{11.80\\text{ V}}{120.0\\,\\Omega} = 0.09833\\text{ A} = 98.33\\text{ mA}$\n$I_{B(\\text{min})} = \\frac{I_{C(\\text{sat})}}{\\beta_{\\text{min}}} = \\frac{98.33\\text{ mA}}{100} = 0.9833\\text{ mA}$",
                  "Paso 2: Corriente de base forzada y dimensionamiento de $R_B$:\nCon factor de saturación $k_{\\text{sat}} = 3.0$:\n$I_{B(\\text{forced})} = k_{\\text{sat}} \\cdot I_{B(\\text{min})} = 3.0 \\cdot 0.9833\\text{ mA} = 2.950\\text{ mA}$\n$R_B = \\frac{V_{\\text{in,HIGH}} - V_{BE(\\text{sat})}}{I_{B(\\text{forced})}} = \\frac{3.30\\text{ V} - 0.70\\text{ V}}{2.950 \\times 10^{-3}\\text{ A}} = \\frac{2.60\\text{ V}}{2.950 \\times 10^{-3}\\text{ A}} = 881.36\\,\\Omega$\nSeleccionamos el valor estándar comercial E24: $R_B = 820\\,\\Omega$ (o $880\\,\\Omega$), que produce $I_B = 3.17\\text{ mA}$ garantizando saturación profunda.",
                  "Paso 3: Disipación total de potencia en el BJT saturado:\n$P_{\\text{BJT}} = P_{\\text{colector}} + P_{\\text{base}} = V_{CE(\\text{sat})} I_{C(\\text{sat})} + V_{BE(\\text{sat})} I_B$\n$P_{\\text{colector}} = (0.20\\text{ V})(98.33\\text{ mA}) = 19.67\\text{ mW}$\n$P_{\\text{base}} = (0.70\\text{ V})(2.95\\text{ mA}) = 2.065\\text{ mW}$\n$P_{\\text{total,BJT}} = 19.67\\text{ mW} + 2.07\\text{ mW} = 21.74\\text{ mW}$",
                  "Paso 4: Comparación tecnológica con MOSFET de enriquecimiento (NMOS):\nEn un MOSFET (e.g. 2N7002 o BSS138), el óxido de compuerta $\\text{SiO}_2$ actúa como aislante ideal ($R_{\\text{gate}} > 10^{12}\\,\\Omega$). La corriente estática de compuerta es estrictamente nula ($I_G \\equiv 0\\text{ A}$), eliminando la disipación de excitación $P_{\\text{base}} = 0\\text{ W}$ y evitando sobrecargar las compuertas lógicas del microcontrolador."
                ],
                finalAnswer: "$$I_{C(\\text{sat})} = 98.33\\text{ mA}, \\quad I_{B(\\text{forced})} = 2.95\\text{ mA}, \\quad R_B = 881\\,\\Omega \\text{ (estándar: } 820\\,\\Omega\\text{)}, \\quad P_{\\text{total}} = 21.74\\text{ mW}, \\quad I_{G(\\text{MOSFET})} = 0\\text{ A}$$",
                textbookCitation: "Horowitz & Hill (AoE 3rd Ed / x-Chapters), Cap. 2x.1-2x.4 (pp. 79-92); M. Morris Mano 6th Ed, Cap. 2"
              },
              {
                type: "complete",
                category: "complete",
                categoryLabel: "Milestone",
                xp: 50
              }
            ]
          },

          /* --- LECCIÓN 4-7: Real-World Engineering Craft --- */
          {
            id: "lesson-4-7",
            title: "4.7 Real-World Engineering Craft (from Horowitz & Hill)",
            subtitle: "Bypass/decoupling capacitors, PCB trace inductance, ground loops, thermal dissipation, and noise suppression.",
            duration: "30 min",
            steps: [
              {
                type: "content",
                category: "reading",
                categoryLabel: "Reading Chapter • 6 min",
                title: "Real-World Engineering Craft",
                subtitle: "The practical secrets that separate theory from working hardware.",
                durationEstimate: "2:55",
                audioSrc: "audio/lesson-4-7.mp3",
                sections: [
                  {
                    title: "1. The Four Non-Negotiable Hardware Rules",
                    sentences: [
                      { id: "s20_1", text: "In textbooks, wires have zero resistance, capacitors have zero inductance, and ground is an equipotential plane.", start: 0.1, end: 9.0 },
                      { id: "s20_2", text: "In real hardware, every trace has parasitic resistance and inductance, and digital switching generates fast current spikes.", start: 9.0, end: 18.5 },
                      { id: "s20_3", text: "Rule One: Always place a 0.1 microfarad ceramic bypass capacitor as close as physically possible to the power pin of every IC chip.", start: 18.5, end: 29.5 },
                      { id: "s20_4", text: "This supplies local high-frequency current pulses without voltage droop across long PCB traces.", start: 29.5, end: 37.0 },
                      { id: "s20_5", text: "Rule Two: Use a continuous, unbroken Ground Plane on 2-layer and 4-layer PCBs to minimize ground loop area and EMI noise.", start: 37.0, end: 47.5 },
                      { id: "s20_6", text: "Rule Three: Never leave high-impedance CMOS inputs floating. Always pull them up or down with a 10k resistor.", start: 47.5, end: 57.0 }
                    ],
                    comparison: {
                      left: {
                        theme: "blue",
                        badge: "Rule 1: Bypass Capacitors",
                        title: "0.1µF Ceramic at Every IC Pin",
                        desc: "Supplies instantaneous transient switching current.",
                        bullets: [
                          "Place $\\le 3\\text{ mm}$ from IC Vcc pin",
                          "Shunts high-frequency switching noise to ground",
                          "Prevents digital IC voltage reset glitches"
                        ]
                      },
                      right: {
                        theme: "rose",
                        badge: "Rule 2: Solid Ground Plane",
                        title: "Unbroken PCB Ground Layer",
                        desc: "Minimizes return loop area and parasitic inductance.",
                        bullets: [
                          "High-frequency current returns directly beneath trace",
                          "Prevents ground bounce and cross-talk",
                          "Shields sensitive analog circuitry"
                        ]
                      }
                    },
                    callout: {
                      icon: "zap",
                      text: "<strong>Horowitz & Hill Pro-Tip:</strong> The #1 reason microcontroller and op-amp boards glitch, reset intermittently, or oscillate is missing decoupling capacitors. Place a $100\\text{ nF}$ ($0.1\\,\\mu\\text{F}$) X7R ceramic cap at every single power pin to eliminate $V_{\\text{droop}} = L_{\\text{trace}} \\frac{di}{dt}$!"
                    }
                  }
                ],
                summary: [
                  "<strong>Decoupling Rule:</strong> $0.1\\,\\mu\\text{F}$ ($100\\text{ nF}$) ceramic cap located within $3\\text{ mm}$ of every IC power pin.",
                  "<strong>Ground Planes:</strong> Unbroken copper ground plane provides lowest return loop inductance.",
                  "<strong>Floating Inputs:</strong> Never leave CMOS gate inputs floating (always tie via $10\\text{ k}\\Omega$ pull-up or pull-down).",
                  "<strong>Thermal Design:</strong> Use thermal vias and copper pours under power MOSFETs."
                ]
              },
              {
                type: "quiz",
                category: "quiz",
                categoryLabel: "Knowledge Check",
                xp: 50,
                question: "What is the primary function of placing a 0.1µF ceramic decoupling capacitor right next to an IC chip's power pin?",
                prompt: "Think about high-speed digital switching transients and PCB trace inductance.",
                options: [
                  "It provides instantaneous local charge for high-frequency switching, preventing supply voltage dips",
                  "It steps down 120V AC wall power to 5V DC",
                  "It increases the clock speed of the microcontroller",
                  "It replaces the need for a power supply"
                ],
                correctIndex: 0,
                explanation: "Correct! When transistors inside an IC switch on, they demand instantaneous bursts of current. Parasitic inductance in PCB traces resists this change, causing voltage droop ($V = L \\frac{di}{dt}$). The local $0.1\\,\\mu\\text{F}$ ceramic capacitor supplies this burst instantly."
              },
              {
                type: "flashcard",
                category: "flashcard",
                categoryLabel: "Active Recall",
                question: "Why should unused CMOS logic inputs NEVER be left floating?",
                answer: "Because CMOS inputs have virtually infinite impedance ($> 10^{12}\\,\\Omega$). Stray electrostatic fields will cause floating inputs to wander randomly between 0 and 1, causing high shoot-through current, excessive heat, and spurious logic errors (Mano Ch. 10)."
              },
              {
                type: "complete",
                category: "complete",
                categoryLabel: "Milestone",
                xp: 100
              }
            ]
          }
        ]
      }
    ]
  }
];
