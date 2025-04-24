from pydantic import BaseModel
from typing import Optional, List

class ConsultantBase(BaseModel):
    name: str
    role: Optional[str]
    seniority: Optional[str]
    description: Optional[str]
    certificates: Optional[List[str]]
    technologies: Optional[List[str]]
    languages_spoken: Optional[List[str]]
    skillset_ranking: Optional[str]
    availability: Optional[str]
    location: Optional[str]

class ConsultantCreate(ConsultantBase):
    pass

class ConsultantOut(ConsultantBase):
    id: int

class Config:
    from_attributes = True



