import netrc
import requests
from requests.auth import HTTPBasicAuth
import os
import io
import sys
import pandas
import numpy as np
import matplotlib.pyplot as plt

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
