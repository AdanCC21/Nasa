/**
 * Exportaciones principales para el sistema de mapas
 * 
 * Este archivo centraliza todas las exportaciones relacionadas con mapas
 * para facilitar las importaciones en otros archivos del proyecto.
 */

// Componentes
export { default as MapSelector } from '../MapSelector';
export { default as LocationPreview } from '../LocationPreview';
export { default as AddressInput } from '../AddressInput';
export { default as AddressMapSelector } from '../AddressMapSelector';
export { default as MapWithAddressInput } from '../MapWithAddressInput';

// Hooks
export { useLocation } from '../../hooks/useLocation';

// Tipos
export type {
  LocationCoordinates,
  LocationData,
  MapRegion,
  LocationSelectionResult,
  UseLocationReturn,
  MapSelectorProps,
  AddressInputProps,
  AddressMapSelectorProps,
  GeocodeResult,
} from '../../types/location';
