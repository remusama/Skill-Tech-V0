
'''
API principal de FastAPI para la asistente Eleonor AI.
Handles chat streaming, text-to-speech, and VTube Studio integration.
'''
from fastapi import FastAPI, Request
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import asyncio
import json
import re
from fastapi.middleware.cors import CORSMiddleware

# Import custom modules
import openai_integration
import text_to_speech # Volvemos al nombre original del módulo
from vtube_client import vts_client # Import the unified async client instance
from semantic_memory import SemanticMemory
from achievement_manager import AchievementManager

# --- Global State for Audio Device ---
# This will hold the currently selected audio device ID for TTS playback.
current_audio_device_id = None

# --- Data Models ---
class ChatRequest(BaseModel):
    text: str
    user_id: str | None = None

class MemoryRequest(BaseModel):
    text: str

class QuizResultRequest(BaseModel):
    user_id: str
    subtopic: str
    score: float # Puntuación de 0 a 100

class AudioDeviceRequest(BaseModel):
    device_id: int

# --- FastAPI App Initialization ---
app = FastAPI()
memory: SemanticMemory | None = None # Initialize as None
achievement_manager: AchievementManager | None = None # Initialize as None

# --- CORS Configuration ---
origins = [
    "http://localhost:3000",
    "http://localhost",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Main Streaming Logic ---
async def stream_generator(prompt: str, user_id: str | None):
    """
    Genera un stream de texto y audio, manejando expresiones de VTube Studio
    y utilizando la memoria semántica para dar contexto a la IA.
    """
    try:
        if not memory:
            raise RuntimeError("La memoria semántica no está inicializada.")
        if not achievement_manager:
            raise RuntimeError("El gestor de logros no está inicializado.")

        # 1. Search for relevant memories
        print(f"🧠 Buscando recuerdos relevantes para: '{prompt}'")
        retrieved_memories = await memory.retrieve_memories(query_text=prompt, n_results=1)
        
        augmented_prompt = prompt
        if retrieved_memories and retrieved_memories.get('documents') and retrieved_memories['documents'][0]:
            # Extract the most relevant document
            context = retrieved_memories['documents'][0][0]
            print(f"Contexto recuperado de la memoria: '{context}'")
            
            # Augment the prompt
            augmented_prompt = f'''
            El usuario ha preguntado: "{prompt}"
 
            Contexto de una conversación pasada que podría ser relevante:
            "{context}"
            '''
        else:
            print("No se encontraron recuerdos relevantes.")

        # 2. Get user achievements to provide more context
        achievements_context = ""
        if user_id:
            user_achievements = await achievement_manager.get_user_achievements(user_id)
            if user_achievements:
                unlocked_list = "\n".join([f'- {a["name"]}' for a in user_achievements])
                achievements_context = f"\n\nLogros que el usuario ya ha desbloqueado:\n{unlocked_list}"

        augmented_prompt = f'''{augmented_prompt}{achievements_context}

            Considerando este contexto, responde a la pregunta del usuario.
        '''

        # 3. Get the full response from OpenAI using the (potentially augmented) prompt
        full_response = await openai_integration.consulta_openai(augmented_prompt)

        # 4. Concurrently, decide and trigger the expression based on the full response
        async def trigger_expression_task():
            expression_name = await openai_integration.elegir_expresion(full_response)
            if expression_name:
                print(f"✨ Expresión elegida por IA: {expression_name}")
                await vts_client.activate_expression(expression_name)
            else:
                print("😐 Tono neutral, no se activó ninguna expresión.")
        
        asyncio.create_task(trigger_expression_task())

        # 5. Split the clean response into sentences for streaming
        # This regex splits by '.', '!', '?' but keeps the delimiter
        sentences = re.split(r'(?<=[.!?])\s*', full_response)

        for sentence in sentences:
            if not sentence.strip():
                continue
 
            # 6. Send the text part (already cleaned)
            yield f"data: {json.dumps({'type': 'text', 'content': sentence})}\n\n"
                
            # 7. Generate and send the audio part
            audio_base64 = await text_to_speech.get_speech_and_play_for_lipsync(sentence, device_id=current_audio_device_id)
            if audio_base64:
                yield f"data: {json.dumps({'type': 'audio', 'content': audio_base64})}\n\n"

    except Exception as e:
        print(f"❌ Error en stream_generator: {e}")
        error_details = f"Error en el servidor: {type(e).__name__} - {e}"
        error_message = json.dumps({'type': 'error', 'content': error_details})
        yield f"data: {error_message}\n\n"
    finally:
        yield f"data: {json.dumps({'type': 'done'})}\n\n"

# --- API Endpoints ---

@app.on_event("startup")
async def startup_event():
    """Conecta con VTube Studio y establece el dispositivo de audio por defecto al iniciar."""
    global current_audio_device_id, memory, achievement_manager
    # Initialize Semantic Memory
    memory = SemanticMemory()
    print("🧠 Memoria Semántica inicializada.")

    # Initialize Achievement Manager
    achievement_manager = AchievementManager()
    print("🏆 Gestor de Logros inicializado.")

    # Connect to VTube Studio
    await vts_client.connect()

    # Set default device on startup
    current_audio_device_id = text_to_speech.get_default_device_id()
    print(f"🔊 Dispositivo de audio por defecto establecido en ID: {current_audio_device_id}")

@app.on_event("shutdown")
async def shutdown_event():
    """Cierra las conexiones al apagar la aplicación."""
    await vts_client.close()
@app.post("/api/chat/stream")
async def handle_chat_stream(request: ChatRequest):
    """
    Processes the chat using streaming of text and audio.
    """
    return StreamingResponse(stream_generator(request.text, request.user_id), media_type="text/event-stream")

@app.post("/api/memory")
async def add_memory(request: MemoryRequest):
    """Adds a new text memory."""
    if not memory:
        return {"status": "error", "message": "La memoria no está inicializada."}
    await memory.add_memory(request.text)
    return {"status": "success", "message": "Memory added."}

@app.get("/api/memory/search")
async def search_memory(query: str):
    """Searches memories."""
    if not memory:
        return {"status": "error", "message": "La memoria no está inicializada."}
    results = await memory.retrieve_memories(query_text=query, n_results=2)
    return {"status": "success", "results": results}

@app.post("/api/quiz/submit")
async def submit_quiz_result(request: QuizResultRequest):
    """
    Recibe el resultado de un quiz, lo procesa y verifica si se desbloquea un logro.
    """
    if not achievement_manager:
        raise HTTPException(status_code=500, detail="El gestor de logros no está inicializado.")
    
    print(f"📊 Recibido resultado de quiz para user '{request.user_id}': {request.subtopic} -> {request.score}%")
    
    unlocked_achievement = await achievement_manager.check_and_unlock_quiz_achievements(
        user_id=request.user_id,
        subtopic=request.subtopic,
        score=request.score
    )
    
    if unlocked_achievement:
        return {"status": "success", "unlocked_achievement": unlocked_achievement}
    
    return {"status": "success", "unlocked_achievement": None}

@app.get("/api/audio/devices")
async def get_audio_devices():
    """Returns a list of available audio output devices."""
    devices = text_to_speech.list_audio_devices()
    return {"status": "success", "devices": devices}

@app.post("/api/audio/device")
async def set_audio_device(request: AudioDeviceRequest):
    """Sets the audio output device for TTS lip-sync playback."""
    global current_audio_device_id
    current_audio_device_id = request.device_id
    print(f"🔊 Dispositivo de audio para lip-sync actualizado a ID: {request.device_id}")
    return {"status": "success", "message": f"Audio device set to ID {request.device_id}."}


@app.get("/")
def read_root():
    return {"message": "Servidor de Eleonor AI (Streaming) está funcionando"}

# Legacy endpoint
@app.post("/api/chat")
async def handle_chat_legacy(request: ChatRequest):
    try:
        ai_response = await openai_integration.consulta_openai(request.text)
        return {"response_text": ai_response, "status": "success"}
    except Exception as e:
        print(f"Error processing chat: {e}")
        return {"response_text": "Lo siento, algo salió mal.", "status": "error"}
