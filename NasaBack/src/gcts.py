import earthaccess
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import xarray as xr
from datetime import datetime, timedelta
import warnings
import os
# CLAVE: Cambiar threading por multiprocessing
from concurrent.futures import ProcessPoolExecutor, as_completed 
import sys # Necesario para redireccionar stdout si es necesario para print()


warnings.filterwarnings('ignore')

from config import NASA_USERNAME, NASA_PASSWORD

# Configuración de ubicación y tiempo
lat = 31.8578
lon = -116.6058
start_date = "2024-04-10T00:00:00" 
end_date = "2024-04-10T15:30:00"  # Solo enero de 2024 para prueba

# Variables meteorológicas simplificadas (Sin cambios)
WEATHER_DATASETS = {
    "velocidad_viento": {
        "collection": "GLDAS_NOAH025_3H",
        "variable": "Wind_f_inst",  # Código interno: GLDAS_NOAH025_3H_2_1_Wind_f_inst
        "description": "Velocidad del viento cerca de la superficie",
        "units": "m/s",
        "full_code": "GLDAS_NOAH025_3H_2_1_Wind_f_inst"
    },
    "precipitacion": {
        "collection": "GLDAS_NOAH025_3H",
        "variable": "Rainf_f_tavg",  # Código interno: GLDAS_NOAH025_3H_2_1_Rainf_f_tavg
        "description": "Tasa de precipitación líquida",
        "units": "kg/m²/s",
        "full_code": "GLDAS_NOAH025_3H_2_1_Rainf_f_tavg"
    },
    "humedad": {
        "collection": "GLDAS_NOAH025_3H",
        "variable": "Qair_f_inst",  # Código interno: GLDAS_NOAH025_3H_2_1_Qair_f_inst
        "description": "Humedad específica del aire",
        "units": "kg/kg",
        "full_code": "GLDAS_NOAH025_3H_2_1_Qair_f_inst"
    },
    "temperatura": {
        "collection": "GLDAS_NOAH025_3H",
        "variable": "Tair_f_inst",  # Código interno: GLDAS_NOAH025_3H_2_1_Tair_f_inst
        "description": "Temperatura del aire cerca de la superficie",
        "units": "K",
        "full_code": "GLDAS_NOAH025_3H_2_1_Tair_f_inst"
    },
    "precipitacion_nieve": {
        "collection": "GLDAS_NOAH025_3H",
        "variable": "Snowf_tavg",  # Código interno: GLDAS_NOAH025_3H_2_1_Snowf_tavg (sin f)
        "description": "Tasa de precipitación de nieve",
        "units": "kg/m²/s",
        "full_code": "GLDAS_NOAH025_3H_2_1_Snowf_tavg"
    },
    "presion_superficie": {
        "collection": "GLDAS_NOAH025_3H",
        "variable": "Psurf_f_inst",  # Código interno: GLDAS_NOAH025_3H_2_1_Psurf_f_inst
        "description": "Presión atmosférica en superficie",
        "units": "Pa",
        "full_code": "GLDAS_NOAH025_3H_2_1_Psurf_f_inst"
    },
    "radiacion_solar": {
        "collection": "GLDAS_NOAH025_3H",
        "variable": "SWdown_f_tavg",  # Código interno: GLDAS_NOAH025_3H_2_1_SWdown_f_tavg
        "description": "Radiación solar descendente (indica nubosidad)",
        "units": "W/m²",
        "full_code": "GLDAS_NOAH025_3H_2_1_SWdown_f_tavg"
    },
    "radiacion_infrarroja": {
        "collection": "GLDAS_NOAH025_3H",
        "variable": "LWdown_f_tavg",  # Código interno: GLDAS_NOAH025_3H_2_1_LWdown_f_tavg
        "description": "Radiación infrarroja descendente",
        "units": "W/m²",
        "full_code": "GLDAS_NOAH025_3H_2_1_LWdown_f_tavg"
    }
}

