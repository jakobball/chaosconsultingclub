from pydantic import BaseModel
from typing import Optional
from datetime import date

class ProjectBase(BaseModel):
    title: str
    description: Optional[str]
    location: Optional[str]
    start_date: date
    end_date: date
    budget: Optional[int]
    status: str
    customer_id: int
    customer_priorities: Optional[str]
    project_feedback_rating: Optional[int]
    project_feedback_comment: Optional[str]

class ProjectCreate(ProjectBase):
    pass

class ProjectOut(ProjectBase):
    id: int

    class Config:
        orm_mode = True
