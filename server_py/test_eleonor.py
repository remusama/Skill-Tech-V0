
import asyncio
import json
import websockets
import pyttsx3
import os
import time

# --- Configuración ---
VTS_URL = "ws://localhost:8001"
TOKEN_FILE = "vts_token.json"
PLUGIN_NAME = "EleonorAI"
PLUGIN_DEVELOPER = "JosueHF"

# --- Script de Presentación ---
# Cada tupla contiene: (Texto a decir, nombre del archivo de expresión)
PRESENTATION_SCRIPT = [
    ("Hola, mi nombre es Eleonor.", "Feliz.exp3.json"),
    ("Soy tu asistente personal en Skilltech.", "Prueba.exp3.json"),
    ("Estoy aquí para ayudarte a organizar tus metas y convertir tu visión en realidad.", "Prueba.exp3.json"),
    ("Juntos, podemos lograr grandes cosas.", "Feliz.exp3.json"),
    ("¿Qué te gustaría explorar hoy?", "coqueta.exp3.json")
]

# --- Funciones de VTube Studio ---

async def get_token():
    """Obtiene el token de autenticación de VTS."""
    if os.path.exists(TOKEN_FILE):
        with open(TOKEN_FILE, "r") as f:
            return json.load(f).get("authenticationToken")
    return None

async def authenticate(ws, token):
    """Autentica la conexión con VTS."""
    auth_request = {
        "apiName": "VTubeStudioPublicAPI",
        "apiVersion": "1.0",
        "requestID": "auth_test",
        "messageType": "AuthenticationRequest",
        "data": {
            "pluginName": PLUGIN_NAME,
            "pluginDeveloper": PLUGIN_DEVELOPER,
            "authenticationToken": token
        }
    }
    await ws.send(json.dumps(auth_request))
    response = json.loads(await ws.recv())
    if response.get("data", {}).get("authenticated"):
        print("✅ Autenticado en VTube Studio.")
        return True
    else:
        print("❌ Fallo de autenticación en VTube Studio.")
        return False

async def trigger_expression(ws, expression_file):
    """Activa una expresión en VTube Studio."""
    if not ws or ws.closed:
        print("🔌 WebSocket no está conectado.")
        return
        
    print(f"😊 Activando expresión: {expression_file}")
    request = {
        "apiName": "VTubeStudioPublicAPI",
        "apiVersion": "1.0",
        "requestID": "trigger_expr",
        "messageType": "ExpressionActivationRequest",
        "data": {
            "expressionFile": expression_file,
            "active": True
        }
    }
    await ws.send(json.dumps(request))

# --- Función Principal ---

def run_presentation():
    """
    Ejecuta la presentación combinando TTS y expresiones de VTS.
    """
    print("🎤 Iniciando presentación de Eleonor...")
    
    # 1. Inicializar el motor de TTS
    try:
        engine = pyttsx3.init()
        
        # --- Opcional: Configurar la voz ---
        # Descomenta las siguientes líneas para ver las voces disponibles y seleccionar una.
        # voices = engine.getProperty('voices')
        # for voice in voices:
        #     print(f"Voice: {voice.name}, ID: {voice.id}")
        # engine.setProperty('voice', 'ID_DE_LA_VOZ_AQUI') # <-- Pega el ID de una voz en español

        engine.setProperty('rate', 160) # Velocidad del habla
        engine.setProperty('volume', 0.9) # Volumen
    except Exception as e:
        print(f"❌ Error al inicializar el motor de TTS: {e}")
        print("Asegúrate de tener un motor de TTS compatible instalado en tu sistema (como SAPI5 en Windows).")
        return

    # 2. Definir la función asíncrona para VTS
    async def vts_task():
        token = await get_token()
        if not token:
            print("❌ No se encontró el token. Ejecuta `get_expressions.py` primero.")
            return

        try:
            async with websockets.connect(VTS_URL) as ws:
                if not await authenticate(ws, token):
                    return

                # 3. Ejecutar el script
                for text, expression_file in PRESENTATION_SCRIPT:
                    await trigger_expression(ws, expression_file)
                    print(f"💬 Diciendo: \"{text}\" ")
                    engine.say(text)
                    engine.runAndWait()
                    time.sleep(0.5) # Pequeña pausa entre frases

                # 4. Desactivar la última expresión
                last_expression = PRESENTATION_SCRIPT[-1][1]
                print(f"😊 Desactivando expresión final: {last_expression}")
                deactivate_request = {
                    "apiName": "VTubeStudioPublicAPI",
                    "apiVersion": "1.0",
                    "requestID": "deactivate_expr",
                    "messageType": "ExpressionActivationRequest",
                    "data": { "expressionFile": last_expression, "active": False }
                }
                await ws.send(json.dumps(deactivate_request))
                
        except ConnectionRefusedError:
            print("❌ Error: No se pudo conectar a VTube Studio.")
            print("   Asegúrate de que esté en ejecución y el servidor API esté habilitado.")
        except Exception as e:
            print(f"Ha ocurrido un error inesperado con VTube Studio: {e}")

    # 5. Ejecutar la tarea asíncrona de VTS
    asyncio.run(vts_task())
    print("✅ Presentación finalizada.")


if __name__ == "__main__":
    print("*****************************************************************")
    print("* Script de Prueba de Eleonor (TTS + VTube Studio)              *")
    print("*****************************************************************")
    print("IMPORTANTE:")
    print("1. Asegúrate de que VTube Studio esté ABIERTO.")
    print("2. Para la sincronización de labios, configura tu CABLE DE AUDIO")
    print("   VIRTUAL como dispositivo de reproducción de audio PREDETERMINADO")
    print("   en los ajustes de sonido de tu sistema operativo.")
    print("*****************************************************************")
    
    run_presentation()