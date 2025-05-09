from sqlalchemy import Table, create_engine, Column, Integer, String, ForeignKey, Date, Enum
from sqlalchemy.orm import relationship, declarative_base
from .enums import Gender, InsuranceType , Specialty
from models.base import User
from db.database import Base

class Admin(User):
    __tablename__ = 'admins'

    id = Column(Integer, ForeignKey('users.id'), primary_key=True)

    __mapper_args__ = {
        'polymorphic_identity': 'admin',
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

    diagnosis_history = relationship("DiagnosisHistory", back_populates="patient")
    diagnostic_list = relationship("DiagnosticList", back_populates="patient")
    doctors = relationship("Doctor", secondary=patient_doctor_association, back_populates="patients")

    __mapper_args__ = {
        'polymorphic_identity': 'patient',
    }


class Doctor(User):
    __tablename__ = 'doctors'

    id = Column(String, ForeignKey('users.id'), primary_key=True)
    specialty = Column(Enum(Specialty) ,nullable=False)
    office_location = Column(String)

    patients = relationship("Patient", secondary=patient_doctor_association, back_populates="doctors")

    __mapper_args__ = {
        'polymorphic_identity': 'doctor',
    }
