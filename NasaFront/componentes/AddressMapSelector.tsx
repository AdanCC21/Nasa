import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
  AddressMapSelectorProps,
  LocationSelectionResult,
  MapRegion
} from '../types/location';
import AddressInput from './AddressInput';
import MapSelector from './MapSelector';

/**
 * Componente híbrido que combina selección por mapa y por dirección
 * 
 * Características:
 * - Alternar entre vista de mapa y input de dirección
 * - Sincronización entre ambos métodos de selección
 * - Animaciones suaves entre vistas
 * - Botones de cambio de modo
 */
const AddressMapSelector: React.FC<AddressMapSelectorProps> = ({
  onLocationSelect,
  initialRegion,
  showCurrentLocationButton = true,
  showAddressInput = true,
  placeholder = 'Search for an address in the map...',
  style,
}) => {
  // Estados locales
  const [mode, setMode] = useState<'map' | 'address'>('map');
  const [selectedLocation, setSelectedLocation] = useState<LocationSelectionResult | null>(null);
  const [mapRegion, setMapRegion] = useState<MapRegion | undefined>(initialRegion);

  // Animación para el cambio de modo
  const fadeAnim = useRef(new Animated.Value(1)).current;

  /**
   * Maneja la selección de ubicación desde cualquier método
   */
  const handleLocationSelect = useCallback((location: LocationSelectionResult) => {
    setSelectedLocation(location);
    
    // Actualizar región del mapa para centrar en la nueva ubicación
    setMapRegion({
      latitude: location.coordinates.latitude,
      longitude: location.coordinates.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });

    // Notificar al componente padre
    onLocationSelect(location);
  }, [onLocationSelect]);

  /**
   * Cambia el modo de selección con animación
   */
  const handleModeChange = useCallback((newMode: 'map' | 'address') => {
    if (newMode === mode) return;

    // Animación de fade out
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      // Cambiar modo
      setMode(newMode);
      
      // Animación de fade in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start();
    });
  }, [mode, fadeAnim]);

  return (
    <View style={[styles.container, style]}>
      {/* Header con controles de modo */}
      <View style={styles.header}>
        <Text style={styles.title}>Seleccionar Ubicación</Text>
        
        {showAddressInput && (
          <View style={styles.modeSelector}>
            <TouchableOpacity
              style={[
                styles.modeButton,
                mode === 'map' && styles.modeButtonActive
              ]}
              onPress={() => handleModeChange('map')}
            >
              <Ionicons 
                name="map" 
                size={16} 
                color={mode === 'map' ? '#fff' : '#666'} 
              />
              <Text style={[
                styles.modeButtonText,
                mode === 'map' && styles.modeButtonTextActive
              ]}>
                Mapa
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.modeButton,
                mode === 'address' && styles.modeButtonActive
              ]}
              onPress={() => handleModeChange('address')}
            >
              <Ionicons 
                name="search" 
                size={16} 
                color={mode === 'address' ? '#fff' : '#666'} 
              />
              <Text style={[
                styles.modeButtonText,
                mode === 'address' && styles.modeButtonTextActive
              ]}>
                Buscar
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Contenido principal con animación */}
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {mode === 'map' ? (
          // Vista de mapa
          <MapSelector
            initialRegion={mapRegion}
            onLocationSelect={handleLocationSelect}
            showCurrentLocationButton={showCurrentLocationButton}
            markerTitle={selectedLocation?.name || 'Ubicación seleccionada'}
            markerDescription="Ubicación elegida"
            style={styles.mapSelector}
          />
        ) : (
          // Vista de búsqueda por dirección
          <View style={styles.addressContainer}>
            <AddressInput
              onAddressSelect={handleLocationSelect}
              placeholder={placeholder}
              showSuggestions={true}
              style={styles.addressInput}
            />

            {/* Información de ayuda */}
            <View style={styles.helpContainer}>
              <Ionicons name="information-circle-outline" size={20} color="#666" />
              <Text style={styles.helpText}>
                Escribe una dirección completa para obtener mejores resultados
              </Text>
            </View>

            {/* Botón para cambiar a mapa si hay ubicación seleccionada */}
            {selectedLocation && (
              <TouchableOpacity
                style={styles.viewOnMapButton}
                onPress={() => handleModeChange('map')}
              >
                <Ionicons name="map-outline" size={20} color="#007AFF" />
                <Text style={styles.viewOnMapText}>Ver en el mapa</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </Animated.View>

      {/* Información de ubicación seleccionada */}
      {selectedLocation && (
        <View style={styles.selectedLocationInfo}>
          <View style={styles.locationHeader}>
            <Ionicons name="checkmark-circle" size={20} color="#28a745" />
            <Text style={styles.locationTitle}>Ubicación seleccionada</Text>
          </View>
          
          <Text style={styles.locationName} numberOfLines={1}>
            {selectedLocation.name}
          </Text>
          
          <Text style={styles.locationAddress} numberOfLines={2}>
            {selectedLocation.address}
          </Text>

          <View style={styles.coordinates}>
            <Text style={styles.coordinatesText}>
              {selectedLocation.coordinates.latitude.toFixed(6)}, {selectedLocation.coordinates.longitude.toFixed(6)}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  modeSelector: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    padding: 2,
  },
  modeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 18,
    gap: 4,
  },
  modeButtonActive: {
    backgroundColor: '#007AFF',
  },
  modeButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  modeButtonTextActive: {
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  mapSelector: {
    flex: 1,
  },
  addressContainer: {
    flex: 1,
    padding: 16,
  },
  addressInput: {
    marginBottom: 16,
  },
  helpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    gap: 8,
    marginBottom: 16,
  },
  helpText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
  },
  viewOnMapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#007AFF',
    gap: 8,
  },
  viewOnMapText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  selectedLocationInfo: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },
  locationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#28a745',
  },
  locationName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  locationAddress: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
    marginBottom: 8,
  },
  coordinates: {
    backgroundColor: '#f8f9fa',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  coordinatesText: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#666',
  },
});

export default AddressMapSelector;
