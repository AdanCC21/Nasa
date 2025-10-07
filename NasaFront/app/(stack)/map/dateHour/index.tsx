import MessageBot from "@/componentes/chat/MessageBot";
import CloudsBackground from "@/componentes/CloudsBackground";
import CustomButton from "@/componentes/CustomButton";
import DatePicker from "@/componentes/DatePicker";
import MapWithAddressInput from "@/componentes/MapWithAddressInput";
import TimeDropdown, { TimePeriod } from "@/componentes/TimeDropdown";
import VariablePill from "@/componentes/variablePill";
import { useEvent } from "@/contexts/EventContext";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useNavigation } from "expo-router";
import { useEffect, useLayoutEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const DateHourScreen = () => {
  const safeArea = useSafeAreaInsets();
  const navigation = useNavigation();
  const {
    eventData,
    setDate,
    setStartTime,
    setEndTime,
    setPlan,
    setMetrics,
    getFormattedData,
  } = useEvent();
  const [selectedDate, setSelectedDateLocal] = useState<Date | undefined>(
    eventData.date
  );
  const [startTime, setStartTimeLocal] = useState(eventData.startTime);
  const [endTime, setEndTimeLocal] = useState(eventData.endTime);
  const [plan, setPlanLocal] = useState(eventData.plan);
  const [metrics, setMetricsLocal] = useState(eventData.metrics || {
    temperature: true,
    precipitation: true,
    humidity: true,
    radiation: true,
  });
  const [showHeader, setShowHeader] = useState(true);

  // Validar si el botón de chat debe estar habilitado
  const isChatEnabled = selectedDate !== undefined && startTime !== undefined && startTime !== '';

  // Verificar si hay ubicación al montar el componente
  useEffect(() => {
    if (!eventData.location) {
      Alert.alert("Location required", "First select a location on the map.", [
        {
          text: "Back",
          onPress: () => router.back(),
        },
      ]);
    }
  }, [eventData.location]);

  // Sincronizar con el contexto cuando cambian los valores locales
  useEffect(() => {
    setDate(selectedDate);
  }, [selectedDate, setDate]);

  useEffect(() => {
    setStartTime(startTime);
  }, [startTime, setStartTime]);

  useEffect(() => {
    setEndTime(endTime);
  }, [endTime, setEndTime]);

  useEffect(() => {
    setPlan(plan);
  }, [plan, setPlan]);

  useEffect(() => {
    setMetrics(metrics);
  }, [metrics, setMetrics]);

  const toggleMetric = (metric: 'temperature' | 'precipitation' | 'humidity' | 'radiation') => {
    setMetricsLocal(prev => ({
      ...prev,
      [metric]: !prev[metric]
    }));
  };

  // Ya no necesitamos manejar la selección de ubicación aquí
  // porque viene del contexto desde la pantalla anterior

  // El formateo ahora se maneja en el contexto con getFormattedData()

  const handleContinue = () => {
    const apiData = getFormattedData();
    if (!apiData) {
      Alert.alert(
        "Incomplete data",
        "Please complete all fields: location, date and start time."
      );
      return;
    }

    console.log("Datos completos del evento:", apiData);
    console.log("\n--- Resumen del Evento ---");
    console.log(`Ubicación: ${apiData.name}`);
    console.log(`Dirección: ${apiData.address}`);
    console.log(`Coordenadas: ${apiData.latitude}, ${apiData.longitude}`);
    console.log(`Fecha: ${apiData.date}`);
    console.log(`Hora inicio: ${apiData.time_start}`);
    console.log(`Hora fin: ${apiData.end_time}`);
    console.log(`Plan: ${apiData.plan}`);
    console.log(`Metrics:`, apiData.metrics);
    console.log("-------------------------\n");

    // Aquí puedes enviar al backend o navegar a la siguiente pantalla
    // Alert.alert(
    //   "Data saved",
    //   `Location: ${apiData.name}\nDate: ${apiData.date}\nTime: ${apiData.time_start}`,
    //   [
    //     {
    //       text: "OK",
    //       onPress: () => {
    //         // Navegar a la siguiente pantalla si es necesario
    //         router.push("/Resultados");
    //       },
    //     },
    //   ]
    // );
    router.push("/Resultados");

  };

  // Manejar el scroll para ocultar/mostrar el header
  const handleScroll = (event: any) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    const HEADER_SCROLL_DISTANCE = 50; // Distancia de scroll para ocultar el header

    if (scrollY > HEADER_SCROLL_DISTANCE && showHeader) {
      setShowHeader(false);
    } else if (scrollY <= HEADER_SCROLL_DISTANCE && !showHeader) {
      setShowHeader(true);
    }
  };

  // Configurar el header dinámicamente
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: showHeader,
    });
  }, [navigation, showHeader]);

  return (
    <LinearGradient
      colors={["#94A8D8", "#5074C9"]}
      style={{ flex: 1 }}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <CloudsBackground />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          style={[styles.container, { paddingTop: safeArea.top + 50 }]}
          contentContainerStyle={{ paddingBottom: safeArea.bottom + 100 }}
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          {/* Mapa más pequeño */}
          <View style={styles.mapContainer} >
            <Text className="text-white text-2xl font-bold pb-2">
              Location selected:
            </Text>
            {eventData.location ? (
              <MapWithAddressInput
                onLocationSelect={() => { }}
                initialLocation={eventData.location}
                initialRegion={{
                  latitude: eventData.location.coordinates.latitude,
                  longitude: eventData.location.coordinates.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
                showCurrentLocationButton={false}
                showAddressInput={false}
                interactive={false}
                showSelectedLocation={false}
                style={{ flex: 1 }}
              />
            ) : (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "rgba(255,255,255,0.1)",
                  borderRadius: 24,
                }}
              >
                <Text style={{ color: "#fff", fontSize: 16 }}>
                  No location selected
                </Text>
              </View>
            )}

            {/* MessageBot superpuesto al mapa */}
            <View style={styles.messageBotContainer}>
              <MessageBot
                imgUrl="Bot.png"
                message="Perfect! Now select the date and time of the event."
              />
            </View>
          </View>

          {/* Formularios de fecha y hora */}
          <View style={styles.formContainer}>
            <View>
              <Text className="text-white text-2xl font-bold pb-2">Date</Text>
              <DatePicker
                value={selectedDate}
                onChange={setSelectedDateLocal}
                placeholder="Select a date"
              />
            </View>

            <View>
              <Text className="text-white text-2xl font-bold pb-2">
                In what time period will you be making your plans?
              </Text>
              <TimeDropdown
                value={startTime}
                onSelect={(period: TimePeriod) => setStartTimeLocal(period.value)}
                placeholder="Select time period"
              />
            </View>

            <View>
              <Text className="text-white text-2xl font-bold pb-2">
                Tell me about your plan!
              </Text>
              <TextInput
                style={styles.textInput}
                value={plan}
                onChangeText={setPlanLocal}
                placeholder="Describe your plan here..."
                placeholderTextColor="rgba(255,255,255,0.5)"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

          </View>

          {/* Botón de continuar */}
          <View style={styles.buttonContainer}>
            <CustomButton
              icon="send"
              iconPosition="right"
              children="Send"
              color="#4684FF"
              onPress={handleContinue}
              className="mt-2"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapContainer: {
    height: 325, // Mapa más pequeño
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginBottom: 16,
  },
  messageBotContainer: {
    position: "absolute",
    top: 248,
    left: 16,
    right: 16,
    zIndex: 10,
  },
  formContainer: {
    paddingHorizontal: 16,
    gap: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 16,
    justifyContent: "flex-end",
    paddingHorizontal: 16,
    paddingVertical: 48,
  },
  textInput: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 12,
    padding: 16,
    color: "#fff",
    fontSize: 16,
    minHeight: 100,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  metricsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
});

export default DateHourScreen;
