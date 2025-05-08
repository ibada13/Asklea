from enum import Enum as PyEnum

class Level(str, PyEnum):
    LOW = "Low"
    NORMAL = "Normal"
    HIGH = "High"
    LOWER_THAN_AVERAGE = "Lower than Average"
    HIGHER_THAN_AVERAGE = "Higher than Average"

class InsuranceType(str, PyEnum):
    PREMIER_AUTO_CORPORATION = "Premier Auto Corporation"
    BLUE_CROSS_BLUE_SHIELD = "Blue Cross Blue Shield"
    AETNA = "Aetna"
    CIGNA = "Cigna"
    UNITED_HEALTHCARE = "United Healthcare"
    HUMANA = "Humana"
    OTHER = "Other"

class Gender(str, PyEnum):
    MALE = "Male"
    FEMALE = "Female"

class Role(str, PyEnum):
    ADMIN = "Admin"
    DOCTOR = "Doctor"
    PATIENT = "Patient"
