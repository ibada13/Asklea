from pydantic import BaseModel ,EmailStr
from typing import Optional , List
from models.enums import Specialty,Gender , InsuranceType
from datetime import date
class UserCreate(BaseModel):
    username:str
    password:str
    email:EmailStr

class DoctorCreate(UserCreate):
    specialty: Optional[Specialty]
    office_location: str
    patients :Optional[list[int]] =None 

class PatientCreate(UserCreate):
    gender: Gender
    age: Optional[int]
    profile_picture: Optional[str]
    date_of_birth: Optional[date]
    phone_number: Optional[str]
    emergency_contact: Optional[str]
    insurance_type: InsuranceType
    doctors: Optional[List[int]] = []



class Token(BaseModel):
    access_token :str
    token_type:str