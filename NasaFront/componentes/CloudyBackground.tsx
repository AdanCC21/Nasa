import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef } from "react";
import { Animated, Dimensions, View } from "react-native";

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');



// Cloud component for background
const Cloud = ({ size, opacity, duration, delay, top }: { 
  size: number; 
  opacity: number; 
  duration: number; 
  delay: number;
  top: number;
}) => {
  const translateX = useRef(new Animated.Value(-size * 1.4)).current;

  useEffect(() => {
    const animate = () => {
      translateX.setValue(-size * 1.4);
      Animated.timing(translateX, {
        toValue: screenWidth + size * 2,
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
  }, [translateX, duration, delay, size]);

  return (
    <Animated.View
      style={{
        position: 'absolute',
        top: top,
        transform: [{ translateX }],
        opacity: opacity,
      }}
    >
      {/* Improved cloud shape with soft, realistic layers */}
      <View style={{ position: 'relative' }}>
        {/* Soft shadow layer */}
        <View
          style={{
            position: 'absolute',
            top: 6,
            left: 6,
            width: size * 1.3,
            height: size * 0.8,
            backgroundColor: 'rgba(100, 116, 139, 0.3)',
            borderRadius: size * 0.4,
            zIndex: 0,
          }}
        />
        
        {/* Main cloud structure */}
        <View style={{ position: 'relative', zIndex: 1 }}>
          {/* Large central base */}
          <View
            style={{
              width: size * 1.0,
              height: size * 0.75,
              backgroundColor: 'rgba(203, 213, 225, 0.9)',
              borderRadius: size * 0.375,
              elevation: 3,
              shadowColor: 'rgba(0, 0, 0, 0.2)',
              shadowOffset: { width: 2, height: 4 },
              shadowOpacity: 0.4,
              shadowRadius: 8,
            }}
          />
          
          {/* Upper left fluffy puff */}
          <View
            style={{
              position: 'absolute',
              left: size * 0.05,
              top: -size * 0.2,
              width: size * 0.7,
              height: size * 0.7,
              backgroundColor: 'rgba(226, 232, 240, 0.85)',
              borderRadius: size * 0.35,
              elevation: 2,
            }}
          />
          
          {/* Upper right puff */}
          <View
            style={{
              position: 'absolute',
              right: size * 0.1,
              top: -size * 0.15,
              width: size * 0.6,
              height: size * 0.6,
              backgroundColor: 'rgba(186, 200, 214, 0.8)',
              borderRadius: size * 0.3,
              elevation: 1,
            }}
          />
          
          {/* Right side extension */}
          <View
            style={{
              position: 'absolute',
              right: -size * 0.15,
              top: size * 0.1,
              width: size * 0.8,
              height: size * 0.65,
              backgroundColor: 'rgba(211, 219, 229, 0.88)',
              borderRadius: size * 0.325,
              elevation: 2,
            }}
          />
          
          {/* Central top bump */}
          <View
            style={{
              position: 'absolute',
              left: size * 0.3,
              top: -size * 0.1,
              width: size * 0.5,
              height: size * 0.5,
              backgroundColor: 'rgba(241, 245, 249, 0.82)',
              borderRadius: size * 0.25,
              elevation: 1,
            }}
          />
          
          {/* Bottom left extension */}
          <View
            style={{
              position: 'absolute',
              left: size * 0.2,
              bottom: -size * 0.08,
              width: size * 0.6,
              height: size * 0.4,
              backgroundColor: 'rgba(174, 184, 198, 0.75)',
              borderRadius: size * 0.2,
            }}
          />
          
          {/* Bottom right wispy part */}
          <View
            style={{
              position: 'absolute',
              right: size * 0.05,
              bottom: -size * 0.05,
              width: size * 0.4,
              height: size * 0.35,
              backgroundColor: 'rgba(221, 227, 235, 0.7)',
              borderRadius: size * 0.175,
            }}
          />
        </View>
        
        {/* Soft cloud highlight */}
        <View
          style={{
            position: 'absolute',
            top: size * 0.08,
            left: size * 0.2,
            width: size * 0.6,
            height: size * 0.15,
            backgroundColor: 'rgba(248, 250, 252, 0.6)',
            borderRadius: size * 0.075,
            zIndex: 3,
          }}
        />
      </View>
    </Animated.View>
  );
};



// Main CloudyBackground component
export default function CloudyBackground() {
  // Generate clouds with varied configurations for overcast cloudy weather
  const clouds = [
    // Top area clouds - dense coverage for overcast feel
    { size: 90, opacity: 0.7, duration: 20000, delay: 0, top: screenHeight * 0.03 },
    { size: 75, opacity: 0.6, duration: 18000, delay: 3000, top: screenHeight * 0.12 },
    { size: 110, opacity: 0.5, duration: 25000, delay: 6000, top: screenHeight * 0.08 },
    
    // Middle area clouds - main coverage layer
    { size: 85, opacity: 0.75, duration: 22000, delay: 9000, top: screenHeight * 0.3 },
    { size: 65, opacity: 0.65, duration: 24000, delay: 4000, top: screenHeight * 0.42 },
    { size: 100, opacity: 0.7, duration: 21000, delay: 12000, top: screenHeight * 0.38 },
    { size: 70, opacity: 0.6, duration: 19000, delay: 15000, top: screenHeight * 0.35 },
    
    // Lower area clouds - creating depth and atmosphere
    { size: 80, opacity: 0.55, duration: 23000, delay: 7000, top: screenHeight * 0.6 },
    { size: 95, opacity: 0.65, duration: 20000, delay: 2000, top: screenHeight * 0.72 },
    { size: 75, opacity: 0.5, duration: 26000, delay: 11000, top: screenHeight * 0.68 },
    { size: 60, opacity: 0.45, duration: 18000, delay: 14000, top: screenHeight * 0.85 },
    
    // Scattered clouds for natural layered look
    { size: 55, opacity: 0.4, duration: 27000, delay: 5000, top: screenHeight * 0.22 },
    { size: 105, opacity: 0.6, duration: 17000, delay: 10000, top: screenHeight * 0.55 },
    { size: 50, opacity: 0.35, duration: 29000, delay: 1000, top: screenHeight * 0.92 },
    { size: 88, opacity: 0.55, duration: 16000, delay: 8000, top: screenHeight * 0.18 },
  ];

  return (
    <LinearGradient
      colors={['#696B6B', '#C2CAD1', '#989B9C']}
      style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0 
      }}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      {/* Render clouds for overcast cloudy weather */}
      {clouds.map((cloud, index) => (
        <Cloud
          key={`cloud-${index}`}
          size={cloud.size}
          opacity={cloud.opacity}
          duration={cloud.duration}
          delay={cloud.delay}
          top={cloud.top}
        />
      ))}
    </LinearGradient>
  );
}