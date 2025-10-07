import netrc
import requests
from requests.auth import HTTPBasicAuth
import os
import io
import sys
import pandas
import numpy as np
import matplotlib.pyplot as plt

from config import NASA_USERNAME,NASA_PASSWORD

# Setup the signin and time series URLs
signin_url = "https://api.giovanni.earthdata.nasa.gov/signin"
time_series_url = "https://api.giovanni.earthdata.nasa.gov/timeseries"

lat = 31.8578
lon = -116.6058
time_start = "2025-01-01T03:00:00"
time_end = "2025-09-30T21:00:00"

# Definir múltiples variables meteorológicas
weather_variables = {
    "velocidad_viento": "GLDAS_NOAH025_3H_2_1_Wind_f_inst",
    "precipitacion": "GLDAS_NOAH025_3H_2_1_Rainf_f_tavg", 
    "humedad": "GLDAS_NOAH025_3H_2_1_Qair_f_inst",
    "temperatura": "GLDAS_NOAH025_3H_2_1_Tair_f_inst",
    "precipitacion_nieve": "GLDAS_NOAH025_3H_2_1_Snowf_f_tavg",
    "presion_superficie": "GLDAS_NOAH025_3H_2_1_Psurf_f_inst",
    "radiacion_solar": "GLDAS_NOAH025_3H_2_1_SWdown_f_tavg",
    "radiacion_infrarroja": "GLDAS_NOAH025_3H_2_1_LWdown_f_tavg"
}

# Variables alternativas si las principales fallan
alternative_variables = {
    "temperatura": "GLDAS_NOAH025_3H_2_1_Tair_f_inst",
    "precipitacion": "GLDAS_NOAH025_3H_2_1_Rainf_f_tavg"
}

# Unidades para cada variable
variable_units = {
    "velocidad_viento": "m/s",
    "precipitacion": "kg/m²/s",
    "humedad": "kg/kg",
    "temperatura": "K",
    "precipitacion_nieve": "kg/m²/s",
    "presion_superficie": "Pa",
    "radiacion_solar": "W/m²",
    "radiacion_infrarroja": "W/m²"
}

# Descripción de las variables
variable_descriptions = {
    "velocidad_viento": "Velocidad del viento cerca de la superficie",
    "precipitacion": "Tasa de precipitación líquida",
    "humedad": "Humedad específica del aire",
    "temperatura": "Temperatura del aire cerca de la superficie",
    "precipitacion_nieve": "Tasa de precipitación de nieve",
    "presion_superficie": "Presión atmosférica en superficie",
    "radiacion_solar": "Radiación solar descendente (indica nubosidad)",
    "radiacion_infrarroja": "Radiación infrarroja descendente"
}

signin_resp = requests.get(signin_url, auth=HTTPBasicAuth(NASA_USERNAME, NASA_PASSWORD), allow_redirects=True)
if signin_resp.status_code != 200:
    print("Failed to obtain signin token.")
    print("Status:", signin_resp.status_code)
    print("Body:", repr(signin_resp.text))
    print("Check your credentials or account status (activation, tokens, etc.).")
    sys.exit(1)

# Clean the token and remove any surrounding quotes/newlines
token = signin_resp.text.replace('"', '').strip()

def call_time_series(lat,lon,time_start,time_end,data):
    """
    INPUTS:
    lat - latitude
    lon - longitude
    time_start - start of time series in YYYY-MM-DDThh:mm:ss format (UTC)
    end_time - end of the time series in YYYY-MM-DDThh:mm:ss format (UTC)
    data - name of the data parameter for the time series
    
    OUTPUT:
    time series csv output string
    """
    query_parameters = {
        "data":data,
        "location":"[{},{}]".format(lat,lon),
        "time":"{}/{}".format(time_start,time_end)
    }
    headers = {"authorizationtoken":token}
    response=requests.get(time_series_url,params=query_parameters,headers=headers)
    return response.text

def get_weather_data(lat, lon, time_start, time_end, weather_variables):
    """
    Obtiene datos de múltiples variables meteorológicas
    
    INPUTS:
    lat - latitud
    lon - longitud
    time_start - inicio del período en formato YYYY-MM-DDThh:mm:ss (UTC)
    time_end - fin del período en formato YYYY-MM-DDThh:mm:ss (UTC)
    weather_variables - diccionario con las variables a obtener
    
    OUTPUT:
    diccionario con los datos de cada variable
    """
    weather_data = {}
    errors = []
    
    print("Obteniendo datos meteorológicos...")
    for var_name, var_code in weather_variables.items():
        print(f"  - Descargando {var_name}...")
        try:
            ts = call_time_series(lat, lon, time_start, time_end, var_code)
   
            # Verificar si hay errores obvios en la respuesta
            if len(ts) < 50:
                errors.append(f"{var_name}: Respuesta muy corta - {ts}")
                continue
                
            headers, df = parse_csv(ts)
            weather_data[var_name] = {
                'headers': headers,
                'data': df
            }
            print(f"    ✓ {var_name} descargado exitosamente ({len(df)} registros)")
            
        except Exception as e:
            error_msg = f"{var_name}: {str(e)}"
            errors.append(error_msg)
            print(f"    ✗ Error en {var_name}: {str(e)}")
    
    if errors:
        print(f"\n⚠️  Se encontraron {len(errors)} errores:")
        for error in errors:
            print(f"    - {error}")
    
    if not weather_data:
        raise ValueError("No se pudo obtener ninguna variable meteorológica. Verifique las credenciales y la conectividad.")
    
    print(f"\n✓ Se obtuvieron exitosamente {len(weather_data)} de {len(weather_variables)} variables solicitadas")
    return weather_data

