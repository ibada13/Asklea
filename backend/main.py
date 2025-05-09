from fastapi import FastAPI
from routes.route.routes import router
from routes.auth.auth import authroute
from routes.admin.route import adminrouter
app =FastAPI()
app.include_router(router=router)
app.include_router(router=adminrouter)
app.include_router(router=authroute)

@app.get("/")
async def root(name:str=None):
    return {"msg":f"it is working {name if name else ''}"}