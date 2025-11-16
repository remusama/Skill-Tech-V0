import asyncio
from chess_engine import LichessBot
from config import LICHESS_TOKEN, STOCKFISH_PATH
from openai_integration import consulta_openai
from text_to_speech import text_to_speech
from utils import save_subtitles
from speech_to_text import speech_to_text


async def main():
    lichess = LichessBot(LICHESS_TOKEN, STOCKFISH_PATH)

    print("💬 Eleonor lista. Comandos: buscar partida / stop partidas / salir / voz")

    modo_voz = False

    while True:
        if modo_voz:
            print("🎙️ Modo voz activado... habla ahora")
            user_input = await asyncio.to_thread(speech_to_text)

            if not user_input:  # silencio → reintentar
                continue

            user_input = user_input.lower().strip()
            print(f"🗨 Tú (voz): {user_input}")

            # 🔑 Comando para salir del modo voz
            if "volvamos a texto" in user_input:
                print("⌨️ Volviendo a modo texto")
                modo_voz = False
                continue
        else:
            user_input = input("🗨 Tú (texto): ").strip().lower()

        if not user_input:
            continue

        if user_input == "salir":
            print("👋 Cerrando todo...")
            if lichess.running:
                await lichess.stop()
            break

        if user_input == "voz":
            modo_voz = True
            print("🎙️ Voz activada ✅ (di 'volvamos a texto' para salir del modo voz)")
            continue

        if user_input == "buscar partida":
            if not lichess.running:
                print("🔍 Activando búsqueda de partidas...")
                await lichess.start()
            else:
                print("⚠️ Ya está buscando partidas.")
            continue

        if user_input == "stop partidas":
            if lichess.running:
                print("🛑 Deteniendo búsqueda de partidas...")
                await lichess.stop()
            else:
                print("⚠️ No hay búsqueda activa.")
            continue

        # resto del flujo normal (texto/voz -> Eleonor)
        respuesta = await consulta_openai(user_input)
        print("ELEONORSAMA:", respuesta)
        save_subtitles(respuesta)
        await text_to_speech(respuesta)


if __name__ == "__main__":
    asyncio.run(main())
