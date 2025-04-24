from sqlalchemy import Column, Integer, String, Text, Float, Date, Boolean, DateTime, ForeignKey
from backend.config.db import Base

class Customer(Base):
    __tablename__ = "Customer"
    id = Column(Integer, primary_key=True)
    name = Column(String)
    industry = Column(String)
    location = Column(String)
    number_of_employees = Column(Integer)
    contact_person = Column(String)
    contact_email = Column(String)
    contact_phone = Column(String)
    website = Column(String)