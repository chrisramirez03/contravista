#!/usr/bin/env python3
import json
import re

with open("curriculum.js", "r", encoding="utf-8") as f:
    text = f.read()

# Update lesson-1-2 in curriculum.js with precise timestamps from audio/lesson-1-2.json
# 1. Section 1 sentences
text = re.sub(
    r'\{\s*id:\s*"s2_1"[\s\S]*?end:\s*[\d\.]+\s*\}',
    '{ id: "s2_1", text: "Every circuit in existence is governed by the relationship between three quantities: Voltage, Current, and Resistance.", start: 0.1, end: 7.74 }',
    text
)
text = re.sub(
    r'\{\s*id:\s*"s2_2"[\s\S]*?end:\s*[\d\.]+\s*\}',
    '{ id: "s2_2", text: "Voltage (V) is the push, measured in Volts.", start: 7.69, end: 12.06 }',
    text
)
text = re.sub(
    r'\{\s*id:\s*"s2_3"[\s\S]*?end:\s*[\d\.]+\s*\}',
    '{ id: "s2_3", text: "Current (I) is the flow rate of charge, measured in Amperes or Amps.", start: 12.06, end: 17.56 }',
    text
)
text = re.sub(
    r'\{\s*id:\s*"s2_4"[\s\S]*?end:\s*[\d\.]+\s*\}',
    '{ id: "s2_4", text: "Resistance (R) is the opposition to that flow, measured in Ohms (Ω).", start: 17.56, end: 23.52 }',
    text
)
text = re.sub(
    r'\{\s*id:\s*"s2_5"[\s\S]*?end:\s*[\d\.]+\s*\}',
    '{ id: "s2_5", text: "In 1827, German physicist Georg Ohm proved that current is directly proportional to voltage and inversely proportional to resistance.", start: 23.52, end: 32.55 }',
    text
)

# 2. Callout in Section 1 (The Hydraulic Analogy)
text = re.sub(
    r'callout:\s*\{\s*icon:\s*"bulb",\s*text:\s*"<strong>The Hydraulic Analogy:</strong> Think of a garden hose\. Voltage is the water pressure from the faucet, Current is the volume flow rate \(\$i = dq/dt\$\), and Resistance is squeezing the nozzle \(\$R = V/I\$\)\."\s*\}',
    'callout: {\n                      icon: "bulb",\n                      start: 32.55,\n                      end: 45.8,\n                      text: "<strong>The Hydraulic Analogy:</strong> Think of a garden hose. Voltage is the water pressure from the faucet, Current is the volume flow rate ($i = dq/dt$), and Resistance is squeezing the nozzle ($R = V/I$)."\n                    }',
    text
)

# 3. Section 2 sentences in lesson-1-2
text = re.sub(
    r'\{\s*id:\s*"s2_6"[\s\S]*?end:\s*[\d\.]+\s*\}',
    '{ id: "s2_6", text: "Whenever electric current flows through a resistance, electrical energy is converted into heat.", start: 45.8, end: 51.74 }',
    text
)
text = re.sub(
    r'\{\s*id:\s*"s2_7"[\s\S]*?end:\s*[\d\.]+\s*\}',
    '{ id: "s2_7", text: "This power dissipation is measured in Watts (W).", start: 51.74, end: 55.73 }',
    text
)
text = re.sub(
    r'\{\s*id:\s*"s2_8"[\s\S]*?end:\s*[\d\.]+\s*\}',
    '{ id: "s2_8", text: "Standard through-hole resistors are typically rated for 1/4 Watt (0.25W) or 1/2 Watt (0.5W).", start: 55.73, end: 66.26 }',
    text
)
text = re.sub(
    r'\{\s*id:\s*"s2_9"[\s\S]*?end:\s*[\d\.]+\s*\}',
    '{ id: "s2_9", text: "If you push 10 Volts across a 100 Ohm resistor, the power dissipated is P = V² / R = 100 / 100 = 1 Watt.", start: 66.26, end: 76.81 }',
    text
)
text = re.sub(
    r'\{\s*id:\s*"s2_10"[\s\S]*?end:\s*[\d\.]+\s*\}',
    '{ id: "s2_10", text: "A standard quarter-watt resistor in that circuit will quickly overheat, smoke, and burn out.", start: 76.81, end: 82.84 }',
    text
)

with open("curriculum.js", "w", encoding="utf-8") as f:
    f.write(text)

print("✅ Updated lesson-1-2 timestamps and callout timing in curriculum.js!")
