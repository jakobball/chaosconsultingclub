from sqlalchemy import Column, Integer, String, Text, Float, Date, Boolean, DateTime, ForeignKey
from config.db import Base

class Staffing(Base):
    __tablename__ = "Staffing"
    id = Column(Integer, primary_key=True)
    consultant_id = Column(Integer, ForeignKey("Consultant.id"))
    project_id = Column(Integer, ForeignKey("Project.id"))
    requirement_skill = Column(String)
    requirement_level = Column(String)
    requirement_slot_index = Column(Integer)
    score = Column(Float)  # ✅ Float statt Integer
    similar_projects = Column(Text)
    status = Column(String)  # proposed, accepted, rejected
    customer_feedback_rating = Column(Integer)
    customer_feedback_comment = Column(Text)
    created_at = Column(DateTime)
    updated_at = Column(DateTime)