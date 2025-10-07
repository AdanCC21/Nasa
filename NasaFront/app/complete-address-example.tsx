import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  AddressInput,
  AddressMapSelector,
  LocationPreview
} from '../componentes/maps';
import { LocationSelectionResult } from '../types/location';

/**
 * Pantalla de ejemplo completa que demuestra todos los componentes de dirección
 * 
 * Esta pantalla muestra:
 * - AddressInput: Input simple para escribir direcciones
 * - AddressMapSelector: Componente híbrido mapa + búsqueda
 * - LocationPreview: Vista previa de ubicaciones seleccionadas
 */
const CompleteAddressExampleScreen: React.FC = () => {
  const [selectedFromInput, setSelectedFromInput] = useState<LocationSelectionResult | null>(null);
  const [selectedFromHybrid, setSelectedFromHybrid] = useState<LocationSelectionResult | null>(null);
  const [showHybridSelector, setShowHybridSelector] = useState(false);

  /**
   * Maneja la selección desde el AddressInput
   */
  const handleAddressInputSelect = (location: LocationSelectionResult) => {
    setSelectedFromInput(location);
    Alert.alert(
      'Dirección encontrada',
      `${location.name}\n${location.address}`,
      [{ text: 'OK' }]
    );
  };

  /**
   * Maneja la selección desde el AddressMapSelector
   */
  const handleHybridSelect = (location: LocationSelectionResult) => {
    setSelectedFromHybrid(location);
  };

  /**
   * Abre el selector híbrido
   */
  const handleOpenHybridSelector = () => {
    setShowHybridSelector(true);
  };

  /**
   * Cierra el selector híbrido
   */
  const handleCloseHybridSelector = () => {
    setShowHybridSelector(false);
  };

  /**
   * Confirma la selección del selector híbrido
   */
  const handleConfirmHybridSelection = () => {
    if (selectedFromHybrid) {
      setShowHybridSelector(false);
      Alert.alert(
        'Ubicación confirmada',
        `Se ha seleccionado: ${selectedFromHybrid.name}`,
        [{ text: 'OK' }]
      );
    }
  };

  if (showHybridSelector) {
    return (
      <SafeAreaView style={styles.fullScreenContainer}>
        {/* Header del selector híbrido */}
        <View style={styles.hybridHeader}>
          <TouchableOpacity onPress={handleCloseHybridSelector}>
            <Ionicons name="arrow-back" size={24} color="#007AFF" />
          </TouchableOpacity>
          
          <Text style={styles.hybridTitle}>Selector Completo</Text>
          
          <TouchableOpacity 
            onPress={handleConfirmHybridSelection}
            disabled={!selectedFromHybrid}
            style={[
              styles.confirmButton,
              !selectedFromHybrid && styles.confirmButtonDisabled
            ]}
          >
            <Text style={[
              styles.confirmButtonText,
              !selectedFromHybrid && styles.confirmButtonTextDisabled
            ]}>
              Listo
            </Text>
          </TouchableOpacity>
        </View>

        {/* Selector híbrido */}
        <AddressMapSelector
          onLocationSelect={handleHybridSelect}
          showCurrentLocationButton={true}
          showAddressInput={true}
          placeholder="Search for an address in the map..."
          style={styles.hybridSelector}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Componentes de Dirección</Text>
          <Text style={styles.subtitle}>
            Ejemplos completos de todos los componentes disponibles
          </Text>
        </View>

        {/* Sección 1: AddressInput Simple */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="search" size={20} color="#007AFF" />
            <Text style={styles.sectionTitle}>1. Búsqueda Simple</Text>
          </View>
          
          <Text style={styles.sectionDescription}>
            Input básico para escribir direcciones con geocodificación automática
          </Text>

          <AddressInput
            onAddressSelect={handleAddressInputSelect}
            placeholder="Escribe una dirección (ej: Torre Latinoamericana, CDMX)"
            showSuggestions={true}
            style={styles.addressInput}
          />

          {selectedFromInput && (
            <LocationPreview
              location={selectedFromInput}
              showActions={false}
              style={styles.previewCard}
            />
          )}
        </View>

        {/* Sección 2: Selector Híbrido */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="layers" size={20} color="#28a745" />
            <Text style={styles.sectionTitle}>2. Selector Híbrido</Text>
          </View>
          
          <Text style={styles.sectionDescription}>
            Combina búsqueda por texto y selección en mapa con alternancia entre modos
          </Text>

          <TouchableOpacity
            style={styles.openHybridButton}
            onPress={handleOpenHybridSelector}
          >
            <Ionicons name="map" size={20} color="#fff" />
            <Text style={styles.openHybridButtonText}>
              Abrir Selector Completo
            </Text>
          </TouchableOpacity>

          {selectedFromHybrid && (
            <LocationPreview
              location={selectedFromHybrid}
              onEdit={handleOpenHybridSelector}
              style={styles.previewCard}
            />
          )}
        </View>

        {/* Sección 3: Características */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="checkmark-circle" size={20} color="#ffc107" />
            <Text style={styles.sectionTitle}>3. Características</Text>
          </View>

          <View style={styles.featuresList}>
            <View style={styles.feature}>
              <Ionicons name="search" size={16} color="#007AFF" />
              <Text style={styles.featureText}>Geocodificación directa (dirección → coordenadas)</Text>
            </View>
            
            <View style={styles.feature}>
              <Ionicons name="location" size={16} color="#007AFF" />
              <Text style={styles.featureText}>Geocodificación reversa (coordenadas → dirección)</Text>
            </View>
            
            <View style={styles.feature}>
              <Ionicons name="list" size={16} color="#007AFF" />
              <Text style={styles.featureText}>Sugerencias múltiples de ubicaciones</Text>
            </View>
            
            <View style={styles.feature}>
              <Ionicons name="swap-horizontal" size={16} color="#007AFF" />
              <Text style={styles.featureText}>Alternancia entre mapa y búsqueda</Text>
            </View>
            
            <View style={styles.feature}>
              <Ionicons name="phone-portrait" size={16} color="#007AFF" />
              <Text style={styles.featureText}>Interfaz optimizada para móvil</Text>
            </View>
            
            <View style={styles.feature}>
              <Ionicons name="code-slash" size={16} color="#007AFF" />
              <Text style={styles.featureText}>TypeScript completo</Text>
            </View>
          </View>
        </View>

        {/* Sección 4: Ejemplos de Uso */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="code-working" size={20} color="#6f42c1" />
            <Text style={styles.sectionTitle}>4. Código de Ejemplo</Text>
          </View>

          <View style={styles.codeExample}>
            <Text style={styles.codeTitle}>Uso básico:</Text>
            <Text style={styles.codeText}>{`import { AddressInput } from './componentes/maps';

const handleSelect = (location) => {
  console.log('Ubicación:', location.name);
  console.log('Coordenadas:', location.coordinates);
};

<AddressInput 
  onAddressSelect={handleSelect}
  placeholder="Buscar dirección..."
/>`}</Text>
          </View>

          <View style={styles.codeExample}>
            <Text style={styles.codeTitle}>Selector híbrido:</Text>
            <Text style={styles.codeText}>{`import { AddressMapSelector } from './componentes/maps';

<AddressMapSelector
  onLocationSelect={handleSelect}
  showCurrentLocationButton={true}
  showAddressInput={true}
/>`}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  fullScreenContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
  },
  section: {
    margin: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 16,
  },
  addressInput: {
    marginBottom: 16,
  },
  previewCard: {
    marginTop: 12,
  },
  openHybridButton: {
    backgroundColor: '#28a745',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    gap: 8,
    marginBottom: 16,
  },
  openHybridButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  featuresList: {
    gap: 12,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    lineHeight: 18,
  },
  codeExample: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
    marginBottom: 12,
  },
  codeTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  codeText: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#666',
    lineHeight: 16,
  },
  hybridHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  hybridTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  confirmButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  confirmButtonDisabled: {
    backgroundColor: '#ccc',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButtonTextDisabled: {
    color: '#999',
  },
  hybridSelector: {
    flex: 1,
  },
});

export default CompleteAddressExampleScreen;
