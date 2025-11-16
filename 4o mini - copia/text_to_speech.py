import io
import numpy as np
import sounddevice as sd
import base64
import edge_tts
from pydub import AudioSegment

from config import TTS_VOICE, AUDIO_OUTPUT_DEVICE
from speech_sync import lip_sync
from utils import find_audio_device_id # Import the new function

def list_audio_devices():
    """Lists available audio output devices."""
    devices = sd.query_devices()
    output_devices = []
    for i, device in enumerate(devices):
        # Check if the device has output channels
        if device['max_output_channels'] > 0:
            output_devices.append({'id': i, 'name': device['name']})
    return output_devices

def get_default_device_id():
    """Gets the ID of the default system output device."""
    try:
        return sd.default.device[1] # [1] is for output
    except Exception:
        return None

# Find the device ID once when the module is loaded
output_device_id = find_audio_device_id(AUDIO_OUTPUT_DEVICE)

async def text_to_speech(text):
    try:
        print(f"🔊 Generando audio para: '{text}'")
        tts = edge_tts.Communicate(text, TTS_VOICE)
        audio_bytes = io.BytesIO()
        async for chunk in tts.stream():
            if chunk["type"] == "audio":
                audio_bytes.write(chunk["data"])
        audio_bytes.seek(0)
        
        audio_segment = AudioSegment.from_file(audio_bytes, format="mp3")
        audio_data = np.array(audio_segment.get_array_of_samples(), dtype=np.int16)
        
        device_info = f"el dispositivo por defecto" if AUDIO_OUTPUT_DEVICE is None else f"'{AUDIO_OUTPUT_DEVICE}'"
        print(f"▶️  Reproduciendo audio en {device_info}...")
        
        # await lip_sync(True) # Comentado temporalmente
        sd.play(audio_data, samplerate=audio_segment.frame_rate, device=output_device_id) # Use the resolved ID
        sd.wait()
        # await lip_sync(False) # Comentado temporalmente
        print("✅ Audio reproducido.")

    except Exception as e:
        print(f"⚠️ Error al generar o reproducir audio: {e}")

async def get_speech_and_play_for_lipsync(text: str, device_id: int | None) -> str | None:
    """
    Generates audio, plays it on the selected device for lip-sync,
    and returns it as a Base64 string for the frontend.
    """
    try:
        tts = edge_tts.Communicate(text, TTS_VOICE)
        audio_bytes = io.BytesIO()
        # Collect all audio chunks into a single BytesIO object
        async for chunk in tts.stream():
            if chunk["type"] == "audio":
                audio_bytes.write(chunk["data"])
        
        audio_bytes.seek(0)
        
        # For playback on the backend (for lip-sync via virtual cable)
        audio_segment = AudioSegment.from_file(audio_bytes, format="mp3")
        audio_data = np.array(audio_segment.get_array_of_samples(), dtype=np.int16)
        
        # Play audio on the selected device. This is non-blocking.
        sd.play(audio_data, samplerate=audio_segment.frame_rate, device=device_id)

        # For sending to the frontend
        audio_bytes.seek(0) # Reset pointer to the beginning
        base64_audio = base64.b64encode(audio_bytes.read()).decode('utf-8')
        return base64_audio

    except Exception as e:
        print(f"⚠️ Error en get_speech_and_play_for_lipsync: {e}")
        return None