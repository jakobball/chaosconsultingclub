from enum import Enum
from typing import List, Optional
from fastapi import FastAPI, Query, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os
from dotenv import load_dotenv

# Lade Umgebungsvariablen aus backend/.env
load_dotenv()

app = FastAPI(
    title="Chaos Consulting Club API",
    description="Backend-API für den Chaos Consulting Club",
    version="1.0.0"
)

# CORS Middleware für Frontend-URLs
origins = [
    "http://localhost:5173",  # Füge Vite-Standardport hinzu
    "http://localhost:3000",  # Falls du einen anderen Port verwendest
    os.getenv("FRONTEND_ORIGIN", "https://chaosconsultingclub.vercel.app")
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Status Enum für Projekte
class ProjectStatus(str, Enum):
    OPEN = "open"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

# Models
class Item(BaseModel):
    name: str

class Items(BaseModel):
    items: List[Item]

class Project(BaseModel):
    id: str
    title: str
    subtitle: str
    status: ProjectStatus
    description: Optional[str] = None

class ProjectList(BaseModel):
    projects: List[Project]

# In-Memory-Datenbank
memory_db = {
    "items": [],
    "projects": [
        Project(id="1", title="KI-gestütztes Matching-System",
                subtitle="Automatisierung des Consultant-Matching-Prozesses",
                status=ProjectStatus.OPEN,
                description="Entwicklung eines KI-Systems zur intelligenten Zuweisung von Consultants zu Projekten basierend auf ihren Fähigkeiten, Erfahrungen und Verfügbarkeiten."),
        Project(id="2", title="Profil-Optimierung",
                subtitle="Verbesserung der Consultant-Profile",
                status=ProjectStatus.IN_PROGRESS,
                description="Analyse und Optimierung der Consultant-Profile für bessere Matching-Ergebnisse durch Implementierung standardisierter Skill-Taxonomien und Erfahrungsbewertungen."),
        Project(id="3", title="Dashboard-Implementierung",
                subtitle="Visualisierung von Matching-Statistiken",
                status=ProjectStatus.COMPLETED,
                description="Erstellung eines interaktiven Dashboards zur Anzeige von Matching-Metriken, Erfolgsraten und Auslastungsstatistiken für das Management-Team."),
        Project(id="4", title="Feedback-System",
                subtitle="Kontinuierliche Verbesserung durch Feedback",
                status=ProjectStatus.OPEN,
                description="Entwicklung eines strukturierten Feedback-Systems für Consultants und Kunden zur kontinuierlichen Verbesserung des Matching-Prozesses.")
    ]
}

# Bestehende Endpoints
@app.get("/", response_model=Items)
def get_items() -> Items:
    return Items(items=memory_db["items"])

@app.put("/", response_model=Item)
def put_item(item: Item) -> Item:
    memory_db["items"].append(item)
    return item

# Endpoints für Projekte
@app.get("/projects", response_model=ProjectList)
def get_projects(status: Optional[ProjectStatus] = None) -> ProjectList:
    if status:
        filtered_projects = [p for p in memory_db["projects"] if p.status == status]
        return ProjectList(projects=filtered_projects)
    return ProjectList(projects=memory_db["projects"])

@app.get("/projects/{project_id}", response_model=Project)
def get_project(project_id: str) -> Project:
    for project in memory_db["projects"]:
        if project.id == project_id:
            return project
    raise HTTPException(status_code=404, detail=f"Projekt mit ID {project_id} nicht gefunden")

@app.post("/projects", response_model=Project)
def create_project(project: Project) -> Project:
    memory_db["projects"].append(project)
    return project

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8002)
