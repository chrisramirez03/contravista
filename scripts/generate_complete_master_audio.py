#!/usr/bin/env python3
"""
scripts/generate_complete_master_audio.py
Extracts 100% of speech items using direct JavaScript object evaluation,
sanitizes math/HTML into natural spoken English, generates complete full-length neural MP3s,
and calibrates exact sentence timestamps in curriculum.js.
"""

import os
import re
import json
import asyncio
import subprocess
import edge_tts

DEFAULT_VOICE = "en-US-ChristopherNeural"
OUTPUT_DIR = "audio"

def sanitize_math_for_speech(text):
    t = text
    # 1. Strip HTML tags
    t = re.sub(r'<[^>]+>', ' ', t)
    
    # 2. Replace HTML entities
    t = t.replace('&rsaquo;', ' > ').replace('&times;', ' times ').replace('&Omega;', ' Ohms ')
    
    # 3. Clean LaTeX formatting commands
    t = t.replace(r'\text{', ' ').replace(r'\mathbf{', ' ').replace(r'\mathrm{', ' ')
    t = t.replace(r'\quad', ' ').replace(r'\qquad', ' ')
    t = t.replace(r'\left(', '(').replace(r'\right)', ')')
    t = t.replace(r'\left[', '[').replace(r'\right]', ']')
    t = t.replace(r'\left\{', '{').replace(r'\right\}', '}')
    t = t.replace(r'\,', ' ').replace(r'\;', ' ').replace(r'\:', ' ').replace(r'\!', ' ')
    
    # 4. Fractions: \frac{a}{b} -> a over b
    t = re.sub(r'\\frac\{([^{}]+)\}\{([^{}]+)\}', r'\1 over \2', t)
    t = re.sub(r'\\frac\{([^{}]+)\}\{([^{}]+)\}', r'\1 over \2', t)
    
    # 5. Square roots
    t = re.sub(r'\\sqrt\{([^{}]+)\}', r'square root of \1', t)
    
    # 6. Exponents & Superscripts
    t = re.sub(r'\^2\b', ' squared', t)
    t = re.sub(r'\^3\b', ' cubed', t)
    t = re.sub(r'\^\{-?19\}\b', ' to the negative 19', t)
    t = re.sub(r'\^\{([^{}]+)\}', r' to the power of \1', t)
    t = re.sub(r'\^([0-9a-zA-Z]+)', r' to the power of \1', t)
    t = t.replace('²', ' squared').replace('³', ' cubed')
    
    # 7. Subscripts
    t = re.sub(r'_\{([^{}]+)\}', r' \1', t)
    t = re.sub(r'_([0-9a-zA-Z]+)', r' \1', t)
    
    # 8. Greek & Engineering Symbols
    symbols = [
        (r'\\Omega\b', ' Ohms '),
        (r'\\tau\b', ' tau '),
        (r'\\omega\b', ' omega '),
        (r'\\pi\b', ' pi '),
        (r'\\Delta\b', ' delta '),
        (r'\\mu\b', ' micro '),
        (r'\\sum\b', ' sum of '),
        (r'\\cdot\b', ' times '),
        (r'\\times\b', ' times '),
        (r'\\approx\b', ' is approximately '),
        (r'\\implies\b', ' which means that '),
        (r'\\iff\b', ' if and only if '),
        (r'\\to\b', ' approaches '),
        (r'\\gg\b', ' is much greater than '),
        (r'\\ll\b', ' is much less than '),
        (r'\\ge\b', ' is greater than or equal to '),
        (r'\\le\b', ' is less than or equal to '),
        (r'\\ne\b', ' is not equal to '),
        (r'\\equiv\b', ' is equivalent to '),
        (r'\\infty\b', ' infinity '),
        (r'\\angle\b', ' angle '),
        (r'\\circ\b', ' degrees '),
        (r'\\partial\b', ' partial derivative of ')
    ]
    for pattern, replacement in symbols:
        t = re.sub(pattern, replacement, t)
        
    # 9. Clean remaining LaTeX curly braces and backslashes
    t = t.replace('{', ' ').replace('}', ' ')
    t = t.replace('\\', ' ')
    t = t.replace('$', ' ')
    
    # 10. Common formulas to natural speech
    t = t.replace('i = dq/dt', 'i equals d q over d t')
    t = t.replace('v = dw/dq', 'v equals d w over d q')
    t = t.replace('V = I·R', 'V equals I times R')
    t = t.replace('V = I*R', 'V equals I times R')
    t = t.replace('P = V·I', 'P equals V times I')
    t = t.replace('1 V = 1 Joule / Coulomb', '1 Volt equals 1 Joule per Coulomb')
    t = t.replace('1 A = 1 Coulomb / second', '1 Ampere equals 1 Coulomb per second')
    t = t.replace('10k', '10 kilo ohm')
    t = t.replace('0.1µF', '0.1 microfarad')
    t = t.replace('100nF', '100 nanofarad')
    
    # 11. Normalize whitespace
    t = re.sub(r'\s+', ' ', t).strip()
    return t


