

from datetime import date
from typing import Optional

from pydantic import BaseModel

from models.enums import Gender, InsuranceType


class PatientEditRequestSchema(BaseModel):
    gender: Optional[Gender]
    age: Optional[int]
    profile_picture: Optional[str]
    date_of_birth: Optional[date] 
    phone_number: Optional[str]
    emergency_contact: Optional[str]
    insurance_type: Optional[InsuranceType]