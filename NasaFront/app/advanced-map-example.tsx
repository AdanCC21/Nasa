import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { MapSelector, LocationPreview } from '../componentes/maps';
import { LocationSelectionResult } from '../types/location';

/**
 * Ejemplo avanzado que muestra el uso completo del sistema de mapas
 * Incluye modal para selección y vista previa de confirmación
 */
const AdvancedMapExampleScreen: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState<LocationSelectionResult | null>(null);
  const [showMapModal, setShowMapModal] = useState(false);
  const [tempLocation, setTempLocation] = useState<LocationSelectionResult | null>(null);

  /**
   * Abre el modal de selección de ubicación
   */
  const handleOpenMapSelector = () => {
    setTempLocation(null);
    setShowMapModal(true);
  };

  /**
   * Maneja la selección temporal de ubicación en el modal
   */
  const handleLocationSelect = (location: LocationSelectionResult) => {
    setTempLocation(location);
  };

  /**
   * Confirma la selección de ubicación
   */
  const handleConfirmLocation = () => {
    if (tempLocation) {
      setSelectedLocation(tempLocation);
      setShowMapModal(false);
      setTempLocation(null);
      
      Alert.alert(
        'Ubicación guardada',
        `Se ha guardado la ubicación: ${tempLocation.name}`,
        [{ text: 'OK' }]
      );
    }
  };

  /**
   * Cancela la selección de ubicación
   */
  const handleCancelSelection = () => {
    setShowMapModal(false);
    setTempLocation(null);
  };

  /**
   * Edita la ubicación actual
   */
  const handleEditLocation = () => {
    setShowMapModal(true);
  };

  /**
   * Confirma el uso de la ubicación seleccionada
   */
  const handleUseLocation = () => {
    if (selectedLocation) {
      Alert.alert(
        'Ubicación confirmada',
        `Usando ubicación: ${selectedLocation.name}\nCoordenadas: ${selectedLocation.coordinates.latitude.toFixed(6)}, ${selectedLocation.coordinates.longitude.toFixed(6)}`,
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Selector Avanzado de Ubicación</Text>
        <Text style={styles.subtitle}>
          Ejemplo completo con modal y vista previa
        </Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {selectedLocation ? (
          // Mostrar ubicación seleccionada
          <LocationPreview
            location={selectedLocation}
            onEdit={handleEditLocation}
            onConfirm={handleUseLocation}
            style={styles.locationPreview}
          />
        ) : (
          // Mostrar botón para seleccionar ubicación
          <View style={styles.emptyState}>
            <Ionicons name="location-outline" size={64} color="#ccc" />
            <Text style={styles.emptyTitle}>Sin ubicación seleccionada</Text>
            <Text style={styles.emptyDescription}>
              Toca el botón para seleccionar una ubicación en el mapa
            </Text>
            
            <TouchableOpacity 
              style={styles.selectButton}
              onPress={handleOpenMapSelector}
            >
              <Ionicons name="map" size={20} color="#fff" />
              <Text style={styles.selectButtonText}>Seleccionar Ubicación</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Información adicional */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Funcionalidades:</Text>
          <View style={styles.featureList}>
            <View style={styles.feature}>
              <Ionicons name="checkmark-circle" size={16} color="#28a745" />
              <Text style={styles.featureText}>Selección por tap en el mapa</Text>
            </View>
            <View style={styles.feature}>
              <Ionicons name="checkmark-circle" size={16} color="#28a745" />
              <Text style={styles.featureText}>Ubicación actual automática</Text>
            </View>
            <View style={styles.feature}>
              <Ionicons name="checkmark-circle" size={16} color="#28a745" />
              <Text style={styles.featureText}>Geocodificación reversa</Text>
            </View>
            <View style={styles.feature}>
              <Ionicons name="checkmark-circle" size={16} color="#28a745" />
              <Text style={styles.featureText}>Vista previa y confirmación</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Modal de selección de ubicación */}
      <Modal
        visible={showMapModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          {/* Header del modal */}
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={handleCancelSelection}>
              <Text style={styles.cancelButton}>Cancelar</Text>
            </TouchableOpacity>
            
            <Text style={styles.modalTitle}>Seleccionar Ubicación</Text>
            
            <TouchableOpacity 
              onPress={handleConfirmLocation}
              disabled={!tempLocation}
              style={[
                styles.confirmButton,
                !tempLocation && styles.confirmButtonDisabled
              ]}
            >
              <Text style={[
                styles.confirmButtonText,
                !tempLocation && styles.confirmButtonTextDisabled
              ]}>
                Confirmar
              </Text>
            </TouchableOpacity>
          </View>

          {/* Mapa */}
          <MapSelector
            onLocationSelect={handleLocationSelect}
            showCurrentLocationButton={true}
            markerTitle="Nueva ubicación"
            markerDescription="Toca 'Confirmar' para usar esta ubicación"
            initialRegion={
              selectedLocation ? {
                latitude: selectedLocation.coordinates.latitude,
                longitude: selectedLocation.coordinates.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              } : undefined
            }
          />

          {/* Vista previa temporal */}
          {tempLocation && (
            <View style={styles.tempPreview}>
              <LocationPreview
                location={tempLocation}
                showActions={false}
              />
            </View>
          )}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
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
  content: {
    flex: 1,
    padding: 20,
  },
  locationPreview: {
    marginBottom: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  selectButton: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    gap: 8,
  },
  selectButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  featureList: {
    gap: 8,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureText: {
    fontSize: 14,
    color: '#666',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  cancelButton: {
    fontSize: 16,
    color: '#007AFF',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  confirmButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#007AFF',
    borderRadius: 6,
  },
  confirmButtonDisabled: {
    backgroundColor: '#ccc',
  },
  confirmButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  confirmButtonTextDisabled: {
    color: '#999',
  },
  tempPreview: {
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
});

export default AdvancedMapExampleScreen;
