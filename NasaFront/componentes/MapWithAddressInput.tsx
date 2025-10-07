import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import { useLocation } from '../hooks/useLocation';
import {
    LocationCoordinates,
    LocationSelectionResult,
    MapRegion
} from '../types/location';
import AddressInput from './AddressInput';

interface MapWithAddressInputProps {
  onLocationSelect?: (location: LocationSelectionResult) => void;
  initialRegion?: MapRegion;
  initialLocation?: LocationSelectionResult; // Nueva prop para ubicación inicial
  showCurrentLocationButton?: boolean;
  placeholder?: string;
  style?: object;
  showAddressInput?: boolean;
  interactive?: boolean;
  showSelectedLocation?: boolean;
}

/**
 * Componente que combina un mapa con un input de dirección
 * Cuando se escribe una dirección, automáticamente se muestra en el mapa
 */
const MapWithAddressInput: React.FC<MapWithAddressInputProps> = ({
  onLocationSelect,
  initialRegion,
  initialLocation,
  showCurrentLocationButton = true,
  placeholder = 'Search for an address in the map...',
  style,
  showAddressInput = true,
  interactive = true,
  showSelectedLocation = true,
}) => {
  // Estados locales - inicializar con initialLocation si existe
  const [selectedLocation, setSelectedLocation] = useState<LocationSelectionResult | null>(
    initialLocation || null
  );
  const [mapRegion, setMapRegion] = useState<MapRegion>(
    initialRegion || (initialLocation ? {
      latitude: initialLocation.coordinates.latitude,
      longitude: initialLocation.coordinates.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    } : {
      latitude: 19.4326, // Ciudad de México por defecto
      longitude: -99.1332,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    })
  );

  // Hook personalizado para ubicación
  const { getCurrentLocation, reverseGeocode } = useLocation();
  
  // Referencia al mapa
  const mapRef = useRef<MapView>(null);

  /**
   * Obtiene la ubicación actual del usuario al montar el componente
   * Solo si no hay una ubicación inicial proporcionada
   */
  useEffect(() => {
    // Si ya hay una ubicación inicial, no obtener la ubicación actual
    if (initialLocation) {
      return;
    }

    const initializeLocation = async () => {
      try {
        const Location = await import('expo-location');
        const { status } = await Location.requestForegroundPermissionsAsync();
        
        if (status === 'granted') {
          const currentLocation = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High,
          });

          const coordinates: LocationCoordinates = {
            latitude: currentLocation.coords.latitude,
            longitude: currentLocation.coords.longitude,
          };

          const newRegion: MapRegion = {
            latitude: coordinates.latitude,
            longitude: coordinates.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          };

          setMapRegion(newRegion);

          // Obtener información de la ubicación actual
          const locationResult = await reverseGeocode(coordinates);
          setSelectedLocation(locationResult);
          onLocationSelect?.(locationResult);
        }
      } catch (err) {
        console.error('Error obteniendo ubicación inicial:', err);
        // Si falla, mantener la ubicación por defecto (Ciudad de México)
      }
    };

    initializeLocation();
  }, [initialLocation, reverseGeocode, onLocationSelect]);

  /**
   * Maneja la selección de dirección desde el input
   */
  const handleAddressSelect = useCallback(async (location: LocationSelectionResult) => {
    setSelectedLocation(location);

    // Crear nueva región centrada en la ubicación seleccionada
    const newRegion: MapRegion = {
      latitude: location.coordinates.latitude,
      longitude: location.coordinates.longitude,
      latitudeDelta: 0.01, // Zoom más cercano para ver la ubicación específica
      longitudeDelta: 0.01,
    };

    // Animar el mapa hacia la nueva ubicación
    setMapRegion(newRegion);
    mapRef.current?.animateToRegion(newRegion, 1000);

    // Notificar al componente padre si hay callback
    onLocationSelect?.(location);
  }, [onLocationSelect]);

  /**
   * Maneja el tap en el mapa para seleccionar ubicación
   */
  const handleMapPress = useCallback(async (event: any) => {
    const coordinates: LocationCoordinates = event.nativeEvent.coordinate;
    
    try {
      // Realizar geocodificación reversa para obtener la dirección
      const locationResult = await reverseGeocode(coordinates);
      
      setSelectedLocation(locationResult);
      onLocationSelect?.(locationResult);
    } catch (err) {
      console.error('Error procesando selección de ubicación:', err);
      Alert.alert(
        'Error',
        'No se pudo obtener información de la ubicación seleccionada'
      );
    }
  }, [reverseGeocode, onLocationSelect]);

  /**
   * Obtiene la ubicación actual del usuario
   */
  const handleCurrentLocation = useCallback(async () => {
    try {
      await getCurrentLocation();
      
      // Obtener ubicación actual para centrar el mapa
      const Location = await import('expo-location');
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status === 'granted') {
        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        const coordinates: LocationCoordinates = {
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        };

        const newRegion: MapRegion = {
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };

        setMapRegion(newRegion);
        mapRef.current?.animateToRegion(newRegion, 1000);

        // Obtener información de la ubicación actual
        const locationResult = await reverseGeocode(coordinates);
        setSelectedLocation(locationResult);
        onLocationSelect?.(locationResult);
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
    setMapRegion(newRegion);
  }, []);

  return (
    <View style={[styles.container, style]}>
      {/* Input de dirección en la parte superior */}
      {showAddressInput && (
        <View style={styles.inputContainer}>
          <AddressInput
            onAddressSelect={handleAddressSelect}
            placeholder={placeholder}
            showSuggestions={true}
            style={styles.addressInput}
            inputStyle={styles.addressInputStyle}
          />
        </View>
      )}

      {/* Mapa */}
      <MapView
        ref={mapRef}
        style={[styles.map, {borderRadius: 24}]}
        region={mapRegion}
        onPress={interactive ? handleMapPress : undefined}
        onRegionChangeComplete={interactive ? handleRegionChange : undefined}
        showsUserLocation={true}
        showsMyLocationButton={false}
        showsCompass={interactive}
        showsScale={interactive}
        mapType="standard"
        scrollEnabled={interactive}
        zoomEnabled={interactive}
        pitchEnabled={interactive}
        rotateEnabled={interactive}
      >
        {/* Marcador de ubicación seleccionada */}
        {selectedLocation && (
          <Marker
            coordinate={selectedLocation.coordinates}
            title={selectedLocation.name}
            description={selectedLocation.address}
            pinColor="red"
          />
        )}
      </MapView>

      {/* Controles flotantes */}
      <View style={styles.floatingControls}>
        {/* Botón de ubicación actual */}
        {showCurrentLocationButton && (
          <TouchableOpacity 
            style={styles.currentLocationButton}
            onPress={handleCurrentLocation}
          >
            <Ionicons name="locate" size={24} color="#007AFF" />
          </TouchableOpacity>
        )}
      </View>

      {/* Información de ubicación seleccionada */}
      {selectedLocation && showSelectedLocation && (
        <View style={styles.locationInfo}>
          <View style={styles.locationHeader}>
            <Ionicons name="location" size={16} color="#007AFF" />
            <Text style={styles.locationTitle} numberOfLines={1}>
              {selectedLocation.name}
            </Text>
          </View>
          <Text style={styles.locationAddress} numberOfLines={2}>
            {selectedLocation.address}
          </Text>
          {/* <Text style={styles.coordinates}>
            {selectedLocation.coordinates.latitude.toFixed(6)}, {selectedLocation.coordinates.longitude.toFixed(6)}
          </Text> */}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  inputContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    zIndex: 1000,
  },
  addressInput: {
    // El AddressInput ya tiene sus propios estilos
  },
  addressInputStyle: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  map: {
    flex: 1,
  },
  floatingControls: {
    position: 'absolute',
    right: 15,
    top: 80, // Debajo del input de dirección
    zIndex: 999,
  },
  currentLocationButton: {
    backgroundColor: '#fff',
    borderRadius: 25,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  locationInfo: {
    position: 'absolute',
    bottom: 20,
    left: 15,
    right: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 6,
  },
  locationTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  locationAddress: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
    marginBottom: 4,
  },
  coordinates: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#999',
  },
});

export default MapWithAddressInput;
