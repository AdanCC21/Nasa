import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef } from "react";
import { Animated, Dimensions, View } from "react-native";

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Individual Raindrop component
const Raindrop = ({ size, opacity, duration, delay, left, speed }: { 
  size: number; 
  opacity: number; 
  duration: number; 
  delay: number;
  left: number;
  speed: number;
}) => {
  const translateY = useRef(new Animated.Value(-20)).current;

  useEffect(() => {
    const animate = () => {
      translateY.setValue(-20);
      Animated.timing(translateY, {
        toValue: screenHeight + 20,
        duration: duration / speed,
        useNativeDriver: true,
      }).start(() => {
        animate(); // Loop the animation
      });
    };

    const timer = setTimeout(() => {
      animate();
    }, delay);

    return () => clearTimeout(timer);
  }, [translateY, duration, delay, speed]);

  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: left,
        transform: [{ translateY }],
        opacity: opacity,
      }}
    >
      {/* Main raindrop shape */}
      <View
        style={{
          width: size,
          height: size * 4,
          backgroundColor: 'rgba(173, 216, 230, 0.7)', // Light blue color for raindrops
          borderRadius: size / 2,
        }}
      />
    </Animated.View>
  );
};

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
      {/* Advanced cloud shape with multiple layers for realism */}
      <View style={{ position: 'relative' }}>
        {/* Base shadow layer */}
        <View
          style={{
            position: 'absolute',
            top: 4,
            left: 4,
            width: size * 1.2,
            height: size * 0.7,
            backgroundColor: 'rgba(37, 47, 63, 0.88)',
            borderRadius: size * 0.35,
            zIndex: 0,
          }}
        />
        
        {/* Main cloud structure */}
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', zIndex: 1 }}>
          {/* Large central puff */}
          <View
            style={{
              width: size * 0.9,
              height: size * 0.7,
              backgroundColor: 'rgba(45, 55, 72, 0.95)',
              borderRadius: size * 0.35,
              elevation: 2,
              shadowColor: 'rgba(37, 47, 63, 0.88)',
              shadowOffset: { width: 3, height: 3 },
              shadowOpacity: 0.5,
              shadowRadius: 6,
            }}
          />
          
          {/* Upper left puff */}
          <View
            style={{
              position: 'absolute',
              left: size * 0.1,
              top: -size * 0.15,
              width: size * 0.6,
              height: size * 0.6,
              backgroundColor: 'rgba(61, 75, 84, 0.5, 0.9)',
              borderRadius: size * 0.3,
              elevation: 1,
            }}
          />
          
          {/* Right side puff */}
          <View
            style={{
              width: size * 0.75,
              height: size * 0.65,
              backgroundColor: 'rgba(71, 86, 94, 0.92)',
              borderRadius: size * 0.325,
              marginLeft: -size * 0.25,
              marginBottom: size * 0.05,
              elevation: 1,
            }}
          />
          
          {/* Small top puff */}
          <View
            style={{
              position: 'absolute',
              right: size * 0.15,
              top: -size * 0.1,
              width: size * 0.5,
              height: size * 0.5,
              backgroundColor: 'rgba(37, 47, 63, 0.88)',
              borderRadius: size * 0.25,
            }}
          />
          
          {/* Bottom extension puff */}
          <View
            style={{
              position: 'absolute',
              left: size * 0.3,
              bottom: -size * 0.05,
              width: size * 0.4,
              height: size * 0.4,
              backgroundColor: 'rgba(55, 65, 81, 0.85)',
              borderRadius: size * 0.2,
            }}
          />
        </View>
        
        {/* Dramatic storm highlight */}
        <View
          style={{
            position: 'absolute',
            top: size * 0.05,
            left: size * 0.15,
            width: size * 0.7,
            height: size * 0.12,
            backgroundColor: 'rgba(148, 163, 184, 0.4)',
            borderRadius: size * 0.06,
            zIndex: 2,
          }}
        />
      </View>
    </Animated.View>
  );
};

// Heavy rain streak component for more realistic effect
const RainStreak = ({ opacity, duration, delay, left }: {
  opacity: number;
  duration: number;
  delay: number;
  left: number;
}) => {
  const translateY = useRef(new Animated.Value(-50)).current;

  useEffect(() => {
    const animate = () => {
      translateY.setValue(-50);
      Animated.timing(translateY, {
        toValue: screenHeight + 50,
        duration: duration,
        useNativeDriver: true,
      }).start(() => {
        animate();
      });
    };

    const timer = setTimeout(() => {
      animate();
    }, delay);

    return () => clearTimeout(timer);
  }, [translateY, duration, delay]);

  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: left,
        transform: [{ translateY }],
        opacity: opacity,
      }}
    >
      <View
        style={{
          width: 1,
          height: 30,
          backgroundColor: 'rgba(173, 216, 230, 0.5)',
        }}
      />
    </Animated.View>
  );
};

// Main RainyBackground component
export default function RainyBackground() {
  // Generate random raindrops

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

  const raindrops = Array.from({ length: 50 }, (_, index) => ({
    size: Math.random() * 3 + 2, // Random size between 2-5
    opacity: Math.random() * 0.4 + 0.3, // Random opacity between 0.3-0.7
    duration: Math.random() * 3000 + 2000, // Random duration between 2-5 seconds
    delay: Math.random() * 5000, // Random delay up to 5 seconds
    left: Math.random() * screenWidth, // Random horizontal position
    speed: Math.random() * 0.5 + 0.8, // Random speed multiplier
  }));

  // Generate rain streaks for heavier rain effect
  const rainStreaks = Array.from({ length: 30 }, (_, index) => ({
    opacity: Math.random() * 0.3 + 0.2,
    duration: Math.random() * 1500 + 1000,
    delay: Math.random() * 3000,
    left: Math.random() * screenWidth,
  }));

  return (
    <LinearGradient
      colors={['#14293D', '#101F2D']}
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
      {/* Render clouds first (background layer) */}
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
      
      {/* Render rain streaks (middle layer) */}
      {rainStreaks.map((streak, index) => (
        <RainStreak
          key={`streak-${index}`}
          opacity={streak.opacity}
          duration={streak.duration}
          delay={streak.delay}
          left={streak.left}
        />
      ))}
      
      {/* Render raindrops (foreground layer) */}
      {raindrops.map((drop, index) => (
        <Raindrop
          key={`drop-${index}`}
          size={drop.size}
          opacity={drop.opacity}
          duration={drop.duration}
          delay={drop.delay}
          left={drop.left}
          speed={drop.speed}
        />
      ))}
    </LinearGradient>
  );
}