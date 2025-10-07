import React, { useState, useCallback, useRef } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { useLocation } from '../hooks/useLocation';
import { 
  MapSelectorProps, 
  LocationCoordinates, 
  MapRegion,
  LocationSelectionResult 
} from '../types/location';

/**
 * Componente MapSelector - Permite seleccionar una ubicación en el mapa
 * 
 * Características:
 * - Selección de ubicación mediante tap en el mapa
 * - Botón para obtener ubicación actual
 * - Geocodificación reversa automática
 * - Marcador personalizable
 * - Manejo de errores y estados de carga
 */
const MapSelector: React.FC<MapSelectorProps> = ({
  initialRegion,
  onLocationSelect,
  showCurrentLocationButton = true,
  markerTitle = 'Ubicación seleccionada',
  markerDescription = 'Toca para confirmar esta ubicación',
  style,
}) => {
  // Estados locales
  const [selectedLocation, setSelectedLocation] = useState<LocationCoordinates | null>(null);
  const [region, setRegion] = useState<MapRegion>(
    initialRegion || {
      latitude: 19.4326, // Ciudad de México por defecto
      longitude: -99.1332,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    }
  );

  // Hook personalizado para manejo de ubicación
  const { loading, error, getCurrentLocation, reverseGeocode } = useLocation();
  
  // Referencia al mapa
  const mapRef = useRef<MapView>(null);

  /**
   * Maneja la selección de ubicación en el mapa
   */
  const handleMapPress = useCallback(async (event: any) => {
    const coordinates: LocationCoordinates = event.nativeEvent.coordinate;
    setSelectedLocation(coordinates);

    try {
      // Realizar geocodificación reversa
      const locationResult = await reverseGeocode(coordinates);
      
      // Notificar al componente padre
      onLocationSelect(locationResult);
    } catch (err) {
      console.error('Error procesando selección de ubicación:', err);
      Alert.alert(
        'Error',
        'No se pudo obtener información de la ubicación seleccionada'
      );
    }
  }, [reverseGeocode, onLocationSelect]);

  /**
   * Obtiene y centra el mapa en la ubicación actual
   */
  const handleCurrentLocation = useCallback(async () => {
    try {
      await getCurrentLocation();
      
      // Obtener ubicación actual para centrar el mapa
      const { status } = await import('expo-location').then(Location => 
        Location.requestForegroundPermissionsAsync()
      );
      
      if (status === 'granted') {
        const Location = await import('expo-location');
        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        const newRegion: MapRegion = {
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        };

        setRegion(newRegion);
        mapRef.current?.animateToRegion(newRegion, 1000);

        // Seleccionar automáticamente la ubicación actual
        const coordinates: LocationCoordinates = {
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        };
        
        setSelectedLocation(coordinates);
        
        const locationResult = await reverseGeocode(coordinates);
        onLocationSelect(locationResult);
      }
    } catch (err) {
      console.error('Error obteniendo ubicación actual:', err);
      Alert.alert(
        'Error de ubicación',
        'No se pudo obtener tu ubicación actual. Verifica que los permisos estén habilitados.'
      );
    }
  }, [getCurrentLocation, reverseGeocode, onLocationSelect]);

  /**
   * Maneja cambios en la región del mapa
   */
  const handleRegionChange = useCallback((newRegion: Region) => {
    setRegion(newRegion);
  }, []);

  return (
    <View style={[styles.container, style]}>
      {/* Mapa */}
      <MapView
        ref={mapRef}
        style={styles.map}
        region={region}
        onPress={handleMapPress}
        onRegionChangeComplete={handleRegionChange}
        showsUserLocation={true}
        showsMyLocationButton={false}
        showsCompass={true}
        showsScale={true}
        mapType="standard"
      >
        {/* Marcador de ubicación seleccionada */}
        {selectedLocation && (
          <Marker
            coordinate={selectedLocation}
            title={markerTitle}
            description={markerDescription}
            pinColor="red"
          />
        )}
      </MapView>

      {/* Controles */}
      <View style={styles.controls}>
        {/* Botón de ubicación actual */}
        {showCurrentLocationButton && (
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleCurrentLocation}
            disabled={loading}
          >
            <Ionicons 
              name="location" 
              size={24} 
              color={loading ? '#999' : '#fff'} 
            />
            <Text style={[styles.buttonText, loading && styles.buttonTextDisabled]}>
              {loading ? 'Obteniendo...' : 'Mi ubicación'}
            </Text>
          </TouchableOpacity>
        )}

        {/* Mensaje de error */}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Instrucciones */}
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsText}>
            Toca en el mapa para seleccionar una ubicación
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  controls: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    gap: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonTextDisabled: {
    color: '#999',
  },
  errorContainer: {
    backgroundColor: '#ff4444',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  errorText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
  instructionsContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  instructionsText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default MapSelector;
