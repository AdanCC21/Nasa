from fastapi import APIRouter, Depends, Request, UploadFile, File, Form
from entitys.models import *
from src.prediction.prediction_service import predict

prediction_router = APIRouter()

@prediction_router.post("/weather")
@prediction_router.post("/weather/")  # Manejar ambas versiones
async def predictWeather(request: WeatherPredictionRequest):
    return predict(request.time, request.location, request.plan)

