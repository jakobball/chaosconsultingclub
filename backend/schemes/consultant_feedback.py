from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class ConsultantFeedbackBase(BaseModel):
    consultant_id: int
    project_id: int
    customer_id: int
    rating: int
    comment: Optional[str]
    created_at: datetime

class ConsultantFeedbackCreate(ConsultantFeedbackBase):
    pass

class ConsultantFeedbackOut(ConsultantFeedbackBase):
    id: int

    class Config:
        from_attributes = True