def analyze_weather_data(weather_data, variable_units, variable_descriptions):
    """
    Analiza y muestra estadísticas de todas las variables meteorológicas
    """
    print("=" * 60)
    print("ANÁLISIS DE VARIABLES METEOROLÓGICAS")
    print("=" * 60)
    
    for var_name, var_info in weather_data.items():
        df = var_info['data']
        headers = var_info['headers']
        data_column = df.columns[1]  # Segunda columna (primera es timestamp)
        unit = variable_units.get(var_name, "unidad desconocida")
        description = variable_descriptions.get(var_name, "Sin descripción")
        
        print(f"\n--- {var_name.upper().replace('_', ' ')} ---")
        print(f"Descripción: {description}")
        print(f"Variable: {headers.get('param_name', 'N/A')}")
        print(f"Unidad: {unit}")
        print(f"Valores totales: {len(df)}")
        print(f"Valores válidos: {df[data_column].count()}")
        print(f"Valor mínimo: {df[data_column].min():.4f} {unit}")
        print(f"Valor máximo: {df[data_column].max():.4f} {unit}")
        print(f"Valor promedio: {df[data_column].mean():.4f} {unit}")
        print(f"Desviación estándar: {df[data_column].std():.4f} {unit}")
        
        # Análisis especial para radiación solar (indicador de nubosidad)
        if var_name == "radiacion_solar":
            avg_radiation = df[data_column].mean()
            print(f"\n💡 ANÁLISIS DE NUBOSIDAD (basado en radiación solar):")
            if avg_radiation < 150:
                print(f"   - Condiciones MUY NUBLADAS (radiación promedio: {avg_radiation:.1f} W/m²)")
            elif avg_radiation < 250:
                print(f"   - Condiciones NUBLADAS (radiación promedio: {avg_radiation:.1f} W/m²)")
            elif avg_radiation < 350:
                print(f"   - Condiciones PARCIALMENTE NUBLADAS (radiación promedio: {avg_radiation:.1f} W/m²)")
            else:
                print(f"   - Condiciones DESPEJADAS (radiación promedio: {avg_radiation:.1f} W/m²)")
            
            # Calcular días soleados vs nublados
            sunny_threshold = df[data_column].quantile(0.75)  # 75% percentil
            cloudy_threshold = df[data_column].quantile(0.25)  # 25% percentil
            
            sunny_days = (df[data_column] > sunny_threshold).sum()
            cloudy_days = (df[data_column] < cloudy_threshold).sum()
            total_days = len(df)
            
            print(f"   - Días soleados (radiación alta): {sunny_days} ({sunny_days/total_days*100:.1f}%)")
            print(f"   - Días nublados (radiación baja): {cloudy_days} ({cloudy_days/total_days*100:.1f}%)")

def create_weather_plots(weather_data, variable_units, lat, lon):
    """
    Crea gráficos de todas las variables meteorológicas
    """
    num_vars = len(weather_data)
    fig, axes = plt.subplots(num_vars, 1, figsize=(15, 4*num_vars))
    
    if num_vars == 1:
        axes = [axes]
    
    for i, (var_name, var_info) in enumerate(weather_data.items()):
        df = var_info['data']
        data_column = df.columns[1]
        unit = variable_units.get(var_name, "unidad desconocida")
        
        axes[i].plot(df['Timestamp'], df[data_column], linewidth=0.8, color=plt.cm.tab10(i))
        axes[i].set_title(f'{var_name.replace("_", " ").title()} - Lat: {lat}, Lon: {lon}', fontsize=12)
        axes[i].set_ylabel(f'{var_name.replace("_", " ").title()} ({unit})', fontsize=10)
        axes[i].grid(True, alpha=0.3)
        axes[i].tick_params(axis='x', rotation=45)
    
    axes[-1].set_xlabel('Fecha', fontsize=12)
    plt.tight_layout()
    
    # Guardar el gráfico
    filename = f'datos_meteorologicos_lat{lat}_lon{lon}.png'
    plt.savefig(filename, dpi=300, bbox_inches='tight')
    print(f"\nGráficos guardados como '{filename}'")
    
    # Mostrar el gráfico
    plt.show()
    
    return filename

