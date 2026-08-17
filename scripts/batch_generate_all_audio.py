#!/usr/bin/env python3
"""
scripts/batch_generate_all_audio.py
Reads curriculum.js directly, extracts all reading chapters, and generates studio neural audio (.mp3)
and sentence alignment (.json) for every lesson in the curriculum.
"""

import os
import re
import json
import asyncio
import edge_tts

DEFAULT_VOICE = "en-US-ChristopherNeural"
OUTPUT_DIR = "audio"

def extract_lessons_from_curriculum(file_path="curriculum.js"):
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Extraer lecciones con audioSrc
    lesson_blocks = re.findall(r'id:\s*"(lesson-[^"]+)"[\s\S]*?audioSrc:\s*"audio/([^"]+\.mp3)"[\s\S]*?sections:\s*(\[[\s\S]*?\])\s*,\s*summary:', content)
    print(f"Found {len(lesson_blocks)} lessons with audio in curriculum.js")
    
    extracted = {}
    
    # Extraer todas las lecciones con id y sentences
    lessons_raw = re.findall(r'id:\s*"(lesson-[0-9]-[0-9])"[\s\S]*?title:\s*"([^"]+)"[\s\S]*?sections:\s*\[([\s\S]*?)\]\s*,\s*(?:summary|callout)', content)
    
    for l_id, title, sections_raw in lessons_raw:
        sentences = re.findall(r'text:\s*"([^"]+)"', sections_raw)
        if sentences:
            extracted[l_id] = {
                "title": title,
                "sentences": sentences
            }
            print(f"Extracted {l_id}: {len(sentences)} sentences")
            
    return extracted

async def generate_audio_for_lesson(lesson_id, lesson_data, voice=DEFAULT_VOICE):
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    mp3_path = os.path.join(OUTPUT_DIR, f"{lesson_id}.mp3")
    json_path = os.path.join(OUTPUT_DIR, f"{lesson_id}.json")

    # Si ya existe y no está vacío, omitir para ahorrar tiempo si no cambia
    if os.path.exists(mp3_path) and os.path.getsize(mp3_path) > 10000 and os.path.exists(json_path):
        print(f"⏩ {lesson_id} already exists ({os.path.getsize(mp3_path)} bytes), skipping.")
        return

    combined_text = " ".join(lesson_data["sentences"])
    print(f"🎙️ Generating audio for {lesson_id} ({len(lesson_data['sentences'])} sentences)...")

    communicate = edge_tts.Communicate(combined_text, voice)
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
        "sentences": sentence_cues
    }

    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(alignment_data, f, indent=2, ensure_ascii=False)

    print(f"✅ Created {mp3_path} ({len(audio_bytes)} bytes, {len(sentence_cues)} cues)")

async def main():
    lessons = extract_lessons_from_curriculum()
    for lesson_id, data in lessons.items():
        await generate_audio_for_lesson(lesson_id, data)
    print("\n🎉 All lesson audio generation complete!")

if __name__ == "__main__":
    asyncio.run(main())
