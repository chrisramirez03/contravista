#!/usr/bin/env python3
"""
scripts/clean_curriculum_math.py
Cleans all raw LaTeX tags in curriculum.js and replaces them with beautiful, crisp Unicode math typography
and semantic HTML tags (<sub>, <sup>, etc.) so that all equations render flawlessly in any browser without raw dollar signs or backslashes.
"""

import re

def clean_curriculum_file(file_path="curriculum.js"):
    with open(file_path, "r", encoding="utf-8") as f:
        text = f.read()

    # Reemplazar fracciones \frac{A}{B} o \\frac{A}{B}
    text = re.sub(r'\\+frac\{([^{}]+)\}\{([^{}]+)\}', r'(\1 / \2)', text)
    
    # Reemplazar raíces cuadradas \sqrt{X}
    text = re.sub(r'\\+sqrt\{([^{}]+)\}', r'√(\1)', text)
    
    # Reemplazar símbolos griegos y matemáticos
    replacements = [
        (r'\\+omega_0', 'ω₀'),
        (r'\\+omega', 'ω'),
        (r'\\+alpha', 'α'),
        (r'\\+tau', 'τ'),
        (r'\\+phi', 'φ'),
        (r'\\+theta', 'θ'),
        (r'\\+beta', 'β'),
        (r'\\+mu', 'µ'),
        (r'\\+pi', 'π'),
        (r'\\+Delta', 'Δ'),
        (r'\\+Sigma', 'Σ'),
        (r'\\+times', '×'),
        (r'\\+cdot', '·'),
        (r'\\+infty', '∞'),
        (r'\\+angle', '∠'),
        (r'\\+approx', '≈'),
        (r'\\+le', '≤'),
        (r'\\+ge', '≥'),
        (r'\\+circ', '°'),
        (r'\\+mathbf\{Z\}', 'Z'),
        (r'\\+mathbf\{V\}', 'V'),
        (r'\\+mathbf\{I\}', 'I'),
        (r'\\+mathbf\{S\}', 'S'),
        (r'\\+mathbf\{([a-zA-Z0-9]+)\}', r'\1'),
        (r'\\+rightarrow', '→'),
        (r'\\+leftarrow', '←'),
    ]
    
    for pat, rep in replacements:
        text = re.sub(pat, rep, text)

    # Subíndices y superíndices
    text = re.sub(r'\_\{([a-zA-Z0-9]+)\}', r'<sub>\1</sub>', text)
    text = re.sub(r'\_([a-zA-Z0-9])', r'<sub>\1</sub>', text)
    text = re.sub(r'\^2', '²', text)
    text = re.sub(r'\^([0-9])', r'<sup>\1</sup>', text)

    # Eliminar delimitadores $ de LaTeX
    text = text.replace('$', '')

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(text)

    print(f"✅ Successfully cleaned all equations and LaTeX formatting in {file_path}")

if __name__ == "__main__":
    clean_curriculum_file()
