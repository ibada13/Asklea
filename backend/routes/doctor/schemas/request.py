from pydantic import BaseModel, conint, confloat
from typing import Literal

Level = Literal["Low", "Normal", "High", "Lower than Average", "Higher than Average"]

class DiagnosisHistoryRequest(BaseModel):
    month: str
    year: int
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
