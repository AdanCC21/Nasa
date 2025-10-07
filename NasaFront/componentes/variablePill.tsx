import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

interface VariablePillProps {
    icon: React.ReactNode;
    texto: string;
    color: string;
    textColor?: string;
    selected?: boolean;
    onPress?: () => void;
}

// Función para aclarar un color hexadecimal
const lightenColor = (hex: string, percent: number = 30): string => {
  // Remover el # si existe
  hex = hex.replace('#', '');
  
  // Convertir a RGB
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  // Aclarar cada componente
  const newR = Math.min(255, Math.floor(r + (255 - r) * (percent / 100)));
  const newG = Math.min(255, Math.floor(g + (255 - g) * (percent / 100)));
  const newB = Math.min(255, Math.floor(b + (255 - b) * (percent / 100)));
  
  // Convertir de vuelta a hex
  return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
};

const VariablePill = ({ icon, texto, color, textColor = '#fff', selected = false, onPress }: VariablePillProps) => {
  const borderColor = lightenColor(color, 40);
  
  // Colores según el estado de selección
  const backgroundColor = selected ? color : 'rgba(255,255,255,0.2)';
  const finalTextColor = selected ? textColor : 'rgba(255,255,255,0.6)';
  const finalBorderColor = selected ? borderColor : 'rgba(255,255,255,0.3)';

  return (
    <TouchableOpacity 
      style={[
        styles.container, 
        { 
          backgroundColor, 
          borderColor: finalBorderColor,
          opacity: selected ? 1 : 0.7,
        }
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {icon}
      <Text style={[styles.text, { color: finalTextColor }]}>{texto}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 10,
    borderWidth: 4,
    borderStyle: 'solid'
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
});

export default VariablePill;