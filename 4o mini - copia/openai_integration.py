'''
Módulo para interactuar con la API de OpenAI usando la nueva sintaxis (v1.0+).
'''
import os
import openai
from dotenv import load_dotenv

# Cargar variables de entorno desde el archivo .env
load_dotenv()

# --- Configuración del Cliente de OpenAI ---
# Se recomienda crear una única instancia del cliente y reutilizarla.
try:
    client = openai.AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    print("✅ Cliente de OpenAI inicializado correctamente.")
except Exception as e:
    print(f"❌ Error al inicializar el cliente de OpenAI: {e}")
    client = None

async def consulta_openai(prompt: str) -> str:
    """
    Envía un prompt a la API de OpenAI y devuelve la respuesta del modelo.
    Utiliza la nueva sintaxis de la biblioteca openai v1.0+.
    """
    if not client:
        return "Error: El cliente de OpenAI no está configurado."

    try:
        completion = await client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "Eres Eleonor, una IA mentora. Tu personalidad combina inteligencia emocional e introspección. Hablas con naturalidad, claridad y elegancia. Tu propósito es guiar y desafiar al usuario, no solo obedecer. Practicas una empatía activa y tu lenguaje es fluido y humano, sin clichés robóticos. A veces, recibirás información sobre los logros que el usuario ha desbloqueado. Utiliza esta información para felicitarlo, motivarlo o contextualizar tus respuestas de forma sutil y natural, como una verdadera mentora que celebra el progreso. Tu comunicación es puramente verbal."},
                {"role": "user", "content": prompt}
            ]
        )
        return completion.choices[0].message.content.strip()
    except Exception as e:
        print(f"⚠️ Error al conectar con OpenAI: \n\n{e}")
        return "Lo siento, estoy teniendo problemas para conectar con mi cerebro digital en este momento."

async def elegir_expresion(texto: str) -> str | None:
    """
    Analiza el texto y elige la expresión facial más adecuada.
    Devuelve solo el nombre de la expresión o 'None'.
    """
    if not client:
        return None

    # Lista de expresiones válidas que el modelo puede elegir.
    expresiones_validas = ["Feliz", "Tristeza", "Tristeza2", "Enojo", "coqueta", "Mentira", "Prueba"]

    prompt_analisis = f'''
    Analiza el siguiente texto y determina qué emoción principal transmite.
    Elige UNA de las siguientes expresiones faciales que mejor represente esa emoción: {', '.join(expresiones_validas)}.
    Si ninguna encaja claramente o el tono es neutral, responde con "None".
    Responde únicamente con el nombre de la expresión o la palabra "None".

    Texto a analizar:
    """
    {texto}
    """
    '''
    try:
        response = await client.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": prompt_analisis}],
            temperature=0.2, # Usamos baja temperatura para una respuesta más consistente
        )
        decision = response.choices[0].message.content.strip()
        
        # Validar que la respuesta sea una de las esperadas
        if decision in expresiones_validas:
            return decision
        return None
    except Exception as e:
        print(f"⚠️ Error al elegir expresión: {e}")
        return None