import os
import asyncio
import berserk
import chess
import chess.engine
from config import LICHESS_TOKEN, STOCKFISH_PATH
from openai_integration import consulta_openai
from text_to_speech import text_to_speech
from utils import save_subtitles

# --- Traducción simple de piezas (puedes ampliar) ---
traduccion_piezas = {
    'p': "peón", 'r': "torre", 'n': "caballo",
    'b': "alfil", 'q': "dama", 'k': "rey"
}

def traducir_movimiento(movimiento, board):
    try:
        move = chess.Move.from_uci(movimiento)
        pieza = board.piece_at(move.from_square)
        if pieza:
            nombre_pieza = traduccion_piezas.get(pieza.symbol().lower(), "pieza")
            return f"Voy a mover mi {nombre_pieza} de {movimiento[:2]} a {movimiento[2:]}."
        else:
            return f"Voy a jugar {movimiento}."
    except Exception as e:
        return f"⚠️ No pude traducir {movimiento}: {e}"

# --- Historial sencillo ---
historico_movimientos = []
def guardar_historial(movimiento, explicacion):
    historico_movimientos.append((movimiento, explicacion))
    if len(historico_movimientos) > 20:
        historico_movimientos.pop(0)

def mostrar_historial():
    for i, (m, e) in enumerate(historico_movimientos, 1):
        print(f"{i}. {m} -> {e}")


