from pydantic import BaseModel, Field
from typing import Literal
import re

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
    latitud: float
    longitud: float