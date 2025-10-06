from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from entitys.models import Location, Time
from .csv_service import generate_weather_csv
import os

csv_router = APIRouter()

@csv_router.post("/generate-csv/")
async def generate_csv_endpoint(
    location: Location,
    time_start: str,  # formato: "2024-06-01T03:00:00"
    time_end: str     # formato: "2024-07-30T21:00:00"
):
    """
    Genera un archivo CSV con datos meteorológicos para una ubicación y período específicos
    """
    try:
        # Generar CSV
        filename, dataframe = generate_weather_csv(
            lat=location.latitud,
            lon=location.longitud,
            time_start=time_start,
            time_end=time_end
        )
        
        return {
            "success": True,
            "message": f"CSV generado exitosamente: {filename}",
            "filename": filename,
            "records_count": len(dataframe),
            "columns": list(dataframe.columns),
            "data_preview": dataframe.head(5).to_dict('records')
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generando CSV: {str(e)}")

@csv_router.get("/download-csv/{filename}")
async def download_csv(filename: str):
    """
    Descarga un archivo CSV generado previamente
    """
    if not os.path.exists(filename):
        raise HTTPException(status_code=404, detail="Archivo CSV no encontrado")
    
    return FileResponse(
        path=filename,
        filename=filename,
        media_type="text/csv"
    )