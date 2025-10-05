
from sqlalchemy import DateTime, Table, Boolean, Column, Integer, String, ForeignKey, Date, Enum, func
from sqlalchemy.orm import relationship, declarative_base
from .enums import Gender, InsuranceType , Specialty
from models.base import User
from db.database import Base

class Admin(User):
    __tablename__ = 'admins'

    id = Column(String, ForeignKey('users.id'), primary_key=True)

    __mapper_args__ = {
        'polymorphic_identity': 'ADMIN',
    }


patient_doctor_association = Table('patient_doctor_association', Base.metadata,
    Column('patient_id', Integer, ForeignKey('patients.id'), primary_key=True),
    Column('doctor_id', Integer, ForeignKey('doctors.id'), primary_key=True)
)

class Patient(User):
    __tablename__ = 'patients'

    id = Column(String, ForeignKey('users.id'), primary_key=True)
    gender = Column(Enum(Gender), nullable=False)
    age = Column(Integer)
    profile_picture = Column(String)
    date_of_birth = Column(Date)
    phone_number = Column(String)
    emergency_contact = Column(String)
    insurance_type = Column(Enum(InsuranceType), nullable=False)

    can_send_messages = Column(Boolean, default=True)


    diagnosis_history = relationship("DiagnosisHistory", back_populates="patient")
    diagnostic_list = relationship("DiagnosticList", back_populates="patient")
    doctors = relationship("Doctor", secondary=patient_doctor_association, back_populates="patients")
    detach_requests = relationship("PatientDetachRequest", back_populates="patient")

    __mapper_args__ = {
        'polymorphic_identity': 'PATIENT',
    }

    edit_request = relationship("PatientEditRequest", back_populates="patient", uselist=False)



class Doctor(User):
    __tablename__ = 'doctors'

    id = Column(String, ForeignKey('users.id'), primary_key=True)
    specialty = Column(Enum(Specialty), nullable=False)
    office_location = Column(String)
    profile_picture = Column(String)
    can_send_messages = Column(Boolean, default=True)
    can_post = Column(Boolean, default=True)

    patients = relationship("Patient", secondary=patient_doctor_association, back_populates="doctors")
    detach_requests = relationship("PatientDetachRequest", back_populates="doctor")
    diagnostic_list = relationship("DiagnosticList", back_populates="doctor")

    reported_diagnoses = relationship("DiagnosisReport", foreign_keys='DiagnosisReport.reporter_id', back_populates="reporter")
    posted_diagnoses = relationship("DiagnosisReport", foreign_keys='DiagnosisReport.posted_by_id', back_populates="posted_by")

    __mapper_args__ = {
        'polymorphic_identity': 'DOCTOR',
    }



class PatientEditRequest(Base):
    __tablename__ = 'patient_edit_requests'

    patient_id = Column(String, ForeignKey('patients.id'), primary_key=True)

    gender = Column(Enum(Gender), nullable=True)
    age = Column(Integer, nullable=True)
    profile_picture = Column(String, nullable=True)
    date_of_birth = Column(Date, nullable=True)
    phone_number = Column(String, nullable=True)
    emergency_contact = Column(String, nullable=True)
    insurance_type = Column(Enum(InsuranceType), nullable=True)

    timestamp = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    patient = relationship("Patient", back_populates="edit_request", uselist=False)
