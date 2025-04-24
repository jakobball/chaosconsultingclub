from sqlalchemy import Column, Integer, String, Text, Float, Date, Boolean, DateTime, ForeignKey
from backend.config.db import Base
class Project(Base):
    __tablename__ = "Project"
    id = Column(Integer, primary_key=True)
    title = Column(String)
    description = Column(Text)
    location = Column(String)
    start_date = Column(Date)
    end_date = Column(Date)
    budget = Column(Integer)
    status = Column(String)  # planned, active, completed
    customer_id = Column(Integer, ForeignKey("Customer.id"))
    customer_priorities = Column(Text)
    project_feedback_rating = Column(Integer)
    project_feedback_comment = Column(Text)
    requirements = Column(Text)  # <-- NEU: als JSON-Text gespeichert