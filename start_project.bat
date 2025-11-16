@echo off
REM ##################################################################
REM #  Script para iniciar todo el entorno del proyecto SkillTech AI   #
REM ##################################################################

ECHO Iniciando todos los servicios de Eleonor AI...

REM Guarda la ruta del directorio actual
set "project_root=%~dp0"

REM --- 1. Iniciar el servidor de Frontend (Next.js) ---
ECHO [1/3] Iniciando el servidor de desarrollo de Next.js en una nueva ventana...
cd /d "%project_root%"
START "SkillTech Frontend" cmd /k "npm run dev"

REM Pequeña pausa para que los procesos no se pisen
ping 127.0.0.1 -n 2 > nul

REM --- 2. Iniciar el servidor de Backend (API de Python) ---
ECHO [2/3] Iniciando la API de Python en una nueva ventana...
cd /d "%project_root%4o mini - copia"
START "Python API Backend" cmd /k "uvicorn api:app --reload --port 8000"

ping 127.0.0.1 -n 2 > nul

REM --- 3. Ejecutar el script principal de Eleonor (m.py) ---
ECHO [3/3] Ejecutando el script m.py en una nueva ventana...
cd /d "%project_root%4o mini - copia"
START "Eleonor Core (m.py)" cmd /k "python m.py"


ECHO.
ECHO ==================================================================
ECHO. 
ECHO   Todas las ventanas han sido lanzadas.
ECHO   - Ventana "SkillTech Frontend" para la web.
ECHO   - Ventana "Python API Backend" para la API.
ECHO   - Ventana "Eleonor Core (m.py)" para tu script principal.
ECHO.
ECHO ==================================================================

pause
