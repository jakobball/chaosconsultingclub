from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from config.db import SessionLocal
from schemes.project import ProjectCreate, ProjectOut
from service.project_service import (
    create_project,
    get_all_projects,
    delete_project_by_id,
    update_project_by_id
)
from typing import List

router = APIRouter(prefix="/project", tags=["Project"])

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Add a new project
@router.post("/add", response_model=ProjectOut)
def add_project(project: ProjectCreate, db: Session = Depends(get_db)):
    return create_project(db, project)

# Get all projects
@router.get("/all", response_model=List[ProjectOut])
def get_projects(db: Session = Depends(get_db)):
    return get_all_projects(db)

# Delete a project by ID
@router.delete("/delete/{project_id}")
def delete_project(project_id: int, db: Session = Depends(get_db)):
    return delete_project_by_id(db, project_id)

# Update a project
@router.put("/edit/{project_id}", response_model=ProjectOut)
def update_project(project_id: int, updated_data: ProjectCreate, db: Session = Depends(get_db)):
    return update_project_by_id(db, project_id, updated_data)
