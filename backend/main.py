from fastapi import FastAPI



app =FastAPI()


@app.get("/")
async def root(name:str=None):
    return {"msg":f"it is working {name if name else ''}"}