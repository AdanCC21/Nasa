import React from 'react';
import { Image, View, StyleSheet } from 'react-native';

interface WeatherData {
  temperature: number;
  maxTemp: number;
  minTemp: number;
  precipitation: number;
  humidity: number;
  solarRadiation: number;
  windSpeed: number;
}

interface RamonWeatherProps {
  weatherData: WeatherData;
  size?: number;
}

const RamonWeather: React.FC<RamonWeatherProps> = ({ weatherData, size = 150 }) => {
  // Función para determinar qué imagen de Ramon mostrar basado en el clima
  const getRamonImage = () => {
    const { temperature, precipitation, solarRadiation } = weatherData;

    // Lluvia - RamonRainy
    if (precipitation >= 70) {
      return require('@/assets/images/RamonRainy.png');
    }

    // Muy frío (< 5°C) - RamonVeryCold
    if (temperature < 5) {
      return require('@/assets/images/RamonVeryCold.png');
    }

    // Frío (5°C - 15°C) - RamonCold
    if (temperature < 15) {
      return require('@/assets/images/RamonCold.png');
    }

    // Muy caliente (> 30°C) - RamonHi
    if (temperature > 30) {
      return require('@/assets/images/RamonHi.png');
    }

    // Soleado (radiación solar alta y poca precipitación) - RamonSunny
    if (solarRadiation > 600 && precipitation < 20) {
      return require('@/assets/images/RamonSunny.png');
    }

    // Por defecto - Ramon normal
    return require('@/assets/images/Ramon.png');
  };

  return (
    <View style={styles.container}>
      <Image
        source={getRamonImage()}
        style={[styles.image, { width: size, height: size }]}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 150,
    height: 150,
  },
});

export default RamonWeather;
