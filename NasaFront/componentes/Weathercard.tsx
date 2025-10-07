import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { DimensionValue, Text, View } from 'react-native';

interface WeatherCardProps {
  title: string;
  value: string;
  iconName: string;
  width?: DimensionValue;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ 
  title, 
  value, 
  iconName, 
  width = "45%" 
}) => {
  return (
    <View 
      className={`bg-black/20 rounded-2xl p-3 m-1 border border-white/20`}
      style={{
        backgroundColor: 'rgba(0,0,0,0.2)', 
        borderColor: 'rgba(255,255,255,0.2)',
        width: width
      }}
    >
      <Text className="text-sm text-slate-300 text-center">{title}</Text>
      <View className="items-center my-1">
        <Ionicons name={iconName as any} size={32} color="white" />
      </View>
      <Text className="font-semibold text-white text-center">{value}</Text>
    </View>
  );
};

export default WeatherCard;