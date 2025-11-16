 ### config.py ###
# Archivo de configuración para Eleonor_VTuber
VTS_API_URL = "ws://localhost:8001"
OLLAMA_API_URL = "http://localhost:11434/api/generate"
TTS_VOICE = "es-MX-DaliaNeural"
STOCKFISH_PATH = r"C:\Games\necesidad\stockfish\stockfish.exe"

# --- Configuración de Audio para Lip Sync ---
# Nombre del dispositivo de salida de audio para VTube Studio (Cable Virtual).
# Ejecuta el script `list_audio_devices.py` para ver los nombres exactos.
# Ejemplo: "CABLE Input (VB-Audio Virtual Cable)"
# Déjalo como None para usar el dispositivo por defecto del sistema.
AUDIO_OUTPUT_DEVICE = "CABLE Input (VB-Audio Virtual Cable)"