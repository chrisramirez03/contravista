#!/usr/bin/env python3
import json
import glob
import re

with open("curriculum.js", "r", encoding="utf-8") as f:
    curriculum = f.read()

json_files = sorted(glob.glob("audio/*.json"))
updated_count = 0

for jf in json_files:
    with open(jf, "r", encoding="utf-8") as f:
        data = json.load(f)
    
    lesson_id = data.get("lessonId")
    cues = data.get("sentences", [])
    speech_items = data.get("speechItems", [])
    
    if not cues:
        continue
        
    print(f"Syncing {lesson_id} ({len(cues)} cues)...")
    
    # Map cues to speech_items
    for idx, cue in enumerate(cues):
        if idx < len(speech_items):
            item = speech_items[idx]
            if item["type"] == "sentence":
                s_id = item["id"]
                # Update { id: s_id, ... start: X, end: Y } in curriculum
                pat = re.compile(r'\{\s*id:\s*"' + s_id + r'"[\s\S]*?\}')
                replacement = f'{{ id: "{s_id}", text: "{item["text"]}", start: {cue["start"]}, end: {cue["end"]} }}'
                curriculum, n = pat.subn(replacement, curriculum)
                if n > 0:
                    updated_count += n
            elif item["type"] == "callout":
                # Update callout in this lesson
                c_text = item["text"]
                # Look for callout with this text
                callout_pat = re.compile(r'callout:\s*\{\s*icon:\s*"([^"]+)",[\s\S]*?text:\s*"' + re.escape(c_text) + r'"\s*\}')
                def make_callout(m):
                    icon = m.group(1)
                    return f'callout: {{\n                      icon: "{icon}",\n                      start: {cue["start"]},\n                      end: {cue["end"]},\n                      text: "{c_text}"\n                    }}'
                curriculum, cn = callout_pat.subn(make_callout, curriculum)
                if cn > 0:
                    updated_count += cn

with open("curriculum.js", "w", encoding="utf-8") as f:
    f.write(curriculum)

print(f"🎉 Successfully calibrated {updated_count} sentence and callout timestamps in curriculum.js!")
