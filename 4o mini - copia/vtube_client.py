'''
(Unified Async) WebSocket client for interacting with the VTube Studio API.
'''
import websockets
import json
import os
import asyncio
from dotenv import load_dotenv, set_key

# --- Configuration ---
VTS_API_URL = "ws://localhost:8001"
ENV_FILE = os.path.join(os.path.dirname(__file__), '.env')
PLUGIN_NAME = "EleonorAI"
PLUGIN_DEVELOPER = "JosueHF"

# Load environment variables
load_dotenv(ENV_FILE)

class VTubeStudioClient:
    """A robust, self-healing WebSocket client for VTube Studio."""
    def __init__(self, url=VTS_API_URL):
        self.url = url
        self.ws = None
        self.auth_token = None
        self.is_authenticated = False
        self.request_counter = 0
        self._lock = asyncio.Lock()
        self._authenticated_event = asyncio.Event()

    def is_connected(self) -> bool:
        """Checks if the WebSocket is connected in a safe way."""
        if self.ws is None:
            return False
        # The 'websockets' library has changed its state properties over versions.
        # This method tries common attributes to be more robust.
        if hasattr(self.ws, "open"):  # For recent versions
            return self.ws.open
        if hasattr(self.ws, "closed"): # For older versions
            return not self.ws.closed
        return False # Fallback if no known state attribute is found

    async def connect(self):
        """Establishes and authenticates the connection if not already connected."""
        async with self._lock:
            if not self.is_connected():
                try:
                    self.is_authenticated = False
                    self._authenticated_event.clear()
                    self.ws = await websockets.connect(self.url)
                    print("🔌 WebSocket conectado a VTube Studio.")
                    await self.authenticate()
                except (websockets.exceptions.ConnectionClosedError, ConnectionRefusedError) as e:
                    print(f"⚠️ Error al conectar con VTube Studio: {e}. ¿Está en ejecución?")
                    self.ws = None
                except Exception as e:
                    print(f"⚠️ Error inesperado al conectar: {e}")
                    self.ws = None

    async def _get_token_from_file(self):
        """Reads the token from the .env file."""
        load_dotenv(ENV_FILE) # Reload to get the latest value
        return os.getenv("VTS_AUTH_TOKEN")

    async def _save_token_to_file(self, token):
        """Saves the token to the .env file."""
        # This will create the file if it doesn't exist and update the key
        set_key(ENV_FILE, "VTS_AUTH_TOKEN", token)
        print(f"💾 Nuevo token guardado en el archivo {ENV_FILE}.")

    async def _request_and_save_new_token(self):
        '''Requests a new token from VTube Studio and saves it.'''
        print("🔑 Solicitando un nuevo token a VTube Studio...")
        print("👉 Por favor, en la ventana de VTube Studio, permite el acceso al plugin.")
        payload = {
            "apiName": "VTubeStudioPublicAPI",
            "apiVersion": "1.0",
            "requestID": "EleonorTokenRequest",
            "messageType": "AuthenticationTokenRequest",
            "data": {
                "pluginName": PLUGIN_NAME,
                "pluginDeveloper": PLUGIN_DEVELOPER
            }
        }
        try:
            await self.ws.send(json.dumps(payload))
            response_str = await self.ws.recv()
            response = json.loads(response_str)

            new_token = response.get("data", {}).get("authenticationToken")
            if new_token:
                await self._save_token_to_file(new_token)
                return new_token
            
            print(f"❌ No se pudo obtener el token. Respuesta de VTS: {response}")
            return None
        except Exception as e:
            print(f"❌ Error solicitando el token: {e}")
            return None

    async def authenticate(self):
        """Authenticates with VTube Studio, getting a new token if necessary."""
        if not self.ws:
            return

        self.auth_token = await self._get_token_from_file()

        if not self.auth_token:
            self.auth_token = await self._request_and_save_new_token()
            if not self.auth_token:
                print("⚠️ Fallo al obtener un nuevo token. La autenticación no puede continuar.")
                return

        # Now, authenticate with the token we have.
        auth_payload = {
            "apiName": "VTubeStudioPublicAPI",
            "apiVersion": "1.0",
            "requestID": "EleonorAuthRequest",
            "messageType": "AuthenticationRequest",
            "data": {
                "pluginName": PLUGIN_NAME,
                "pluginDeveloper": PLUGIN_DEVELOPER,
                "authenticationToken": self.auth_token
            }
        }
        try:
            await self.ws.send(json.dumps(auth_payload))
            response_str = await self.ws.recv()
            response = json.loads(response_str)

            if response.get("data", {}).get("authenticated") and response.get("requestID") == "EleonorAuthRequest":
                self.is_authenticated = True
                self._authenticated_event.set() # Signal that authentication is complete
                print("✅ Autenticado correctamente con VTube Studio.")
            else:
                self.is_authenticated = False
                print(f"⚠️ La autenticación con el token guardado falló. Respuesta: {response}")
                # Token is invalid, remove it from .env and try to get a new one.
                set_key(ENV_FILE, "VTS_AUTH_TOKEN", "")
                print("Token inválido eliminado. Se solicitará uno nuevo en la próxima conexión.")
                # --- IMPROVEMENT: Immediately try to get a new token ---
                print("🔄 Intentando obtener un nuevo token inmediatamente...")
                self.auth_token = await self._request_and_save_new_token()
                if self.auth_token:
                    await self.authenticate() # Re-run authentication with the new token
        except Exception as e:
            self.is_authenticated = False
            print(f"⚠️ Error durante la autenticación: {e}")

    async def send_request(self, request_type, data=None):
        '''Sends a generic request to the VTube Studio API.'''
        await self.connect()

        # If not authenticated, wait for the authentication to complete from another task.
        if not self.is_authenticated:
            await self._authenticated_event.wait()

        if not self.is_authenticated or not self.is_connected(): # Double-check after waiting
            print(f"⚠️ No se puede enviar la solicitud '{request_type}'. No hay conexión autenticada.")
            return None

        try:
            self.request_counter += 1
            request_id = f"EleonorRequest-{self.request_counter}"
            payload = {
                "apiName": "VTubeStudioPublicAPI",
                "apiVersion": "1.0",
                "requestID": request_id,
                "messageType": request_type,
                "data": data or {}
            }
            await self.ws.send(json.dumps(payload))
            # For fire-and-forget requests, we don't wait for a response.
            return {"status": "sent"}
        except Exception as e:
            print(f"⚠️ Error al enviar la solicitud '{request_type}': {e}")
            # In case of websocket error, mark as not connected to force reconnect.
            if self.ws:
                await self.ws.close()
            self.ws = None
            self.is_authenticated = False
            self._authenticated_event.clear()
            return None

    async def activate_expression(self, expression_name: str, duration_seconds: float = 4.0):
        '''
        Activates an expression for a set duration and then deactivates it.
        This is a "fire-and-forget" task.
        '''
        expression_file = f"{expression_name}.exp3.json"
        
        # 1. Activate
        await self.send_request(
            "ExpressionActivationRequest", 
            data={"expressionFile": expression_file, "active": True}
        )
        
        # 2. Wait for the specified duration
        await asyncio.sleep(duration_seconds)
        
        # 3. Deactivate
        await self.send_request(
            "ExpressionActivationRequest", 
            data={"expressionFile": expression_file, "active": False}
        )

    async def close(self):
        if self.is_connected():
            await self.ws.close()
            print("🔌 Conexión WebSocket cerrada.")
            self._authenticated_event.clear()
            self.ws = None

# Singleton instance to be used across the application
vts_client = VTubeStudioClient()
