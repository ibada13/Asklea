from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session
from . import  jwt_token
from db.session import get_db
from models.models import User, Doctor, Admin
from fastapi.security import OAuth2PasswordBearer

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    user_email = jwt_token.get_current_user(token)
    user = db.query(User).filter(User.email == user_email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

def get_admin(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> Admin:
    if current_user.role != 'admin':
        raise HTTPException(status_code=403, detail="Admin privileges required")
    admin = db.query(Admin).filter(Admin.id == current_user.id).first()
    if not admin:
        raise HTTPException(status_code=404, detail="Admin not found")
    return admin

def get_doctor(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> Doctor:
    if current_user.role != 'doctor':
        raise HTTPException(status_code=403, detail="Doctor privileges required")
    doctor = db.query(Doctor).filter(Doctor.id == current_user.id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    return doctor

def get_patient(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> User:
    if current_user.role != 'patient':
        raise HTTPException(status_code=403, detail="Patient privileges required")
    return current_user
