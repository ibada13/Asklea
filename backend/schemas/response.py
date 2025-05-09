from pydantic import BaseModel 
from models.enums import Gender , InsuranceType  ,Role
from typing import Optional 
from datetime import date

class PatientOut(BaseModel):
    id: int
    gender: Gender
    age: Optional[int]
    profile_picture: Optional[str]
    date_of_birth: Optional[date]
    phone_number: Optional[str]
    emergency_contact: Optional[str]
    insurance_type: InsuranceType

    class Config:
        from_attributes = True


class UserOut(BaseModel):
    id: int
    username: str
    email: str
    role: Role

    class Config:
        from_attributes = True