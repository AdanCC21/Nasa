import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapSelector from '../componentes/MapSelector';
import { LocationSelectionResult } from '../types/location';

/**
 * Pantalla de ejemplo para demostrar el uso del componente MapSelector
 * 
 * Esta pantalla muestra:
 * - Cómo implementar el componente MapSelector
 * - Cómo manejar la selección de ubicación
 * - Cómo mostrar la información de la ubicación seleccionada
 */
const MapExampleScreen: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState<LocationSelectionResult | null>(null);

  /**
   * Maneja la selección de ubicación desde el mapa
   */
  const handleLocationSelect = (location: LocationSelectionResult) => {
    setSelectedLocation(location);
    
    // Opcional: Mostrar confirmación
    Alert.alert(
      'Ubicación seleccionada',
      `${location.name}\n${location.address}`,
      [
        { text: 'OK', style: 'default' }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Selector de Ubicación</Text>
        <Text style={styles.subtitle}>
          Toca en el mapa para seleccionar una ubicación
        </Text>
      </View>

      {/* Componente MapSelector */}
      <View style={styles.mapContainer}>
        <MapSelector
          onLocationSelect={handleLocationSelect}
          showCurrentLocationButton={true}
          markerTitle="Mi ubicación seleccionada"
          markerDescription="Esta es la ubicación que elegiste"
          initialRegion={{
            latitude: 19.4326, // Ciudad de México
            longitude: -99.1332,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      </View>

      {/* Información de la ubicación seleccionada */}
      {selectedLocation && (
        <View style={styles.infoContainer}>
          <ScrollView style={styles.infoScroll}>
            <Text style={styles.infoTitle}>Ubicación Seleccionada:</Text>
            
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Nombre:</Text>
              <Text style={styles.infoValue}>{selectedLocation.name}</Text>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Dirección:</Text>
              <Text style={styles.infoValue}>{selectedLocation.address}</Text>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Latitud:</Text>
              <Text style={styles.infoValue}>
                {selectedLocation.coordinates.latitude.toFixed(6)}
              </Text>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Longitud:</Text>
              <Text style={styles.infoValue}>
                {selectedLocation.coordinates.longitude.toFixed(6)}
              </Text>
            </View>

            {/* Ejemplo de cómo usar los datos */}
            <View style={styles.codeExample}>
              <Text style={styles.codeTitle}>Datos JSON:</Text>
              <Text style={styles.codeText}>
                {JSON.stringify(selectedLocation, null, 2)}
              </Text>
            </View>
          </ScrollView>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  mapContainer: {
    flex: 1,
    minHeight: 300,
  },
  infoContainer: {
    maxHeight: 200,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  infoScroll: {
    padding: 15,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  infoItem: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'flex-start',
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    width: 80,
    marginRight: 10,
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  codeExample: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  codeTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginBottom: 5,
  },
  codeText: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#333',
  },
});

export default MapExampleScreen;
