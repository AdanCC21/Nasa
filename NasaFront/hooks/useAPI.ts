import { useState, useCallback } from 'react';
import { apiServices } from '@/services/api';
import {
    ChatRequest,
    ChatResponse,
    SimpleChatRequest,
    WeatherPredictionRequest,
    WeatherPredictionResponse,
    CSVGenerationRequest,
    CSVGenerationResponse
} from '@/types/api';

// Hook para manejar estados de loading y errores
interface ApiState<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
}

// Hook para el servicio de chat
export const useChat = () => {
    const [state, setState] = useState<ApiState<ChatResponse>>({
        data: null,
        loading: false,
        error: null,
    });

    const sendMessage = useCallback(async (data: SimpleChatRequest) => {
        setState({ data: null, loading: true, error: null });
        try {
            const response = await apiServices.chat.sendMessage(data);
            setState({ data: response, loading: false, error: null });
            return response;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            setState({ data: null, loading: false, error: errorMessage });
            throw error;
        }
    }, []);

    return {
        ...state,
        sendMessage,
    };
};

// Hook para el servicio de predicción del clima
export const useWeatherPrediction = () => {
    const [state, setState] = useState<ApiState<WeatherPredictionResponse>>({
        data: null,
        loading: false,
        error: null,
    });

    const getWeatherPrediction = useCallback(async (data: WeatherPredictionRequest) => {
        setState({ data: null, loading: true, error: null });
        try {
            const response = await apiServices.weather.getWeatherPrediction(data);
            setState({ data: response, loading: false, error: null });
            return response;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            setState({ data: null, loading: false, error: errorMessage });
            throw error;
        }
    }, []);

    return {
        ...state,
        getWeatherPrediction,
    };
};

// Hook para el servicio de CSV
export const useCSV = () => {
    const [generateState, setGenerateState] = useState<ApiState<CSVGenerationResponse>>({
        data: null,
        loading: false,
        error: null,
    });

    const [downloadState, setDownloadState] = useState<ApiState<Blob>>({
        data: null,
        loading: false,
        error: null,
    });

    const generateCSV = useCallback(async (data: CSVGenerationRequest) => {
        setGenerateState({ data: null, loading: true, error: null });
        try {
            const response = await apiServices.csv.generateCSV(data);
            setGenerateState({ data: response, loading: false, error: null });
            return response;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            setGenerateState({ data: null, loading: false, error: errorMessage });
            throw error;
        }
    }, []);

    const downloadCSV = useCallback(async (filename: string) => {
        setDownloadState({ data: null, loading: true, error: null });
        try {
            const response = await apiServices.csv.downloadCSV(filename);
            setDownloadState({ data: response, loading: false, error: null });
            return response;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            setDownloadState({ data: null, loading: false, error: errorMessage });
            throw error;
        }
    }, []);

    return {
        generateCSV,
        downloadCSV,
        generateState,
        downloadState,
    };
};

// Hook general que combina todos los servicios
export const useAPI = () => {
    const chat = useChat();
    const weather = useWeatherPrediction();
    const csv = useCSV();

    return {
        chat,
        weather,
        csv,
    };
};