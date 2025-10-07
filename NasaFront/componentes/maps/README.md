# MapSelector Component

Componente de React Native para selección de ubicaciones en mapas, construido con `react-native-maps` y `expo-location`.

## Características

- ✅ Selección de ubicación mediante tap en el mapa
- ✅ Botón para obtener ubicación actual del usuario
- ✅ Geocodificación reversa automática
- ✅ Marcador personalizable
- ✅ Manejo de errores y estados de carga
- ✅ TypeScript completo
- ✅ Hook personalizado reutilizable

## Instalación

Las dependencias ya están instaladas en el proyecto:

```bash
npx expo install react-native-maps expo-location
```

## Configuración

Los permisos ya están configurados en `app.json`:

```json
{
  "plugins": [
    [
      "expo-location",
      {
        "locationAlwaysAndWhenInUsePermission": "Esta aplicación necesita acceso a la ubicación para mostrar mapas y permitir la selección de ubicaciones.",
        "locationWhenInUsePermission": "Esta aplicación necesita acceso a la ubicación para mostrar mapas y permitir la selección de ubicaciones."
      }
    ]
  ]
}
```

## Uso Básico

```tsx
import React from 'react';
import { MapSelector } from './componentes/maps';
import { LocationSelectionResult } from './types/location';

const MyScreen = () => {
  const handleLocationSelect = (location: LocationSelectionResult) => {
    console.log('Ubicación seleccionada:', {
      name: location.name,
      address: location.address,
      latitude: location.coordinates.latitude,
      longitude: location.coordinates.longitude,
    });
  };

  return (
    <MapSelector
      onLocationSelect={handleLocationSelect}
      showCurrentLocationButton={true}
      markerTitle="Mi ubicación"
      markerDescription="Ubicación seleccionada"
    />
  );
};
```

## Props del Componente

| Prop | Tipo | Requerido | Default | Descripción |
|------|------|-----------|---------|-------------|
| `onLocationSelect` | `(location: LocationSelectionResult) => void` | ✅ | - | Callback ejecutado cuando se selecciona una ubicación |
| `initialRegion` | `MapRegion` | ❌ | Ciudad de México | Región inicial del mapa |
| `showCurrentLocationButton` | `boolean` | ❌ | `true` | Mostrar botón de ubicación actual |
| `markerTitle` | `string` | ❌ | `"Ubicación seleccionada"` | Título del marcador |
| `markerDescription` | `string` | ❌ | `"Toca para confirmar esta ubicación"` | Descripción del marcador |
| `style` | `object` | ❌ | - | Estilos personalizados para el contenedor |

## Tipos TypeScript

### LocationSelectionResult

```tsx
interface LocationSelectionResult {
  coordinates: {
    latitude: number;
    longitude: number;
  };
  name: string;
  address: string;
}
```

### MapRegion

```tsx
interface MapRegion {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}
```

## Hook useLocation

El componente utiliza un hook personalizado que también puedes usar independientemente:

```tsx
import { useLocation } from './hooks/useLocation';

const MyComponent = () => {
  const { location, loading, error, getCurrentLocation, reverseGeocode } = useLocation();

  // Obtener ubicación actual
  const handleGetLocation = async () => {
    await getCurrentLocation();
  };

  // Geocodificación reversa
  const handleReverseGeocode = async (coordinates) => {
    const result = await reverseGeocode(coordinates);
    console.log(result);
  };
};
```

## Ejemplo Completo

Revisa el archivo `app/map-example.tsx` para ver un ejemplo completo de implementación.

## Personalización

### Estilos del Mapa

```tsx
<MapSelector
  style={{ height: 400, borderRadius: 10 }}
  // ... otras props
/>
```

### Región Inicial Personalizada

```tsx
<MapSelector
  initialRegion={{
    latitude: 40.7128,  // Nueva York
    longitude: -74.0060,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  }}
  // ... otras props
/>
```

## Manejo de Errores

El componente maneja automáticamente:

- Permisos de ubicación denegados
- Errores de geocodificación
- Errores de red
- Ubicación no disponible

Los errores se muestran en la interfaz y se registran en la consola.

## Consideraciones

1. **Permisos**: El componente solicita permisos automáticamente
2. **Rendimiento**: Usa geocodificación reversa solo cuando es necesario
3. **Fallbacks**: Proporciona coordenadas como fallback si falla la geocodificación
4. **Accesibilidad**: Incluye textos descriptivos para lectores de pantalla

## Troubleshooting

### El mapa no se muestra

1. Verifica que las dependencias estén instaladas
2. Asegúrate de que los permisos estén configurados en `app.json`
3. Reinicia el servidor de desarrollo después de cambios en `app.json`

### Geocodificación no funciona

1. Verifica conexión a internet
2. Confirma que los permisos de ubicación estén otorgados
3. Revisa la consola para errores específicos
