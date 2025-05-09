from fastapi import APIRouter ,Depends ,HTTPException
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordBearer ,OAuth2PasswordRequestForm

from sqlalchemy.orm import Session 
from db.session import get_db
from schemas.authschema import UserCreate ,Token
from .utlis import check_admin,check_current_user,create_user_handler ,auth_user ,get_current_user
authroute = APIRouter(
    prefix="/api/auth",
    tags=["auth"]
)


@authroute.get("/" , status_code=200)
async def user(user:dict =Depends(get_current_user) ):
    if user is None:
        raise  HTTPException(status_code=401 , detail="Authenticstion Failed")
    return {"user":user}

@authroute.get("/check" , status_code=200 )
async def user(response:bool =Depends(check_current_user) ):
    if not response:
        raise  HTTPException(status_code=401 , detail="Authenticstion Failed")
    return {"authenticated":True}

@authroute.post("/register" ,status_code=201 )
async def create_user(create_user_request:UserCreate,db:Session = Depends(get_db) ,is_admin:bool =Depends(check_admin) ):
    try:
        create_user_handler(create_user_request=create_user_request ,db=db)
        return {
            "message":"User was created sucessfully"
        }
    except HTTPException :
        raise
    except Exception as e :
        raise HTTPException(status_code=500 ,detail=f"Error occured {str(e)}")



@authroute.post("/token",response_model=Token)
async def login_by_token(form_data:OAuth2PasswordRequestForm=Depends() , db:Session =Depends(get_db)):
    try:
        token = auth_user(form_data.username , form_data.password , db)
        return {"access_token":token,
                "token_type":"bearer"
                }    
    except HTTPException :
        raise
    except Exception as e :
        raise HTTPException(status_code=500 , detail=f"Error occured {str(e)}")