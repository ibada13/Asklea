from fastapi import APIRouter, Depends ,HTTPException ,Query
from fastapi.encoders import jsonable_encoder
from .handlers import create_doctor_handler, create_patient_handler, attach_doctors_to_patient_handler, attach_patients_to_doctor_handler
from schemas.authschema import PatientCreate, DoctorCreate
from sqlalchemy.orm import Session
from db.session import get_db
from pydantic import BaseModel
from models.models import Doctor ,Patient ,patient_doctor_association
def check_admin_placeholder():
    return True

adminrouter = APIRouter(
    prefix="/api/admin",
    tags=["admin"],
)

@adminrouter.post("/doctors")
def create_doctor_profile(doctor: DoctorCreate, db: Session = Depends(get_db), is_admin: bool = Depends(check_admin_placeholder)):
    return create_doctor_handler(create_doctor_request=doctor, db=db)

@adminrouter.get("/doctors")
def get_doctors(db:Session =Depends(get_db),is_admin:bool=Depends(check_admin_placeholder) ):
    result = db.query(Doctor.id, Doctor.username).all()
    doctors = [{"id": doctor.id, "username": doctor.username , "specialty" :doctor.specialty , "office_location":doctor.office_location} for doctor in result]
    return doctors


@adminrouter.get("/doctors/{doctor_id}")
def get_doctor(doctor_id: str, db: Session = Depends(get_db), is_admin: bool = Depends(check_admin_placeholder)):
    doctor = db.query(Doctor).filter(Doctor.id == doctor_id).first()

    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")

    return jsonable_encoder(doctor)


@adminrouter.post("/patients")
def create_patient_profile(patient: PatientCreate, db: Session = Depends(get_db), is_admin: bool = Depends(check_admin_placeholder)):
    return create_patient_handler(patient, db)

# class Justtoattach(BaseModel):
#     patient_id:str 
#     doctors_ids :list[str]


@adminrouter.post("/attach_doctors_to_patient/{patient_id}")
def attach_doctors_to_patient(patient_id: str, doctor_ids: list[str], db: Session = Depends(get_db), is_admin: bool = Depends(check_admin_placeholder)):
    return attach_doctors_to_patient_handler(patient_id=patient_id, doctor_ids=doctor_ids, db=db)


@adminrouter.post("/attach_patients_to_doctor/{doctor_id}")
def attach_patients_to_doctor(doctor_id: str, patient_ids: list[str], db: Session = Depends(get_db), is_admin: bool = Depends(check_admin_placeholder)):
    return attach_patients_to_doctor_handler(doctor_id=doctor_id, patient_ids=patient_ids, db=db)


@adminrouter.get("/search_patients/{doctor_id}")
def search_patients(
    doctor_id: str,
    name: str = Query(..., min_length=1),
    db: Session = Depends(get_db),
    is_admin: bool = Depends(check_admin_placeholder)
):
    patients = db.query(Patient.id, Patient.username).filter(Patient.username.ilike(f"%{name}%")).all()
    attached_patient_ids = db.query(patient_doctor_association.c.patient_id).filter(patient_doctor_association.c.doctor_id == doctor_id).all()
    attached_patient_ids = [p[0] for p in attached_patient_ids]
    filtered_patients = [
        {"id": p.id, "username": p.username}
        for p in patients
        if p.id not in attached_patient_ids
    ]
    return filtered_patients
