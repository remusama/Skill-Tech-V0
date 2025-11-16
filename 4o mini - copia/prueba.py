import asyncio
from text_to_speech import text_to_speech

async def test_tts():
    await text_to_speech("Prueba de voz. Si me escuchas, el TTS funciona correctamente.")

asyncio.run(test_tts())
