from pydantic import BaseModel
from datetime import date, datetime
from typing import Optional

class StaffingAssignmentBase(BaseModel):
    consultant_id: int
    project_id: int
    assigned_at: datetime
    expected_end: date
    actual_end: Optional[date]
    active: bool

class StaffingAssignmentCreate(StaffingAssignmentBase):
    pass

class StaffingAssignmentOut(StaffingAssignmentBase):
    id: int

    class Config:
        from_attributes = True
