from sqlalchemy import Column, Integer, String, Text, Float, Date, Boolean, DateTime, ForeignKey
from config.db import Base
class StaffingAssignment(Base):
    __tablename__ = "StaffingAssignment"
    id = Column(Integer, primary_key=True)
    consultant_id = Column(Integer, ForeignKey("Consultant.id"))
    project_id = Column(Integer, ForeignKey("Project.id"))
    assigned_at = Column(DateTime)
    expected_end = Column(Date)
    actual_end = Column(Date)
    active = Column(Boolean)