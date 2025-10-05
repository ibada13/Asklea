from datetime import datetime ,timezone
from sqlalchemy import Column, DateTime, ForeignKey ,Integer ,String , Enum, Text, func 
from sqlalchemy.orm import relationship
from db.database import Base
from .enums import *
from uuid import uuid4 ,UUID
from sqlalchemy.dialects.postgresql import UUID


class User(Base):
    __tablename__ = 'users'

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid4()))
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
    created_at = Column(DateTime, default=datetime.now(timezone.utc), nullable=False)
    timestamp = Column(DateTime, default=datetime.now(timezone.utc), nullable=False)

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

    patient_id = Column(String, ForeignKey('patients.id'))
    patient = relationship("Patient", back_populates="diagnosis_history")
class DiagnosticList(Base):
    __tablename__ = 'diagnostic_list'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    description = Column(String)
    status = Column(Enum(DiagnosisStatus), default=DiagnosisStatus.PENDING)
 
    patient_id = Column(String, ForeignKey('patients.id'))
    patient = relationship("Patient", back_populates="diagnostic_list")
    doctor_id = Column(String, ForeignKey('doctors.id'))
    doctor = relationship("Doctor", back_populates="diagnostic_list")

    reports = relationship("DiagnosisReport", back_populates="diagnostic_list", cascade="all, delete-orphan")




class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    sender_id = Column(String, ForeignKey("users.id"), nullable=False)
    receiver_id = Column(String, ForeignKey("users.id"), nullable=False)
    text = Column(String, nullable=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    sender = relationship("User", foreign_keys=[sender_id])
    receiver = relationship("User", foreign_keys=[receiver_id])


class MessageReportes(Base):
    __tablename__ = "messagereportes"

    id = Column(Integer, primary_key=True, index=True)
    sender_id = Column(String, ForeignKey("users.id"), nullable=False)
    reporter_id = Column(String, ForeignKey("users.id"), nullable=False)
    text = Column(String, nullable=False)
    reporter = relationship("User", foreign_keys=[reporter_id])
    sender = relationship("User", foreign_keys=[sender_id])

    pass



class PatientDetachRequest(Base):
    __tablename__ = "patient_detach_requests"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(String, ForeignKey("patients.id"), nullable=False)
    doctor_id = Column(String, ForeignKey("doctors.id"), nullable=False)

    patient = relationship("Patient", back_populates="detach_requests")
    doctor = relationship("Doctor", back_populates="detach_requests")


class DiagnosisReport(Base):
    __tablename__ = 'diagnosis_reports'

    id = Column(Integer, primary_key=True, index=True)
    description = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    diagnostic_list_id = Column(Integer, ForeignKey('diagnostic_list.id'))
    diagnostic_list = relationship("DiagnosticList", back_populates="reports")

    reporter_id = Column(String, ForeignKey('doctors.id'))
    reporter = relationship("Doctor", foreign_keys=[reporter_id], back_populates="reported_diagnoses")

    posted_by_id = Column(String, ForeignKey('doctors.id'))
    posted_by = relationship("Doctor", foreign_keys=[posted_by_id], back_populates="posted_diagnoses")
