from typing import List
from fastapi import FastAPI, Depends
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import requests
import uvicorn
import os
from dotenv import load_dotenv
from sqlalchemy.orm import Session
from routes import recommendation_ressource
from config.db import SessionLocal
from routes import project_ressource
from config.db import Base, engine
from models import *

Base.metadata.create_all(bind=engine)

# Lade Umgebungsvariablen aus backend/.env
load_dotenv()



#Test
app = FastAPI()

# CORS Middleware für Frontend-URLs
# Hole erlaubte Frontend-URL aus .env oder nutze Standard
origins = [
    os.getenv("FRONTEND_ORIGIN", "https://chaosconsultingclub.vercel.app")
]
app.include_router(project_ressource.router)
app.include_router(recommendation_ressource.router)


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

