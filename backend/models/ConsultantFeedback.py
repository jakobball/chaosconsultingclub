from sqlalchemy import Column, Integer, String, Text, Float, Date, Boolean, DateTime, ForeignKey
from config.db import Base

class ConsultantFeedback(Base):
    __tablename__ = "ConsultantFeedback"
    id = Column(Integer, primary_key=True)
    consultant_id = Column(Integer, ForeignKey("Consultant.id"))
    project_id = Column(Integer, ForeignKey("Project.id"))
    customer_id = Column(Integer, ForeignKey("Customer.id"))
    rating = Column(Integer)
    comment = Column(Text)
    created_at = Column(DateTime)