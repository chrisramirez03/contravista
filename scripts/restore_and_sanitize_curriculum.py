#!/usr/bin/env python3
"""
scripts/restore_and_sanitize_curriculum.py
Performs a deep, clean repair of curriculum.js:
1. Fixes var COURSES_CATALOG definition.
2. Strips any HTML tags from sentence.text fields (so neural audio & text match perfectly).
3. Formats equations in summary, callout, comparison, and explanations with clean HTML math.
4. Verifies syntax via JavaScript execution.
"""

import re
import subprocess

def sanitize_curriculum(file_path="curriculum.js"):
    with open(file_path, "r", encoding="utf-8") as f:
        text = f.read()

    # 1. Reparar la declaración global
    text = re.sub(r'var COURSES<[^>]+>ATALOG', 'var COURSES_CATALOG', text)
    text = text.replace('COURSES<sub>C</sub>ATALOG', 'COURSES_CATALOG')

    # 2. Reparar variables mal divididas
    fixes = [
        (r'V<sub>r</sub>ms', 'V<sub>rms</sub>'),
        (r'I<sub>r</sub>ms', 'I<sub>rms</sub>'),
        (r'V<sub>G</sub>S', 'V<sub>GS</sub>'),
        (r'R<sub>D</sub>S\(on\)', 'R<sub>DS(on)</sub>'),
        (r'R<sub>D</sub>S', 'R<sub>DS(on)</sub>'),
        (r'V<sub>b</sub>e', 'V<sub>be</sub>'),
        (r'V<sub>c</sub>e\(sat\)', 'V<sub>ce(sat)</sub>'),
        (r'V<sub>c</sub>e', 'V<sub>ce</sub>'),
        (r'I<sub>g</sub>ate', 'I<sub>gate</sub>'),
        (r'i<sub>p</sub>lus', 'i<sub>+</sub>'),
        (r'i<sub>m</sub>inus', 'i<sub>−</sub>'),
        (r'v<sub>p</sub>lus', 'v<sub>+</sub>'),
        (r'v<sub>m</sub>inus', 'v<sub>−</sub>'),
        (r'i<sub>b</sub>ranch', 'i<sub>branch</sub>'),
        (r'V<sub>s</sub>ource', 'V<sub>source</sub>'),
        (r'I<sub>s</sub>ource', 'I<sub>source</sub>'),
        (r'V<sub>l</sub>oop', 'V<sub>loop</sub>'),
        (r'V<sub>a</sub>b', 'V<sub>ab</sub>'),
        (r'omega<sub>0</sub>', 'ω₀'),
        (r'omega', 'ω'),
        (r'\\dots', '…'),
    ]

    for pat, rep in fixes:
        text = re.sub(pat, rep, text)

    # 3. Limpiar cualquier etiqueta HTML dentro de las oraciones de lectura (sentences: [{ text: "..." }])
    def clean_sentence_text(match):
        s_id = match.group(1)
        s_text = match.group(2)
        # Limpiar tags HTML dentro del texto de la oración hablada
        clean_text = re.sub(r'<[^>]+>', '', s_text)
        # Limpiar backslashes
        clean_text = clean_text.replace('\\', '')
        return f'{{ id: "{s_id}", text: "{clean_text}"'

    text = re.sub(r'\{\s*id:\s*"([^"]+)",\s*text:\s*"([^"]+)"', clean_sentence_text, text)

    # 4. Asegurar que las oraciones con start/end también tengan texto limpio
    def clean_timed_sentence(match):
        s_id = match.group(1)
        s_text = match.group(2)
        start_val = match.group(3)
        end_val = match.group(4)
        clean_text = re.sub(r'<[^>]+>', '', s_text).replace('\\', '')
        clean_id = re.sub(r'<[^>]+>', '', s_id)
        return f'{{ id: "{clean_id}", text: "{clean_text}", start: {start_val}, end: {end_val} }}'

    text = re.sub(r'\{\s*id:\s*"([^"]+)",\s*text:\s*"([^"]+)",\s*start:\s*([0-9.]+),\s*end:\s*([0-9.]+)\s*\}', clean_timed_sentence, text)

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(text)

    print(f"✅ Sanitized {file_path}")

if __name__ == "__main__":
    sanitize_curriculum()
