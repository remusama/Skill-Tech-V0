"""
A simple utility to list all available audio output devices.
Run this script to find the exact name or index of your virtual audio cable 
for use in the config.py file.
"""
import sounddevice as sd

def list_devices():
    """Prints a formatted list of available audio devices."""
    print("--- Buscando Dispositivos de Audio ---")
    try:
        hostapis = sd.query_hostapis()
        devices = sd.query_devices()
        default_output = sd.default.device[1] # Get default output device index

        print("\nInstrucciones:")
        print("1. Ejecuta este script (`python list_audio_devices.py`).")
        print("2. Busca en la lista el nombre de tu cable virtual (ej. 'CABLE Input (VB-Audio Virtual Cable)').")
        print("3. Copia el nombre COMPLETO y pégalo en la variable AUDIO_OUTPUT_DEVICE en `config.py`.")
        print("-----------------------------------------")

        for api in hostapis:
            print(f"\nAPI: {api['name']}")
            print("="* (len(api['name']) + 5))
            found_device = False
            for device_index in api['devices']:
                device_info = devices[device_index]
                if device_info['max_output_channels'] > 0:
                    found_device = True
                    default_marker = " (Dispositivo por defecto)" if device_index == default_output else ""
                    print(f"  -> {device_info['name']}{default_marker}")
            
            if not found_device:
                print("  (No se encontraron dispositivos de salida para esta API)")

    except Exception as e:
        print(f"\n--- ¡ERROR! ---")
        print(f"No se pudieron consultar los dispositivos de audio: {e}")
        print("Asegúrate de haber instalado las dependencias con: pip install -r requirements.txt")
        print("Las librerías necesarias son 'sounddevice' y 'numpy'.")

if __name__ == "__main__":
    list_devices()
