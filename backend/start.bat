@echo off
echo =========================================
echo  CSMU Event Portal - Starting Backend
echo =========================================
echo.

cd /d "%~dp0"

REM Install dependencies
echo [1/3] Installing Python dependencies...
pip install -r requirements.txt --quiet

REM Seed database
echo [2/3] Seeding database...
python seed.py

REM Start server
echo [3/3] Starting FastAPI server on http://localhost:8000
echo  API Docs: http://localhost:8000/docs
echo.
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
