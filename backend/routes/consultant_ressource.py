from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from config.db import SessionLocal
from schemes.Consultant import ConsultantCreate, ConsultantOut
from service.consultant_service import (
    create_consultant,
    get_all_consultants,
    delete_consultant_by_id,
    update_consultant_by_id
)
from typing import List

router = APIRouter(prefix="/consultant", tags=["Consultant"])

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Add consultant
@router.post("/add", response_model=ConsultantOut)
def add_consultant(consultant: ConsultantCreate, db: Session = Depends(get_db)):
    return create_consultant(db, consultant)

# Get all consultants
@router.get("/all", response_model=List[ConsultantOut])
def get_consultants(db: Session = Depends(get_db)):
    return get_all_consultants(db)

# Delete consultant by ID
@router.delete("/delete/{consultant_id}")
def delete_consultant(consultant_id: int, db: Session = Depends(get_db)):
    return delete_consultant_by_id(db, consultant_id)

# Update consultant by ID
@router.put("/edit/{consultant_id}", response_model=ConsultantOut)
def update_consultant(consultant_id: int, updated_data: ConsultantCreate, db: Session = Depends(get_db)):
    return update_consultant_by_id(db, consultant_id, updated_data)
