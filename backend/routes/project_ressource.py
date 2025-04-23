from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from config.db import SessionLocal

router = APIRouter(prefix="/project_edit", tags=["Project Editing"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

