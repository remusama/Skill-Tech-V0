import json
import os
import datetime
from typing import Dict, Any, List, Optional

ACHIEVEMENTS_DEFINITION_FILE = os.path.join(os.path.dirname(__file__), "achievements_data.json")
USER_DATA_DIR = os.path.join(os.path.dirname(__file__), "user_data")

class AchievementManager:
    """
    Gestiona la lógica de desbloqueo y consulta de logros para los usuarios.
    """
    def __init__(self):
        """Inicializa el gestor, cargando las definiciones de logros."""
        if not os.path.exists(USER_DATA_DIR):
            os.makedirs(USER_DATA_DIR)
        
        try:
            with open(ACHIEVEMENTS_DEFINITION_FILE, 'r', encoding='utf-8') as f:
                self.definitions = json.load(f)
            print("🏆 Definiciones de logros cargadas.")
        except FileNotFoundError:
            print("❌ Error: No se encontró el archivo achievements_data.json.")
            self.definitions = {}

    def _get_user_file_path(self, user_id: str) -> str:
        """Obtiene la ruta al archivo de datos de un usuario."""
        return os.path.join(USER_DATA_DIR, f"user_{user_id}.json")

    def _get_user_data(self, user_id: str) -> Dict[str, Any]:
        """Carga los datos de un usuario. Si no existe, crea un archivo nuevo."""
        user_file = self._get_user_file_path(user_id)
        if not os.path.exists(user_file):
            return {"user_id": user_id, "achievements": {}}
        
        try:
            with open(user_file, 'r', encoding='utf-8') as f:
                return json.load(f)
        except (json.JSONDecodeError, IOError):
            return {"user_id": user_id, "achievements": {}}

    def _save_user_data(self, user_id: str, data: Dict[str, Any]):
        """Guarda los datos de un usuario."""
        user_file = self._get_user_file_path(user_id)
        try:
            with open(user_file, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
        except IOError as e:
            print(f"❌ Error al guardar datos para el usuario {user_id}: {e}")

    async def get_user_achievements(self, user_id: str) -> List[Dict[str, Any]]:
        """Obtiene una lista de los logros desbloqueados por un usuario."""
        user_data = self._get_user_data(user_id)
        unlocked_ids = user_data.get("achievements", {})
        
        result = []
        for achievement_id, unlock_info in unlocked_ids.items():
            definition = self.definitions.get(achievement_id)
            if definition:
                result.append({
                    "id": achievement_id,
                    "name": definition["name"],
                    "description": definition["description"],
                    "unlocked_at": unlock_info["unlocked_at"]
                })
        return result

    async def check_and_unlock_quiz_achievements(self, user_id: str, subtopic: str, score: float) -> Optional[Dict[str, Any]]:
        """
        Verifica si los resultados de un quiz desbloquean algún logro.
        Devuelve la información del logro recién desbloqueado, si lo hay.
        """
        user_data = self._get_user_data(user_id)
        
        for achievement_id, definition in self.definitions.items():
            trigger = definition.get("trigger")
            
            # Verificar si es un logro de quiz y si coincide el subtema
            if (trigger and trigger.get("type") == "quiz" and 
                trigger.get("subtopic") == subtopic):
                
                # Verificar si el usuario ya tiene el logro
                if achievement_id in user_data.get("achievements", {}):
                    continue # Ya lo tiene, pasar al siguiente

                # Verificar si cumple la puntuación mínima
                if score >= trigger.get("min_score", 101):
                    return await self._unlock_achievement(user_id, achievement_id, user_data)
        
        return None

    async def _unlock_achievement(self, user_id: str, achievement_id: str, user_data: Dict) -> Optional[Dict[str, Any]]:
        """Método interno para marcar un logro como desbloqueado."""
        now = datetime.datetime.now().isoformat()
        if "achievements" not in user_data:
            user_data["achievements"] = {}
            
        user_data["achievements"][achievement_id] = {"unlocked_at": now}
        self._save_user_data(user_id, user_data)
        
        unlocked_achievement_info = {
            "id": achievement_id,
            "name": self.definitions[achievement_id]["name"],
            "description": self.definitions[achievement_id]["description"]
        }
        print(f"🏆 ¡Logro desbloqueado para {user_id}! '{unlocked_achievement_info['name']}'")
        return unlocked_achievement_info