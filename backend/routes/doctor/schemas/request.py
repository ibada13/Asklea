from datetime import datetime
from pydantic import BaseModel, conint, confloat
from typing import Literal
from models.enums import DiagnosisStatus
Level = Literal["Low", "Normal", "High", "Lower than Average", "Higher than Average"]

class DiagnosisHistoryRequest(BaseModel):
    timestamp: datetime
    blood_pressure_systolic_value: int
    blood_pressure_systolic_levels: Level
    blood_pressure_diastolic_value: int
    blood_pressure_diastolic_levels: Level
    heart_rate_value: int
    heart_rate_levels: Level
    respiratory_rate_value: int
    respiratory_rate_levels: Level
    temperature_value: float
    temperature_levels: Level

    
class DiagnosticListRequest(BaseModel):
    name:str
    description: str | None = None
    status: DiagnosisStatus



class DiagnosisReportCreate(BaseModel):
    description: str
    diagnostic_list_id: int

