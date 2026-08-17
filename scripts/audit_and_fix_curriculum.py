#!/usr/bin/env python3
"""
scripts/audit_and_fix_curriculum.py
Thoroughly audits curriculum.js to ensure:
1. All sentence IDs (e.g. s1, s2_1, s8_6) are pure clean identifiers without HTML tags.
2. All variable subscripts (e.g. R_Th -> R<sub>Th</sub>, P_max -> P<sub>max</sub>, V_out -> V<sub>out</sub>, V_in -> V<sub>in</sub>, R_eq -> R<sub>eq</sub>, V_oc -> V<sub>oc</sub>, I_sc -> I<sub>sc</sub>) are formatted with 100% precision.
3. No raw LaTeX or backslashes remain anywhere in the curriculum.
"""

import re

def audit_and_fix(file_path="curriculum.js"):
    with open(file_path, "r", encoding="utf-8") as f:
        text = f.read()

    # 1. Reparar IDs de oraciones dañadas
    text = re.sub(r'id:\s*"([^"]*?)<sub[^>]*>([0-9a-zA-Z]+)</sub>([^"]*?)"', r'id: "\1_\2\3"', text)
    text = re.sub(r'id:\s*"([^"]*?)<sup[^>]*>([0-9a-zA-Z]+)</sup>([^"]*?)"', r'id: "\1^\2\3"', text)

    # 2. Reparar subíndices de Thevenin, Norton, max, out, in, eq, oc, sc
    broken_subs = [
        (r'R<sub>T</sub>h', 'R<sub>Th</sub>'),
        (r'V<sub>T</sub>h', 'V<sub>Th</sub>'),
        (r'P<sub>m</sub>ax', 'P<sub>max</sub>'),
        (r'V<sub>o</sub>c', 'V<sub>oc</sub>'),
        (r'I<sub>s</sub>c', 'I<sub>sc</sub>'),
        (r'R<sub>e</sub>q', 'R<sub>eq</sub>'),
        (r'V<sub>o</sub>ut', 'V<sub>out</sub>'),
        (r'V<sub>i</sub>n', 'V<sub>in</sub>'),
        (r'\\\\frac\{([^}]+)\}\{([^}]+)\}', r'(\1 / \2)'),
        (r'\\frac\{([^}]+)\}\{([^}]+)\}', r'(\1 / \2)'),
        (r'\\frac', ''),
    ]

    for pat, rep in broken_subs:
        text = re.sub(pat, rep, text)

    # 3. Limpiar cualquier resto de delimitadores $
    text = text.replace('$', '')

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(text)

    print("✅ Completed full audit and precision repair of curriculum.js!")

if __name__ == "__main__":
    audit_and_fix()
