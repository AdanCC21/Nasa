import MessageBot from "@/componentes/chat/MessageBot";
import CloudsBackground from "@/componentes/CloudsBackground";
import CustomButton from "@/componentes/CustomButton";
import MapWithAddressInput from "@/componentes/MapWithAddressInput";
import { useEvent } from "@/contexts/EventContext";
import { LocationSelectionResult } from "@/types/location";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const MapScreen = () => {
  const safeArea = useSafeAreaInsets();
  const { setLocation, eventData } = useEvent();
  const [currentLocation, setCurrentLocation] = useState<LocationSelectionResult | null>(
    eventData.location
  );

  /**
   * Maneja la selección de ubicación
   */
  const handleLocationSelect = (location: LocationSelectionResult) => {
    console.log("Ubicación seleccionada:", {
      name: location.name,
      address: location.address,
      coordinates: location.coordinates,
    });
    setCurrentLocation(location);
    setLocation(location);
  };

  /**
   * Maneja el botón de continuar
   */
  const handleContinue = () => {
    if (!currentLocation) {
      Alert.alert(
        "Ubicación requerida",
        "Por favor selecciona una ubicación en el mapa antes de continuar."
      );
      return;
    }
    router.push("/(stack)/map/dateHour");
  };

  return (
    <LinearGradient
      colors={["#3F4C6B", "#606C88"]}
      style={{ flex: 1 }}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <CloudsBackground />
      <View style={[styles.container, { paddingTop: safeArea.top + 50 }]}>
        <View style={styles.mapContainer}>
          <MapWithAddressInput
            onLocationSelect={handleLocationSelect}
            showCurrentLocationButton={true}
            placeholder="Search for an address in the map..."
            style={{ flex: 1 }}
          />
        </View>

        <View style={styles.bottomContainer}>
          <MessageBot
            imgUrl="Bot.png"
            message="Hi, welcome! 👋, First select the event location. Drop a pin where you want to host the event and adjust the radius to cover the area you want to include."
          />
        </View>
        <View className="w-full items-center pb-8">
          <CustomButton
            children="Select this location"
            color="#4684FF"
            onPress={handleContinue}
            className="mt-2 "
          />
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapContainer: {
    flex: 3, // 3/4 de la pantalla
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  bottomContainer: {
    flex: 1, // 1/4 de la pantalla
    padding: 16,
    justifyContent: "flex-start",
  },
});

export default MapScreen;
