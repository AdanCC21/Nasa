import { useEffect, useRef } from "react";
import { Animated, Dimensions, View } from "react-native";

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Individual Cloud component
const Cloud = ({ size, opacity, duration, delay, top }: { 
  size: number; 
  opacity: number; 
  duration: number; 
  delay: number;
  top: number;
}) => {
  const translateX = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    const animate = () => {
      translateX.setValue(-100);
      Animated.timing(translateX, {
        toValue: screenWidth + 100,
        duration: duration,
        useNativeDriver: true,
      }).start(() => {
        animate(); // Loop the animation
      });
    };

    const timer = setTimeout(() => {
      animate();
    }, delay);

    return () => clearTimeout(timer);
  }, [translateX, duration, delay]);

  return (
    <Animated.View
      style={{
        position: 'absolute',
        top: top,
        transform: [{ translateX }],
        opacity: opacity,
      }}
    >
      <View
        style={{
          width: size,
          height: size * 0.6,
          backgroundColor: 'rgba(255, 255, 255, 0.3)',
          borderRadius: size * 0.3,
        }}
      />
      <View
        style={{
          position: 'absolute',
          top: size * 0.15,
          left: size * 0.2,
          width: size * 0.8,
          height: size * 0.5,
          backgroundColor: 'rgba(255, 255, 255, 0.3)',
          borderRadius: size * 0.25,
        }}
      />
      <View
        style={{
          position: 'absolute',
          top: size * 0.1,
          left: size * 0.5,
          width: size * 0.6,
          height: size * 0.4,
          backgroundColor: 'rgba(255, 255, 255, 0.3)',
          borderRadius: size * 0.2,
        }}
      />
    </Animated.View>
  );
};

// Main SunnyBackground component
export default function SunnyBackground() {
  

  return (
    <View style={{ 
      position: 'absolute', 
      top: 0, 
      left: 0, 
      right: 0, 
      bottom: 0,
      backgroundColor: '#87CEEB' // Sky blue background
    }}>
      
    </View>
  );
}