def authenticate_earthdata():
    """
    Autenticación con earthaccess usando la estrategia 'environment' 
    y las credenciales cargadas de .env.

    CLAVE: Esta función ahora se llamará dentro de cada PROCESO, 
    asegurando una sesión limpia e independiente.
    """

    if not NASA_USERNAME or not NASA_PASSWORD:
        raise Exception("❌ Error: NASA_USERNAME o NASA_PASSWORD no se cargaron correctamente desde .env/config.")
    

    os.environ['EARTHDATA_USERNAME'] = NASA_USERNAME
    os.environ['EARTHDATA_PASSWORD'] = NASA_PASSWORD

    try:
        auth = earthaccess.login(
            strategy="environment", 
            persist=True 
        )
        
    except earthaccess.errors.LoginAttemptFailure:
        raise Exception("❌ Error en la autenticación. Las credenciales de Earthdata son incorrectas.")
    except Exception as e:
        raise Exception(f"❌ Error desconocido durante la autenticación: {str(e)}")
        
    if auth.authenticated:
        # print("✅ Autenticación exitosa en el proceso actual!")
        return auth
    else:
        raise Exception("❌ Error en la autenticación. No se pudo iniciar sesión.")


def search_and_open_data(collection_name, start_date, end_date, lat, lon, max_files=2):
    """
    Busca y abre datos como datasets de xarray.
    """
    try:
       
        authenticate_earthdata()

        print(f"[{collection_name}] 🔍 Buscando datos...")
        
        # Buscar archivos
        results = earthaccess.search_data(
            short_name=collection_name,
            temporal=(start_date, end_date),
            bounding_box=(lon-5.0, lat-5.0, lon+5.0, lat+5.0)
        )
        
        if not results:
            print(f"[{collection_name}] ⚠️  No se encontraron datos")
            return None
            
        print(f"[{collection_name}] 📦 Encontrados {len(results)} archivos")
        
        # Limitar archivos para evitar problemas de memoria
        limited_results = results[:max_files]
        print(f"[{collection_name}] 📥 Procesando {len(limited_results)} archivos")
        
        # CLAVE: earthaccess.open debe ejecutarse dentro de cada proceso
        files = earthaccess.open(limited_results)
        
        if not files:
            print(f"[{collection_name}] ⚠️  No se pudieron abrir los archivos")
            return None
        
        # SOLUCION: Convertir HTTPFiles a datasets de xarray
        datasets = []
        for i, file in enumerate(files):
            try:
                ds = xr.open_dataset(file)
                datasets.append(ds)
            except Exception as e:
                print(f"[{collection_name}] ❌ Error convirtiendo archivo {i+1}: {str(e)}")
                continue
        
        if datasets:
            print(f"[{collection_name}] ✅ {len(datasets)} datasets cargados como xarray exitosamente")
            return datasets
        else:
            print(f"[{collection_name}] ❌ No se pudieron convertir archivos a datasets")
            return None
        
    except Exception as e:
        # Redirigir el error más claro para el diagnóstico
        print(f"[{collection_name}] ❌ Error general procesando: {type(e).__name__}: {str(e)}")
        return None



def extract_point_data_fixed(datasets, variable_name, lat, lon):
    """
    Extrae datos para un punto específico - Función sin cambios
    """
    var_name_tag = variable_name.split('_')[0] 
    try:
        print(f"[{var_name_tag}] 🔧 Extrayendo variable '{variable_name}'")
        
        all_data = []
        
        for i, ds in enumerate(datasets):
            try:
                if not isinstance(ds, xr.Dataset):
                    print(f"[{var_name_tag}] ❌ Dataset {i+1} no es xarray.Dataset válido")
                    continue
                
                if variable_name not in ds.data_vars:
                    print(f"[{var_name_tag}] ⚠️  Variable '{variable_name}' no encontrada")
                    continue
                
                lat_coords = [c for c in ds.coords if 'lat' in c.lower()]
                lon_coords = [c for c in ds.coords if 'lon' in c.lower()]
                
                if not lat_coords or not lon_coords:
                    print(f"[{var_name_tag}] ⚠️  Coordenadas lat/lon no encontradas")
                    continue
                
                lat_coord = lat_coords[0]
                lon_coord = lon_coords[0]
                
                try:
                    point_data = ds.sel({lat_coord: lat, lon_coord: lon}, method='nearest')
                    
                    if variable_name in point_data:
                        var_data = point_data[variable_name]
                        
                        df = var_data.to_dataframe().reset_index()
                        
                        if not df.empty and variable_name in df.columns:
                            valid_data = df[df[variable_name].notna()]
                            if not valid_data.empty:
                                all_data.append(valid_data)
                        
                except Exception as e:
                    print(f"[{var_name_tag}] ❌ Error seleccionando punto: {str(e)}")
                    continue
                    
            except Exception as e:
                print(f"[{var_name_tag}] ❌ Error en dataset {i+1}: {str(e)}")
                continue
        
        if all_data:
            combined_df = pd.concat(all_data, ignore_index=True)
            time_cols = [col for col in combined_df.columns if 'time' in col.lower()]
            if time_cols:
                combined_df = combined_df.sort_values(time_cols[0]).reset_index(drop=True)
            
            print(f"[{var_name_tag}] ✅ Datos combinados: {len(combined_df)} registros totales")
            return combined_df
        else:
            print(f"[{var_name_tag}] ❌ No se extrajeron datos válidos")
            return None
            
    except Exception as e:
        print(f"[{var_name_tag}] ❌ Error extrayendo datos: {str(e)}")
        return None