def save_consolidated_data(weather_data, lat, lon):
    """
    Guarda todos los datos en un archivo CSV consolidado
    """
    # Crear DataFrame consolidado
    consolidated_df = None
    
    for var_name, var_info in weather_data.items():
        df = var_info['data']
        data_column = df.columns[1]
        
        if consolidated_df is None:
            consolidated_df = df[['Timestamp']].copy()
        
        # Renombrar la columna de datos con el nombre de la variable
        consolidated_df[var_name] = df[data_column].values
    
    # Guardar archivo
    filename = f'datos_meteorologicos_consolidados_lat{lat}_lon{lon}.csv'
    consolidated_df.to_csv(filename, index=False)
    print(f"Datos consolidados guardados en '{filename}'")
    
    return filename, consolidated_df
    """
    INPUTS:
    lat - latitude
    lon - longitude
    time_start - start of time series in YYYY-MM-DDThh:mm:ss format (UTC)
    end_time - end of the time series in YYYY-MM-DDThh:mm:ss format (UTC)
    data - name of the data parameter for the time series
    
    OUTPUT:
    time series csv output string
    """
    query_parameters = {
        "data":data,
        "location":"[{},{}]".format(lat,lon),
        "time":"{}/{}".format(time_start,time_end)
    }
    headers = {"authorizationtoken":token}
    response=requests.get(time_series_url,params=query_parameters,headers=headers)
    return response.text


def parse_csv(ts):
    """
    INPUTS:
    ts - time series output of the time series service
    
    OUTPUTS:
    headers,df - the headers from the CSV as a dict and the values in a pandas dataframe
    """
    # Verificar si la respuesta contiene un error
    if "Error" in ts or "error" in ts or len(ts) < 100:
        raise ValueError(f"Error en la respuesta del servidor: {ts[:200]}...")
    
    with io.StringIO(ts) as f:
        # the first 13 rows are header
        headers = {}
        for i in range(13):
            line = f.readline().strip()
            if not line:
                raise ValueError(f"Línea vacía en el header en la fila {i}")
            
            # Manejar líneas que pueden no tener coma
            if "," in line:
                parts = line.split(",", 1)  # Split solo en la primera coma
                if len(parts) == 2:
                    key, value = parts
                    headers[key] = value.strip()
                else:
                    print(f"Advertencia: línea de header malformada: {line}")
            else:
                print(f"Advertencia: línea sin coma en header: {line}")

        # Verificar que tenemos el nombre del parámetro
        if "param_name" not in headers:
            raise ValueError("No se encontró 'param_name' en los headers")

        # Read the csv proper
        df = pandas.read_csv(
            f,
            header=1,
            names=("Timestamp", headers["param_name"]),
            converters={"Timestamp": pandas.Timestamp}
        )

    return headers, df

# Primero intentar con una variable simple para verificar conectividad
print("🔍 Verificando conectividad con una variable de prueba...")
try:
    test_var = "GLDAS_NOAH025_3H_2_1_Tair_f_inst"  # Temperatura es generalmente más estable
    test_time_start = "2020-01-01T03:00:00"
    test_time_end = "2020-01-02T03:00:00"  # Solo un día para prueba rápida
    
    test_ts = call_time_series(lat, lon, test_time_start, test_time_end, test_var)
    test_headers, test_df = parse_csv(test_ts)
    print(f"✓ Prueba exitosa. Variable de prueba retornó {len(test_df)} registros")
    
except Exception as e:
    print(f"✗ Error en prueba de conectividad: {e}")
    print("⚠️  Continuando con el procesamiento principal...")

print(f"\n{'='*60}")
print("INICIANDO DESCARGA DE DATOS METEOROLÓGICOS PRINCIPALES")
print(f"{'='*60}")

# Obtener datos de todas las variables meteorológicas
weather_data = get_weather_data(lat, lon, time_start, time_end, weather_variables)

# Analizar los datos
analyze_weather_data(weather_data, variable_units, variable_descriptions)

# Crear visualizaciones
plot_filename = create_weather_plots(weather_data, variable_units, lat, lon)

# Guardar datos consolidados
csv_filename, consolidated_df = save_consolidated_data(weather_data, lat, lon)

print(f"\n{'='*60}")
print("RESUMEN DE ARCHIVOS GENERADOS")
print(f"{'='*60}")
print(f"📊 Gráficos: {plot_filename}")
print(f"📋 Datos CSV: {csv_filename}")
print(f"📈 Total de registros: {len(consolidated_df)}")
print(f"📅 Período: {time_start} a {time_end}")
print(f"🌍 Ubicación: Lat {lat}, Lon {lon}")

print(f"\n{'='*60}")
print("PRIMERAS 5 FILAS DE DATOS CONSOLIDADOS")
print(f"{'='*60}")
print(consolidated_df.head())