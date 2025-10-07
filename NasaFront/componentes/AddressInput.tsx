import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useLocation } from '../hooks/useLocation';
import { AddressInputProps, LocationSelectionResult } from '../types/location';

/**
 * Componente AddressInput - Permite escribir una dirección y obtener coordenadas
 * 
 * Características:
 * - Input de texto para escribir direcciones
 * - Geocodificación directa (dirección → coordenadas)
 * - Lista de sugerencias/resultados
 * - Manejo de estados de carga y errores
 * - Botón de búsqueda
 */
const AddressInput: React.FC<AddressInputProps> = ({
  onAddressSelect,
  placeholder = 'Escribe una dirección...',
  initialValue = '',
  showSuggestions = true,
  style,
  inputStyle,
}) => {
  // Estados locales
  const [inputText, setInputText] = useState<string>(initialValue);
  const [suggestions, setSuggestions] = useState<LocationSelectionResult[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [showSuggestionsList, setShowSuggestionsList] = useState<boolean>(false);

  // Hook personalizado para geocodificación
  const { geocodeAddress } = useLocation();
  
  // Referencia al input
  const inputRef = useRef<TextInput>(null);

  /**
   * Realiza la búsqueda de direcciones
   */
  const handleSearch = useCallback(async (address?: string) => {
    const searchAddress = address || inputText.trim();
    
    if (!searchAddress) {
      Alert.alert('Error', 'Por favor escribe una dirección');
      return;
    }

    try {
      setIsSearching(true);
      setSuggestions([]);
      
      const results = await geocodeAddress(searchAddress);
      
      if (results.length === 0) {
        Alert.alert(
          'Sin resultados', 
          'No se encontraron ubicaciones para la dirección especificada'
        );
        return;
      }

      setSuggestions(results);
      
      if (showSuggestions && results.length > 1) {
        setShowSuggestionsList(true);
      } else {
        // Si solo hay un resultado, seleccionarlo automáticamente
        handleSelectSuggestion(results[0]);
      }

    } catch (error) {
      console.error('Error buscando dirección:', error);
      Alert.alert(
        'Error de búsqueda',
        'No se pudo buscar la dirección. Verifica tu conexión a internet.'
      );
    } finally {
      setIsSearching(false);
    }
  }, [inputText, geocodeAddress, showSuggestions]);

  /**
   * Maneja la selección de una sugerencia
   */
  const handleSelectSuggestion = useCallback((suggestion: LocationSelectionResult) => {
    setInputText(suggestion.address);
    setShowSuggestionsList(false);
    setSuggestions([]);
    Keyboard.dismiss();
    onAddressSelect(suggestion);
  }, [onAddressSelect]);

  /**
   * Maneja el cambio de texto en el input
   */
  const handleTextChange = useCallback((text: string) => {
    setInputText(text);
    
    // Ocultar sugerencias si el texto está vacío
    if (!text.trim()) {
      setShowSuggestionsList(false);
      setSuggestions([]);
    }
  }, []);

  /**
   * Maneja el evento de envío del formulario (Enter)
   */
  const handleSubmitEditing = useCallback(() => {
    handleSearch();
  }, [handleSearch]);

  /**
   * Limpia el input y las sugerencias
   */
  const handleClear = useCallback(() => {
    setInputText('');
    setSuggestions([]);
    setShowSuggestionsList(false);
    inputRef.current?.focus();
  }, []);

  /**
   * Renderiza un elemento de la lista de sugerencias
   */
  const renderSuggestionItem = ({ item }: { item: LocationSelectionResult }) => (
    <TouchableOpacity
      style={styles.suggestionItem}
      onPress={() => handleSelectSuggestion(item)}
    >
      <View style={styles.suggestionContent}>
        <Ionicons name="location-outline" size={20} color="#666" />
        <View style={styles.suggestionText}>
          <Text style={styles.suggestionName} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.suggestionAddress} numberOfLines={2}>
            {item.address}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, style]}>
      {/* Input de dirección */}
      <View style={styles.inputContainer}>
        <View style={[styles.inputWrapper, inputStyle]}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          
          <TextInput
            ref={inputRef}
            style={styles.textInput}
            value={inputText}
            onChangeText={handleTextChange}
            onSubmitEditing={handleSubmitEditing}
            placeholder={placeholder}
            placeholderTextColor="#999"
            returnKeyType="search"
            autoCapitalize="words"
            autoCorrect={true}
            editable={!isSearching}
          />

          {/* Botón de limpiar */}
          {inputText.length > 0 && !isSearching && (
            <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}

          {/* Indicador de carga */}
          {isSearching && (
            <ActivityIndicator size="small" color="#007AFF" style={styles.loadingIndicator} />
          )}
        </View>

        {/* Botón de búsqueda */}
        <TouchableOpacity
          style={[styles.searchButton, isSearching && styles.searchButtonDisabled]}
          onPress={() => handleSearch()}
          disabled={isSearching || !inputText.trim()}
        >
          <Ionicons 
            name="search" 
            size={20} 
            color={isSearching || !inputText.trim() ? '#999' : '#fff'} 
          />
        </TouchableOpacity>
      </View>

      {/* Lista de sugerencias */}
      {showSuggestionsList && suggestions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          <FlatList
            data={suggestions}
            renderItem={renderSuggestionItem}
            keyExtractor={(item, index) => `${item.coordinates.latitude}-${item.coordinates.longitude}-${index}`}
            style={styles.suggestionsList}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  inputContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  clearButton: {
    marginLeft: 8,
  },
  loadingIndicator: {
    marginLeft: 8,
  },
  searchButton: {
    backgroundColor: '#007AFF',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 48,
  },
  searchButtonDisabled: {
    backgroundColor: '#ccc',
  },
  suggestionsContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginTop: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    maxHeight: 200,
  },
  suggestionsList: {
    maxHeight: 200,
  },
  suggestionItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  suggestionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  suggestionText: {
    flex: 1,
    marginLeft: 12,
  },
  suggestionName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  suggestionAddress: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
  },
});

export default AddressInput;
