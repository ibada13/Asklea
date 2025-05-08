from sqlalchemy import Column, ForeignKey ,Integer ,String , Enum 
from sqlalchemy.orm import relationship
from db.database import Base
from .enums import *

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, index=True, unique=True)
    email = Column(String, unique=True)
    password = Column(String)
    role = Column(Enum(Role), nullable=False)

    __mapper_args__ = {
        'polymorphic_identity': 'user',
        'polymorphic_on': role,  
    }

class DiagnosisHistory(Base):
    __tablename__ = 'diagnosis_history'

    id = Column(Integer, primary_key=True, index=True)
    month = Column(String)
    year = Column(Integer)
    blood_pressure_systolic_value = Column(Integer)
    blood_pressure_systolic_levels = Column(Enum(Level), nullable=False)
    blood_pressure_diastolic_value = Column(Integer)
    blood_pressure_diastolic_levels = Column(Enum(Level), nullable=False)
    heart_rate_value = Column(Integer)
    heart_rate_levels = Column(Enum(Level), nullable=False)
    respiratory_rate_value = Column(Integer)
    respiratory_rate_levels = Column(Enum(Level), nullable=False)
    temperature_value = Column(Integer)
    temperature_levels = Column(Enum(Level), nullable=False)

    patient_id = Column(Integer, ForeignKey('patients.id'))
    patient = relationship("Patient", back_populates="diagnosis_history")

class DiagnosticList(Base):
    __tablename__ = 'diagnostic_list'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    description = Column(String)
    status = Column(String)

    patient_id = Column(Integer, ForeignKey('patients.id'))
    patient = relationship("Patient", back_populates="diagnostic_list")
