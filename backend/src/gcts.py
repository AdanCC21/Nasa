import netrc
import requests
from requests.auth import HTTPBasicAuth
import os
import io
import sys
import pandas
import numpy as np
import matplotlib.pyplot as plt

from src.csv.csv_service import parse_csv

# Setup the signin and time series URLs
signin_url = "https://api.giovanni.earthdata.nasa.gov/signin"
time_series_url = "https://api.giovanni.earthdata.nasa.gov/timeseries"

# Definir múltiples variables meteorológicas
weather_variables = {
    "velocidad_viento": "GLDAS_NOAH025_3H_2_1_Wind_f_inst",
    "precipitacion": "GLDAS_NOAH025_3H_2_1_Rainf_f_tavg", 
    "humedad": "GLDAS_NOAH025_3H_2_1_Qair_f_inst",
    "temperatura": "GLDAS_NOAH025_3H_2_1_Tair_f_inst",
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

def get_credentials():
    """Try to obtain credentials from ~/.netrc, then from environment variables.

    Returns (username, password) or exits with an explanatory message.
    """
    # First try .netrc
    try:
        hosts = netrc.netrc().hosts
        entry = hosts.get('urs.earthdata.nasa.gov')
        if entry and len(entry) >= 3 and entry[0] and entry[2]:
            return entry[0], entry[2]
    except FileNotFoundError:
        pass
    except netrc.NetrcParseError:

        netrc_path = os.path.expanduser('~/.netrc')
        try:
            with open(netrc_path, 'r', encoding='utf-8-sig') as f:
                content = f.read()
            with open(netrc_path, 'w', encoding='utf-8') as f:
                f.write(content)
            hosts = netrc.netrc().hosts
            entry = hosts.get('urs.earthdata.nasa.gov')
            if entry and len(entry) >= 3 and entry[0] and entry[2]:
                return entry[0], entry[2]
        except Exception:
            pass

    # Try environment variables (common names)
    username = os.environ.get('NASA_USERNAME') or os.environ.get('URS_USERNAME') or os.environ.get('EARTHDATA_USERNAME')
    password = os.environ.get('NASA_PASSWORD') or os.environ.get('URS_PASSWORD') or os.environ.get('EARTHDATA_PASSWORD')
    if username and password:
        return username, password

    sys.exit(
        "Error: No .netrc file found at your home directory and no NASA/Earthdata credentials set in environment variables.\n"
        "Create a file at C:\\Users\\<you>\\.netrc containing: \n"
        "    machine urs.earthdata.nasa.gov login YOUR_USERNAME password YOUR_PASSWORD\n"
        "or set the environment variables NASA_USERNAME and NASA_PASSWORD before running this script."
    )

user, pwd = get_credentials()
signin_resp = requests.get(signin_url, auth=HTTPBasicAuth(user, pwd), allow_redirects=True)
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


"""
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

"""