class LichessBot:
    def __init__(self, lichess_token: str, stockfish_path: str):
        self.session = berserk.TokenSession(lichess_token)
        self.client = berserk.Client(self.session)
        self.stockfish_path = stockfish_path

        self.engine = None
        self._incoming_q = asyncio.Queue()
        self._running = False
        self._tasks = []
        self._loop = None

    @property
    def running(self):
        return self._running

    async def start(self):
        """Arranca el listener de Lichess y carga Stockfish. No bloquea: devuelve rápido."""
        if self._running:
            print("⚠️ LichessBot ya estaba corriendo.")
            return
        if not os.path.exists(self.stockfish_path):
            raise FileNotFoundError(f"Stockfish no encontrado en {self.stockfish_path}")

        self._loop = asyncio.get_running_loop()
        self._running = True

        # Cargar Stockfish en hilo para no bloquear el loop
        self.engine = await asyncio.to_thread(chess.engine.SimpleEngine.popen_uci, self.stockfish_path)
        print("✅ Stockfish cargado (en background).")

        # Configuración: dificultad máxima + parámetros extra
        await asyncio.to_thread(self.engine.configure, {
            "Skill Level": 20,   # máxima dificultad
            "Move Overhead": 30, # tiempo de reacción (ms)
            "Threads": 2,        # núcleos CPU a usar
            "Hash": 256          # memoria para transposición (MB)
        })
     
        # lanzar worker que lee stream_incoming_events() en un thread y empuja a la cola async
        def incoming_worker():
            try:
                for event in self.client.board.stream_incoming_events():
                    self._loop.call_soon_threadsafe(self._incoming_q.put_nowait, event)
            except Exception as e:
                self._loop.call_soon_threadsafe(self._incoming_q.put_nowait, {"__error__": str(e)})

        t_incoming = asyncio.create_task(asyncio.to_thread(incoming_worker))
        self._tasks.append(t_incoming)

        t_proc = asyncio.create_task(self._process_incoming())
        self._tasks.append(t_proc)

        print("🔍 LichessBot: Listener activado.")

    async def stop(self):
        """Detiene el listener y cierra Stockfish."""
        if not self._running:
            print("⚠️ LichessBot ya estaba detenido.")
            return
        self._running = False

        for t in list(self._tasks):
            t.cancel()
        self._tasks.clear()

        if self.engine:
            try:
                await asyncio.to_thread(self.engine.quit)
            except Exception:
                pass
            self.engine = None

        print("🛑 LichessBot detenido.")

    async def _process_incoming(self):
        while self._running:
            try:
                event = await self._incoming_q.get()
                if isinstance(event, dict) and "__error__" in event:
                    print("⚠️ Error en stream de Lichess:", event["__error__"])
                    await asyncio.sleep(5)
                    continue

                etype = event.get("type")

                if etype == "challenge":
                    cid = event.get("id")
                    try:
                        await asyncio.to_thread(self.client.challenges.accept, cid)
                        print("⚡ Desafío aceptado:", cid)
                    except Exception as e:
                        print("⚠️ No pude aceptar desafío:", e)

                elif etype == "gameStart":
                    game_id = event["game"]["id"]
                    print("✅ Partida iniciada:", game_id)
                    t = asyncio.create_task(self._handle_game(game_id))
                    self._tasks.append(t)

            except asyncio.CancelledError:
                break
            except Exception as e:
                print("⚠️ Excepción en _process_incoming:", e)
                await asyncio.sleep(2)

    async def _handle_game(self, game_id: str):
        print(f"♟️ Manejo de juego {game_id} iniciado.")
        loop = self._loop or asyncio.get_running_loop()
        q = asyncio.Queue()

        def game_worker():
            try:
                for ev in self.client.board.stream_game_state(game_id):
                    loop.call_soon_threadsafe(q.put_nowait, ev)
            except Exception as e:
                loop.call_soon_threadsafe(q.put_nowait, {"__error__": str(e)})

        t_worker = asyncio.create_task(asyncio.to_thread(game_worker))
        board = chess.Board()

        try:
            while True:
                ev = await q.get()
                if isinstance(ev, dict) and "__error__" in ev:
                    print("⚠️ Error en stream del juego:", ev["__error__"])
                    break

                if ev.get("type") in ["gameFull", "gameState"]:
                    fen = ev.get("state", {}).get("fen")
                    if fen:
                        board = chess.Board(fen)
                    else:
                        moves_str = ev.get("moves") or ev.get("state", {}).get("moves") or ""
                        board = chess.Board()
                        for mv in moves_str.split():
                            if mv.strip():
                                board.push_uci(mv)

                    print("♟️ Posición actual:\n", board)

                    if board.turn == chess.WHITE:
                        await self._hacer_movimiento(game_id, board)

                    if ev.get("type") == "gameState":
                        status = ev.get("state", {}).get("status")
                        if status in ("mate", "resign", "draw", "outoftime", "stalemate"):
                            print("🔚 Partida terminada:", status)
                            break

        except asyncio.CancelledError:
            pass
        except Exception as e:
            print("⚠️ Error en manejo de partida:", e)
        finally:
            t_worker.cancel()
            print(f"♟️ Manejo de juego {game_id} finalizado.")

    async def _hacer_movimiento(self, game_id, board):
        print("🤖 Eleonor está analizando la posición...")
        opciones = await self.obtener_movimientos(board, num_opciones=3)
        if not opciones:
            print("⚠️ No hay opciones desde Stockfish.")
            return

        jugada = await self.eleonor_decide(board, opciones)
        if not jugada:
            print("⚠️ Eleonor no decidió una jugada válida.")
            return

        try:
            resp = await asyncio.to_thread(self.client.board.make_move, game_id, jugada)
            if resp and "error" in resp:
                print("⚠️ Lichess rechazó movimiento:", resp)
            else:
                print(f"📤 Movimiento enviado: {jugada} ({traducir_movimiento(jugada, board)})")
        except Exception as e:
            print("⚠️ Error al enviar movimiento:", e)

        await asyncio.sleep(1.2)

    async def obtener_movimientos(self, board, num_opciones=3):
        try:
            info = await asyncio.to_thread(
                lambda: self.engine.analyse(board, chess.engine.Limit(time=0.5), multipv=num_opciones)
            )
            opciones = [i["pv"][0].uci() for i in info if "pv" in i and i.get("pv")]
            return opciones
        except Exception as e:
            print("⚠️ Error Stockfish:", e)
            return []

    async def eleonor_decide(self, board, opciones):
        if not opciones:
            return None

        prompt = (
            f"Estás jugando una partida de ajedrez. Opciones: {', '.join(opciones)}.\n"
            "Elige una jugada en formato UCI y explica en una frase con la personalidad de Eleonor: Comprensiva y juguetona "
            "Responde empezando con la jugada (por ejemplo: e2e4) seguida de tu explicacion SI ES NECESARIO."
        )

        decision = await consulta_openai(prompt)
        jugada_elegida = None
        for op in opciones:
            if op in decision:
                jugada_elegida = op
                break
        if not jugada_elegida:
            jugada_elegida = opciones[0]

        explicacion = decision.replace(jugada_elegida, "").strip()
        if not explicacion:
            explicacion = traducir_movimiento(jugada_elegida, board)

        print(f"🤖 Eleonor: {explicacion}")
        save_subtitles(explicacion)
        await text_to_speech(explicacion)
        guardar_historial(jugada_elegida, explicacion)
        return jugada_elegida
