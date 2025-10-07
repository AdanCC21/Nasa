import { LocationSelectionResult } from "@/types/location";
import React, { createContext, ReactNode, useContext, useState } from "react";

/**
 * Interface para los datos del evento
 */
export interface EventData {
  location: LocationSelectionResult | null;
  date: Date | undefined;
  startTime: string; // Formato HH:mm:ss
  endTime: string; // Formato HH:mm:ss
  plan: string; // Descripción del plan
  metrics: {
    temperature: boolean;
    precipitation: boolean;
    humidity: boolean;
    radiation: boolean;
  };
  weatherData: any | null; // Datos meteorológicos completos de la predicción
  recommendations: string[]; // Recomendaciones generadas
}

/**
 * Interface para el contexto del evento
 */
interface EventContextType {
  eventData: EventData;
  setLocation: (location: LocationSelectionResult) => void;
  setDate: (date: Date | undefined) => void;
  setStartTime: (time: string) => void;
  setEndTime: (time: string) => void;
  setPlan: (plan: string) => void;
  setMetrics: (metrics: { temperature: boolean; precipitation: boolean; humidity: boolean; radiation: boolean }) => void;
  setWeatherData: (data: any) => void;
  setRecommendations: (recommendations: string[]) => void;
  clearEventData: () => void;
  getFormattedData: () => FormattedEventData | null;
}

/**
 * Datos formateados para enviar a la API
 */
export interface FormattedEventData {
  latitude: number;
  longitude: number;
  address: string;
  name: string;
  date: string; // YYYY-MM-DD
  time_start: string; // YYYY-MM-DDThh:mm:ss
  end_time: string; // YYYY-MM-DDThh:mm:ss
  plan: string; // Descripción del plan
  metrics: {
    temperature: boolean;
    precipitation: boolean;
    humidity: boolean;
    radiation: boolean;
  };
}

const EventContext = createContext<EventContextType | undefined>(undefined);

/**
 * Provider del contexto de evento
 */
export const EventProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [eventData, setEventData] = useState<EventData>({
    location: null,
    date: undefined,
    startTime: "",
    endTime: "",
    plan: "",
    metrics: {
      temperature: true,
      precipitation: true,
      humidity: true,
      radiation: true,
    },
    weatherData: null,
    recommendations: [],
  });

  const setLocation = (location: LocationSelectionResult) => {
    setEventData((prev) => ({ ...prev, location }));
  };

  const setDate = (date: Date | undefined) => {
    setEventData((prev) => ({ ...prev, date }));
  };

  const setStartTime = (time: string) => {
    setEventData((prev) => ({ ...prev, startTime: time }));
  };

  const setEndTime = (time: string) => {
    setEventData((prev) => ({ ...prev, endTime: time }));
  };

  const setPlan = (plan: string) => {
    setEventData((prev) => ({ ...prev, plan }));
  };

  const setMetrics = (metrics: { temperature: boolean; precipitation: boolean; humidity: boolean; radiation: boolean }) => {
    setEventData((prev) => ({ ...prev, metrics }));
  };

  const setWeatherData = (data: any) => {
    setEventData((prev) => ({ ...prev, weatherData: data }));
  };

  const setRecommendations = (recommendations: string[]) => {
    setEventData((prev) => ({ ...prev, recommendations }));
  };

  const clearEventData = () => {
    setEventData({
      location: null,
      date: undefined,
      startTime: "",
      endTime: "",
      plan: "",
      metrics: {
        temperature: false,
        precipitation: false,
        humidity: false,
        radiation: false,
      },
      weatherData: null,
      recommendations: [],
    });
  };

  /**
   * Formatea los datos del evento para enviar a la API
   */
  const getFormattedData = (): FormattedEventData | null => {
    if (!eventData.location || !eventData.date || !eventData.startTime) {
      return null;
    }

    // Formatear fecha a YYYY-MM-DD
    const year = eventData.date.getFullYear();
    const month = String(eventData.date.getMonth() + 1).padStart(2, "0");
    const day = String(eventData.date.getDate()).padStart(2, "0");
    const dateStr = `${year}-${month}-${day}`;

    // Formatear timestamps
    const timeStart = `${dateStr}T${eventData.startTime}`;
    const timeEnd = eventData.endTime
      ? `${dateStr}T${eventData.endTime}`
      : `${dateStr}T23:59:59`;

    return {
      latitude: eventData.location.coordinates.latitude,
      longitude: eventData.location.coordinates.longitude,
      address: eventData.location.address,
      name: eventData.location.name,
      date: dateStr,
      time_start: timeStart,
      end_time: timeEnd,
      plan: eventData.plan,
      metrics: eventData.metrics,
    };
  };

  return (
    <EventContext.Provider
      value={{
        eventData,
        setLocation,
        setDate,
        setStartTime,
        setEndTime,
        setPlan,
        setMetrics,
        setWeatherData,
        setRecommendations,
        clearEventData,
        getFormattedData,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

/**
 * Hook personalizado para usar el contexto del evento
 */
export const useEvent = (): EventContextType => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error("useEvent debe ser usado dentro de un EventProvider");
  }
  return context;
};