# --- IMPLEMENTACIÓN DE PROCESOS ---

def _process_get_data(var_name, config, lat, lon, start_date, end_date):
    """
    Función auxiliar para ser ejecutada por cada PROCESO.
    Retorna (var_name, data_dict) o (var_name, None).
    """
    try:
        # Nota: La autenticación se realiza dentro de search_and_open_data 
        # para asegurar que cada proceso hijo tiene su propia sesión.
        
        print(f"\n📊 [PROCESS: {var_name}] Procesando: {var_name}")
        
        # 1. Buscar y abrir datos
        datasets = search_and_open_data(
            config['collection'], 
            start_date, 
            end_date, 
            lat, 
            lon,
            max_files=2
        )
        
        if datasets:
            # 2. Extraer datos del punto
            point_data = extract_point_data_fixed(datasets, config['variable'], lat, lon)
            
            if point_data is not None and not point_data.empty:
                result_data = {
                    'data': point_data,
                    'variable': config['variable'],
                    'description': config['description'],
                    'units': config['units'],
                    'collection': config['collection']
                }
                print(f"🎉 [PROCESS: {var_name}] EXITOSO: {len(point_data)} registros")
                return var_name, result_data
            else:
                print(f"❌ [PROCESS: {var_name}] No se extrajeron datos para {var_name}")
                return var_name, None
        else:
            print(f"❌ [PROCESS: {var_name}] No se abrieron datasets para {var_name}")
            return var_name, None
            
    except Exception as e:
        print(f"❌ [PROCESS: {var_name}] Error procesando: {str(e)}")
        return var_name, None

def get_weather_data(lat, lon, start_date, end_date):
    """
    Función principal para obtener datos meteorológicos, optimizada con PROCESOS.
    """
    weather_data = {}
    
    print(f"\n🌍 Obteniendo datos meteorológicos (CON PROCESOS):")
    print(f"   📍 Ubicación: Lat {lat}, Lon {lon}")
    print(f"   📅 Período: {start_date} a {end_date}")
    print("-" * 50)
    
    MAX_PROCESSES = len(WEATHER_DATASETS)
    
    # CLAVE: Usar ProcessPoolExecutor en lugar de ThreadPoolExecutor
    with ProcessPoolExecutor(max_workers=MAX_PROCESSES) as executor:
        
        future_to_var = {
            executor.submit(_process_get_data, var_name, config, lat, lon, start_date, end_date): var_name
            for var_name, config in WEATHER_DATASETS.items()
        }
        
        # Recolectar resultados a medida que los procesos terminan
        for future in as_completed(future_to_var):
            var_name = future_to_var[future]
            try:
                # El resultado es una tupla: (var_name, result_data)
                _, result_data = future.result() 
                if result_data:
                    # Almacenar el resultado en el diccionario principal
                    weather_data[var_name] = result_data
            except Exception as e:
                print(f"❌ [MAIN] El proceso de {var_name} generó una excepción: {e}")


    print("\n" + "="*50)
    print("✅ Todos los procesos finalizados. Recolección de datos terminada.")
    print("="*50)
    return weather_data
