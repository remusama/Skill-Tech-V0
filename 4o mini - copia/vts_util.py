'''
Self-healing VTube Studio utility to list ALL expressions and their details.
Automatically requests a new token if the existing one is invalid.
'''
import asyncio
import json
import websockets
import os
from dotenv import load_dotenv, set_key

# --- CONFIGURATION ---
VTS_HOST = "ws://localhost:8001"
PLUGIN_NAME = "EleonorUtil"
PLUGIN_DEVELOPER = "Josue"
ENV_FILE = os.path.join(os.path.dirname(__file__), '.env')

# Load environment variables
load_dotenv(ENV_FILE)

class VTubeStudioUtilClient:
    """A self-healing client for VTube Studio diagnostics."""
    def __init__(self, uri=VTS_HOST):
        self.uri = uri
        self.ws = None
        self.token = os.getenv("VTS_AUTH_TOKEN")

    async def connect(self):
        """Establishes a WebSocket connection to VTube Studio."""
        try:
            self.ws = await websockets.connect(self.uri)
        except Exception as e:
            print(f"❌ Error al conectar con VTube Studio: {e}")
            self.ws = None

    async def authenticate(self):
        """Tries to authenticate with a stored token; if it fails, requests a new one."""
        if not self.ws:
            return False

        # Step 1: Try to authenticate with the existing token
        if self.token:
            # print("🔑 Intentando autenticar con el token existente...")
            auth_payload = {
                "apiName": "VTubeStudioPublicAPI", "apiVersion": "1.0",
                "requestID": "util-auth-1", "messageType": "AuthenticationRequest",
                "data": {
                    "pluginName": PLUGIN_NAME, "pluginDeveloper": PLUGIN_DEVELOPER,
                    "authenticationToken": self.token
                }
            }
            await self.ws.send(json.dumps(auth_payload))
            resp = json.loads(await self.ws.recv())
            if resp.get("data", {}).get("authenticated"):
                print("✅ Autenticación exitosa.")
                return True
            else:
                print("⚠️ El token existente es inválido o ha sido revocado.")

        # Step 2: If token is missing or invalid, request a new one
        print("\nSolicitando un nuevo token...")
        print("👉 Por favor, en la ventana de VTube Studio, permite el acceso al plugin.")
        token_req_payload = {
            "apiName": "VTubeStudioPublicAPI", "apiVersion": "1.0",
            "requestID": "util-token-request", "messageType": "AuthenticationTokenRequest",
            "data": {"pluginName": PLUGIN_NAME, "pluginDeveloper": PLUGIN_DEVELOPER}
        }
        await self.ws.send(json.dumps(token_req_payload))
        resp = json.loads(await self.ws.recv())

        if "authenticationToken" in resp.get("data", {}):
            self.token = resp["data"]["authenticationToken"]
            print("✅ Nuevo token recibido.")
            # Save the new token to the .env file
            # This will create the file if it doesn't exist
            set_key(ENV_FILE, "VTS_AUTH_TOKEN", self.token)
            print(f"💾 Nuevo token guardado en el archivo {ENV_FILE}.")
            # We need to re-authenticate with the new token to be considered authenticated for the session
            return await self.authenticate()
        else:
            print(f"❌ No se pudo obtener un nuevo token. Respuesta: {resp}")
            return False

    async def get_expression_list(self):
        """Gets the list of all expressions."""
        req = {
            "apiName": "VTubeStudioPublicAPI", "apiVersion": "1.0",
            "requestID": "util-list-expressions", "messageType": "ExpressionStateRequest",
            "data": {"details": True}
        }
        await self.ws.send(json.dumps(req))
        resp = json.loads(await self.ws.recv())
        return resp.get("data", {}).get("expressions", [])

    async def close(self):
        if self.ws: await self.ws.close()

async def main():
    """Main function to run the utility."""
    client = VTubeStudioUtilClient()
    try:
        await client.connect()
        if client.ws:
            is_authed = await client.authenticate()
            
            if is_authed:
                expressions = await client.get_expression_list()
                if expressions:
                    print("\n✅ Lista de todas las expresiones disponibles:")
                    print("--------------------------------------------------")
                    for i, exp in enumerate(expressions):
                        name = exp.get('name', 'Sin Nombre')
                        file = exp.get('file', 'N/A')
                        is_active = exp.get('active', False)
                        
                        print(f"  Expresión #{i+1}")
                        print(f"    - Nombre: {name}")
                        print(f"    - Archivo: {file}")
                        print(f"    - Activa: {'Sí' if is_active else 'No'}")
                    print("--------------------------------------------------")
                    if expressions:
                         print(f"\nℹ️  Para usar una expresión, Eleonor debe incluir el nombre del ARCHIVO (sin la extensión .exp3.json) en su respuesta. Por ejemplo: [EXPRESION:{expressions[0].get('file', '').replace('.exp3.json', '')}]")
                else:
                    print("\n❌ No se pudo obtener la lista de expresiones o no hay ninguna cargada en el modelo actual.")

    except Exception as e:
        print(f"\nHa ocurrido un error: {e}")
    finally:
        await client.close()
        print("--------------------------------------------------")

if __name__ == "__main__":
    print("--- Herramienta de Listado de Expresiones VTS ---")
    # Ensure python-dotenv is installed: pip install python-dotenv
    asyncio.run(main())