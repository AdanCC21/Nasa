import CloudsBackground from '@/componentes/CloudsBackground';
import CloudyBackground from '@/componentes/CloudyBackground';
import RainyBackground from '@/componentes/RainyBackground';
import SunnyBackground from '@/componentes/sunny';
import RamonWeather from '@/componentes/RamonWeather';
import { Feather, Ionicons } from '@expo/vector-icons';
import Entypo from '@expo/vector-icons/Entypo';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import WeatherCard from '../../../componentes/Weathercard';
import { useWeatherPrediction } from '@/hooks/useAPI';
import { useEvent } from '@/contexts/EventContext';
import { Time, Location, WeatherPredictionRequest } from '@/types/api';
import { router } from 'expo-router';

interface WeatherData {
  temperature: number;
  maxTemp: number;
  minTemp: number;
  precipitation: number;
  humidity: number;
  solarRadiation: number;
  windSpeed: number;
}

const ResultadosScreen = () => {
  const safeAreaInsets = useSafeAreaInsets();
  const { eventData, getFormattedData, setWeatherData: setContextWeatherData, setRecommendations: setContextRecommendations } = useEvent();
  const { getWeatherPrediction, loading, error, data } = useWeatherPrediction();

  // Estados para almacenar los datos del clima, las recomendaciones y el estado de carga
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [recommendations, setRecommendations] = useState<string>('');
  const [hasExecuted, setHasExecuted] = useState<boolean>(false); // Para evitar ciclos infinitos

  // Función para convertir datos del contexto a formato de API
  const prepareWeatherRequest = (): WeatherPredictionRequest | null => {
    const formattedData = getFormattedData();
    if (!formattedData || !eventData.location) {
      return null;
    }

    // Convertir fecha y hora al formato requerido por la API
    const eventDate = new Date(formattedData.date);

    // Extraer solo la hora de los timestamps ISO
    const startTime = new Date(formattedData.time_start);
    const endTime = new Date(formattedData.end_time);

    const timeData: Time = {
      day: eventDate.getDate(),
      month: eventDate.getMonth() + 1, // getMonth() retorna 0-11
      start_time: startTime.toTimeString().substring(0, 5), // "HH:mm" format
      end_time: endTime.toTimeString().substring(0, 5), // "HH:mm" format
    };

    const locationData: Location = {
      lat: formattedData.latitude,
      lon: formattedData.longitude,
    };

    return {
      time: timeData,
      location: locationData,
      plan: eventData.plan || "",
    };
  };

  // Función para convertir datos de la API al formato local
  const convertAPIDataToLocal = (apiData: any): WeatherData => {
    // La respuesta del backend tiene la estructura: { data: { summary: {...}, data: [...] }, recomendations: [...] }
    const summary = apiData.data?.summary || apiData.summary || apiData;

    // Función helper para convertir Kelvin a Celsius
    const kelvinToCelsius = (kelvin: number): number => {
      return Math.round(kelvin - 273.15);
    };

    // Convertir humedad específica a porcentaje relativo (aproximación)
    const specificToRelativeHumidity = (specificHumidity: number): number => {
      // Conversión más precisa de humedad específica (kg/kg) a humedad relativa (%)
      // Para humedad específica típica de 0.01-0.02, esto da ~70-90% de humedad relativa
      const relativeHumidity = specificHumidity * 7000; // Factor de conversión ajustado
      return Math.min(Math.max(Math.round(relativeHumidity), 0), 100);
    };

    return {
      temperature: kelvinToCelsius(summary.temperatura || 293.15), // Default ~20°C
      maxTemp: kelvinToCelsius(summary.temperatura_max || summary.temperatura || 298.15), // Default ~25°C
      minTemp: kelvinToCelsius(summary.temperatura_min || summary.temperatura || 288.15), // Default ~15°C
      precipitation: Math.round((summary.precipitacion || 0) * 100), // Convertir a porcentaje
      humidity: specificToRelativeHumidity(summary.humedad || 0.5), // Convertir humedad específica
      solarRadiation: Math.round(summary.radiacion_solar || 500),
      windSpeed: Math.round(summary.velocidad_viento || 5),
    };
  };  // Función para determinar la condición climática basada en los datos
  const getWeatherCondition = (data: WeatherData) => {
    if (data.precipitation >= 70) return 'Rainy';
    if (data.precipitation >= 30) return 'Cloudy';
    if (data.solarRadiation > 600 && data.precipitation < 20) return 'Sunny';
    return 'Partly Cloudy';
  };

  // Función para obtener ícono según la condición determinada
  const getWeatherIcon = (data: WeatherData) => {
    const condition = getWeatherCondition(data);
    const conditions: { [key: string]: any } = {
      'Sunny': 'sunny',
      'Cloudy': 'cloudy',
      'Rainy': 'rainy',
      'Stormy': 'thunderstorm',
      'Partly Cloudy': 'partly-sunny'
    };
    return conditions[condition] || 'cloud';
  };

  // Función para obtener ícono de precipitación según porcentaje
  const getPrecipitationIcon = (percentage: number) => {
    if (percentage >= 80) return 'rainy';
    if (percentage >= 50) return 'rainy-outline';
    if (percentage >= 20) return 'cloud-outline';
    return 'sunny-outline';
  };

  // Función para obtener ícono de humedad según porcentaje
  const getHumidityIcon = (percentage: number) => {
    if (percentage >= 80) return 'water';
    if (percentage >= 50) return 'water-outline';
    return 'leaf-outline';
  };

  // Función para obtener ícono de radiación solar (valores numéricos en W/m²)
  const getSolarRadiationIcon = (radiation: number) => {
    if (radiation >= 1000) return 'flame'; // Muy alta
    if (radiation >= 600) return 'sunny'; // Alta
    if (radiation >= 300) return 'sunny-outline'; // Moderada
    return 'partly-sunny'; // Baja
  };

  // Función para obtener el nivel de radiación solar como texto
  const getSolarRadiationLevel = (radiation: number) => {
    if (radiation >= 1000) return 'Very High';
    if (radiation >= 600) return 'High';
    if (radiation >= 300) return 'Moderate';
    return 'Low';
  };

  // Función para obtener ícono de viento según velocidad
  const getWindIcon = (speed: number) => {
    if (speed >= 15) return <Entypo name="air" size={32} color="white" />;
    if (speed < 15) return 'leaf';
    return 'refresh-outline';
  };

  // Función para obtener descripción de índice UV
  const getUVDescription = (index: number) => {
    if (index <= 2) return 'Bajo';
    if (index <= 5) return 'Moderado';
    if (index <= 7) return 'Alto';
    if (index <= 10) return 'Muy Alto';
    return 'Extremo';
  };

  // Función para obtener el fondo según los datos climáticos
  const getWeatherBackground = (data: WeatherData) => {
    const condition = getWeatherCondition(data);
    if (condition === 'Rainy') {
      return <RainyBackground />;
    }
    else if (condition === 'Sunny') {
      return <SunnyBackground />;
    }
    else if (condition === 'Partly Cloudy') {
      return <CloudsBackground />;
    }
    else {
      return <CloudyBackground />;
    }
  };

  // Función para obtener el color del ícono principal según los datos
  const getIconColor = (data: WeatherData) => {
    const condition = getWeatherCondition(data);
    if (condition === 'Rainy') {
      return '#E5E7EB'; // Gris claro para lluvia
    }
    if (condition === 'Sunny') {
      return '#FDE047'; // Amarillo para soleado
    }
    if (condition === 'Cloudy') {
      return '#9CA3AF'; // Gris para nublado
    }
    return 'white'; // Color por defecto
  };

  // useEffect se ejecuta una vez cuando el componente se monta para buscar los datos
  useEffect(() => {
    // Evitar ejecuciones múltiples y verificar que tengamos los datos necesarios
    if (hasExecuted || !eventData.location || !eventData.date || !eventData.startTime || loading) {
      return;
    }

    // Si ya tenemos datos meteorológicos en el contexto, no hacer nueva consulta
    if (eventData.weatherData && weatherData) {
      console.log('🔄 Datos ya disponibles, evitando nueva consulta');
      return;
    }

    const fetchWeatherData = async () => {
      const requestData = prepareWeatherRequest();

      if (!requestData) {
        console.error('No hay datos suficientes para hacer la petición');
        return;
      }

      // Marcar como ejecutado ANTES de hacer la consulta
      setHasExecuted(true);

      // Log de los datos que se envían al backend
      console.log('📤 Enviando datos al backend:', JSON.stringify(requestData, null, 2));

      try {
        const response = await getWeatherPrediction(requestData);
        console.log('📥 Respuesta del backend:', JSON.stringify(response, null, 2));

        const localWeatherData = convertAPIDataToLocal(response);
        setWeatherData(localWeatherData);

        // Guardar datos completos en el contexto para el chat
        setContextWeatherData(response);

        // Usar recomendaciones del backend si están disponibles
        console.log('🔍 Revisando recomendaciones:', response.recomendations);
        console.log('🔍 Tipo de recomendaciones:', typeof response.recomendations);
        console.log('🔍 Es array?:', Array.isArray(response.recomendations));

        if (response.recomendations && Array.isArray(response.recomendations)) {
          console.log('✅ Usando recomendaciones del backend:', response.recomendations);
          setRecommendations(response.recomendations.join(' '));
          setContextRecommendations(response.recomendations);
        } else {
          console.log('⚠️ No hay recomendaciones del backend, generando fallback');
          // Generar recomendaciones básicas como fallback
          generateRecommendations(localWeatherData);
        }

      } catch (error) {
        console.error('Error fetching weather data:', error);
        // En caso de error, usar datos de ejemplo
        const fallbackData: WeatherData = {
          temperature: 22,
          maxTemp: 25,
          minTemp: 18,
          precipitation: 10,
          humidity: 65,
          solarRadiation: 600,
          windSpeed: 8,
        };
        setWeatherData(fallbackData);
        generateRecommendations(fallbackData);
      }
    };

    fetchWeatherData();
  }, [eventData.location, eventData.date, eventData.startTime, hasExecuted, loading]); // Incluir loading

  // Función para generar recomendaciones básicas
  const generateRecommendations = (data: WeatherData) => {
    let recs = [];

    if (data.precipitation > 50) {
      recs.push("High chance of rain - bring an umbrella!");
    }
    if (data.temperature > 30) {
      recs.push("Very hot - stay hydrated and seek shade.");
    }
    if (data.temperature < 10) {
      recs.push("Cold weather - dress warmly.");
    }
    if (data.windSpeed > 15) {
      recs.push("Strong winds expected - secure loose items.");
    }
    if (data.solarRadiation > 800) {
      recs.push("High UV radiation - use sunscreen.");
    }

    if (recs.length === 0) {
      recs.push("Perfect weather conditions for your activities!");
    }

    setRecommendations(recs.join(" "));
    setContextRecommendations(recs);
  };

  // Pantalla de carga mientras se obtienen los datos
  if (loading) {
    return (
      <View className='flex-1 bg-blue-900 items-center justify-center'>
        <ActivityIndicator size="large" color="white" />
        <Text className='text-white text-xl mt-4'>Loading weather data...</Text>
      </View>
    );
  }

  // Si no hay datos después de la carga, mostrar error
  if (!weatherData) {
    return (
      <View className='flex-1 bg-blue-900 items-center justify-center px-4'>
        <Ionicons name="cloud-offline" size={100} color="white" />
        <Text className='text-white text-xl text-center mt-4'>Unable to load weather data</Text>
        <TouchableOpacity
          onPress={() => {/* router.push('/home') */ }}
          className='mt-4 bg-white/20 px-6 py-3 rounded-lg'
        >
          <Text className='text-white font-bold'>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className='flex-1 bg-blue-900'>
      {weatherData && getWeatherBackground(weatherData)}

      <ScrollView
        className='flex-1'
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View className='flex-1 items-center justify-start w-full px-4' style={{ paddingTop: safeAreaInsets.top + 30 }}>
          {weatherData && (
            <>
              {/* Weather Icon y Ramon lado a lado */}
              <View className='flex-row items-center justify-center w-full px-4 mb-4'>
                <Ionicons name={getWeatherIcon(weatherData)} size={100} color={getIconColor(weatherData)} />
                <RamonWeather weatherData={weatherData} size={120} />
              </View>

              <Text className='text-white text-8xl font-bold'>{weatherData.temperature}°</Text>
              <Text className='text-white text-2xl font-bold'>{getWeatherCondition(weatherData)}</Text>
              <Text className='text-white text-2xl font-bold'>Max: {weatherData.maxTemp}° Min: {weatherData.minTemp}°</Text>

              <View className="mt-4 flex-row flex-wrap justify-center max-w-[100%] w-full">
                <WeatherCard
                  title="Precipitation"
                  value={`${weatherData.precipitation}%`}
                  iconName={getPrecipitationIcon(weatherData.precipitation)}
                />
                <WeatherCard
                  title="Humidity"
                  value={`${weatherData.humidity}%`}
                  iconName={getHumidityIcon(weatherData.humidity)}
                />

                <WeatherCard
                  title="Solar Radiation"
                  value={`${weatherData.solarRadiation} W/m² (${getSolarRadiationLevel(weatherData.solarRadiation)})`}
                  iconName={getSolarRadiationIcon(weatherData.solarRadiation)}
                />

                <View className="w-[45%] bg-white rounded-2xl p-3 m-1 border border-white/20" style={{ backgroundColor: 'rgba(0,0,0,0.2)', borderColor: 'rgba(255,255,255,0.2)' }}>
                  <Text className="text-xs text-slate-300 text-center mb-1">Wind Speed</Text>
                  <View className="items-center mb-2">
                    {typeof getWindIcon(weatherData.windSpeed) === 'string' ? (
                      <Ionicons name={getWindIcon(weatherData.windSpeed) as any} size={32} color="white" />
                    ) : (
                      getWindIcon(weatherData.windSpeed)
                    )}
                  </View>
                  <Text className="font-semibold text-white text-center">{weatherData.windSpeed} km/h</Text>
                </View>

                <View className="w-[92%] bg-black/20 rounded-2xl p-4 m-1 border border-white/20" style={{ backgroundColor: 'rgba(0,0,0,0.2)', borderColor: 'rgba(255,255,255,0.2)' }}>
                  <Text className="text-2xl text-slate-300 text-center mb-3">Recommendations</Text>
                  <View className="items-center">
                    <Text className='text-white text-base text-left leading-7 tracking-wide'>{recommendations}</Text>
                  </View>
                </View>

                {/* Botón Ask AI debajo de las recomendaciones */}
                <View className="w-[92%] mt-2 mb-8">
                  <TouchableOpacity
                    onPress={() => router.push('/(stack)/chat')}
                    className='flex-row items-center justify-center bg-white/20 px-4 py-3 rounded-lg border border-white/30'
                  >
                    <Ionicons name="chatbubble-outline" size={24} color="white" />
                    <Text className='text-white text-lg font-medium ml-3'>Continue with AI Chat</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default ResultadosScreen