from sqlalchemy import create_engine, Column, Integer, String, ForeignKey, Date, JSON, Enum
from sqlalchemy.orm import relationship, declarative_base
from .enums import *
from .base import User




class Admin(User):
    __tablename__ = 'admins'

    id = Column(Integer, ForeignKey('users.id'), primary_key=True)
    
    
    __mapper_args__ = {
        'polymorphic_identity': 'admin', 
    }




class Doctor(User):
    __tablename__ = 'doctors'

    id = Column(Integer, ForeignKey('users.id'), primary_key=True)
    specialty = Column(String)
    office_location = Column(String)

    patients = relationship("Patient", back_populates="doctor")

    __mapper_args__ = {
        'polymorphic_identity': 'doctor',
    }



class Patient(User):
    __tablename__ = 'patients'

    id = Column(Integer, ForeignKey('users.id'), primary_key=True)
    gender = Column(Enum(Gender), nullable=False)
    age = Column(Integer)
    profile_picture = Column(String)
    date_of_birth = Column(Date)
    phone_number = Column(String)
    emergency_contact = Column(String)
    insurance_type = Column(Enum(InsuranceType), nullable=False)
    diagnosis_history = relationship("DiagnosisHistory", back_populates="patient")
    diagnostic_list = relationship("DiagnosticList", back_populates="patient")

    doctor_id = Column(Integer, ForeignKey('doctors.id'))
    doctor = relationship("Doctor", back_populates="patients")

    __mapper_args__ = {
        'polymorphic_identity': 'patient',
    }