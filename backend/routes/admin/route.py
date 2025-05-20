from fastapi import APIRouter, Depends ,HTTPException ,Query ,status
from fastapi.encoders import jsonable_encoder

from schemas.authschema import PatientCreate, DoctorCreate
from sqlalchemy.orm import Session

from pydantic import BaseModel

from .handlers import create_doctor_handler, create_patient_handler, attach_doctors_to_patient_handler, attach_patients_to_doctor_handler

from db.session import get_db

from models.base import User
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

from fastapi import Query

@adminrouter.get("/patients")
def get_patients(
    db: Session = Depends(get_db),
    is_admin: bool = Depends(check_admin_placeholder),
    search: str = Query(None, description="Search patients by username")
):
    query = db.query(Patient)
    if search:
        query = query.filter(Patient.username.ilike(f"%{search}%"))
    result = query.limit(10).all()
    patients = [{
        "id": patient.id,
        "username": patient.username,
        "gender": patient.gender,
        "age": patient.age,
        "profile_picture": patient.profile_picture,
        "date_of_birth": patient.date_of_birth,
        "phone_number": patient.phone_number,
        "emergency_contact": patient.emergency_contact,
        "insurance_type": patient.insurance_type
    } for patient in result]
    return patients

@adminrouter.get("/doctors")
def get_doctors(
    db:Session =Depends(get_db),
    is_admin:bool=Depends(check_admin_placeholder),
    search: str = Query(None, description="Search doctors by username")

                  ):
    query = db.query(Doctor)
    if search :
        query = query.filter(Doctor.username.ilike(f"%{search}%"))
    result = query.limit(10).all()
    doctors = [{"id": doctor.id, "username": doctor.username , "specialty" :doctor.specialty , "office_location":doctor.office_location} for doctor in result]
    return doctors


from sqlalchemy.orm import load_only

@adminrouter.get("/doctors/{doctor_id}")
def get_doctor(doctor_id: str, db: Session = Depends(get_db), is_admin: bool = Depends(check_admin_placeholder)):
    doctor = db.query(Doctor).options(
        load_only(
            Doctor.id,
            Doctor.username,
            Doctor.email,
            Doctor.specialty,
            Doctor.office_location,
        )
    ).filter(Doctor.id == doctor_id).first()

    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")

    return jsonable_encoder(doctor)

@adminrouter.get("/patients/{patient_id}")
def get_doctor(patient_id: str, db: Session = Depends(get_db), is_admin: bool = Depends(check_admin_placeholder)):
    patient = db.query(Patient).filter(Patient.id == patient_id).first()

    if not patient:
        raise HTTPException(status_code=404, detail="patient not found")

    return jsonable_encoder(patient)

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





@adminrouter.get("/attached_patients/{doctor_id}")
def attached_patients(
    doctor_id: str,
    db: Session = Depends(get_db),
    is_admin: bool = Depends(check_admin_placeholder)
):
    attached_patient_ids = db.query(patient_doctor_association.c.patient_id).filter(patient_doctor_association.c.doctor_id == doctor_id).all()
    attached_patient_ids = [p[0] for p in attached_patient_ids]
    attached_patients = db.query(Patient.id, Patient.username).filter(Patient.id.in_(attached_patient_ids)).all()
    return [{"id": p.id, "username": p.username} for p in attached_patients]
@adminrouter.get("/not_attached_patients/{doctor_id}")
def not_attached_patients(
    doctor_id: str,
    name: str = Query(..., min_length=1),
    db: Session = Depends(get_db),
    is_admin: bool = Depends(check_admin_placeholder)
):
    patients = db.query(Patient.id, Patient.username)\
        .filter(Patient.username.ilike(f"%{name}%"))\
        .all()
    attached_patient_ids = db.query(patient_doctor_association.c.patient_id)\
        .filter(patient_doctor_association.c.doctor_id == doctor_id)\
        .all()
    attached_patient_ids = [p[0] for p in attached_patient_ids]
    return [
        {"id": p.id, "username": p.username}
        for p in patients if p.id not in attached_patient_ids
    ]


@adminrouter.get("/attached_doctors/{patient_id}")
def attached_doctors(
    patient_id: str,
    db: Session = Depends(get_db),
    is_admin: bool = Depends(check_admin_placeholder)
):
    attached_doctor_ids = db.query(patient_doctor_association.c.doctor_id)\
        .filter(patient_doctor_association.c.patient_id == patient_id)\
        .all()
    attached_doctor_ids = [d[0] for d in attached_doctor_ids]
    doctors = db.query(Doctor.id, Doctor.username)\
        .filter(Doctor.id.in_(attached_doctor_ids))\
        .all()
    return [{"id": d.id, "username": d.username} for d in doctors]


@adminrouter.get("/not_attached_doctors/{patient_id}")
def not_attached_doctors(
    patient_id: str,
    name: str = Query(..., min_length=1),
    db: Session = Depends(get_db),
    is_admin: bool = Depends(check_admin_placeholder)
):
    doctors = db.query(Doctor.id, Doctor.username)\
        .filter(Doctor.username.ilike(f"%{name}%"))\
        .all()
    attached_doctor_ids = db.query(patient_doctor_association.c.doctor_id)\
        .filter(patient_doctor_association.c.patient_id == patient_id)\
        .all()
    attached_doctor_ids = [d[0] for d in attached_doctor_ids]
    return [
        {"id": d.id, "username": d.username}
        for d in doctors if d.id not in attached_doctor_ids
    ]



@adminrouter.delete("/patients/{patient_id}/doctors/{doctor_id}")
def detach_doctor(patient_id: int, doctor_id: int, db: Session = Depends(get_db), is_admin:bool =Depends(check_admin_placeholder)):
    patient = db.get(Patient, patient_id)
    doctor = db.get(Doctor, doctor_id)
    if not patient or not doctor:
        raise HTTPException(status_code=404, detail="Patient or Doctor not found")
    if doctor in patient.doctors:
        patient.doctors.remove(doctor)
        db.commit()
    return {"detail": "Doctor detached from patient"}

@adminrouter.delete("/doctors/{doctor_id}/patients/{patient_id}")
def detach_doctor(patient_id: int, doctor_id: int, db: Session = Depends(get_db), is_admin:bool =Depends(check_admin_placeholder)):
    patient = db.get(Patient, patient_id)
    doctor = db.get(Doctor, doctor_id)
    if not patient or not doctor:
        raise HTTPException(status_code=404, detail="Patient or Doctor not found")
    if doctor in patient.doctors:
        patient.doctors.remove(doctor)
        db.commit()
    return {"detail": "Doctor detached from patient"}


@adminrouter.delete("/{user_id}")
async def delete_user(user_id:str , db:Session = Depends(get_db) ,is_admin :bool =Depends(check_admin_placeholder)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail=f"User with id {user_id} not found"
        )
    
    db.delete(user)
    db.commit()
    return {"msg":f"User with the id {user_id} has been delted"}