import speech_recognition as sr

def speech_to_text():
    recognizer = sr.Recognizer()
    mic_index = 2  # 👈 usar siempre el micro del puerto 2

    try:
        with sr.Microphone(device_index=mic_index) as source:
            print("🎤 Escuchando... (máx 5 seg de silencio)")
            recognizer.adjust_for_ambient_noise(source, duration=0.5)
            try:
                audio = recognizer.listen(source, timeout=10, phrase_time_limit=10)
            except sr.WaitTimeoutError:
                return ""  # no habló nada
    except OSError as e:
        return f"⚠️ Error al acceder al micrófono {mic_index}: {e}"

    try:
        return recognizer.recognize_google(audio, language="es-ES")
    except sr.UnknownValueError:
        return ""  # no entendió nada
    except sr.RequestError as e:
        return f"Error con Google Speech API: {e}"
