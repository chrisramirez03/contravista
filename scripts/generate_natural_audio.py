#!/usr/bin/env python3
"""
scripts/generate_natural_audio.py
Generates natural-spoken studio neural audio (.mp3) and precise sentence cues (.json)
for all ContraVista lessons.
Converts HTML tags, LaTeX equations, and electrical symbols into clear spoken English.
"""

import os
import re
import json
import asyncio
import edge_tts

DEFAULT_VOICE = "en-US-ChristopherNeural"
OUTPUT_DIR = "audio"

def sanitize_math_for_speech(text):
    """
    Transforms raw HTML and LaTeX formulas into natural spoken English.
    """
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


def parse_curriculum_lessons(file_path="curriculum.js"):
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Find all lessons with reading steps
    lesson_matches = re.finditer(r'id:\s*"(lesson-[0-9]-[0-9])"[\s\S]*?title:\s*"([^"]+)"[\s\S]*?audioSrc:\s*"audio/([^"]+\.mp3)"[\s\S]*?sections:\s*\[([\s\S]*?)\]\s*,\s*(?:summary|callout)', content)
    
    lessons = {}
    for m in lesson_matches:
        l_id = m.group(1)
        l_title = m.group(2)
        audio_file = m.group(3)
        sections_block = m.group(4)
        
        # Parse sections within this lesson
        sections = []
        sec_matches = re.finditer(r'\{\s*title:\s*"([^"]+)"[\s\S]*?sentences:\s*\[([\s\S]*?)\]([\s\S]*?)\}', sections_block)
        
        for sm in sec_matches:
            sec_title = sm.group(1)
            sentences_raw = sm.group(2)
            sec_remainder = sm.group(3)
            
            # Extract sentence objects: { id: "s1", text: "..." }
            sentences = []
            for sent_m in re.finditer(r'\{\s*id:\s*"([^"]+)"\s*,\s*text:\s*"([^"]+)"', sentences_raw):
                s_id = sent_m.group(1)
                s_text = sent_m.group(2)
                sentences.append({
                    "id": s_id,
                    "text": s_text,
                    "spoken": sanitize_math_for_speech(s_text)
                })
            
            # Check for callout in section
            callout = None
            callout_m = re.search(r'callout:\s*\{[\s\S]*?text:\s*"([^"]+)"', sec_remainder)
            if callout_m:
                c_text = callout_m.group(1)
                callout = {
                    "text": c_text,
                    "spoken": sanitize_math_for_speech(c_text)
                }
            
            sections.append({
                "title": sec_title,
                "sentences": sentences,
                "callout": callout
            })
            
        lessons[l_id] = {
            "title": l_title,
            "sections": sections
        }
        
    return lessons


async def generate_lesson_audio(lesson_id, lesson_data, voice=DEFAULT_VOICE):
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    mp3_path = os.path.join(OUTPUT_DIR, f"{lesson_id}.mp3")
    json_path = os.path.join(OUTPUT_DIR, f"{lesson_id}.json")

    # Build ordered speech items
    speech_items = []
    
    for sec in lesson_data["sections"]:
        for sent in sec["sentences"]:
            speech_items.append({
                "type": "sentence",
                "id": sent["id"],
                "text": sent["text"],
                "spoken": sent["spoken"]
            })
        if sec["callout"]:
            speech_items.append({
                "type": "callout",
                "text": sec["callout"]["text"],
                "spoken": sec["callout"]["spoken"]
            })

    if not speech_items:
        return

    full_spoken_text = " ".join([item["spoken"] for item in speech_items])
    print(f"🎙️ Generating natural audio for {lesson_id} ({len(speech_items)} items)...")

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
        "speechItems": speech_items
    }

    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(alignment_data, f, indent=2, ensure_ascii=False)

    print(f"✅ Created {mp3_path} ({len(audio_bytes)} bytes, {len(sentence_cues)} cues)")
    return alignment_data


async def main():
    lessons = parse_curriculum_lessons()
    print(f"Found {len(lessons)} lessons in curriculum.js")
    for lesson_id, data in lessons.items():
        await generate_lesson_audio(lesson_id, data)
    print("\n🎉 Master natural audio generation complete for all lessons!")


if __name__ == "__main__":
    asyncio.run(main())
