import asyncio
import json
import websockets

async def obtener_token_con_plugin():
    async with websockets.connect("ws://localhost:8001") as ws:
        print("✅ Conectado a VTube Studio")

        # Solicitar un Authentication Token con plugin name y developer
        payload = {
            "apiName": "VTubeStudioPublicAPI",
            "apiVersion": "1.0",
            "requestID": "token-request",
            "messageType": "AuthenticationTokenRequest",
            "data": {
                "pluginName": "EleonorAI",       # Nombre de tu plugin (mín 3, máx 32 chars)
                "pluginDeveloper": "JosueHF",    # Tu nombre o alias
                # "pluginIcon": "..."            # Opcional: base64 de un PNG 128x128
            }
        }

        await ws.send(json.dumps(payload))
        response = await ws.recv()
        print("📩 Respuesta (Token):")
        print(response)

asyncio.run(obtener_token_con_plugin())
