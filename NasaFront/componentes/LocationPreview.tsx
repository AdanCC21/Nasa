import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LocationSelectionResult } from '../types/location';

interface LocationPreviewProps {
  location: LocationSelectionResult;
  onEdit?: () => void;
  onConfirm?: () => void;
  showActions?: boolean;
  style?: object;
}

/**
 * Componente para mostrar una vista previa de la ubicación seleccionada
 * Útil para confirmar la selección antes de proceder
 */
const LocationPreview: React.FC<LocationPreviewProps> = ({
  location,
  onEdit,
  onConfirm,
  showActions = true,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="location" size={24} color="#007AFF" />
        <Text style={styles.title}>Ubicación Seleccionada</Text>
      </View>

      {/* Location Info */}
      <View style={styles.content}>
        <Text style={styles.name}>{location.name}</Text>
        <Text style={styles.address}>{location.address}</Text>
        
        <View style={styles.coordinates}>
          <Text style={styles.coordinateLabel}>Coordenadas:</Text>
          <Text style={styles.coordinateValue}>
            {location.coordinates.latitude.toFixed(6)}, {location.coordinates.longitude.toFixed(6)}
          </Text>
        </View>
      </View>

      {/* Actions */}
      {showActions && (
        <View style={styles.actions}>
          {onEdit && (
            <TouchableOpacity style={[styles.button, styles.editButton]} onPress={onEdit}>
              <Ionicons name="pencil" size={16} color="#666" />
              <Text style={styles.editButtonText}>Editar</Text>
            </TouchableOpacity>
          )}
          
          {onConfirm && (
            <TouchableOpacity style={[styles.button, styles.confirmButton]} onPress={onConfirm}>
              <Ionicons name="checkmark" size={16} color="#fff" />
              <Text style={styles.confirmButtonText}>Confirmar</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  content: {
    marginBottom: 16,
  },
  name: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  address: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 8,
  },
  coordinates: {
    backgroundColor: '#f8f9fa',
    padding: 8,
    borderRadius: 6,
  },
  coordinateLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  coordinateValue: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#333',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 6,
  },
  editButton: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  editButtonText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
  confirmButton: {
    backgroundColor: '#007AFF',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default LocationPreview;
