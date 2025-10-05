from fastapi import APIRouter  ,Depends ,HTTPException 
from fastapi.encoders import jsonable_encoder

from sqlalchemy import and_
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from db.session import get_db
from models.models import Doctor ,Patient , patient_doctor_association
from models.base import DiagnosisHistory, DiagnosisReport , DiagnosticList , PatientDetachRequest

from routes.auth.utlis import get_current_doctor

from .schemas.request import DiagnosisHistoryRequest, DiagnosisReportCreate , DiagnosticListRequest

def is_doctor_for_patient_placeholder():
    return True


doctorrouter = APIRouter(prefix="/api/doctor" ,tags=["doctor"])

BASE_URL = "http://localhost:8000"

@doctorrouter.get("/my-patients")
def my_patients(name: str = "", doctor=Depends(get_current_doctor), db: Session = Depends(get_db)):
    doctor_id = doctor.id
    attached_patient_ids = db.query(patient_doctor_association.c.patient_id)\
        .filter(patient_doctor_association.c.doctor_id == doctor_id).all()
    attached_patient_ids = [p[0] for p in attached_patient_ids]

    query = db.query(Patient.id, Patient.age, Patient.gender, Patient.username, Patient.profile_picture)\
        .filter(Patient.id.in_(attached_patient_ids))
    if name:
        query = query.filter(Patient.username.ilike(f"%{name}%"))
    attached_patients = query.all()

    detach_patient_ids = {
        r[0] for r in db.query(PatientDetachRequest.patient_id)
        .filter(PatientDetachRequest.doctor_id == doctor_id).all()
    }
    print( list(detach_patient_ids))  
    return [
        {
            "id": p.id,
            "age": p.age,
            "gender": p.gender,
            "username": p.username,
            "profile_picture": f"{BASE_URL}{p.profile_picture}" if p.profile_picture else None ,
            "detach": p.id in detach_patient_ids
        }
        for p in attached_patients
    ]


@doctorrouter.get("/my-patient/{patient_id}")
def get_doctor(patient_id: str, db: Session = Depends(get_db), is_doctor: bool = Depends(is_doctor_for_patient_placeholder)):
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="patient not found")

    patient_data = jsonable_encoder(patient)
    patient_data["profile_picture"] = f"{BASE_URL}{patient.profile_picture}" if patient.profile_picture else None

    return patient_data


@doctorrouter.get("/my-patients/{patient_id}/diagnostics")
def get_patient_diagnostics(
    patient_id: str,
    doctor=Depends(get_current_doctor),
    is_doctor: bool = Depends(is_doctor_for_patient_placeholder),
    db: Session = Depends(get_db)
):
    diagnosis_history = db.query(DiagnosisHistory)\
        .filter(DiagnosisHistory.patient_id == patient_id)\
        .order_by(DiagnosisHistory.timestamp.asc())\
        .all()

    diagnostic_list = db.query(DiagnosticList)\
        .filter(DiagnosticList.patient_id == patient_id).all()

    diagnostic_list_serialized = [
        {
            "id": d.id,
            "name": d.name,
            "description": d.description,
            "status": d.status.value if hasattr(d.status, "value") else d.status,
            "is_by_this_doc": d.doctor_id == doctor.id
        }
        for d in diagnostic_list
    ]

    return {
        "diagnosis_history": diagnosis_history,
        "diagnostic_list": diagnostic_list_serialized,
        "can_post":doctor.can_post
    }


@doctorrouter.post("/{patient_id}/diagnosishistory")
async def create_diagnosis_history(
    data: DiagnosisHistoryRequest,
    patient_id: str,
    db: Session = Depends(get_db),
    is_doctor: bool = Depends(is_doctor_for_patient_placeholder)
):
    try:
        diagnosis = DiagnosisHistory(
            timestamp=data.timestamp,
            blood_pressure_systolic_value=data.blood_pressure_systolic_value,
            blood_pressure_systolic_levels=data.blood_pressure_systolic_levels,
            blood_pressure_diastolic_value=data.blood_pressure_diastolic_value,
            blood_pressure_diastolic_levels=data.blood_pressure_diastolic_levels,
            heart_rate_value=data.heart_rate_value,
            heart_rate_levels=data.heart_rate_levels,
            respiratory_rate_value=data.respiratory_rate_value,
            respiratory_rate_levels=data.respiratory_rate_levels,
            temperature_value=int(data.temperature_value),
            temperature_levels=data.temperature_levels,
            patient_id=patient_id,
        )
        db.add(diagnosis)
        db.commit()
        db.refresh(diagnosis)
        return {"message": "Diagnostic posted successfully", "id": diagnosis.id}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=404, detail=f"Failed to post diagnostic: {str(e)}")



