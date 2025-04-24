from pydantic import BaseModel
from backend.schemes.project import ProjectCreate
from backend.schemes.Customer import CustomerCreate

class ProjectAndCustomerCreate(BaseModel):
    project: ProjectCreate
    customer: CustomerCreate
