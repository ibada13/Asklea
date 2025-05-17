from fastapi import APIRouter ,HTTPException ,Depends 

from typing import List

from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError

from db.session import get_db

from routes.auth.utlis import get_current_patient 

from models.base import DiagnosisHistory ,DiagnosticList
from models.models import Patient



patientrouter = APIRouter(prefix="/api/patients",tags=["patient"])




@patientrouter.get("/me")
def get_my_profile(patient_id:str = Depends(get_current_patient) , db:Session=Depends(get_db)):
    try :
        patient = db.query(Patient).filter(Patient.id == patient_id).first()
        if not patient :
            raise HTTPException(status_code=404 ,detail=f"Not Found ")
        return patient     
    except SQLAlchemyError as e :
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