def extract_all_speech_items():
    script = '''
    var cStr = $.NSString.stringWithContentsOfFileEncodingError('curriculum.js', $.NSUTF8StringEncoding, null).js;
    eval(cStr);

    var lessons = {};
    COURSES_CATALOG[0].phases.forEach(function(phase) {
        phase.lessons.forEach(function(lesson) {
            var contentStep = lesson.steps.find(function(s) { return s.type === 'content' && s.audioSrc; });
            if (contentStep && contentStep.sections) {
                var items = [];
                contentStep.sections.forEach(function(sec) {
                    if (sec.sentences) {
                        sec.sentences.forEach(function(s) {
                            items.push({ type: 'sentence', id: s.id, text: s.text });
                        });
                    }
                    if (sec.callout && sec.callout.text) {
                        items.push({ type: 'callout', text: sec.callout.text });
                    }
                });
                lessons[lesson.id] = {
                    title: contentStep.title,
                    audioSrc: contentStep.audioSrc,
                    items: items
                };
            }
        });
    });

    JSON.stringify(lessons);
    '''
    res = subprocess.run(['osascript', '-l', 'JavaScript', '-e', script], capture_output=True, text=True)
    return json.loads(res.stdout.strip())


async def generate_lesson_audio(lesson_id, lesson_data, voice=DEFAULT_VOICE):
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    mp3_path = os.path.join(OUTPUT_DIR, f"{lesson_id}.mp3")
    json_path = os.path.join(OUTPUT_DIR, f"{lesson_id}.json")

    items = lesson_data["items"]
    for item in items:
        item["spoken"] = sanitize_math_for_speech(item["text"])

    full_spoken_text = " ".join([item["spoken"] for item in items])
    print(f"🎙️ Synthesizing complete audio for {lesson_id} ({len(items)} items, {len(full_spoken_text.split())} words)...")

    communicate = edge_tts.Communicate(full_spoken_text, voice)
    sentence_cues = []
    audio_bytes = bytearray()

    async for chunk in communicate.stream():
        if chunk["type"] == "audio":
            audio_bytes.extend(chunk["data"])
        elif chunk["type"] == "SentenceBoundary":
            offset_sec = chunk["offset"] / 10000000.0
            duration_sec = chunk["duration"] / 10000000.0
            sentence_cues.append({
                "text": chunk["text"],
                "start": round(offset_sec, 2),
                "end": round(offset_sec + duration_sec, 2)
            })

    with open(mp3_path, "wb") as f:
        f.write(audio_bytes)

    alignment_data = {
        "lessonId": lesson_id,
        "voice": voice,
        "totalDuration": sentence_cues[-1]["end"] if sentence_cues else 0,
        "sentences": sentence_cues,
        "speechItems": items
    }

    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(alignment_data, f, indent=2, ensure_ascii=False)

    print(f"✅ Generated {mp3_path}: {alignment_data['totalDuration']}s duration ({len(audio_bytes)} bytes, {len(sentence_cues)} cues)")
    return alignment_data


async def main():
    lessons = extract_all_speech_items()
    print(f"Loaded {len(lessons)} complete lessons via JS evaluation.")
    
    all_alignments = {}
    for lesson_id, data in lessons.items():
        alignment = await generate_lesson_audio(lesson_id, data)
        all_alignments[lesson_id] = alignment

    print("\n🎉 Complete audio generation finished! Calibrating curriculum.js timestamps...")
    
    with open("curriculum.js", "r", encoding="utf-8") as f:
        curriculum = f.read()

    updated = 0
    for lesson_id, align in all_alignments.items():
        if not align:
            continue
        cues = align.get("sentences", [])
        items = align.get("speechItems", [])
        
        for idx, cue in enumerate(cues):
            if idx < len(items):
                item = items[idx]
                if item["type"] == "sentence":
                    s_id = item["id"]
                    pat = re.compile(r'\{\s*id:\s*"' + s_id + r'"[\s\S]*?\}')
                    replacement = f'{{ id: "{s_id}", text: "{item["text"]}", start: {cue["start"]}, end: {cue["end"]} }}'
                    curriculum, n = pat.subn(replacement, curriculum)
                    updated += n
                elif item["type"] == "callout":
                    c_text = item["text"]
                    callout_pat = re.compile(r'callout:\s*\{\s*icon:\s*"([^"]+)",[\s\S]*?text:\s*"' + re.escape(c_text) + r'"\s*\}')
                    def make_callout(m):
                        icon = m.group(1)
                        return f'callout: {{\n                      icon: "{icon}",\n                      start: {cue["start"]},\n                      end: {cue["end"]},\n                      text: "{c_text}"\n                    }}'
                    curriculum, cn = callout_pat.subn(make_callout, curriculum)
                    updated += cn

    with open("curriculum.js", "w", encoding="utf-8") as f:
        f.write(curriculum)

    print(f"🚀 Calibration complete! {updated} items updated with exact full-length timing in curriculum.js.")


if __name__ == "__main__":
    asyncio.run(main())
