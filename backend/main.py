from fastapi import FastAPI ,Depends
from fastapi.staticfiles import StaticFiles
from sqlalchemy import MetaData
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware

from routes.route.routes import router
from routes.auth.auth import authroute
from routes.admin.route import adminrouter
from routes.doctor.api  import doctorrouter
from routes.patient.api import patientrouter
from routes.chat.api import chatrouter

from db.database import Base 
from db.session import engine , get_db
from models.base import Message ,DiagnosticList
from models.models import Admin 

from secruity import bcrypt_context


app =FastAPI()

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(router=router)
app.include_router(router=adminrouter)
app.include_router(router=authroute)
app.include_router(router=doctorrouter)
app.include_router(router=patientrouter)
app.include_router(router=chatrouter)
# Base.metadata.drop_all(bind=engine)
# Base.metadata.create_all(bind=engine)


# meta = MetaData()
# meta.reflect(bind=engine)
# table = meta.tables["diagnosis_history"]
# table.drop(bind=engine)



# DiagnosticList.__table__.drop(engine)
@app.get("/")
async def root(name:str=None , db:Session =Depends(get_db)):
    dg = db.query(DiagnosticList).filter(DiagnosticList.id == 2 ).first()
    db.delete(dg)
    db.commit()
    # admin = Admin(
    #     email = "admin@admin.com",
    #     password =  bcrypt_context.hash("admin"),
    #     username="admin"
    # )
    # db.add(admin)
    # db.commit()
    # db.refresh(admin)
    return {"msg":f"it is working {name if name else ''}"}



@app.get("/test")
def del_(db:Session=Depends(get_db)):
    db.query(Message).delete()
    db.commit()
    return True
    pass