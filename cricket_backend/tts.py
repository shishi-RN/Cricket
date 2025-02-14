import asyncio
import edge_tts
import sys

async def generate_speech(text, output_file="output.mp3", rate="+20%"):
    try:
        # Adjust the speech rate using the rate parameter
        communicate = edge_tts.Communicate(text=text, voice="en-IN-PrabhatNeural", rate=rate)
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
