from pydantic import BaseModel, EmailStr
from typing import Optional
from models.enums import Specialty ,Gender, Role, InsuranceType

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str



class PatientCreate(BaseModel):
    username: str
    email: EmailStr
    gender: Gender
    age: Optional[int] = None
    date_of_birth: Optional[str] = None
    phone_number: Optional[str] = None
    emergency_contact: Optional[str] = None
    insurance_type: InsuranceType

class PatientUpdate(BaseModel):
    gender: Optional[Gender] = None
    age: Optional[int] = None
    date_of_birth: Optional[str] = None
    phone_number: Optional[str] = None
    emergency_contact: Optional[str] = None
    insurance_type: Optional[InsuranceType] = None




class DiagnosisHistoryCreate(BaseModel):
    month: str
    year: int
    blood_pressure_systolic_value: Optional[int] = None
    blood_pressure_systolic_levels: str
    blood_pressure_diastolic_value: Optional[int] = None
    blood_pressure_diastolic_levels: str
    heart_rate_value: Optional[int] = None
    heart_rate_levels: str
    respiratory_rate_value: Optional[int] = None
    respiratory_rate_levels: str
    temperature_value: Optional[int] = None
    temperature_levels: str

    class Config:
        orm_mode = True

class DiagnosticListCreate(BaseModel):
    name: str
    description: str
    status: str

    class Config:
        orm_mode = True
