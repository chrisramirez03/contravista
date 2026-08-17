#!/usr/bin/env python3
"""
scripts/perfect_curriculum_equations.py
Refines all mathematical equations, formulas, and text across curriculum.js
to use clean, standard Unicode typography with proper parentheses, fractions, sub/superscripts,
and semantic clarity.
"""

import re

def polish_curriculum(file_path="curriculum.js"):
    with open(file_path, "r", encoding="utf-8") as f:
        text = f.read()

    replacements = [
        (r'Branch Current Equation:</strong> i = \(v<sub>from</sub> - v<sub>to</sub> / R\)\.',
         'Branch Current Equation:</strong> i = (v<sub>from</sub> − v<sub>to</sub>) / R.'),
        
        (r'Node Equation Standard Form:</strong> At node 1: \(v<sub>1</sub> - v<sub>2</sub> / R<sub>1</sub>\) \+ \(v<sub>1</sub> - 0 / R<sub>2</sub>\) = I<sub>source</sub>\.',
         'Node Equation Standard Form:</strong> At node 1: (v<sub>1</sub> − v<sub>2</sub>)/R<sub>1</sub> + (v<sub>1</sub> − 0)/R<sub>2</sub> = I<sub>source</sub>.'),
        
        (r'Parallel Equivalent:</strong> 1/R<sub>eq</sub> = 1/R<sub>1</sub> \+ 1/R<sub>2</sub> \(or R<sub>eq</sub> = \(R<sub>1</sub> R<sub>2</sub> / R<sub>1</sub> \+ R<sub>2</sub>\)\)\.',
         'Parallel Equivalent:</strong> 1/R<sub>eq</sub> = 1/R<sub>1</sub> + 1/R<sub>2</sub> (or R<sub>eq</sub> = (R<sub>1</sub> · R<sub>2</sub>) / (R<sub>1</sub> + R<sub>2</sub>)).'),

        (r'Voltage Divider:</strong> V<sub>out</sub> = V<sub>in</sub> \(R<sub>2</sub> / R<sub>1</sub> \+ R<sub>2</sub>\)\.',
         'Voltage Divider:</strong> V<sub>out</sub> = V<sub>in</sub> · [R<sub>2</sub> / (R<sub>1</sub> + R<sub>2</sub>)].'),

        (r'Voltage Divider Formula:</strong> V<sub>out</sub> = V<sub>in</sub> × \(R<sub>2</sub> / R<sub>1</sub> \+ R<sub>2</sub>\)\.',
         'Voltage Divider Formula:</strong> V<sub>out</sub> = V<sub>in</sub> · [R<sub>2</sub> / (R<sub>1</sub> + R<sub>2</sub>)].'),

        (r'v\(t\) = V<sub>s</sub> \(1 - e\^\{-t/τ\}\)',
         'v(t) = V<sub>s</sub>(1 − e<sup>−t/τ</sup>)'),

        (r'v\(t\) = V<sub>0</sub> e\^\{-t/τ\}',
         'v(t) = V<sub>0</sub> e<sup>−t/τ</sup>'),

        (r'Resonant Frequency:</strong> ω₀ = \(1 / √\(LC\)\) rad/s\.',
         'Resonant Frequency:</strong> ω₀ = 1 / √(L · C) rad/s.'),

        (r'Damping Factor \(Series\):</strong> α = \(R / 2L\)\.',
         'Damping Factor (Series):</strong> α = R / (2L).'),

        (r'Cutoff Frequency:</strong> f<sub>c</sub> = \(1 / 2π R C\) Hertz\.',
         'Cutoff Frequency:</strong> f<sub>c</sub> = 1 / (2π · R · C) Hertz.'),

        (r'Decibel Formula:</strong> G<sub>dB</sub> = 20 \\log<sub>10</sub>\(V<sub>out</sub> / V<sub>in</sub>\)\.',
         'Decibel Formula:</strong> G<sub>dB</sub> = 20 · log₁₀(V<sub>out</sub> / V<sub>in</sub>).'),

        (r'Real Power \(P\):</strong> P = V<sub>rms</sub> I<sub>rms</sub> \\cosθ',
         'Real Power (P):</strong> P = V<sub>rms</sub> · I<sub>rms</sub> · cos(θ)'),

        (r'Reactive Power \(Q\):</strong> Q = V<sub>rms</sub> I<sub>rms</sub> \\sinθ',
         'Reactive Power (Q):</strong> Q = V<sub>rms</sub> · I<sub>rms</sub> · sin(θ)'),

        (r'Power Factor:</strong> PF = \\cosθ = P / \|S\|',
         'Power Factor:</strong> PF = cos(θ) = P / |S|'),

        (r'Inverting Gain:</strong> A<sub>v</sub> = -\(R<sub>f</sub> / R<sub>1</sub>\)\.',
         'Inverting Gain:</strong> A<sub>v</sub> = −(R<sub>f</sub> / R<sub>1</sub>).'),

        (r'Non-Inverting Gain:</strong> A<sub>v</sub> = 1 \+ \(R<sub>f</sub> / R<sub>1</sub>\)\.',
         'Non-Inverting Gain:</strong> A<sub>v</sub> = 1 + (R<sub>f</sub> / R<sub>1</sub>).'),

        (r'Golden Rule 1:</strong> i_\+ = i_- = 0',
         'Golden Rule 1:</strong> i₊ = i₋ = 0'),

        (r'Golden Rule 2:</strong> v_\+ = v_-',
         'Golden Rule 2:</strong> v₊ = v₋'),

        (r'\\dots', '…'),
        (r'\\\\dots', '…'),
        (r'\\%', '%'),
        (r'\\\\%', '%')
    ]

    for pat, rep in replacements:
        text = re.sub(pat, rep, text)

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(text)

    print("✅ Successfully polished all equations in curriculum.js!")

if __name__ == "__main__":
    polish_curriculum()
