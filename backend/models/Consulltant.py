from sqlalchemy import Column, Integer, String, Text, Float, Date, Boolean, DateTime, ForeignKey
from config.db import Base

class Consultant(Base):
    __tablename__ = "Consultant"
    id = Column(Integer, primary_key=True)
    name = Column(String)
    role = Column(String)
    seniority = Column(String)
    description = Column(Text)
    certificates = Column(Text)  # JSON als TEXT gespeichert
    technologies = Column(Text)
    languages_spoken = Column(Text)
    skillset_ranking = Column(String)
    availability = Column(String)
    location = Column(String)