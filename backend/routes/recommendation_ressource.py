from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session

from backend.models import Staffing
from backend.routes.client_ressource import get_db
from backend.schemes.staffing import StaffingOut
from backend.service.create_staffing_service import create_suggestion, delete_staffing_by_project_id, get_staffing_by_project_id
from backend.config.db import SessionLocal

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
@router.delete("/deleteStaffing/{project_id}/{consultant_id}")
def delete_staffing(project_id: int, consultant_id: int, db: Session = Depends(get_db)):
    staffing_entry = db.query(Staffing).filter(
        Staffing.project_id == project_id,
        Staffing.consultant_id == consultant_id
    ).first()

    if not staffing_entry:
        raise HTTPException(status_code=404, detail="Staffing entry not found.")

    db.delete(staffing_entry)
    db.commit()
    return {"message": f"Staffing entry for project_id={project_id} and consultant_id={consultant_id} deleted."}