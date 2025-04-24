from sqlalchemy.orm import Session
from models.Consulltant import Consultant
from schemes.Consultant import ConsultantCreate
from fastapi import HTTPException

import json


def get_consultant_by_id(db: Session, consultant_id: int):
    consultant = db.query(Consultant).filter(Consultant.id == consultant_id).first()
    if not consultant:
        raise HTTPException(status_code=404, detail="Consultant not found")

    # JSON-Felder zurückkonvertieren für Response
    try:
        consultant.certificates = json.loads(consultant.certificates or "[]")
        consultant.technologies = json.loads(consultant.technologies or "[]")
        consultant.languages_spoken = json.loads(consultant.languages_spoken or "[]")
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error decoding consultant fields")

    return consultant


def create_consultant(db: Session, consultant_data: ConsultantCreate):
    data_dict = consultant_data.dict()

    # Speichern als JSON-Strings (MySQL verträglich)
    data_dict["certificates"] = json.dumps(data_dict["certificates"])
    data_dict["technologies"] = json.dumps(data_dict["technologies"])
    data_dict["languages_spoken"] = json.dumps(data_dict["languages_spoken"])

    new_consultant = Consultant(**data_dict)
    db.add(new_consultant)
    db.commit()
    db.refresh(new_consultant)

    # Nach dem Speichern zurückkonvertieren für Response
    new_consultant.certificates = json.loads(new_consultant.certificates)
    new_consultant.technologies = json.loads(new_consultant.technologies)
    new_consultant.languages_spoken = json.loads(new_consultant.languages_spoken)

    return new_consultant


def get_all_consultants(db: Session):
    return db.query(Consultant).all()


def delete_consultant_by_id(db: Session, consultant_id: int):
    consultant = db.query(Consultant).filter(Consultant.id == consultant_id).first()
    if not consultant:
        raise HTTPException(status_code=404, detail="Consultant not found")
    db.delete(consultant)
    db.commit()
    return {"message": f"Consultant with id {consultant_id} deleted."}


def update_consultant_by_id(db: Session, consultant_id: int, updated_data: ConsultantCreate):
    consultant = db.query(Consultant).filter(Consultant.id == consultant_id).first()
    if not consultant:
        raise HTTPException(status_code=404, detail="Consultant not found")
    for key, value in updated_data.dict().items():
        setattr(consultant, key, value)
    db.commit()
    db.refresh(consultant)
    return consultant
