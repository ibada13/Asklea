from fastapi import APIRouter ,Depends ,HTTPException
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordBearer ,OAuth2PasswordRequestForm , oauth2

from pydantic import BaseModel
from sqlalchemy.orm import Session 
from db.session import get_db
from schemas.authschema import UserCreate ,Token
from .utlis import check_admin,check_current_user,create_admin_handler ,auth_user ,get_current_user , refresh_token


from secruity import oauth2_bearer 
authroute = APIRouter(
    prefix="/api/auth",
    tags=["auth"]
)

class SimpleUser(BaseModel):
    username:str 
    id:str 
    role :str

@authroute.get("/" , status_code=200)
async def user(user:SimpleUser =Depends(get_current_user) ):
    if user is None:
        raise  HTTPException(status_code=401 , detail="Authenticstion Failed")
    return user

@authroute.get("/check" , status_code=200 )
async def user(response:bool =Depends(check_current_user) ):
    if not response:
        raise  HTTPException(status_code=401 , detail="Authenticstion Failed")
    return {"authenticated":True}

@authroute.post("/register" ,status_code=201 )
async def create_admin(create_user_request:UserCreate,db:Session = Depends(get_db) ):
    try:
        create_admin_handler(create_user_request=create_user_request ,db=db)
        return {
            "message":"User was created sucessfully"
        }
    except HTTPException :
        raise
    except Exception as e :
        raise HTTPException(status_code=500 ,detail=f"Error occured {str(e)}")



@authroute.post("/token",response_model=Token)
async def login(form_data:OAuth2PasswordRequestForm=Depends() , db:Session =Depends(get_db)):
    try:
        token , role= auth_user(form_data.username , form_data.password , db)
        print(role , token )
        return {"access_token":token,
                "token_type":"bearer",
                "role":role ,
                }    
    except HTTPException :
        raise
    except Exception as e :
        raise HTTPException(status_code=500 , detail=f"Error occured {str(e)}")


@authroute.post("/refresh")
async def refresh_access_token(token :str =Depends(oauth2_bearer)  , db:Session=Depends(get_db )):
    return await refresh_token(token=token , db=db)