from typing import List
from fastapi import FastAPI, Depends
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import requests
import uvicorn
import os
from dotenv import load_dotenv
from sqlalchemy.orm import Session
from backend.config.db import SessionLocal
from backend.config.db import Base, engine
from backend.models import *

# Import-Handling für verschiedene Umgebungen
try:
    # Versuche lokale Imports (Entwicklungsumgebung)
    from backend.routes import recommendation_ressource, client_ressource, project_ressource, consultant_ressource

    print("Lokale Imports erfolgreich geladen")
except ImportError:
    try:
        # Versuche Render-Deployment-Imports
        from backend.routes import recommendation_ressource, client_ressource, project_ressource, consultant_ressource

        print("Render-Deployment-Imports erfolgreich geladen")
    except ImportError as e:
        print(f"Fehler beim Importieren der Module: {e}")
        raise

Base.metadata.create_all(bind=engine)

# Lade Umgebungsvariablen aus backend/.env
load_dotenv()

app = FastAPI()

# CORS Middleware für Frontend-URLs
# Hole erlaubte Frontend-URL aus .env oder nutze Standard
origins = [
    os.getenv("FRONTEND_ORIGIN", "https://chaosconsultingclub.vercel.app")
]
app.include_router(project_ressource.router)
app.include_router(recommendation_ressource.router)
app.include_router(consultant_ressource.router)
app.include_router(client_ressource.router)

# CORS Middleware einrichten
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8002)
