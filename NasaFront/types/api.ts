// Tipos basados en los modelos del backend
export interface Time {
    day: number; // 1-31
    month: number; // 1-12
    start_time: string; // formato HH:mm
    end_time: string; // formato HH:mm
}

export interface Location {
    lat: number;
    lon: number;
}

export interface WeatherSummary {
    temperatura: number;
    temperatura_min: number;
    temperatura_max: number;
    nubosidad: string;
    precipitacion: number;
    humedad: number;
    radiacion_solar: number;
    velocidad_viento: number;
}

// Interfaces para las respuestas de API
export interface ChatRequest {
    prompt: string;
    time: Time;
    location: Location;
}

export interface SimpleChatRequest {
    prompt: string;
    location?: {
        lat: number;
        lon: number;
        address: string;
    };
    current_time?: string;
    weather_data?: any; // Datos meteorológicos completos de la predicción
}

export interface ChatResponse {
    response: string;
    status: string;
}

export interface WeatherPredictionRequest {
    time: Time;
    location: Location;
    plan?: string;
}

export interface WeatherPredictionResponse {
    data: {
        summary: WeatherSummary;
        data: Array<{
            velocidad_viento: { time: string; value: number };
            precipitacion: { time: string; value: number };
            humedad: { time: string; value: number };
            temperatura: { time: string; value: number };
            presion_superficie: { time: string; value: number };
            radiacion_solar: { time: string; value: number };
            radiacion_infrarroja: { time: string; value: number };
        }>;
    };
    recomendations: string[];
}

export interface CSVGenerationRequest {
    location: Location;
    time_start: string; // formato: "2024-06-01T03:00:00"
    time_end: string; // formato: "2024-07-30T21:00:00"
}

export interface CSVGenerationResponse {
    success: boolean;
    message: string;
    filename: string;
    records_count: number;
    columns: string[];
    data_preview: any[];
}

// Tipos de error de API
export interface APIError {
    detail: string;
    status_code?: number;
}