from openai import OpenAI
from config import OPENAI_API_KEY

client = OpenAI(api_key=OPENAI_API_KEY)

def chatgpt_query(prompt, model="gpt-4o-mini"):
    models_to_try = [model, "gpt-3.5-turbo", "gpt-4o-mini", "gpt-4", "text-davinci-003"] 
    
    for current_model in models_to_try:
        try:
            print(f"Intentando con modelo: {current_model}")
            response = client.chat.completions.create(
                model=current_model,
                messages=[
                    {"role": "user", "content": prompt}
                ]
            )
            return response.choices[0].message.content.strip()
        except Exception as e:
            print(f"Error con modelo {current_model}: {str(e)}")
            continue
    
    return "Error: No se pudo acceder a ningún modelo de ChatGPT. Verifica tu API key y permisos."


"""
    Analiza los datos meteorológicos usando ChatGPT para obtener un resumen simple de valores medios
    
    Args:
        weather_data: Diccionario con los datos meteorológicos
        variable_units: Diccionario con las unidades de cada variable
        variable_descriptions: Diccionario con descripciones de cada variable
        lat: Latitud de la ubicación
        lon: Longitud de la ubicación
    
    Returns:
        String con el análisis de ChatGPT o None si hay error
"""
def analyze_weather_data_with_ai(weather_data, variable_units, variable_descriptions, lat, lon):
   
    print("\n" + "="*60)
    print("ANÁLISIS INTELIGENTE CON CHATGPT")
    print("="*60)
    
    # Calcular estadísticas básicas para cada variable
    stats_summary = {}
    
    for var_name, var_info in weather_data.items():
        df = var_info['data']
        data_column = df.columns[1]
        unit = variable_units.get(var_name, "unidad desconocida")
        description = variable_descriptions.get(var_name, "Sin descripción")
        
        stats = {
            'descripcion': description,
            'unidad': unit,
            'valor_medio': df[data_column].mean(),
            'valor_minimo': df[data_column].min(),
            'valor_maximo': df[data_column].max(),
            'total_registros': len(df),
            'registros_validos': df[data_column].count()
        }
        stats_summary[var_name] = stats
    
    # Preparar prompt para ChatGPT
    prompt = f"""
Analiza los siguientes datos meteorológicos obtenidos de la NASA Giovanni API para la ubicación:
Latitud: {lat}, Longitud: {lon}

Datos meteorológicos recopilados:

"""
    
    for var_name, stats in stats_summary.items():
        prompt += f"""
{var_name.replace('_', ' ').title()}:
- Descripción: {stats['descripcion']}
- Valor medio: {stats['valor_medio']:.4f} {stats['unidad']}
- Valor mínimo: {stats['valor_minimo']:.4f} {stats['unidad']}
- Valor máximo: {stats['valor_maximo']:.4f} {stats['unidad']}
- Total de registros: {stats['total_registros']}
"""
    
    prompt += """

Por favor, proporciona un análisis simple y claro que incluya:

1. Un resumen de los valores medios más importantes
2. Interpretación del clima general en esta ubicación
3. Observaciones relevantes sobre patrones meteorológicos
4. Recomendaciones o insights basados en estos datos

Mantén la respuesta concisa pero informativa, enfocándote en los aspectos más relevantes para entender el clima de esta región."""

    print("🤖 Enviando datos a ChatGPT para análisis...")
    
    try:
        # Llamar a ChatGPT
        analysis = chatgpt_query(prompt)
        
        print("✓ Análisis de ChatGPT recibido exitosamente\n")
        print("="*60)
        print("ANÁLISIS INTELIGENTE DE DATOS METEOROLÓGICOS")
        print("="*60)
        print(analysis)
        print("="*60)
        
        return analysis
        
    except Exception as e:
        print(f"✗ Error al obtener análisis de ChatGPT: {str(e)}")
        print("Continuando con el procesamiento normal...")
        return None

if __name__ == "__main__":
    user_input = input("Escribe tu consulta para ChatGPT: ")
    answer = chatgpt_query(user_input)
    print("Respuesta de ChatGPT:")
    print(answer)