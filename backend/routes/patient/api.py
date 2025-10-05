from datetime import datetime, timezone
from fastapi import APIRouter ,HTTPException ,Depends 

from typing import List

from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError

from db.session import get_db

from routes.auth.utlis import get_current_patient 

from models.base import DiagnosisHistory ,DiagnosticList
from models.models import Patient, PatientEditRequest , patient_doctor_association ,Doctor
from routes.patient.schema.req import PatientEditRequestSchema

from .schema.res import PatientProfileResponse

BASE_URL = "http://localhost:8000"

patientrouter = APIRouter(prefix="/api/patient",tags=["patient"])




@patientrouter.get("/me")
def get_my_profile(patient_id: str = Depends(get_current_patient), db: Session = Depends(get_db)):
    try:
        result = db.query(
            Patient.id,
            Patient.username,
            Patient.gender,
            Patient.age,
            Patient.profile_picture,
            Patient.date_of_birth,
            Patient.phone_number,
            Patient.emergency_contact,
            Patient.insurance_type,
        ).filter(Patient.id == patient_id).first()

        if not result:
            raise HTTPException(status_code=404, detail="Not Found")

        return {
            "id": result.id,
            "username": result.username,
            "gender": result.gender,
            "age": result.age,
            "profile_picture": f"{BASE_URL}{result.profile_picture}" if result.profile_picture else None ,

            "date_of_birth": result.date_of_birth,
            "phone_number": result.phone_number,
            "emergency_contact": result.emergency_contact,
            "insurance_type": result.insurance_type,
        }
    except SQLAlchemyError:
        raise HTTPException(status_code=500, detail="Database error")



@patientrouter.get("/diagnostics")
def get_patient_diagnostics(
    patient_id: str=Depends(get_current_patient),
    db: Session = Depends(get_db)
):

    diagnosis_history = db.query(DiagnosisHistory)\
        .filter(DiagnosisHistory.patient_id == patient_id).all()

    diagnostic_list = db.query(DiagnosticList)\
        .filter(DiagnosticList.patient_id == patient_id).all()

    return {
        "diagnosis_history": diagnosis_history,
        "diagnostic_list": diagnostic_list
    }



@patientrouter.get("/my-doctors")
def my_doctors(name: str = "", patient_id: str = Depends(get_current_patient), db: Session = Depends(get_db)):
    attached_doctors_ids = db.query(patient_doctor_association.c.doctor_id).filter(patient_doctor_association.c.patient_id == patient_id).all()
    attached_doctors_ids = [p[0] for p in attached_doctors_ids]
    query = db.query(Doctor.id,
                    #   Doctor.age,
                        # Doctor.gender,
                          Doctor.username,
                          Doctor.specialty ,
                          Doctor.profile_picture
                            # Doctor.profile_picture
                            ).filter(Doctor.id.in_(attached_doctors_ids))
    if name:
        query = query.filter(Doctor.username.ilike(f"%{name}%"))
    attached_doctors = query.all()
    print(attached_doctors)
    return [{"id": d.id,"specialty": d.specialty,            "profile_picture": f"{BASE_URL}{d.profile_picture}" if d.profile_picture else None ,  "username": d.username} for d in attached_doctors]



@patientrouter.post("/edit-request")
def submit_edit_request(
    data: PatientEditRequestSchema,
    patient_id: str = Depends(get_current_patient),
    db: Session = Depends(get_db),
):
    try:
        existing_request = db.query(PatientEditRequest).filter_by(patient_id=patient_id).first()
        if existing_request:
            raise HTTPException(status_code=400, detail="You already have a pending edit request.")

        edit_request = PatientEditRequest(
            patient_id=patient_id,
            gender=data.gender,
            age=data.age,
            profile_picture=data.profile_picture,
            date_of_birth=data.date_of_birth,
            phone_number=data.phone_number,
            emergency_contact=data.emergency_contact,
            insurance_type=data.insurance_type,
            timestamp=datetime.now(timezone.utc),
        )
        db.add(edit_request)
        db.commit()

        return {"detail": "Edit request submitted successfully"}

    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error : {e}")
