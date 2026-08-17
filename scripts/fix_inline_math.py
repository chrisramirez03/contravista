#!/usr/bin/env python3
import re

with open("curriculum.js", "r", encoding="utf-8") as f:
    text = f.read()

# Replace any ($$math$$) or ( $$math$$ ) with ($math$)
text = re.sub(r'\(\s*\$\$([\s\S]*?)\$\$\s*\)', r'($\1$)', text)

# For sentences, summary arrays, callouts, flashcards, quizzes:
# If a string contains $$ but is part of a sentence or list item, convert $$ to $
lines = text.split("\n")
new_lines = []

for line in lines:
    # Check if this line is a property value with text
    stripped = line.strip()
    # If the line contains inline text like 'answer:', 'question:', 'explanation:', 'text:', 'title:', 'subtitle:', 'bullets:', 'summary:'
    # and has $$ inside it
    if re.search(r'(answer|question|explanation|prompt|subtitle|bullets|summary|desc|text|bullets|heading):\s*', line) or stripped.startswith('"') or stripped.startswith("'"):
        # If it's not a standalone equation block line (e.g., '$$V = I \cdot R$$' alone)
        if not re.match(r'^\s*[\"\']\$\$[^\$]+\$\$[\"\'],?\s*$', line):
            # Replace all occurrences of $$ with $ in this line
            line = line.replace('$$', '$')
    
    # Extra safety: any ($math$) should never have $$
    line = re.sub(r'\(\s*\$\$([^$]+?)\$\$\s*\)', r'($\1$)', line)
    new_lines.append(line)

new_text = "\n".join(new_lines)

with open("curriculum.js", "w", encoding="utf-8") as f:
    f.write(new_text)

print("✅ Successfully converted all inline and parenthesized math to $...$ in curriculum.js!")
