# 🌤️ NASA Weather Prediction Backend

Backend API desarrollado con FastAPI que proporciona predicciones meteorológicas utilizando datos de NASA y ChatGPT para generar recomendaciones inteligentes.

## � Prerrequisitos

- **Python 3.8+** (Recomendado Python 3.11)
- **pip** (gestor de paquetes de Python)
- **Cuenta de OpenAI** (para ChatGPT API)
- **Credenciales de NASA Earthdata** (para datos meteorológicos)

## 🚀 Configuración e Instalación

### 1. Crear y Activar Entorno Virtual

```bash
# Navegar al directorio del backend
cd NasaBack

# Crear entorno virtual
python -m venv venv

# Activar entorno virtual
# En Windows:
venv\Scripts\activate

# En MacOS/Linux:
source venv/bin/activate
```

### 2. Instalar Dependencias

```bash
# Instalar todas las dependencias desde requirements.txt
pip install -r requirements.txt
```

### 3. Configurar Variables de Entorno

Crear un archivo `.env` en la carpeta `NasaBack/`:

```bash
# NasaBack/.env
OPENAI_API_KEY=tu_openai_api_key_aqui
NASA_USERNAME=tu_usuario_nasa_earthdata
NASA_PASSWORD=tu_contraseña_nasa_earthdata
```

**Cómo obtener las credenciales:**

- **OpenAI API Key**: Regístrate en [platform.openai.com](https://platform.openai.com) y genera una API key
- **NASA Earthdata**: Crea una cuenta gratuita en [urs.earthdata.nasa.gov](https://urs.earthdata.nasa.gov)

### 4. Levantar el Servidor

```bash
# Ejecutar el servidor con uvicorn
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

El servidor estará disponible en: `http://localhost:8000`

**Documentación API**: `http://localhost:8000/docs`

## � Estructura del Proyecto

```
NasaBack/
├── main.py                     # Punto de entrada de la aplicación
├── config.py                   # Configuración y variables de entorno
├── requirements.txt            # Dependencias de Python
├── .env                       # Variables de entorno (crear este archivo)
├── entitys/
│   └── models.py              # Modelos de datos Pydantic
├── src/
│   ├── chat/                  # Servicios de chat con ChatGPT
│   ├── prediction/            # Servicios de predicción meteorológica
│   ├── csv/                   # Servicios de generación de CSV
│   ├── chatgpt_querys.py      # Cliente de OpenAI
│   └── gcts.py                # Cliente de NASA API
└── __pycache__/               # Archivos compilados de Python
```

## 🔧 Comandos Útiles

```bash
# Activar entorno virtual (si no está activo)
venv\Scripts\activate

# Actualizar requirements.txt
pip install -r requirements.txt

# Ejecutar servidor en modo desarrollo
uvicorn main:app --reload

# Ejecutar servidor en producción
uvicorn main:app --host 0.0.0.0 --port 8000

# Desactivar entorno virtual
deactivate
```

## 📡 Endpoints Principales

- `POST /predict/weather/` - Predicción meteorológica
- `POST /chat/simple/` - Chat con contexto meteorológico
- `POST /csv/generate-csv/` - Generación de archivos CSV
- `GET /docs` - Documentación interactiva de la API

## ⚠️ Notas Importantes

1. **Nunca subas el archivo `.env` a git**
2. Asegúrate de que tu API key de OpenAI tenga créditos disponibles
3. Las credenciales de NASA Earthdata deben ser válidas
4. El servidor debe ejecutarse antes que el frontend