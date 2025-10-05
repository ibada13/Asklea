from pydantic import BaseModel
from typing import Optional
from enum import Enum
from datetime import date
from models.enums import Gender , InsuranceType

class PatientProfileResponse(BaseModel):
    id: str
    username: str
    full_name: Optional[str]
    gender: Gender
    age: Optional[int]
    profile_picture: Optional[str]
    date_of_birth: Optional[date]
    phone_number: Optional[str]
    emergency_contact: Optional[str]
    insurance_type: InsuranceType

    class Config:
        orm_mode = True
