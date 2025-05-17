from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from db.session import get_db
from models.base import User ,DiagnosisHistory ,DiagnosticList  
from models.models import Doctor, Patient
from routes.auth.utlis import check_admin , get_current_patient 
from typing import List
from schemas.request import   PatientUpdate ,DiagnosisHistoryCreate , DiagnosticListCreate
from schemas.response import PatientOut
from schemas.authschema import PatientCreate , DoctorCreate
from routes.auth.utlis import is_doctor_for_patient
router = APIRouter(
    prefix="/api",
    tags=["routes"]
)


def is_doctor_for_patient_placeholder():
    return True








@router.get("/patients")
def get_all_patients( db:Session=Depends(get_db)):
    return db.query(Patient).all()

@router.get("/doctors")
def get_all_patients( db:Session=Depends(get_db)):
    return db.query(Doctor).all()