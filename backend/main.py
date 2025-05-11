from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.route.routes import router
from routes.auth.auth import authroute
from routes.admin.route import adminrouter
from routes.doctor.api  import doctorrouter
from db.database import Base 

from models.base import DiagnosticList




app =FastAPI()
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
# Base.metadata.drop_all(bind=engine)
# Base.metadata.create_all(bind=engine)
# DiagnosticList.__table__.drop(engine)
@app.get("/")
async def root(name:str=None):
    return {"msg":f"it is working {name if name else ''}"}