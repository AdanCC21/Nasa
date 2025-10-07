from src.chatgpt_querys import chatgpt_query
from entitys.models import *
from src.gcts import get_weather_data
import pandas as pd
import json

def getStats(data):
    df = pd.DataFrame(data)
    valores = df.iloc[:, 1]
    
    return {
        'min': float(valores.min()),
        'max': float(valores.max()),
        'mean': float(valores.mean())
    }

def weather(data, start_time, end_time, user_plan=""):
    plan_context = f"\n\nPlan del usuario: {user_plan}\nGenera recomendaciones específicas considerando este plan." if user_plan.strip() else ""
    
    prompt = f"""
    SÓLO Y EXCLUSIVAMENTE DEVUELVE UN OBJETO JSON VÁLIDO. NO INCLUYAS TEXTO INTRODUCTORIO, EXPLICACIONES, NI MARKDOWN DE CÓDIGO (```json).
    
    CRITICAL INSTRUCTION: ALL RECOMMENDATIONS MUST BE WRITTEN IN ENGLISH LANGUAGE ONLY.
    
    Eres un meteorólogo experto que analiza datos climáticos para generar predicciones y recomendaciones útiles para actividades al aire libre.
    
    Se desea hacer una predicción meteorológica de las siguientes variables:
    - Velocidad del viento
    - Precipitación
    - Humedad
    - Temperatura
    - Presión superficial
    - Radiación solar
    - Radiación infrarroja

    Datos meteorológicos históricos del día (con estadísticas): {data}

    Período de predicción: 
    - Hora de inicio: {start_time}
    - Hora de fin: {end_time}{plan_context}
    
    INSTRUCCIONES ESPECÍFICAS:
    
    1. Genera un JSON con predicciones por hora desde {start_time} hasta {end_time}
    2. Crea un resumen general (summary) con promedios y condiciones generales
    3. Usa presion_superficie, radiacion_infrarroja y radiacion_solar para determinar nubosidad
    4. GENERA RECOMENDACIONES PERSONALIZADAS Y ESPECÍFICAS basadas en:
       - Las condiciones climáticas predichas
       - El rango horario específico
       - Actividades típicas para ese período del día
       - Precauciones de seguridad si es necesario
       - Consejos de vestimenta y preparación
       - El plan específico del usuario si fue proporcionado
    
    Las recomendaciones deben ser:
    - Específicas y accionables
    - Relacionadas directamente con los datos meteorológicos
    - Útiles para planificar actividades
    - EN INGLÉS y con un tono amigable pero profesional
    - Entre 3-5 recomendaciones por respuesta
    - Personalizadas según el plan del usuario cuando sea relevante
    
    Ejemplo de estructura:
    {{
        "summary": {{
            "temperatura": <valor_kelvin>,
            "temperatura_min": <valor_kelvin>,
            "temperatura_max": <valor_kelvin>,
            "nubosidad": "<descripción_textual>",
            "precipitacion": <valor_mm>,
            "humedad": <valor_kg_kg>,
            "radiacion_solar": <valor_w_m2>,
            "velocidad_viento": <valor_m_s>
        }},
        "data": {{
            "velocidad_viento": [
                {{"time": "<hora>", "value": <valor>}},
                {{"time": "<hora>", "value": <valor>}}
            ],
            "precipitacion": [
                {{"time": "<hora>", "value": <valor>}},
                {{"time": "<hora>", "value": <valor>}}
            ],
            "humedad": [
                {{"time": "<hora>", "value": <valor>}},
                {{"time": "<hora>", "value": <valor>}}
            ],
            "temperatura": [
                {{"time": "<hora>", "value": <valor>}},
                {{"time": "<hora>", "value": <valor>}}
            ],
            "presion_superficie": [
                {{"time": "<hora>", "value": <valor>}},
                {{"time": "<hora>", "value": <valor>}}
            ],
            "radiacion_solar": [
                {{"time": "<hora>", "value": <valor>}},
                {{"time": "<hora>", "value": <valor>}}
            ],
            "radiacion_infrarroja": [
                {{"time": "<hora>", "value": <valor>}},
                {{"time": "<hora>", "value": <valor>}}
            ]
        }},
        "recomendations": [
            "Specific recommendation based on temperature and humidity conditions",
            "Clothing advice considering wind and precipitation levels", 
            "Activity suggestions appropriate for these weather conditions",
            "Solar radiation precaution if necessary for UV protection",
            "Hydration or protection recommendation based on conditions"
        ]
    }}
    
    IMPORTANTE: Cada variable en 'data' debe tener registros para cada hora desde {start_time} hasta {end_time}.
    CRITICAL: All recommendations MUST be written in ENGLISH language only.
    Las recomendaciones deben ser contextuales, específicas y útiles para el usuario.
    TOMA EN CUENTA QUE DATA DEBE TERNER POR CADA VARIABLE UN REGISTRO DE CADA HORA DESDE LA HORA INICIAL HASTA LA FINAL
    """
    
    return chatgpt_query(prompt=prompt)
    
"""
time_start - inicio del período en formato YYYY-MM-DDThh:mm:ss (UTC)
time_end - fin del período en formato YYYY-MM-DDThh:mm:ss (UTC)
"""
def predict(time: Time, location: Location, plan: str = ""):

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
        data_values_df = details['data']
        
        if data_values_df.empty:
            continue
            
        value_column_name = data_values_df.columns[-1]
        filtered_data = data_values_df[['time', value_column_name]].copy()
        
        simplified_data[variable] = {
            'stats': getStats(filtered_data),
            'data': filtered_data.to_dict(orient='records')
        }
        
    
    res = weather(simplified_data, time.start_time, time.end_time, plan)
    print("📤 Plan del usuario:", plan)
    print("🤖 Respuesta de ChatGPT:", res)
    
    # Intentar parsear el JSON y verificar recomendaciones
    try:
        parsed_response = json.loads(res)
        print("✅ JSON parseado exitosamente")
        print("📋 Recomendaciones encontradas:", parsed_response.get('recomendations', []))
        return parsed_response
    except json.JSONDecodeError as e:
        print("❌ Error al parsear JSON:", str(e))
        print("🔍 Respuesta cruda:", res)
        raise