@doctorrouter.post("/{patient_id}/diagnosticlist")
def create_diagnostic_list_item(
    patient_id: str,
    diagnostic: DiagnosticListRequest,
    doctor=Depends(get_current_doctor) , 
    is_doctor :bool =Depends(is_doctor_for_patient_placeholder),
    db: Session = Depends(get_db),
):
    try:
        diagnosis = DiagnosticList(
            name=diagnostic.name, 
            description=diagnostic.description,
            status=diagnostic.status,
            patient_id=patient_id,
            doctor_id = doctor.id
        )
        db.add(diagnosis)
        db.commit()
        db.refresh(diagnosis)
        return {"message": "Diagnostic posted successfully", "id": diagnosis.id}

    
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=404 , detail=f"Failed to post diagnostic {str(e)}")


@doctorrouter.post("/{patient_id}/detach_request")
async def detach_patient_request(patient_id:str ,doctor =Depends(get_current_doctor)  , db:Session=Depends(get_db)):
    patinet = db.query(Patient).filter(Patient.id == patient_id).first()
    
    if not patinet :
        raise HTTPException(status_code=404 , detail=f"patient with id {patient_id} was not found")
    detach_request = db.query(PatientDetachRequest).filter(and_(
                    PatientDetachRequest.patient_id == patient_id , 
                PatientDetachRequest.doctor_id == doctor.id 
    )).first()
    if detach_request is not None :
        raise HTTPException(status_code=400 , detail=f"detach request was already sent")
    try:
        
        detach_request = PatientDetachRequest(
            patient_id = patient_id , 
            doctor_id = doctor.id 
        )
        db.add(detach_request)
        db.commit()
        db.refresh(detach_request)
    except Exception as e :
        db.rollback()
        raise HTTPException(status_code= 500 , detail=f"some err occured f{e}")
 







@doctorrouter.post("/diagnosis_reports/")
def create_diagnosis_report(data: DiagnosisReportCreate,doctor=Depends(get_current_doctor), db: Session = Depends(get_db)):
    try:
        diagnostic_list = db.query(DiagnosticList).filter(DiagnosticList.id == data.diagnostic_list_id).first()
        if not diagnostic_list:
            raise HTTPException(status_code=404, detail="Diagnostic list not found")

        report = DiagnosisReport(
            description=data.description,
            diagnostic_list_id=data.diagnostic_list_id,
            reporter_id=doctor.id,
            posted_by_id=diagnostic_list.doctor_id,
           
        )

        db.add(report)
        db.commit()
        db.refresh(report)
        return {"detail":"your report was posted successfully"}

    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")



@doctorrouter.put("/diagnosticlist/{diagnostic_id}")
async def update_diagnostic(diagnostic_id: int, data: dict, db: Session = Depends(get_db) , doctor=Depends(get_current_doctor) ):
    try:
        diagnostic = db.query(DiagnosticList).filter(DiagnosticList.id == diagnostic_id).first()
        if not diagnostic:
            raise HTTPException(status_code=404, detail="Diagnostic not found")
        if diagnostic.doctor_id != doctor.id:
            raise HTTPException(status_code=404, detail="You are not allowed to edit this diagnostic")

        diagnostic.name = data.get("name", diagnostic.name)
        diagnostic.description = data.get("description", diagnostic.description)
        diagnostic.status = data.get("status", diagnostic.status)

        db.commit()
        db.refresh(diagnostic)
        return {"message": "Diagnostic updated successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Something went wrong {e}")
 