from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class StaffingBase(BaseModel):
    consultant_id: int
    project_id: int
    requirement_skill: Optional[str]
    requirement_level: Optional[str]
    requirement_slot_index: Optional[int]
    score: Optional[float]
    similar_projects: Optional[List[str]]
    status: Optional[str]
    customer_feedback_rating: Optional[int]
    customer_feedback_comment: Optional[str]
    created_at: Optional[datetime]
    updated_at: Optional[datetime]

class StaffingCreate(StaffingBase):
    pass

class StaffingOut(StaffingBase):
    id: int

    class Config:
        orm_mode = True
