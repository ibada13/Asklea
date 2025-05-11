from datetime import datetime ,timezone ,timedelta
from fastapi import HTTPException,Depends
from secruity import oauth2_bearer ,bcrypt_context
from schemas.authschema import UserCreate ,DoctorCreate ,PatientCreate
from sqlalchemy.orm import Session 
from sqlalchemy import create_pool_from_url, or_
from models.base import User
from models.models import Admin ,  Doctor ,Patient,patient_doctor_association 
from sqlalchemy.exc import SQLAlchemyError
from jose import jwt ,JWTError
from models.enums import Role
from db.session import get_db
from config import SECRET_KEY  ,ALGORITHM
def create_admin_handler(create_user_request :UserCreate , db:Session):
    try:
        admin = db.query(Admin).filter(or_(Admin.email == create_user_request.email , Admin.username == create_user_request.username)).first()
        if admin:
            raise HTTPException(status_code=409 , detail="User with this email or username already exist")
        created_admin = Admin(
            username = create_user_request.username , 
            password = bcrypt_context.hash(create_user_request.password),
            email = create_user_request.email,
        )
        db.add(created_admin)
        db.commit()
        db.refresh(created_admin)
    except SQLAlchemyError as e :
        db.rollback()
        raise Exception(f"Error while creating admin : {str(e)}")



def auth_user(username:str , password :str , db:Session):
    try :
        user = db.query(User).filter(User.username == username).first()
        print(user)
        if not user or not bcrypt_context.verify(password ,user.password) :
            raise HTTPException(status_code=401 , detail="Invalid credentials")
        return create_access_token(user=user)

    except SQLAlchemyError as e :
        raise Exception(f"Error occured while logining you in : {str(e)}")
    


def create_access_token(user:User , expires_delta:int=20):
    encode = {"sub":user.username , "id":user.id,"role" :user.role}
    expires = datetime.now(timezone.utc)  +timedelta(minutes=expires_delta)
    encode.update({"exp":expires})
    return jwt.encode(claims=encode , key=SECRET_KEY ,algorithm=ALGORITHM)



async def get_current_user(token :str =Depends(oauth2_bearer) ):
    try:
        payload = jwt.decode(token=token,key=SECRET_KEY ,algorithms=ALGORITHM)
        username :str = payload.get("sub")
        userid:int = payload.get("id")
        if username is None or userid is None :
            raise HTTPException(status_code=401 , detail="Invalid credentials")
        return {"username":username , "id":userid}
    
    except JWTError  :
        raise HTTPException(status_code=401,detail="Invalid credentials")
    
async def check_current_user(token :str =Depends(oauth2_bearer) ):
    try:
        payload = jwt.decode(token=token,key=SECRET_KEY ,algorithms=ALGORITHM)
        username :str = payload.get("sub")
        userid:int = payload.get("id")
        if username is None or userid is None :
            raise HTTPException(status_code=401 , detail="Invalid credentials")
        return True
    
    except JWTError  :
        raise HTTPException(status_code=401,detail="Invalid credentials")    
    return False


async def check_admin(token:str=Depends(oauth2_bearer)):
    try:
        payload = jwt.decode(token=token,key=SECRET_KEY ,algorithms=ALGORITHM)
        role = payload.get("role")
        if role != Role.ADMIN :
            raise HTTPException(status_code=401 , detail="Not Allowed")
        return True
    
    except JWTError  :
        raise HTTPException(status_code=401,detail="Not Allowed")    
    


async def check_doctor(token:str=Depends(oauth2_bearer)):
    try:
        payload = jwt.decode(token=token,key=SECRET_KEY ,algorithms=ALGORITHM)
        role = payload.get("role")
        if role != Role.DOCTOR :
            raise HTTPException(status_code=401 , detail="Not Allowed")
        return True
    
    except JWTError  :
        raise HTTPException(status_code=401,detail="Not Allowed")    
    


async def check_patient(token:str=Depends(oauth2_bearer)):
    try:
        payload = jwt.decode(token=token,key=SECRET_KEY ,algorithms=ALGORITHM)
        role = payload.get("role")
        if role != Role.PATIENT :
            raise HTTPException(status_code=401 , detail="Not Allowed")
        return True
    
    except JWTError  :
        raise HTTPException(status_code=401,detail="Not Allowed")    
    


async def get_current_patient( token:str=Depends(oauth2_bearer)):
    try:
        payload = jwt.decode(token=token,key=SECRET_KEY ,algorithms=ALGORITHM)
        patientId:int = payload.get("id")
        return patientId     
    except JWTError  :
        raise HTTPException(status_code=401,detail="Invalid credentials")


async def get_current_patient(db:Session=Depends(get_db), token:str=Depends(oauth2_bearer)):
    try:
        payload = jwt.decode(token=token,key=SECRET_KEY ,algorithms=ALGORITHM)
        patient_id:int = payload.get("id")
        patient = db.query(Patient).filter(Patient.id == patient_id).first()
        
        if not patient:
            raise HTTPException(status_code=401, detail="Patient not found")
        
        
        return patient_id 
    except JWTError  :
        raise HTTPException(status_code=401,detail="Invalid credentials")
    


async def get_current_doctor(db:Session=Depends(get_db), token:str=Depends(oauth2_bearer)):
    try:
        payload = jwt.decode(token=token,key=SECRET_KEY ,algorithms=ALGORITHM)
        doctor_id:int = payload.get("id")
        doctor = db.query(Doctor).filter(Doctor.id == doctor_id).first()
        
        if not doctor:
            raise HTTPException(status_code=401, detail="Doctor not found")
        
        
        return doctor_id 
    except JWTError  :
        raise HTTPException(status_code=401,detail="Invalid credentials")
    




def is_doctor_for_patient(patient_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)) -> bool:
    if not user.is_doctor:
        raise HTTPException(status_code=403, detail="You must be a doctor to perform this action")
    
    doctor_patients = db.query(patient_doctor_association).filter(patient_doctor_association.c.doctor_id == user.id).all()
    if not any(doctor_patient.patient_id == patient_id for doctor_patient in doctor_patients):
        raise HTTPException(status_code=403, detail="Doctor does not have this patient in their list")
    
    return True

    