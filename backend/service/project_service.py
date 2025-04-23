from sqlalchemy.orm import Session
from models.Project import Project
from schemes.project import ProjectCreate
from fastapi import HTTPException

import json


def create_project(db: Session, project_data: ProjectCreate):
    data_dict = project_data.dict()

    # requirements in JSON-String umwandeln für DB
    if data_dict.get("requirements"):
        data_dict["requirements"] = json.dumps(data_dict["requirements"])

    new_project = Project(**data_dict)
    db.add(new_project)
    db.commit()
    db.refresh(new_project)

    # Optionale Rückumwandlung beim Response
    if new_project.requirements:
        new_project.requirements = json.loads(new_project.requirements)

    return new_project


import json

def get_all_projects(db: Session):
    projects = db.query(Project).all()
    for p in projects:
        if isinstance(p.requirements, str):
            try:
                p.requirements = json.loads(p.requirements)
            except Exception:
                p.requirements = []
    return projects


def delete_project_by_id(db: Session, project_id: int):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    db.delete(project)
    db.commit()
    return {"message": f"Project with id {project_id} deleted."}


def update_project_by_id(db: Session, project_id: int, updated_data: ProjectCreate):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    data_dict = updated_data.dict()

    # 🔥 Wichtig: requirements IMMER in einen String umwandeln – auch leere Listen
    if data_dict.get("requirements") is not None:
        data_dict["requirements"] = json.dumps(data_dict["requirements"])
    else:
        data_dict["requirements"] = json.dumps([])  # <-- DAS hier war vorher wahrscheinlich `None` oder eine echte Liste

    for key, value in data_dict.items():
        setattr(project, key, value)

    db.commit()
    db.refresh(project)

    # Zurückkonvertieren für das Response
    if isinstance(project.requirements, str):
        try:
            project.requirements = json.loads(project.requirements)
        except Exception:
            project.requirements = []

    return project

def get_project_by_id(db: Session, project_id: int):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    # JSON-Feld zurückumwandeln
    if isinstance(project.requirements, str):
        try:
            project.requirements = json.loads(project.requirements)
        except Exception:
            project.requirements = []

    return project

