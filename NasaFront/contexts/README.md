# EventContext - Gestión de Datos del Evento

## Descripción

`EventContext` es un contexto de React que permite compartir datos del evento (ubicación, fecha y horarios) entre diferentes pantallas de la aplicación.

## Estructura de Datos

### EventData
```typescript
interface EventData {
  location: LocationSelectionResult | null;  // Ubicación seleccionada
  date: Date | undefined;                    // Fecha del evento
  startTime: string;                         // Hora de inicio (HH:mm:ss)
  endTime: string;                           // Hora de fin (HH:mm:ss)
}
```

### FormattedEventData
Datos formateados listos para enviar a la API:
```typescript
interface FormattedEventData {
  latitude: number;
  longitude: number;
  address: string;
  name: string;
  date: string;           // YYYY-MM-DD
  time_start: string;     // YYYY-MM-DDThh:mm:ss
  end_time: string;       // YYYY-MM-DDThh:mm:ss
}
```

## Uso

### 1. Importar el hook
```typescript
import { useEvent } from '@/contexts/EventContext';
```

### 2. Usar en un componente
```typescript
const MyComponent = () => {
  const { 
    eventData,           // Datos actuales del evento
    setLocation,         // Guardar ubicación
    setDate,            // Guardar fecha
    setStartTime,       // Guardar hora de inicio
    setEndTime,         // Guardar hora de fin
    clearEventData,     // Limpiar todos los datos
    getFormattedData    // Obtener datos formateados para API
  } = useEvent();

  // Guardar ubicación
  const handleLocationSelect = (location: LocationSelectionResult) => {
    setLocation(location);
  };

  // Guardar fecha
  const handleDateChange = (date: Date) => {
    setDate(date);
  };

  // Obtener datos para enviar a la API
  const handleSubmit = () => {
    const apiData = getFormattedData();
    if (apiData) {
      console.log('Datos para API:', apiData);
      // Enviar a tu backend
    } else {
      console.log('Faltan datos requeridos');
    }
  };
};
```

## Flujo de la Aplicación

### Pantalla 1: Selección de Ubicación (`/map`)
1. Usuario selecciona ubicación en el mapa
2. Se guarda en el contexto con `setLocation()`
3. Usuario presiona "Continuar"
4. Navega a la pantalla de fecha/hora

### Pantalla 2: Selección de Fecha y Hora (`/map/dateHour`)
1. Lee la ubicación del contexto (`eventData.location`)
2. Muestra el mapa con la ubicación seleccionada
3. Usuario selecciona fecha y hora
4. Se guardan en el contexto con `setDate()` y `setStartTime()`
5. Usuario presiona "Enviar"
6. Se obtienen todos los datos con `getFormattedData()`
7. Se envían a la API o siguiente pantalla

## Validación

`getFormattedData()` retorna `null` si faltan datos requeridos:
- Ubicación (location)
- Fecha (date)
- Hora de inicio (startTime)

La hora de fin (endTime) es opcional. Si no se proporciona, se usa `23:59:59` del mismo día.

## Ejemplo Completo

```typescript
// En la pantalla de mapa
const MapScreen = () => {
  const { setLocation } = useEvent();

  const handleLocationSelect = (location: LocationSelectionResult) => {
    setLocation(location);
  };

  const handleContinue = () => {
    router.push('/map/dateHour');
  };

  return (
    <MapWithAddressInput onLocationSelect={handleLocationSelect} />
  );
};

// En la pantalla de fecha/hora
const DateHourScreen = () => {
  const { eventData, setDate, setStartTime, getFormattedData } = useEvent();

  const handleSubmit = () => {
    const apiData = getFormattedData();
    if (apiData) {
      // Enviar a la API
      fetch('/api/events', {
        method: 'POST',
        body: JSON.stringify(apiData)
      });
    }
  };

  return (
    <>
      <DatePicker onChange={setDate} />
      <TimeDropdown onSelect={(period) => setStartTime(period.value)} />
      <Button onPress={handleSubmit} />
    </>
  );
};
```

## Notas Importantes

- El contexto está envuelto en el `StackLayout`, por lo que está disponible en todas las pantallas del stack
- Los datos persisten mientras el usuario navega entre pantallas
- Usa `clearEventData()` si necesitas resetear todos los datos
- Los datos NO persisten si la app se cierra (no hay persistencia en AsyncStorage)
