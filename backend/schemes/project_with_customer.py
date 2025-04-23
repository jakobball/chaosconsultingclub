from pydantic import BaseModel
from schemes.project import ProjectCreate
from schemes.Customer import CustomerCreate

class ProjectAndCustomerCreate(BaseModel):
    project: ProjectCreate
    customer: CustomerCreate
