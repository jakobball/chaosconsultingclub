from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from config.db import SessionLocal
from schemes.Customer import CustomerCreate, CustomerOut
from service.customer_service import (
    create_customer,
    get_all_customers,
    get_customer_by_id,
    delete_customer
)
from typing import List

router = APIRouter(prefix="/client", tags=["Client"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/add", response_model=CustomerOut)
def add_client(client: CustomerCreate, db: Session = Depends(get_db)):
    return create_customer(db,client)

@router.get("/all", response_model=List[CustomerOut])
def get_clients(db: Session = Depends(get_db)):
    return get_all_customers(db)

@router.get("/{client_id}", response_model=CustomerOut)
def get_client(client_id: int, db: Session = Depends(get_db)):
    return get_customer_by_id(db, client_id)

@router.delete("/delete/{client_id}")
def delete_client(client_id: int, db: Session = Depends(get_db)):
    return delete_customer(db, client_id)

