from fastapi import APIRouter, HTTPException
# Cambiar FileResponse e importar StreamingResponse
from fastapi.responses import StreamingResponse 
from entitys.models import Location, WeatherData
from src.csv.csv_service import generate_weather_csv
import io # Solo necesario si se usa StringIO aquí, pero mejor si el servicio lo maneja
# Eliminar las importaciones de os y tempfile

csv_router = APIRouter()

@csv_router.post("/generate/")
async def generate_csv_endpoint(
    location: Location,
    data: WeatherData
):
    """
    Genera un archivo CSV con datos meteorológicos para una ubicación y período específicos
    y lo retorna directamente.
    """
    try:
        # Generar CSV usando la función. Recibe el nombre y el contenido CSV como string.
        filename, csv_content = generate_weather_csv(
            lat=location.lat,
            lon=location.lon,
            weather_data=data
        )
        
        # --- MODIFICACIÓN CLAVE: Usar StreamingResponse para retornar el contenido directamente ---
        # El contenido debe ser un iterable (como una lista con la cadena CSV)
        # Se añaden los headers de Content-Disposition para que el navegador lo descargue con el nombre correcto
        return StreamingResponse(
            iter([csv_content]),
            media_type="text/csv",
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )

    except Exception as e:
        # Si hay un error, devolvemos un mensaje de error
        # Se elimina el manejo de borrado de archivos temporales
        raise HTTPException(status_code=500, detail=f"Error generando CSV: {str(e)}")