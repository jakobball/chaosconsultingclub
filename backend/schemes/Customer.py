from pydantic import BaseModel
from typing import Optional

class CustomerBase(BaseModel):
    name: str
    industry: Optional[str]
    location: Optional[str]
    number_of_employees: Optional[int]
    contact_person: Optional[str]
    contact_email: Optional[str]
    contact_phone: Optional[str]
    website: Optional[str]

class CustomerCreate(CustomerBase):
    pass

class CustomerOut(CustomerBase):
    id: int

    class Config:
        from_attributes = True
