import { useState, useCallback } from 'react';
import * as Location from 'expo-location';
import { 
  LocationCoordinates, 
  LocationData, 
  LocationSelectionResult, 
  UseLocationReturn 
} from '../types/location';

/**
 * Hook personalizado para manejo de ubicación y geocodificación
 * Proporciona funcionalidades para obtener ubicación actual y geocodificación reversa
 */
export const useLocation = (): UseLocationReturn => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Obtiene la ubicación actual del usuario
   */
  const getCurrentLocation = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      // Verificar permisos
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Permisos de ubicación denegados');
      }

      // Obtener ubicación actual
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const coordinates: LocationCoordinates = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      };

      // Obtener nombre del lugar
      const geocodeResult = await reverseGeocode(coordinates);
      
      setLocation({
        ...coordinates,
        name: geocodeResult.name,
        address: geocodeResult.address,
      });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al obtener ubicación';
      setError(errorMessage);
      console.error('Error obteniendo ubicación:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Realiza geocodificación directa para convertir dirección en coordenadas
   */
  const geocodeAddress = useCallback(async (
    address: string
  ): Promise<LocationSelectionResult[]> => {
    try {
      const geocodeResults = await Location.geocodeAsync(address);

      if (geocodeResults.length > 0) {
        const results: LocationSelectionResult[] = [];

        for (const result of geocodeResults) {
          const coordinates: LocationCoordinates = {
            latitude: result.latitude,
            longitude: result.longitude,
          };

          // Obtener información detallada mediante geocodificación reversa
          const detailedInfo = await reverseGeocode(coordinates);
          results.push(detailedInfo);
        }

        return results;
      }

      // Si no hay resultados, devolver array vacío
      return [];

    } catch (err) {
      console.error('Error en geocodificación directa:', err);
      throw new Error('No se pudo encontrar la dirección especificada');
    }
  }, []);

  /**
   * Realiza geocodificación reversa para obtener información de una ubicación
   */
  const reverseGeocode = useCallback(async (
    coordinates: LocationCoordinates
  ): Promise<LocationSelectionResult> => {
    try {
      const geocodeResults = await Location.reverseGeocodeAsync({
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
      });

      if (geocodeResults.length > 0) {
        const result = geocodeResults[0];
        
        // Construir nombre del lugar
        const nameParts = [
          result.name,
          result.street,
          result.streetNumber,
        ].filter(Boolean);
        
        const name = nameParts.length > 0 
          ? nameParts.join(', ') 
          : 'Ubicación seleccionada';

        // Construir dirección completa
        const addressParts = [
          result.street && result.streetNumber 
            ? `${result.street} ${result.streetNumber}` 
            : result.street,
          result.district,
          result.city,
          result.region,
          result.country,
        ].filter(Boolean);

        const address = addressParts.length > 0 
          ? addressParts.join(', ') 
          : `${coordinates.latitude.toFixed(6)}, ${coordinates.longitude.toFixed(6)}`;

        return {
          coordinates,
          name,
          address,
        };
      }

      // Fallback si no hay resultados de geocodificación
      return {
        coordinates,
        name: 'Ubicación seleccionada',
        address: `${coordinates.latitude.toFixed(6)}, ${coordinates.longitude.toFixed(6)}`,
      };

    } catch (err) {
      console.error('Error en geocodificación reversa:', err);
      
      // Fallback en caso de error
      return {
        coordinates,
        name: 'Ubicación seleccionada',
        address: `${coordinates.latitude.toFixed(6)}, ${coordinates.longitude.toFixed(6)}`,
      };
    }
  }, []);

  return {
    location,
    loading,
    error,
    getCurrentLocation,
    reverseGeocode,
    geocodeAddress,
  };
};
