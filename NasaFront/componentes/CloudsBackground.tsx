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

// Main CloudsBackground component
export default function CloudsBackground() {
  const clouds = [
    // Top area clouds
    { size: 80, opacity: 0.4, duration: 15000, delay: 0, top: screenHeight * 0.05 },
    { size: 60, opacity: 0.3, duration: 5000, delay: 3000, top: screenHeight * 0.15 },
    { size: 100, opacity: 0.2, duration: 25000, delay: 8000, top: screenHeight * 0.1 },
    
    // Middle area clouds
    { size: 70, opacity: 0.35, duration: 18000, delay: 12000, top: screenHeight * 0.35 },
    { size: 50, opacity: 0.25, duration: 22000, delay: 6000, top: screenHeight * 0.45 },
    { size: 90, opacity: 0.3, duration: 20000, delay: 15000, top: screenHeight * 0.4 },
    
    // Bottom area clouds
    { size: 65, opacity: 0.28, duration: 17000, delay: 9000, top: screenHeight * 0.65 },
    { size: 75, opacity: 0.32, duration: 19000, delay: 4000, top: screenHeight * 0.75 },
    { size: 87, opacity: 0.32, duration: 19000, delay: 5000, top: screenHeight * 0.50 },
    { size: 55, opacity: 0.26, duration: 21000, delay: 11000, top: screenHeight * 0.8 },
    // Additional scattered clouds
    { size: 45, opacity: 0.22, duration: 24000, delay: 7000, top: screenHeight * 0.25 },
    { size: 85, opacity: 0.29, duration: 16000, delay: 13000, top: screenHeight * 0.55 },
    { size: 40, opacity: 0.24, duration: 23000, delay: 2000, top: screenHeight * 0.9 },
  ];

  return (
    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
      {clouds.map((cloud, index) => (
        <Cloud
          key={index}
          size={cloud.size}
          opacity={cloud.opacity}
          duration={cloud.duration}
          delay={cloud.delay}
          top={cloud.top}
        />
      ))}
    </View>
  );
}
