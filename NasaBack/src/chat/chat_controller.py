from fastapi import APIRouter, Depends, Request, UploadFile, File, Form
from entitys.models import *
from src.chat.chat_service import clima_feedback, simple_chat
from pydantic import BaseModel
from typing import Optional

chat_router = APIRouter()

class SimpleChatRequest(BaseModel):
    prompt: str
    location: Optional[dict] = None  # {"lat": float, "lon": float, "address": str}
    current_time: Optional[str] = None  # ISO string o formato legible
    weather_data: Optional[dict] = None  # Datos meteorológicos completos del prediction service

@chat_router.post("/weather/")
async def predictLocateTime(
    chatRequest: ChatRequest
):
    return clima_feedback(chatRequest.prompt, chatRequest.time, chatRequest.location)

@chat_router.post("/simple/")
async def simple_chat_endpoint(
    chatRequest: SimpleChatRequest
):
    return simple_chat(chatRequest.prompt, chatRequest.location, chatRequest.current_time, chatRequest.weather_data)