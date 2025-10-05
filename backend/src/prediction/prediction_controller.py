from fastapi import APIRouter, Depends, Request, UploadFile, File, Form
from entitys.models import *

prediction_router = APIRouter()

@prediction_router.post("/predict/")
async def predictLocateTime(
    time: Time,
    location: Location,
):
    return {
        "time": time,
        "location": location
    }