// Configuración de la API
export const API_CONFIG = {
    BASE_URL: 'http://10.41.89.248:8000',
    TIMEOUT: 30000,
    ENDPOINTS: {
        CHAT: '/chat/simple/',
        WEATHER_PREDICTION: '/predict/weather',  // Sin slash final
        GENERATE_CSV: '/csv/generate-csv/',
        DOWNLOAD_CSV: '/csv/download-csv/',
    }
};

// Headers por defecto para las peticiones
export const DEFAULT_HEADERS = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
};