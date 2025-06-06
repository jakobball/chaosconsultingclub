import json
from datetime import datetime

from sqlalchemy import text
from sqlalchemy.orm import Session

from backend.models import Staffing
from backend.config.db import SessionLocal
from backend.routes.project_ressource import get_db
from backend.service.n8nRequests import get_matching_profiles


def get_staffing_by_project_id(project_id: int):
    db_gen = get_db()
    db = next(db_gen)
    staffing_entries = db.query(Staffing).filter(Staffing.project_id == project_id).all()

    for entry in staffing_entries:
        if isinstance(entry.similar_projects, str):
            try:
                entry.similar_projects = json.loads(entry.similar_projects)
            except Exception:
                entry.similar_projects = []

        if isinstance(entry.requirement_skill, str):
            try:
                skills = json.loads(entry.requirement_skill)
                entry.requirement_skill = ", ".join(skills)  # ← wichtig
            except Exception:
                entry.requirement_skill = ""

    return staffing_entries


def delete_staffing_by_project_id(project_id: int):

    db_gen = get_db()
    db = next(db_gen)

    try:
        deleted_rows = db.query(Staffing).filter(Staffing.project_id == project_id).delete()
        db.commit()
        print(f"✅ {deleted_rows} Einträge mit project_id = {project_id} wurden gelöscht.")
    except Exception as e:
        db.rollback()
        print("❌ Fehler beim Löschen der Einträge:", e)


def create_suggestion(project_id: str, query: str = ""):
    # Daten vom AI-Agent holen
    response = get_matching_profiles(project_id, query)

    try:
        data = response.json()
        print(data)
    except Exception as e:
        print("❌ Fehler beim Parsen der JSON-Antwort:", e)
        print("Antwort war:", response.text)
        return

    if "output" not in data or not isinstance(data["output"], list):
        print("❌ 'output' fehlt oder ist kein Array.")
        return

    entries = data["output"]
    if not entries:
        print("ℹ️ Keine Vorschläge erhalten.")
        return

    db_gen = get_db()
    db = next(db_gen)

    try:
        for entry in entries:
            try:
                consultant_id = int(entry.get("consultant_id"))
                project_id = int(entry.get("project_id"))
                score = float(entry.get("score"))

                new_staffing = Staffing(
                    consultant_id=consultant_id,
                    project_id=project_id,
                    requirement_skill=json.dumps(entry.get("skills", [])),  # z. B. "Python, SQL"
                    requirement_level="",  # oder None, wenn nicht gebraucht
                    requirement_slot_index=0,  # oder None
                    score=score,
                    similar_projects=json.dumps(entry.get("similar_projects", [])),  # z. B. "1, 2"
                    status="proposed",
                    customer_feedback_rating=None,
                    customer_feedback_comment=None,
                    created_at=datetime.utcnow(),
                    updated_at=datetime.utcnow())

                db.add(new_staffing)
                db.commit()
                db.refresh(new_staffing)

                # updates current project for potential requerying
                current_project = project_id

            except Exception as e:
                print(f"Fehler beim Parsen eines Eintrags: {entry}")
                print("Fehler:", e)
                continue  # nächster Datensatz

    except:
        print("Error!")
        return
