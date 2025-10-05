from pydantic import BaseModel
from datetime import date
from typing import Optional 
from models.enums import  Gender , InsuranceType ,Specialty
class UserUpdate(BaseModel):
    username: Optional[str]
    email: Optional[str]
    password: Optional[str]

class PatientUpdate(UserUpdate):
    gender: Optional[Gender]
    age: Optional[int]
    profile_picture: Optional[str]
    date_of_birth: Optional[date]
    phone_number: Optional[str]
    emergency_contact: Optional[str]
    insurance_type: Optional[InsuranceType]

class DoctorUpdate(UserUpdate):
    specialty: Optional[Specialty]
    office_location: Optional[str]

