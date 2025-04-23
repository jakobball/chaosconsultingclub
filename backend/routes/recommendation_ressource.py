from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from schemes.staffing import StaffingOut
from service.create_staffing_service import create_suggestion, delete_staffing_by_project_id, get_staffing_by_project_id
from config.db import SessionLocal

router = APIRouter(prefix="/recommendation", tags=["recommendation"])

@router.post("/")
async def start_suggestion_creation(request: Request):
    body = await request.json()
    project_id = body.get("project_id")
    create_suggestion(project_id)
    return {"message": f"Suggestion for project_id={project_id} started."}

@router.post("/query")
async def start_suggestion_recreation(request: Request):
    body = await request.json()
    project_id = body.get("project_id")
    query = body.get("query")
    delete_staffing_by_project_id(project_id)
    create_suggestion(project_id, query)
    return {"message": f"Suggestion for project_id={project_id} started."}

@router.get("/getstaffing/{project_id}", response_model=list[StaffingOut])
def get_staffing(project_id: int):
    staffing = get_staffing_by_project_id(project_id)
    project_id_s = str(project_id)
    if not staffing:
        create_suggestion(project_id_s)
        get_staffing(project_id)
        return staffing
    return staffing