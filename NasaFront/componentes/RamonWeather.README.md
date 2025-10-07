# RamonWeather Component

Componente que muestra la imagen del personaje Ramon según las condiciones climáticas.

## Características

- **Selección automática de imagen**: Muestra diferentes versiones de Ramon basándose en temperatura, precipitación y radiación solar
- **Tamaño personalizable**: Prop `size` para ajustar el tamaño de la imagen
- **TypeScript**: Completamente tipado con interfaces

## Lógica de Selección de Imágenes

El componente usa la misma lógica que `getWeatherBackground()` para determinar qué imagen mostrar:

| Condición | Imagen | Criterio |
|-----------|--------|----------|
| **Lluvia** | `RamonRainy.png` | `precipitation >= 70%` |
| **Muy Frío** | `RamonVeryCold.png` | `temperature < 5°C` |
| **Frío** | `RamonCold.png` | `temperature < 15°C` |
| **Muy Caliente** | `RamonHi.png` | `temperature > 30°C` |
| **Soleado** | `RamonSunny.png` | `solarRadiation > 600 && precipitation < 20` |
| **Por Defecto** | `Ramon.png` | Cualquier otra condición |

## Uso

```tsx
import RamonWeather from '@/componentes/RamonWeather';

// En tu componente
<RamonWeather 
  weatherData={weatherData} 
  size={180} // Opcional, default: 150
/>
```

## Props

- `weatherData` (required): Objeto con datos del clima
  - `temperature`: Temperatura en °C
  - `precipitation`: Porcentaje de precipitación
  - `solarRadiation`: Radiación solar en W/m²
  - `humidity`: Humedad relativa en %
  - `windSpeed`: Velocidad del viento en km/h
  - `maxTemp`: Temperatura máxima
  - `minTemp`: Temperatura mínima

- `size` (optional): Tamaño de la imagen en píxeles (default: 150)

## Imágenes Disponibles

Todas las imágenes están en `/assets/images/`:
- `Ramon.png` - Normal
- `RamonCold.png` - Frío
- `RamonVeryCold.png` - Muy frío
- `RamonHi.png` - Calor
- `RamonSunny.png` - Soleado
- `RamonRainy.png` - Lluvia

## Integración

El componente está integrado en la pantalla de Resultados (`app/(stack)/Resultados/index.tsx`) y se muestra junto con el ícono del clima y la temperatura.
