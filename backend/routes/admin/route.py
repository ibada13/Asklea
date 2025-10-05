from datetime import date
from typing import List, Optional, Union
from fastapi import APIRouter, Depends, File, Form ,HTTPException ,Query, UploadFile ,status
from fastapi.encoders import jsonable_encoder
from sqlalchemy import func

from models.enums import Gender, InsuranceType
from schemas.authschema import PatientCreate, DoctorCreate
from sqlalchemy.orm import Session ,joinedload ,load_only
from sqlalchemy.exc import SQLAlchemyError
from pydantic import BaseModel, EmailStr

from secruity import bcrypt_context

from .handlers import create_doctor_handler, create_patient_handler, attach_doctors_to_patient_handler, attach_patients_to_doctor_handler

from db.session import get_db

from models.base import DiagnosisReport, Message, MessageReportes, PatientDetachRequest, User,DiagnosticList
from models.models import Doctor ,Patient, PatientEditRequest ,patient_doctor_association 

from .schemas.request import PatientUpdate , DoctorUpdate
from .schemas.response import DetachRequestSummary, PatientEditRequestSummary
def check_admin_placeholder():
    return True

adminrouter = APIRouter(
    prefix="/api/admin",
    tags=["admin"],
)
base_url = "http://localhost:8000"

