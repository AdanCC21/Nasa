from pydantic import BaseModel, Field
from typing import Literal
import re
from typing import Dict

"""
Timestamp / fecha:hora
velocidad_viento
precipitacion
humedad
temperatura
nubosidad {
    presion_superficie
    radiacion_solar
    radiacion_infrarroja
}
radiacion_solar
"""

class Time(BaseModel):
    day: int = Field(..., ge=1, le=31)
    month: int = Field(..., ge=1, le=12)
    start_time: str = Field(..., pattern=r"^(?:[01]\d|2[0-3]):[0-5]\d$")
    end_time: str = Field(..., pattern=r"^(?:[01]\d|2[0-3]):[0-5]\d$")

class Location(BaseModel):
    lat: float
    lon: float
    
class WeatherData(BaseModel):
    velocidad_viento: Dict[str, float]
    precipitacion: Dict[str, float]
    humedad: Dict[str, float]
    temperatura: Dict[str, float]
    presion_superficie: Dict[str, float]
    radiacion_solar: Dict[str, float]
    radiacion_infrarroja: Dict[str, float]
    
class ChatRequest(BaseModel):
    prompt: str
    time: Time
    location: Location

class WeatherPredictionRequest(BaseModel):
    time: Time
    location: Location
    plan: str = ""  # Plan del usuario para generar recomendaciones personalizadas
