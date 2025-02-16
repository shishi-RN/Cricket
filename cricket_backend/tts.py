import asyncio
import edge_tts
import sys
import random

# List of available en-IN voices. You can add more voices if available.
EN_IN_VOICES = [
    "en-IN-PrabhatNeural",
    "en-IN-NeerjaNeural"
]

async def generate_speech(text, output_file="output.mp3", rate="+20%"):
    try:
        # Choose a random voice from the list
        voice = random.choice(EN_IN_VOICES)
        print(f"Using voice: {voice}")
        
        communicate = edge_tts.Communicate(text=text, voice=voice, rate=rate)
        await communicate.save(output_file)
        return output_file
    except Exception as e:
        print(str(e), file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python tts.py '<text>' [output_file] [rate]", file=sys.stderr)
        sys.exit(1)
    
    text = sys.argv[1]
    output_file = sys.argv[2] if len(sys.argv) > 2 else "output.mp3"
    rate = sys.argv[3] if len(sys.argv) > 3 else "+20%"  # Default rate is +20%

    result = asyncio.run(generate_speech(text, output_file, rate))
    print(result)
