from sqlalchemy.orm import Session
from backend.models.Customer import Customer
from backend.schemes.Customer import CustomerCreate

def create_customer(db: Session, customer_data: CustomerCreate):
    customer = Customer(**customer_data.dict())
    db.add(customer)
    db.commit()
    db.refresh(customer)
    return customer

def get_all_customers(db: Session):
    return db.query(Customer).all()

def get_customer_by_id(db: Session, customer_id: int):
    return db.query(Customer).filter(Customer.id == customer_id).first()

def delete_customer(db: Session, customer_id: int):
    customer = db.query(Customer).filter(Customer.id == customer_id).first()
    if customer:
        db.delete(customer)
        db.commit()
    return customer
