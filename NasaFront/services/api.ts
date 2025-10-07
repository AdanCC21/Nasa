import { API_CONFIG, DEFAULT_HEADERS } from '@/config/api';
import {
    ChatRequest,
    ChatResponse,
    SimpleChatRequest,
    WeatherPredictionRequest,
    WeatherPredictionResponse,
    CSVGenerationRequest,
    CSVGenerationResponse,
    APIError
} from '@/types/api';

// Función helper para manejar errores de red
const handleResponse = async (response: Response) => {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Error de red' }));
        throw new Error(errorData.detail || `Error HTTP: ${response.status}`);
    }
    return response.json();
};

// Función helper para hacer peticiones
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
    const url = `${API_CONFIG.BASE_URL}${endpoint}`;

    const config: RequestInit = {
        ...options,
        headers: {
            ...DEFAULT_HEADERS,
            ...options.headers,
        },
    };

    try {
        const response = await fetch(url, config);
        return await handleResponse(response);
    } catch (error) {
        console.error(`Error en petición a ${url}:`, error);
        throw error;
    }
};

// Servicio de Chat
export const chatService = {
    /**
     * Envía un mensaje simple al chat de ChatGPT
     */
    sendMessage: async (data: SimpleChatRequest): Promise<ChatResponse> => {
        return apiRequest(API_CONFIG.ENDPOINTS.CHAT, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },
};

// Servicio de Predicción del Clima
export const weatherService = {
    /**
     * Obtiene predicción del clima
     */
    getWeatherPrediction: async (data: WeatherPredictionRequest): Promise<WeatherPredictionResponse> => {
        return apiRequest(API_CONFIG.ENDPOINTS.WEATHER_PREDICTION, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },
};

// Servicio de CSV
export const csvService = {
    /**
     * Genera un archivo CSV con datos meteorológicos
     */
    generateCSV: async (data: CSVGenerationRequest): Promise<CSVGenerationResponse> => {
        return apiRequest(API_CONFIG.ENDPOINTS.GENERATE_CSV, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    /**
     * Descarga un archivo CSV generado
     */
    downloadCSV: async (filename: string): Promise<Blob> => {
        const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.DOWNLOAD_CSV}${filename}`;

        const response = await fetch(url, {
            headers: {
                'Accept': 'text/csv',
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ detail: 'Error de descarga' }));
            throw new Error(errorData.detail || `Error HTTP: ${response.status}`);
        }

        return response.blob();
    },
};

// Objeto que exporta todos los servicios
export const apiServices = {
    chat: chatService,
    weather: weatherService,
    csv: csvService,
};