@adminrouter.post("/doctors")
def create_doctor_profile(
    username: str = Form(...),
    password: str = Form(...),
    email: EmailStr = Form(...),
    specialty: Optional[str] = Form(None),
    office_location: str = Form(...),
    patients: Optional[List[int]] = Form(None),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    is_admin: bool = Depends(check_admin_placeholder)
):
    doctor_data = DoctorCreate(
        username=username,
        password=password,
        email=email,
        specialty=specialty,
        office_location=office_location,
        patients=patients,
    )
    return create_doctor_handler(create_doctor_request=doctor_data, image=image, db=db)



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
    
    base_url = "http://localhost:8000"
    
    patients = [{
        "id": patient.id,
        "username": patient.username,
        "gender": patient.gender,
        "age": patient.age,
        "profile_picture": f"{base_url}{patient.profile_picture}" if patient.profile_picture else None,
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
    doctors = [{"id": doctor.id,"profile_picture":f"{base_url}{doctor.profile_picture}" if doctor.profile_picture else None , "username": doctor.username , "specialty" :doctor.specialty , "office_location":doctor.office_location} for doctor in result]
    return doctors




@adminrouter.get("/doctors/{doctor_id}")
def get_doctor(
    doctor_id: str,
    db: Session = Depends(get_db),
    is_admin: bool = Depends(check_admin_placeholder)
):
    doctor = db.query(Doctor).options(
        load_only(
            Doctor.id,
            Doctor.username,
            Doctor.email,
            Doctor.specialty,
            Doctor.office_location,
            Doctor.profile_picture
        )
    ).filter(Doctor.id == doctor_id).first()

    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")

    doctor_data = jsonable_encoder(doctor)
   
    doctor_data["profile_picture"] = f"{base_url}{doctor.profile_picture}" if doctor.profile_picture else None

    return doctor_data


@adminrouter.get("/patients/{patient_id}")
def get_patient(
    patient_id: str,
        db: Session = Depends(get_db),
    is_admin: bool = Depends(check_admin_placeholder)
):
    patient = db.query(Patient).options(
        load_only(
            Patient.id,
            Patient.username,
            Patient.email,
            Patient.role,
            Patient.gender,
            Patient.age,
            Patient.profile_picture,
            Patient.date_of_birth,
            Patient.phone_number,
            Patient.emergency_contact,
            Patient.insurance_type
        )
    ).filter(Patient.id == patient_id).first()

    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    patient_data = jsonable_encoder(patient)
    if patient.profile_picture:
       
        patient_data["profile_picture"] = f"{base_url}{patient.profile_picture}"
    else:
        patient_data["profile_picture"] = None

    return patient_data

 
@adminrouter.post("/patients")
def create_patient_profile(
    username: str = Form(...),
    password: str = Form(...),
    email: EmailStr = Form(...),
    gender: Gender = Form(...),
    age: Optional[int] = Form(None),
    date_of_birth: Optional[date] = Form(None),
    phone_number: Optional[str] = Form(None),
    emergency_contact: Optional[str] = Form(None),
    insurance_type: InsuranceType = Form(...),
    doctors: Optional[List[int]] = Form([]),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    is_admin: bool = Depends(check_admin_placeholder),
):
    patient_data = PatientCreate(
        username=username,
        password=password,
        email=email,
        gender=gender,
        age=age,
        date_of_birth=date_of_birth,
        phone_number=phone_number,
        emergency_contact=emergency_contact,
        insurance_type=insurance_type,
        doctors=doctors
    )
    return create_patient_handler(patient_data, image, db)
 
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
    attached_patients = db.query(Patient.id, Patient.username,Patient.profile_picture).filter(Patient.id.in_(attached_patient_ids)).all()
    return [{"id": p.id, "username": p.username , "profile_picture":f"{base_url}{p.profile_picture}"if p.profile_picture else None} for p in attached_patients]
@adminrouter.get("/not_attached_patients/{doctor_id}")
def not_attached_patients(
    doctor_id: str,
    name: str = Query(..., min_length=1),
    db: Session = Depends(get_db),
    is_admin: bool = Depends(check_admin_placeholder)
):
    patients = db.query(Patient.id, Patient.username,Patient.profile_picture)\
        .filter(Patient.username.ilike(f"%{name}%"))\
        .all()
    attached_patient_ids = db.query(patient_doctor_association.c.patient_id)\
        .filter(patient_doctor_association.c.doctor_id == doctor_id)\
        .all()
    attached_patient_ids = [p[0] for p in attached_patient_ids]
    return [
        {"id": p.id, "username": p.username , "profile_picture":f"{base_url}{p.profile_picture}"if p.profile_picture else None}
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
    doctors = db.query(Doctor.id, Doctor.username , Doctor.profile_picture)\
        .filter(Doctor.id.in_(attached_doctor_ids))\
        .all()
    return [{"id": d.id, "username": d.username ,"profile_picture":f"{base_url}{d.profile_picture}"if d.profile_picture else None} for d in doctors]


@adminrouter.get("/not_attached_doctors/{patient_id}")
def not_attached_doctors(
    patient_id: str,
    name: str = Query(..., min_length=1),
    db: Session = Depends(get_db),
    is_admin: bool = Depends(check_admin_placeholder)
):
    doctors = db.query(Doctor.id, Doctor.username ,Doctor.profile_picture)\
        .filter(Doctor.username.ilike(f"%{name}%"))\
        .all()
    attached_doctor_ids = db.query(patient_doctor_association.c.doctor_id)\
        .filter(patient_doctor_association.c.patient_id == patient_id)\
        .all()
    attached_doctor_ids = [d[0] for d in attached_doctor_ids]
    return [
        {"id": d.id, "username": d.username ,"profile_picture":f"{base_url}{d.profile_picture}"if d.profile_picture else None}
        for d in doctors if d.id not in attached_doctor_ids
    ]



@adminrouter.delete("/patients/{patient_id}/doctors/{doctor_id}")
def detach_patient(patient_id: str, doctor_id: str, db: Session = Depends(get_db), is_admin:bool =Depends(check_admin_placeholder)):
    patient = db.get(Patient, patient_id)
    doctor = db.get(Doctor, doctor_id)
    if not patient or not doctor:
        raise HTTPException(status_code=404, detail="Patient or Doctor not found")
    if doctor in patient.doctors:
        patient.doctors.remove(doctor)
        db.commit()
    return {"detail": "patient detached from doctor"}

@adminrouter.delete("/doctors/{doctor_id}/patients/{patient_id}")
def detach_doctor(patient_id: str, doctor_id: str, db: Session = Depends(get_db), is_admin:bool =Depends(check_admin_placeholder)):
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



@adminrouter.put("/users/{user_id}")
def update_user(
    user_id: str,
    user_update: Union[PatientUpdate, DoctorUpdate],
    is_admin:bool = Depends(check_admin_placeholder) ,
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    data = user_update.model_dump(exclude_unset=True)
    if "password" in data:
        data["password"] = bcrypt_context.hash(data["password"])

    for key, value in data.items():
        setattr(user, key, value)

    db.commit()

    return {"id": user_id}



@adminrouter.get("/dashboard/stats")
def get_dashboard_stats(
    is_admin: bool = Depends(check_admin_placeholder),
    db: Session = Depends(get_db)
):  
    total_doctors = db.query(func.count(Doctor.id)).scalar() or 0
    total_patients = db.query(func.count(Patient.id)).scalar() or 0

    patients_banned_from_messaging = db.query(func.count(Patient.id))\
        .filter(Patient.can_send_messages == False).scalar() or 0

    doctors_banned_from_posting = db.query(func.count(Doctor.id))\
        .filter(Doctor.can_post == False).scalar() or 0

    doctors_banned_from_messaging = db.query(func.count(Doctor.id))\
        .filter(Doctor.can_send_messages == False).scalar() or 0

    messages_today = db.query(func.count(Message.id))\
        .filter(func.date(Message.timestamp) == func.current_date()).scalar() or 0

    diagnosis_reports = db.query(func.count(DiagnosisReport.id)).scalar() or 0
    message_reports = db.query(func.count(MessageReportes.id)).scalar() or 0
    infos_request = db.query(func.count(PatientEditRequest.patient_id)).scalar() or 0
    detach_request = db.query(func.count(PatientDetachRequest.id)).scalar() or 0

    return {
        "total_doctors": total_doctors,
        "total_patients": total_patients,
        "patients_banned_from_messaging": patients_banned_from_messaging,
        "doctors_banned_from_posting": doctors_banned_from_posting,
        "doctors_banned_from_messaging": doctors_banned_from_messaging,
        "messages_today": messages_today,
        "diagnosis_reports": diagnosis_reports,
        "message_reports": message_reports,
        "infos_request": infos_request,
        "detach_request": detach_request,
    }



@adminrouter.get("/message-reports")
def get_message_reports(db: Session = Depends(get_db) , is_admin:bool=Depends(check_admin_placeholder)):
    reports = db.query(MessageReportes)\
        .options(
            joinedload(MessageReportes.sender),   
            joinedload(MessageReportes.reporter)   
        ).all()

    if not reports:
        raise HTTPException(status_code=404, detail="No message reports found")

    result = []
    for r in reports:
        result.append({
            "id": r.id,
            "sender_id": r.sender_id,
            "sender_name": r.sender.username if r.sender else None,
            "reporter_id": r.reporter_id,
            "reporter_name": r.reporter.username if r.reporter else None,
            "text": r.text
        })

    return result   



# @adminrouter.get("/diagnosis-reports")
# def get_diagnosis_reports(db: Session = Depends(get_db) , is_admin:bool=Depends(check_admin_placeholder)):
#     reports = db.query(MessageReportes)\
#         .options(
#             joinedload(MessageReportes.sender),   
#             joinedload(MessageReportes.reporter)   
#         ).all()

#     if not reports:
#         raise HTTPException(status_code=404, detail="No message reports found")

#     result = []
#     for r in reports:
#         result.append({
#             "id": r.id,
#             "sender_id": r.sender_id,
#             "sender_name": r.sender.username if r.sender else None,
#             "reporter_id": r.reporter_id,
#             "reporter_name": r.reporter.username if r.reporter else None,
#             "text": r.text
#         })

#     return result   




@adminrouter.get("/patient-edit-request/{patient_id}")
def get_info_request(patient_id:str , db: Session = Depends(get_db) , is_admin:bool=Depends(check_admin_placeholder)):
    result = db.query(PatientEditRequest).filter(PatientEditRequest.patient_id == patient_id ).first()
    return result    




@adminrouter.get("/patient-edit-requests", response_model=List[PatientEditRequestSummary])
def get_patient_edit_requests(db: Session = Depends(get_db) , is_admin:bool=Depends(check_admin_placeholder)):
    results = (
        db.query(
            PatientEditRequest.patient_id,
            Patient.username
        )
        .join(Patient, Patient.id == PatientEditRequest.patient_id)
        .all()
    )
    return [{"patient_id": pid, "patient_username": username} for pid, username in results]



@adminrouter.get("/patient-detach-requests", response_model=List[DetachRequestSummary])
def get_patient_detach_requests(db: Session = Depends(get_db), is_admin: bool = Depends(check_admin_placeholder)):
    results = (
        db.query(
            PatientDetachRequest.id,
            PatientDetachRequest.patient_id,
            Patient.username.label("patient_username"),
            PatientDetachRequest.doctor_id,
            Doctor.username.label("doctor_username")
        )
        .join(Patient, Patient.id == PatientDetachRequest.patient_id)
        .join(Doctor, Doctor.id == PatientDetachRequest.doctor_id)
        .all()
    )

    return [
        {
            "id": row.id,
            "patient_id": row.patient_id,
            "patient_username": row.patient_username,
            "doctor_id": row.doctor_id,
            "doctor_username": row.doctor_username,
        }
        for row in results
    ]



@adminrouter.delete("/{request_id}/patient-detach-request/{action}")
def patient_detach_request_action(
    request_id: int,
    action: bool,
    db: Session = Depends(get_db),
    is_admin: bool = Depends(check_admin_placeholder)
):
    detach_request = db.query(PatientDetachRequest).filter(PatientDetachRequest.id == request_id).first()
    if not detach_request:
        raise HTTPException(status_code=404, detail="Detach request not found")
    
    db.delete(detach_request)
    db.commit()
    if action is False:
        return {"detail": "Detach request was declined successfully"}
    
    patient = db.get(Patient, detach_request.patient_id)
    doctor = db.get(Doctor, detach_request.doctor_id)

    if not patient or not doctor:
        raise HTTPException(status_code=404, detail="Patient or Doctor not found")

    if patient in doctor.patients:
        doctor.patients.remove(patient)
        db.commit()
        return {"detail": "Detach request was accepted"}
    
    return {"detail": "Detach request already resolved or patient not attached"}



@adminrouter.put("/patient-edit-request/{patient_id}/{accept}")
def handle_patient_edit_request(
    patient_id: str,
    accept: bool,
    db: Session = Depends(get_db),
    is_admin: bool = Depends(check_admin_placeholder)
):
    edit_request = db.query(PatientEditRequest).filter_by(patient_id=patient_id).first()
    if not edit_request:
        raise HTTPException(status_code=404, detail="Edit request not found")

    db.delete(edit_request)
    db.commit()
    if not accept:
        return {"detail": "Edit request was declined"}

    patient = db.query(Patient).filter_by(id=patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    if edit_request.gender is not None:
        patient.gender = edit_request.gender
    if edit_request.age is not None:
        patient.age = edit_request.age
    if edit_request.profile_picture is not None:
        patient.profile_picture = edit_request.profile_picture
    if edit_request.date_of_birth is not None:
        patient.date_of_birth = edit_request.date_of_birth
    if edit_request.phone_number is not None:
        patient.phone_number = edit_request.phone_number
    if edit_request.emergency_contact is not None:
        patient.emergency_contact = edit_request.emergency_contact
    if edit_request.insurance_type is not None:
        patient.insurance_type = edit_request.insurance_type

    
    db.commit()
    db.refresh(patient) 
    return {"detail": "Edit request accepted and patient updated"}



@adminrouter.post("/chat/report/{report_id}/{accept}")
def handle_message_report(
    report_id: int,
    accept: bool,
    db: Session = Depends(get_db),
    is_admin:bool=Depends(check_admin_placeholder)
):
    report = db.query(MessageReportes).filter(MessageReportes.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    if accept:
        user = db.query(User).filter(User.id == report.sender_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        user_subclass = db.query(user.__class__).filter_by(id=user.id).first()
        if not user_subclass:
            raise HTTPException(status_code=404, detail="User subtype not found")

        user_subclass.can_send_messages = 0
        db.add(user_subclass)
        db.query(MessageReportes).filter(MessageReportes.sender_id == report.sender_id).delete(synchronize_session=False)
        db.commit()
        return {"detail": "Report accepted, user messaging disabled and related reports deleted."}

    db.delete(report)
    db.commit()
    return {"detail": "Report declined and deleted."}


@adminrouter.get("/diagnosis-reports")
def get_diagnosis_reports(
    db: Session = Depends(get_db),
    is_admin: bool = Depends(check_admin_placeholder)
):
    reports = (
        db.query(DiagnosisReport)
        .options(
            joinedload(DiagnosisReport.posted_by),
            joinedload(DiagnosisReport.reporter)
        )
        .all()
    )
    return [
        {
            "id": r.id,
            "description": r.description,
            "created_at": r.created_at,
            "posted_by_username": r.posted_by.username if r.posted_by else None,
            "reported_by_username": r.reporter.username if r.reporter else None
        }
        for r in reports
    ]



@adminrouter.post("/diagnosis/report/{report_id}/{accept}")
def handle_diagnosis_report(
    report_id: int,
    accept: bool,
    db: Session = Depends(get_db),
    is_admin: bool = Depends(check_admin_placeholder)
):
    try:
        report = db.query(DiagnosisReport).filter(DiagnosisReport.id == report_id).first()
        if not report:
            raise HTTPException(status_code=404, detail="Diagnosis report not found")

        if accept:
            doctor = db.query(Doctor).filter(Doctor.id == report.posted_by_id).first()
            if not doctor:
                raise HTTPException(status_code=404, detail="Reported doctor not found")

            doctor.can_post = False
            if report.diagnostic_list :
                db.delete(report.diagnostic_list)
            
            db.query(DiagnosisReport).filter(DiagnosisReport.posted_by_id == report.posted_by_id).delete(synchronize_session=False)
            
            db.commit()
            return {"detail": "Report accepted. Doctor blocked from posting diagnoses. Related reports deleted."}

        db.delete(report)
        db.commit()
        return {"detail": "Report declined and deleted."}

    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Database error: " + str(e))
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Internal server error: " + str(e))