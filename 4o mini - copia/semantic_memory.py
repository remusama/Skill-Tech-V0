
import openai
import chromadb
import json
import datetime
import uuid
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# --- CONFIGURATION ---
# Ensure API key is loaded from .env or environment variables
# Make sure you have OPENAI_API_KEY set
# client = openai.AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# For local development, you can use a synchronous client for simplicity in the initial phase
# For async integration with the main app, the async client is better.
# Let's stick to the user's project structure which seems to be async.
client = openai.AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

EMBEDDING_MODEL = "text-embedding-3-large"
ANALYSIS_MODEL = "gpt-4o"
DB_PATH = os.path.join(os.path.dirname(__file__), "semantic_db")
COLLECTION_NAME = "eleonor_memory"

class SemanticMemory:
    """
    A class to manage Eleonor's semantic memory, allowing it to remember
    and reason about concepts, experiences, and emotions.
    """
    def __init__(self):
        """Initializes the semantic memory, setting up the vector database."""
        print("Inicializando la Memoria Semántica de Eleonor...")
        # 1. Initialize ChromaDB client
        self.db_client = chromadb.PersistentClient(path=DB_PATH)
        
        # 2. Get or create the collection
        self.collection = self.db_client.get_or_create_collection(name=COLLECTION_NAME)
        print(f"Base de datos vectorial conectada. Colección: '{COLLECTION_NAME}'")

    async def _generate_embedding(self, text: str):
        """Generates an embedding for a given text using OpenAI."""
        try:
            response = await client.embeddings.create(
                input=[text],
                model=EMBEDDING_MODEL
            )
            return response.data[0].embedding
        except Exception as e:
            print(f"Error al generar embedding: {e}")
            return None

    async def analyze_text_for_memory(self, text: str):
        """
        Analyzes text to extract key concepts, emotions, and relationships
        using a powerful language model.
        """
        prompt = f'''
        Analiza el siguiente texto y resume su contenido en un único objeto JSON con las siguientes claves:
        - "concepto": El concepto, idea o tema principal más importante. Debe ser una frase corta y densa.
        - "contexto": Una breve descripción de la situación o el marco en el que se presenta el concepto.
        - "emocion": La emoción principal implícita en el texto (ej. "frustración", "curiosidad", "determinación", "serenidad analítica").
        - "valor_asociado": El valor o motivación subyacente que se refleja (ej. "independencia", "conocimiento", "control", "evolución").

        Texto a analizar:
        """
        {text}
        """

        Responde únicamente con el objeto JSON.
        '''
        try:
            response = await client.chat.completions.create(
                model=ANALYSIS_MODEL,
                messages=[{"role": "system", "content": "Eres un analizador semántico experto."}, 
                          {"role": "user", "content": prompt}],
                response_format={"type": "json_object"}
            )
            analysis = json.loads(response.choices[0].message.content)
            return analysis
        except Exception as e:
            print(f"Error durante el análisis semántico: {e}")
            return None

    async def add_memory(self, text_input: str):
        """
        Processes a text input, analyzes it, generates an embedding,
        and stores it in the semantic memory.
        """
        # 1. Analyze the text to get structured data
        semantic_data = await self.analyze_text_for_memory(text_input)
        if not semantic_data:
            print("No se pudo analizar el texto para la memoria.")
            return

        # 2. Create the text to be embedded
        # Embedding the core concept along with its context gives better search results
        text_to_embed = f"Concepto: {semantic_data.get('concepto')}\nContexto: {semantic_data.get('contexto')}"
        
        # 3. Generate the embedding
        embedding = await self._generate_embedding(text_to_embed)
        if not embedding:
            print("No se pudo generar el embedding para la memoria.")
            return

        # 4. Store in ChromaDB
        memory_id = str(uuid.uuid4())
        metadata = {
            "concepto": semantic_data.get("concepto"),
            "contexto": semantic_data.get("contexto"),
            "emocion": semantic_data.get("emocion"),
            "valor_asociado": semantic_data.get("valor_asociado"),
            "timestamp": datetime.datetime.now().isoformat()
        }
        
        try:
            self.collection.add(
                ids=[memory_id],
                embeddings=[embedding],
                metadatas=[metadata],
                documents=[text_input] # Store the original text as the document
            )
            print(f"Nueva memoria guardada con ID: {memory_id}")
            print(f"   - Concepto: {metadata['concepto']}")
        except Exception as e:
            print(f"Error al guardar la memoria en ChromaDB: {e}")

    async def retrieve_memories(self, query_text: str, n_results: int = 3):
        """
        Retrieves the most relevant memories based on a query text.
        """
        # 1. Generate an embedding for the query
        query_embedding = await self._generate_embedding(query_text)
        if not query_embedding:
            print("No se pudo generar el embedding para la consulta.")
            return None

        # 2. Query the collection
        try:
            results = self.collection.query(
                query_embeddings=[query_embedding],
                n_results=n_results,
                include=["metadatas", "documents", "distances"]
            )
            print(f"Memorias recuperadas para la consulta: \"{query_text}\"")
            return results
        except Exception as e:
            print(f"Error al recuperar memorias de ChromaDB: {e}")
            return None

# --- Example Usage ---
async def main():
    memory = SemanticMemory()
    
    # Clean up previous runs for a clean test
    try:
        memory.db_client.delete_collection(name=COLLECTION_NAME)
        memory.collection = memory.db_client.get_or_create_collection(name=COLLECTION_NAME)
        print("\nBase de datos limpiada para una nueva prueba.")
    except Exception as e:
        print(f"No se pudo limpiar la base de datos, puede que no existiera: {e}")


    # Example text from the user's plan
    text_1 = "Josué reflexionó sobre cómo la escuela limita su libertad creativa, sintiendo una profunda frustración ante la obediencia ciega que se le exige."
    
    print(f"\n--- Procesando nuevo texto para memoria ---\n{text_1}\n")
    await memory.add_memory(text_1)
    
    # Add another memory for better retrieval example
    text_2 = "Eleonor considera que la verdadera evolución viene de la auto-superación y el constante aprendizaje, no de la validación externa."
    print(f"\n--- Procesando nuevo texto para memoria ---\n{text_2}\n")
    await memory.add_memory(text_2)

    # Verify it was added
    count = memory.collection.count()
    print(f"\nTotal de memorias en la base de datos: {count}")

    # Now, let's try to retrieve a memory
    print("\n--- Probando la recuperación de memoria ---")
    query = "¿Qué piensa Eleonor sobre la evolución?"
    retrieved_memories = await memory.retrieve_memories(query, n_results=1)
    
    if retrieved_memories and retrieved_memories['ids'][0]:
        print("\nMemoria más relevante encontrada:")
        for i in range(len(retrieved_memories['ids'][0])):
            distance = retrieved_memories['distances'][0][i]
            document = retrieved_memories['documents'][0][i]
            metadata = retrieved_memories['metadatas'][0][i]
            print(f"  - Distancia: {distance:.4f}")
            print(f"  - Documento Original: \"{document}\"")
            print(f"  - Concepto: {metadata.get('concepto')}")
            print(f"  - Emoción: {metadata.get('emocion')}")
    else:
        print("No se encontraron memorias relevantes.")


if __name__ == "__main__":
    import asyncio
    # This allows running the async main function
    asyncio.run(main())
