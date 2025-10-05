
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel

from routes.auth.utlis import get_current_user

from models.base import Message

from db.session import get_db

chatrouter = APIRouter(
    prefix="/api/chat",
    tags=["chat"]
)





class User(BaseModel):
    id: str
    username: str
    role: str

class MessageOut(BaseModel):
    id: int
    sender_id: str
    receiver_id: str
    text: str
    timestamp: datetime
    sender: User

    class Config:
        orm_mode = True

@chatrouter.get("/messages/{receiver_id}", response_model=List[MessageOut])
def fetch_msgs(receiver_id: str, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        print(user)
        msgs = db.query(Message).filter(
            ((Message.sender_id == user["id"]) & (Message.receiver_id == receiver_id)) |
            ((Message.sender_id == receiver_id) & (Message.receiver_id == user["id"]))
        ).order_by(Message.timestamp).all()
        return msgs
    except Exception as e:

        print(f"Error fetching messages: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch messages")


