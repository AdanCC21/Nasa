/**
 * Tipos relacionados con ubicación y mapas
 */

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
}

export interface LocationData extends LocationCoordinates {
  name?: string;
  address?: string;
}

export interface MapRegion extends LocationCoordinates {
  latitudeDelta: number;
  longitudeDelta: number;
}

export interface LocationSelectionResult {
  coordinates: LocationCoordinates;
  name: string;
  address: string;
}

export interface UseLocationReturn {
  location: LocationData | null;
  loading: boolean;
  error: string | null;
  getCurrentLocation: () => Promise<void>;
  reverseGeocode: (coordinates: LocationCoordinates) => Promise<LocationSelectionResult>;
  geocodeAddress: (address: string) => Promise<LocationSelectionResult[]>;
}

export interface MapSelectorProps {
  initialRegion?: MapRegion;
  onLocationSelect: (location: LocationSelectionResult) => void;
  showCurrentLocationButton?: boolean;
  markerTitle?: string;
  markerDescription?: string;
  style?: object;
}

export interface AddressInputProps {
  onAddressSelect: (location: LocationSelectionResult) => void;
  placeholder?: string;
  initialValue?: string;
  showSuggestions?: boolean;
  style?: object;
  inputStyle?: object;
}

export interface AddressMapSelectorProps {
  onLocationSelect: (location: LocationSelectionResult) => void;
  initialRegion?: MapRegion;
  showCurrentLocationButton?: boolean;
  showAddressInput?: boolean;
  placeholder?: string;
  style?: object;
}

export interface GeocodeResult {
  address: string;
  coordinates: LocationCoordinates;
  name: string;
}
