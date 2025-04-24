from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from config.db import SessionLocal
from schemes.project import ProjectCreate, ProjectOut
from schemes.project_with_customer import ProjectAndCustomerCreate
from service.customer_service import create_customer
from service.project_service import (
    create_project,
    get_all_projects,
    delete_project_by_id,
    update_project_by_id,
    get_project_by_id
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
def add_project(data: ProjectAndCustomerCreate, db: Session = Depends(get_db)):
    print("📦 Angekommene Daten im Backend:")
    print(data)
    # Zuerst Kunde erstellen
    customer = create_customer(db, data.customer)
    # Dann Kunde-ID ins Projekt setzen
    data.project.customer_id = customer.id
    # Projekt erstellen
    return create_project(db, data.project)

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
# Get a single project by ID
@router.get("/{project_id}", response_model=ProjectOut)
def read_project(project_id: int, db: Session = Depends(get_db)):
    return get_project_by_id(db, project_id)
