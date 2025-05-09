from fastapi import APIRouter, Depends, HTTPException
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
from routes.auth.utlis import check_if_doctor_and_has_patient
router = APIRouter(
    prefix="/api",
    tags=["routes"]
)





@router.get("/patients/me")
def get_my_profile(patient_id:str = Depends(get_current_patient) , db:Session=Depends(get_db)):
    try :
        patient = db.query(Patient).filter(Patient.id == patient_id).first()
        if not patient :
            raise HTTPException(status_code=404 ,detail=f"Not Found ")
        return patient     
    except SQLAlchemyError as e :
        raise HTTPException(status_code=500, detail="Database error")

@router.get("/patients/me/diagnostic-list", response_model=List[DiagnosticListCreate])
def get_my_diagnostic_list(db: Session = Depends(get_db), patient_id: str = Depends(get_current_patient)):
    try:
        diagnostics = db.query(DiagnosticList).filter(DiagnosticList.patient_id == patient_id).all()
        if not diagnostics:
            raise HTTPException(status_code=404, detail="No diagnostic list found for this patient")
        return diagnostics
    except SQLAlchemyError:
        raise HTTPException(status_code=500, detail="Database error")


@router.get("/patients/me/diagnosis-history", response_model=List[DiagnosisHistoryCreate])
def get_my_diagnosis_history(patient_id: str = Depends(get_current_patient), db: Session = Depends(get_db)):
    try:
        diagnosis_history = db.query(DiagnosisHistory).filter(DiagnosisHistory.patient_id == patient_id).all()
        if not diagnosis_history:
            raise HTTPException(status_code=404, detail="No diagnosis history found")
        return diagnosis_history
    except SQLAlchemyError:
        raise HTTPException(status_code=500, detail="Database error")



@router.get("/patients/{patient_id}/diagnosis-history")
def get_diagnosis_history(patient_id: str, db: Session = Depends(get_db) , is_authz:bool=Depends(check_if_doctor_and_has_patient)):
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    diagnosis_history = db.query(DiagnosisHistory).filter(DiagnosisHistory.patient_id == patient_id).all()
    return diagnosis_history

@router.post("/patients/{patient_id}/diagnosis-history")
def create_diagnosis_history(patient_id: str, diagnosis_history: DiagnosisHistoryCreate, db: Session = Depends(get_db) , is_authz:bool=Depends(check_if_doctor_and_has_patient)):
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    new_history = DiagnosisHistory(**diagnosis_history.dict(), patient_id=patient_id)
    db.add(new_history)
    db.commit()
    db.refresh(new_history)
    return new_history

@router.get("/patients/{patient_id}/diagnostic-list")
def get_diagnostic_list(patient_id: str, db: Session = Depends(get_db) , is_authz:bool=Depends(check_if_doctor_and_has_patient)):
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    diagnostic_list = db.query(DiagnosticList).filter(DiagnosticList.patient_id == patient_id).all()
    return diagnostic_list

@router.post("/patients/{patient_id}/diagnostic-list")
def create_diagnostic_list(patient_id: str, diagnostic: DiagnosticListCreate, db: Session = Depends(get_db) , is_authz:bool=Depends(check_if_doctor_and_has_patient)):
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    new_diagnostic = DiagnosticList(**diagnostic.dict(), patient_id=patient_id)
    db.add(new_diagnostic)
    db.commit()
    db.refresh(new_diagnostic)
    return new_diagnostic
