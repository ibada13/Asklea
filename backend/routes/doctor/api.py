from fastapi import APIRouter  ,Depends ,HTTPException 
from fastapi.encoders import jsonable_encoder

from sqlalchemy.orm import Session

from db.session import get_db
from models.models import Doctor ,Patient , patient_doctor_association
from models.base import DiagnosisHistory , DiagnosticList

from routes.auth.utlis import get_current_doctor


def is_doctor_for_patient_placeholder():
    return True


doctorrouter = APIRouter(prefix="/api/doctor" ,tags=["doctor    "])


@doctorrouter.get("/my-patients")
def my_patients(name: str = "", doctor_id: str = Depends(get_current_doctor), db: Session = Depends(get_db)):
    attached_patient_ids = db.query(patient_doctor_association.c.patient_id).filter(patient_doctor_association.c.doctor_id == doctor_id).all()
    attached_patient_ids = [p[0] for p in attached_patient_ids]
    query = db.query(Patient.id, Patient.age, Patient.gender, Patient.username, Patient.profile_picture).filter(Patient.id.in_(attached_patient_ids))
    if name:
        query = query.filter(Patient.username.ilike(f"%{name}%"))
    attached_patients = query.all()
    return [{"id": p.id, "age": p.age, "gender": p.gender, "username": p.username, "profile_picture": p.profile_picture} for p in attached_patients]

@doctorrouter.get("/my-patient/{patient_id}")
def get_doctor(patient_id: str, db: Session = Depends(get_db), is_doctor: bool = Depends(is_doctor_for_patient_placeholder)):
    patient = db.query(Patient).filter(Patient.id == patient_id).first()

    if not patient:
        raise HTTPException(status_code=404, detail="patient not found")

    return jsonable_encoder(patient)

@doctorrouter.get("/my-patients/{patient_id}/diagnostics")
def get_patient_diagnostics(
    patient_id: str,
    is_doctor: bool = Depends(is_doctor_for_patient_placeholder),
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
