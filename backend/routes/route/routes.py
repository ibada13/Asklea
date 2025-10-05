import json
from fastapi import APIRouter, Body, Depends, HTTPException, WebSocket, WebSocketDisconnect, Query
from pydantic import BaseModel
from sqlalchemy import and_
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from db.session import get_db
from models.base import MessageReportes ,Message
from models.models import Doctor, Patient      
from routes.auth.utlis import check_admin, get_current_patient, get_user_if_can_message  ,get_current_user_with_token
from typing import List, Dict
from schemas.request import PatientUpdate, DiagnosisHistoryCreate, DiagnosticListCreate
from schemas.response import PatientOut
from schemas.authschema import PatientCreate, DoctorCreate
from routes.auth.utlis import is_doctor_for_patient
from  secruity import oauth2_bearer
router = APIRouter(
    prefix="/api",
    tags=["routes"]
)

clients: Dict[int, WebSocket] = {}

@router.get("/patients")
def get_all_patients(db: Session = Depends(get_db)):
    return db.query(Patient).all()

@router.get("/doctors")
def get_all_patients(db: Session = Depends(get_db)):
    return db.query(Doctor).all()


@router.websocket("/ws/chat/{receiver_id}")
async def websocket_chat_endpoint(
    websocket: WebSocket,
    receiver_id: str,
    token: str = Query(...),
    db: Session = Depends(get_db),
):
    sender, error = await get_user_if_can_message(token=token, db=db)

    if error:
        print(error)
        await websocket.accept()
        await websocket.send_text(json.dumps({"error": error}))
        await websocket.close(code=4003)
        return

    await websocket.accept()
    clients[sender.id] = websocket

    try:
        while True:
            message_data = await websocket.receive_text()

            message = Message(
                sender_id=sender.id,
                receiver_id=receiver_id,
                text=message_data,
            )
            db.add(message)
            db.commit()
            message_json = json.dumps({
                "id": message.id,
                "sender_id": message.sender_id,
                "receiver_id": message.receiver_id,
                "text": message.text,
                "timestamp": message.timestamp.isoformat(),
            })

            if receiver_id in clients:
                await clients[receiver_id].send_text(message_json)

            await websocket.send_text(message_json)

    except WebSocketDisconnect:
        clients.pop(sender.id, None)

@router.post("/chat/report/{sender_id}")
async def chat_report(
    sender_id: str,
    text: str = Body(...),
    token: str = Depends(oauth2_bearer),
    db: Session = Depends(get_db)
):
    reporter = await get_current_user_with_token(token=token, db=db)
    if not reporter:
        raise HTTPException(status_code=401, detail="unauthorized")

    msg = db.query(Message).filter(
        and_(
            Message.text == text,
            Message.sender_id == sender_id,
            Message.receiver_id == reporter.id
        )
    ).first()

    if not msg:
        raise HTTPException(status_code=404, detail="msg was not found")

    try:
        msgreport = MessageReportes(
            sender_id=sender_id,
            reporter_id=reporter.id,
            text=msg.text,
        )
        db.add(msgreport)
        db.commit()
        db.refresh(msgreport)
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"error occurred: {e}")

    return {"detail": "Report submitted successfully"}