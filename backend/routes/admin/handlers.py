
from fastapi import HTTPException 
from sqlalchemy import or_
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session
from models.models import Doctor ,Patient
from schemas.authschema import DoctorCreate , PatientCreate 
from secruity import bcrypt_context 


def create_doctor_handler(create_doctor_request :DoctorCreate ,db:Session):
    try:
        doctor = db.query(Doctor).filter(or_(Doctor.email == create_doctor_request.email ,Doctor.username == create_doctor_request.username)).first()
        if doctor :
            raise HTTPException(status_code=409 , detail="Doctor with this email or username already exist")
        created_doctor = Doctor(
            username = create_doctor_request.username ,
            password = bcrypt_context.hash(create_doctor_request.password),
            email = create_doctor_request.email,
            specialty = create_doctor_request.specialty ,
            office_location = create_doctor_request.office_location ,
        )
        if create_doctor_request.patients :
            patients = db.query(Patient).filter(Patient.id.in_(create_doctor_request.patients))
            created_doctor.patients.extend(patients)

        db.add(created_doctor)
        db.commit()
        db.refresh(created_doctor)
        return {"msg": "Doctor profile created successfully" , "id":created_doctor.id}
    except SQLAlchemyError as e :
        db.rollback()
        raise Exception(f"Error while creating doctor : {str(e)}")



def create_patient_handler(create_patient_request: PatientCreate, db: Session):
    try:
        existing_patient = db.query(Patient).filter(
            or_(
                Patient.email == create_patient_request.email,
                Patient.username == create_patient_request.username
            )
        ).first()

        if existing_patient:
            raise HTTPException(status_code=409, detail="Patient with this email or username already exists")

        created_patient = Patient(
            username=create_patient_request.username,
            password=bcrypt_context.hash(create_patient_request.password),
            email=create_patient_request.email,
            gender=create_patient_request.gender,
            age=create_patient_request.age,
            profile_picture=create_patient_request.profile_picture,
            date_of_birth=create_patient_request.date_of_birth,
            phone_number=create_patient_request.phone_number,
            emergency_contact=create_patient_request.emergency_contact,
            insurance_type=create_patient_request.insurance_type,
        )

        if create_patient_request.doctors:
            doctors = db.query(Doctor).filter(Doctor.id.in_(create_patient_request.doctors)).all()
            created_patient.doctors.extend(doctors)

        db.add(created_patient)
        db.commit()
        db.refresh(created_patient)

        return {"msg": "Patient profile created successfully" , "id":created_patient.id}

    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error while creating patient: {str(e)}")



def attach_doctors_to_patient_handler(patient_id: str, doctor_ids: list[str], db: Session):
    try:
        patient = db.query(Patient).filter(Patient.id == patient_id).first()
        if not patient:
            raise HTTPException(status_code=404, detail="Patient not found")

        doctors = db.query(Doctor).filter(Doctor.id.in_(doctor_ids)).all()
        if len(doctors) != len(doctor_ids):
            raise HTTPException(status_code=404, detail="One or more doctors not found")

        for doctor in doctors:
            if doctor not in patient.doctors:
                patient.doctors.append(doctor)

        db.commit()
        db.refresh(patient)

        return {"message": "Doctors successfully attached to patient", "patient_id": patient.id}
    
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error attaching doctors to patient: {str(e)}")


def attach_patients_to_doctor_handler(doctor_id: str, patient_ids: list[str], db: Session):
    try:
        doctor = db.query(Doctor).filter(Doctor.id == doctor_id).first()
        if not doctor:
            raise HTTPException(status_code=404, detail="Doctor not found")

        patients = db.query(Patient).filter(Patient.id.in_(patient_ids)).all()
        if len(patients) != len(patient_ids):
            raise HTTPException(status_code=404, detail="One or more patients not found")

        for patient in patients:
            if patient not in doctor.patients:
                doctor.patients.append(patient)

        db.commit()
        db.refresh(doctor)

        return {"message": "Patients successfully attached to doctor", "doctor_id": doctor.id}
    
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error attaching patients to doctor: {str(e)}")


