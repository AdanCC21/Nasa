from fastapi import APIRouter, Depends, Request, UploadFile, File, Form
from entitys.models import *
from chat_service import clima_feedback
chat = APIRouter()

@chat.post("/chat/")
async def predictLocateTime(
    promt: str,
    time: Time,
    location: Location 
):
    return clima_feedback(promt, time, location)