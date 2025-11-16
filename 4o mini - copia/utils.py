import sounddevice as sd
import time

def find_audio_device_id(device_name, retries=3, delay=1):
    """
    Finds the device ID for a given audio device name with retries and case-insensitivity.
    """
    if device_name is None:
        return None  # Use system default

    for attempt in range(retries):
        try:
            devices = sd.query_devices()
            for i, device in enumerate(devices):
                # Case-insensitive and partial matching
                if device['max_output_channels'] > 0 and device_name.lower() in device['name'].lower():
                    print(f"✅ Dispositivo de audio encontrado: '{device['name']}' con ID: {i}")
                    return i
        except Exception as e:
            print(f"⚠️ Error consultando dispositivos en intento {attempt + 1}: {e}")

        if attempt < retries - 1:
            print(f"⚠️ No se encontró el dispositivo '{device_name}'. Reintentando en {delay} segundo(s)...")
            time.sleep(delay)
    
    print(f"❌ No se pudo encontrar el dispositivo de audio de salida: '{device_name}' después de {retries} intentos. Se usará el predeterminado.")
    return None

def save_subtitles(text):
    try:
        with open("output.txt", "w", encoding="utf-8") as f:
            f.write(text)
    except Exception as e:
        print(f"⚠️ Error al guardar subtítulos: {e}")