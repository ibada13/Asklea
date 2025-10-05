from pydantic import BaseModel


class PatientEditRequestSummary(BaseModel):
    patient_id: str
    patient_username: str


class DetachRequestSummary(BaseModel):
    id: int
    patient_id: str
    patient_username: str
    doctor_id: str
    doctor_username: str