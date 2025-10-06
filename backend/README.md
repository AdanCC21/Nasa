# Proyecto NasaBack — Instrucciones de ejecución

Este repositorio contiene el script `gcts.py` que descarga series temporales meteorológicas desde el servicio Giovanni/Earthdata, genera análisis y guarda un CSV y un PNG con los resultados.

Este README explica cómo preparar el entorno virtual, instalar dependencias, configurar credenciales y ejecutar el script en Windows (PowerShell).

## Requisitos

- Python 3.10+ instalado en el sistema (el proyecto se probó en el intérprete que crea `.venv`).
- Conectividad a Internet para descargar datos y paquetes.

## Preparar y activar el entorno virtual (PowerShell)

Ejecuta estos comandos en la carpeta del proyecto (`C:\Users\User\Desktop\hello\NasaBack`):

```powershell
# Crear el virtual environment (solo si no existe)
python -m venv .venv

# Permitir la ejecución del script de activación para esta sesión y activar el venv
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force
. .\.venv\Scripts\Activate.ps1

# Actualizar pip y instalar dependencias
python -m pip install --upgrade pip
pip install -r .\requirements.txt
```

Notas:
- Si usas `cmd.exe` en lugar de PowerShell, activa con:

```cmd
.venv\Scripts\activate.bat
```

## Configurar credenciales de Earthdata (obligatorio)

El script requiere credenciales válidas de Earthdata (NASA/URS). Puedes proporcionarlas de dos maneras:

1) Archivo `~/.netrc` (recomendado para uso local):

   - Crea un archivo en `C:\Users\<tu_usuario>\.netrc` con el siguiente contenido (reemplaza USER y PASS):

```
machine urs.earthdata.nasa.gov login USER password PASS
```

   - En Windows, asegúrate de que el archivo tenga permisos apropiados (no es tan directo como en UNIX, pero evita subirlo a repositorios).

2) Variables de entorno (temporal o CI):

```powershell
setx NASA_USERNAME "TU_USER"
setx NASA_PASSWORD "TU_PASSWORD"
# Luego cierra y abre la terminal para que las variables estén disponibles, o usa $env:NASA_USERNAME = 'TU_USER' en la sesión actual
```

El script también busca nombres alternativos: `URS_USERNAME`, `EARTHDATA_USERNAME`, `URS_PASSWORD`, `EARTHDATA_PASSWORD`.

## Ejecutar `gcts.py`

Después de activar el venv y configurar credenciales, ejecuta:

```powershell
.venv\Scripts\python.exe .\gcts.py
```

O, si ya activaste el venv:

```powershell
python .\gcts.py
```

Salida esperada:
- Un archivo PNG con los gráficos: `datos_meteorologicos_lat{lat}_lon{lon}.png`.
- Un CSV consolidado: `datos_meteorologicos_consolidados_lat{lat}_lon{lon}.csv`.
- Salida por consola con estadísticas y primeras filas del CSV.

## Personalizar ubicación y periodo

Por ahora los valores de latitud, longitud y periodo están definidos al principio de `gcts.py` (variables `lat`, `lon`, `time_start`, `time_end`). Edita esos valores si deseas ejecutar para otra ubicación o periodo.

Si quieres que añada soporte por línea de comandos (args) para cambiar lat/lon/fechas sin editar el archivo, dímelo y lo implemento.

## Problemas y soluciones comunes

- Error al activar el script (`Activate.ps1` no encontrado): verifica que `.venv` exista en la carpeta del proyecto. Si no, crea el venv con `python -m venv .venv`.
- `Set-ExecutionPolicy` denegado: el comando propuesto usa `-Scope Process` y no cambia la política global; debe funcionar. Si no, abre PowerShell como administrador (solo si entiendes los riesgos).
- Error 400 "Data parameter is invalid" para alguna variable (por ejemplo, `precipitacion_nieve`): es probable que el identificador del dataset no exista o esté mal tipeado. Puedes:
  - Eliminar o comentar esa variable en el diccionario `weather_variables` dentro de `gcts.py`.
  - Pedirme que implemente una estrategia de fallback automática usando `alternative_variables`.
- Problemas de credenciales: revisa que el `.netrc` esté bien formado o que las variables de entorno estén definidas.

## Ejemplo rápido (resumen)

1. Crear y activar venv

```powershell
python -m venv .venv
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force
. .\.venv\Scripts\Activate.ps1
```

2. Instalar dependencias

```powershell
pip install -r .\requirements.txt
```

3. Ejecutar script

```powershell
python .\gcts.py
```

**Autor:** Hackamoles
---
**Generado:** 2025-10-04
