from fastapi import APIRouter ,Depends
from .handlers import create_doctor_handler , create_patient_handler ,attach_doctors_to_patient_handler , attach_patients_to_doctor_handler
from schemas.authschema import PatientCreate , DoctorCreate 
from sqlalchemy.orm import Session 
from routes.auth.utlis import check_admin
from models.base import User 
from db.session import get_db
adminrouter = APIRouter(
    prefix="/api/admin",
    tags=["admin"],
)

@adminrouter.post("/doctors")
def create_doctor_profile(doctor: DoctorCreate, db: Session = Depends(get_db), is_admin: bool = Depends(check_admin)):
    return create_doctor_handler(create_doctor_request=doctor , db=db)

@adminrouter.post("/patients")
def create_patient_profile(patient: PatientCreate, db: Session = Depends(get_db), is_admin: bool = Depends(check_admin)):
    return create_patient_handler(patient,db)


@adminrouter.post("/attach_doctors_to_patient/{patient_id}")
def attach_doctors_to_patient(patient_id: str, doctor_ids: list[str], db: Session=Depends(get_db) , is_admin :bool = Depends(check_admin)):
    return attach_doctors_to_patient_handler(patient_id=patient_id ,doctor_ids=doctor_ids,db=db)


@adminrouter.post("/attach_patients_to_doctor/{doctor_id}")
def attach_patients_to_doctor(doctor_id: str, patient_ids: list[str], db: Session=Depends(get_db) , is_admin :bool = Depends(check_admin)):
    return attach_patients_to_doctor_handler(doctor_id=doctor_id , patient_ids=patient_ids ,db=db) 