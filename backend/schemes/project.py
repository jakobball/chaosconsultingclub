from pydantic import BaseModel
from typing import Optional, List
from datetime import date

class Requirement(BaseModel):
    skill: str
    amount: int
    recommendedSeniority: str

class ProjectBase(BaseModel):
    title: str
    description: Optional[str]
    location: Optional[str]
    start_date: date
    end_date: date
    budget: Optional[int]
    status: str
    customer_id: Optional[int] = None
    customer_priorities: Optional[str]
    project_feedback_rating: Optional[int]
    project_feedback_comment: Optional[str]
    requirements: Optional[List[Requirement]] = None


class ProjectCreate(ProjectBase):
    pass

class ProjectOut(ProjectBase):
    id: int
    class Config:
        from_attributes = True