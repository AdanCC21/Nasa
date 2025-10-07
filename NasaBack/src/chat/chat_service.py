from src.prediction.prediction_service import weather, get_weather_data
from entitys.models import *
import json
import pandas as pd
from src.chatgpt_querys import chatgpt_query

def simple_chat(prompt: str, location: dict = None, current_time: str = None, weather_data: dict = None):
    """
    Función que envía el prompt a ChatGPT con contexto de ubicación, tiempo y datos meteorológicos
    """
    try:
        # Construir contexto adicional
        context = ""
        if location:
            lat = location.get('lat')
            lon = location.get('lon')
            address = location.get('address', 'Unknown location')
            context += f"\nUser's current location: {address} (Latitude: {lat}, Longitude: {lon})"
        
        if current_time:
            context += f"\nCurrent date and time: {current_time}"
        
        # Añadir contexto meteorológico si está disponible
        weather_context = ""
        if weather_data:
            weather_context += "\n\nWEATHER DATA CONTEXT:"
            
            # Agregar summary del clima
            if 'data' in weather_data and 'summary' in weather_data['data']:
                summary = weather_data['data']['summary']
                weather_context += f"\nWeather Summary:"
                weather_context += f"\n- Temperature: {summary.get('temperatura', 'N/A')} K"
                weather_context += f"\n- Min Temperature: {summary.get('temperatura_min', 'N/A')} K"
                weather_context += f"\n- Max Temperature: {summary.get('temperatura_max', 'N/A')} K"
                weather_context += f"\n- Cloudiness: {summary.get('nubosidad', 'N/A')}"
                weather_context += f"\n- Precipitation: {summary.get('precipitacion', 'N/A')} mm"
                weather_context += f"\n- Humidity: {summary.get('humedad', 'N/A')} kg/kg"
                weather_context += f"\n- Solar Radiation: {summary.get('radiacion_solar', 'N/A')} W/m²"
                weather_context += f"\n- Wind Speed: {summary.get('velocidad_viento', 'N/A')} m/s"
            
            # Agregar recomendaciones previas
            if 'recomendations' in weather_data:
                recommendations = weather_data['recomendations']
                if isinstance(recommendations, list) and recommendations:
                    weather_context += f"\n\nPrevious Weather Recommendations:"
                    for i, rec in enumerate(recommendations, 1):
                        weather_context += f"\n{i}. {rec}"
        
        # Añadir contexto al prompt si existe
        enhanced_prompt = prompt
        if context or weather_context:
            enhanced_prompt = f"""Context information:  
Please provide a helpful response considering the user's location, current time, and weather data when relevant.
Write ALL text content in ENGLISH language only. The text should be friendly and engaging. The response should be tailored to the user's specific situation and needs.
CRITICAL: Base your recommendations on the ACTUAL weather data provided, not generic examples. Speak with a kind and friendly tone.

You have access to detailed weather information for the user's location. Use this data to provide accurate and contextual advice.

The format of the response should be: 
the response should be a single text block without sections or titles.

MANDATORY: Write ALL text content in ENGLISH language only. Use the provided weather data to give specific, actionable advice.
{context}{weather_context}

User's question: {prompt}
"""

        response = chatgpt_query(prompt=enhanced_prompt)
        return {
            "response": response,
            "status": "success"
        }
    except Exception as e:
        return {
            "response": f"Error: {str(e)}",
            "status": "error"
        }

def getStats(data):
    df = pd.DataFrame(data)
    valores = df.iloc[:, 1]
    
    return {
        'min': float(valores.min()),
        'max': float(valores.max()),
        'mean': float(valores.mean())
    }
    
def feedback(data,start_time,end_time,prompt):
    
    prompt = f"""
    Se desea hacer una predicción meteorológica de las siguientes variables:
    - Velocidad del viento
    - Precipitación
    - Humedad
    - Temperatura
    - Presión superficial
    - Radiación solar
    - Radiación infrarroja

    Las variables meteorológicas de cada uno se describen a continuación:

    Datos del día (con estadísticas): {data}

    Hora de inicio del período: {start_time}
    Hora de fin del período: {end_time}
    
    En base a tu predicción, regresa un texto de feedback sobre ese dia 
    basandote tambén en esta informacion que representa el plan de la
    persona para ese día: {prompt}
    
    Además también toma en estas variables para dar feedback, representa
    la prediccion del dia.
    'summary': {{
            "temperatura": <valor>,
            "temperatura_min": <valor>,
            "temperatura_max": <valor>,
            "nubosidad": <valor>,
            "precipitacion": <valor>,
            "humedad": <valor>,
            "radiacion_solar": <valor>,
            "velocidad_viento": <valor>,
            
    }}

    CRITICAL: Base your recommendations on the ACTUAL data analysis, not generic examples, also divide each recomendation clearly.

    MANDATORY: Write ALL text content in ENGLISH language only.
    """
    
    return chatgpt_query(prompt=prompt)
    
def clima_feedback(prompt: str, time: Time,location: Location):
    start_time = f'2024-{str(time.month).zfill(2)}-{str(time.day).zfill(2)}T00:00:00'
    end_time = f'2024-{str(time.month).zfill(2)}-{str(time.day).zfill(2)}T{time.start_time}:00'
    
    weather_data = get_weather_data(
                        location.lat,
                        location.lon,
                        start_time,
                        end_time
                        )
    
    simplified_data = {}

    for variable, details in weather_data.items():
        data_values = details['data']
        
        simplified_data[variable] = {
            'stats': getStats(data_values),
            'data': data_values.to_dict(orient='records')
        }
        
    res = feedback(simplified_data,time.start_time,time.end_time,prompt)
    
    return {
        "res" : res
    }