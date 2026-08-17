#!/usr/bin/env python3
import re

with open("tutor_knowledge_base.js", "r", encoding="utf-8") as f:
    text = f.read()

commands = [
    "frac", "cdot", "left", "right", "sum", "int", "omega",
    "alpha", "tau", "mathbf", "text", "times", "quad", "dots",
    "mu", "eta", "implies", "gg", "approx", "angle", "circ", "sqrt"
]

for cmd in commands:
    # Ensure double backslash in JS string literal
    pattern = r"\\+" + cmd
    replacement = r"\\\\" + cmd
    text = re.sub(pattern, replacement, text)

with open("tutor_knowledge_base.js", "w", encoding="utf-8") as f:
    f.write(text)

print("✅ LaTeX backslashes correctly escaped in tutor_knowledge_base.js!")
