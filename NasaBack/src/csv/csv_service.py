import netrc
import requests
from requests.auth import HTTPBasicAuth
import os
import io
import sys
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from entitys.models import WeatherData

from src.gcts import get_weather_data

def generate_weather_csv(lat: float, lon: float, weather_data: WeatherData):
    """
    Transforma un objeto WeatherData a un archivo CSV.
    Retorna el nombre del archivo y el *contenido CSV como una cadena*.
    """
    # Convertir el modelo WeatherData en un diccionario
    weather_data_dict = weather_data.model_dump()
    
    # Crear una lista para almacenar los DataFrames de cada variable
    data_frames = []
    timestamps = set() 
    
    for var_name, var_info in weather_data_dict.items():
        # Para cada variable meteorológica, crear un DataFrame
        df = pd.DataFrame(var_info.items(), columns=["Timestamp", var_name])
        timestamps.update(df["Timestamp"]) # Añadir los timestamps al conjunto de timestamps
        
        data_frames.append(df) # Añadir el DataFrame de la variable a la lista
    
    # Convertir el set de timestamps a lista y ordenar las fechas
    timestamps = sorted(list(timestamps))
    
    # Crear un DataFrame vacío con la columna 'Timestamp'
    consolidated_df = pd.DataFrame(timestamps, columns=["Timestamp"])
    
    # Unir los DataFrames de cada variable por la columna 'Timestamp'
    for df in data_frames:
        consolidated_df = pd.merge(consolidated_df, df, on="Timestamp", how="left")
    
    # Generar el nombre del archivo CSV
    filename = f'datos_meteorologicos_lat{lat}_lon{lon}.csv'
    
    # --- MODIFICACIÓN CLAVE: Guardar el DataFrame a un buffer en memoria (StringIO) ---
    csv_buffer = io.StringIO()
    consolidated_df.to_csv(csv_buffer, index=False)
    csv_content = csv_buffer.getvalue()
    
    # Retornar el nombre del archivo y el CONTENIDO CSV
    return filename, csv_content # <--- Retorna el contenido como string, NO el DataFrame
