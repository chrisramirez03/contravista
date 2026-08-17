#!/usr/bin/env python3
"""
scripts/generate_lesson_audio.py
Generates high-fidelity pre-recorded neural audio (.mp3) and sentence-level timestamp alignment (.json)
for ElectronFlow lessons using Edge Neural TTS ($0 cost, 0 API keys, 0 token consumption at runtime).
"""

import os
import json
import asyncio
import edge_tts

# Voces neurales disponibles:
# en-US-ChristopherNeural (cálida, profesional, clara)
# en-US-GuyNeural (amigable, entusiasta)
# en-US-JennyNeural (natural, femenina)
# en-US-AriaNeural (profesional, femenina)
DEFAULT_VOICE = "en-US-ChristopherNeural"

LESSONS_CONTENT = {
    "lesson-1-1": {
        "title": "The Foundations of Electricity",
        "sections": [
            {
                "title": "The Foundations of Electricity.",
                "sentences": [
                    "Welcome to ElectronFlow.",
                    "Today we explore how subatomic particles, atomic bonds, and electrical pressure create the flow of electricity."
                ]
            },
            {
                "title": "Section 1: The Atomic Blueprint.",
                "sentences": [
                    "Everything in the physical universe is composed of atoms.",
                    "Your phone screen, your body, and copper wiring are all built from billions of these microscopic building blocks.",
                    "Every atom contains a dense central nucleus packed with positively charged protons and neutral neutrons.",
                    "Orbiting around this nucleus at high speeds are tiny, negatively charged particles called electrons.",
                    "In normal stable matter, positive protons and negative electrons balance out.",
                    "Electricity occurs when electrons break free from their orbits and move."
                ]
            },
            {
                "title": "Section 2: Conductors versus Insulators.",
                "sentences": [
                    "Why does electricity flow easily through metal wiring, but get stopped cold by plastic or rubber?",
                    "In conductive materials like copper, silver, and gold, the outermost electrons are held very loosely.",
                    "They can easily hop between neighboring atoms to form an electric current.",
                    "In insulators like rubber, glass, and plastic, electrons are locked tightly to their nuclei.",
                    "Even with high electrical force, they refuse to flow.",
                    "That is why electrical cables use copper wire on the inside to conduct power, surrounded by flexible rubber on the outside to keep you safe."
                ]
            },
            {
                "title": "Section 3: Voltage: The Electrical Pressure.",
                "sentences": [
                    "Electrons will not flow through a wire on their own. They need a force pushing them.",
                    "Think of water in a pipe: without water pressure from a pump or elevated water tower, the water just sits still.",
                    "Voltage, measured in Volts, is that electrical pressure provided by a battery or power supply.",
                    "The higher the voltage, the stronger the push, and the more current flows through the circuit.",
                    "Remember the golden rule: Voltage is the cause, and Current is the effect."
                ]
            },
            {
                "title": "Key Takeaways.",
                "sentences": [
                    "To summarize:",
                    "Electricity is the movement of charge carriers through a conductor.",
                    "Conductors have free valence electrons, while insulators lock their electrons tightly.",
                    "And Voltage provides the electrical pressure required to drive current through a closed circuit."
                ]
            }
        ]
    }
}

async def generate_audio_for_lesson(lesson_id, lesson_data, output_dir="audio", voice=DEFAULT_VOICE):
    os.makedirs(output_dir, exist_ok=True)
    mp3_path = os.path.join(output_dir, f"{lesson_id}.mp3")
    json_path = os.path.join(output_dir, f"{lesson_id}.json")

    # Unir todo el texto en párrafos naturales
    full_paragraphs = []
    sentence_map = []
    
    for sec in lesson_data["sections"]:
        full_paragraphs.append(sec["title"])
        for sent in sec["sentences"]:
            full_paragraphs.append(sent)

    combined_text = " ".join(full_paragraphs)
    print(f"Generating audio for {lesson_id} with voice {voice}...")

    communicate = edge_tts.Communicate(combined_text, voice)
    
    sentence_cues = []
    audio_bytes = bytearray()

    async for chunk in communicate.stream():
        if chunk["type"] == "audio":
            audio_bytes.extend(chunk["data"])
        elif chunk["type"] == "SentenceBoundary":
            # offset y duration en unidades de 100ns (1s = 10,000,000)
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

    print(f"✅ Created {mp3_path} ({len(audio_bytes)} bytes)")
    print(f"✅ Created {json_path} ({len(sentence_cues)} aligned sentences)")

async def main():
    for lesson_id, data in LESSONS_CONTENT.items():
        await generate_audio_for_lesson(lesson_id, data)

if __name__ == "__main__":
    asyncio.run(main())
