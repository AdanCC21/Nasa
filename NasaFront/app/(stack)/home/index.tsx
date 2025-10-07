import CloudsBackground from "@/componentes/CloudsBackground";
import MenuButton from "@/componentes/MenuButton";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Image, Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <LinearGradient
      colors={["#5074C9", "#94A8D8"]}
      style={{ flex: 1 }}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <CloudsBackground />

      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 24 }}>
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <Text className="text-white text-4xl text-center font-bold">
            Hacka Cloud
          </Text>
          <Text className="text-white text-xl text-center">Hackamoles 2</Text>
        </View>

        <View style={{ position: "relative", alignItems: "center" }}>
          {/* Speech Bubble */}
          <View
            style={{
              position: "absolute",
              top: 20,
              left: 175,
              backgroundColor: "white",
              borderRadius: 16,
              padding: 12,
              paddingHorizontal: 16,
              maxWidth: 150,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
              zIndex: 10,
            }}
          >
            <Text style={{ fontSize: 14, color: "#333", textAlign: "center", fontWeight: "500" }}>
            Plan smarter, no matter the weather.

            </Text>
            {/* Triangle pointer */}
            <View
              style={{
                position: "absolute",
                bottom: -10,
                left: 0,
                width: 0,
                height: 0, 
                borderLeftWidth: 10,
                borderRightWidth: 10,
                borderTopWidth: 10,
                borderLeftColor: "transparent",
                borderRightColor: "transparent",
                borderTopColor: "white",
                zIndex:9999,
                transform: [{ rotate: "135deg" }, { scaleX: -1 }]
              }}
            />
          </View>
          
          <View className="mt-10 mr-10">
            <Image source={require("@/assets/images/RamonHi.png")} className="size-80" />
          </View>
        </View>

        <View
          style={{ backgroundColor: "rgba(255,255,255,0.8)" }}
          className="w-auto items-center h-auto p-8 px-4 rounded-xl mt-4"
        >
          <MenuButton
            title="Map"
            description="Explore locations visually."
            icon="location-sharp"
            color="#5074C9"
            onPress={() => router.push("/map")}
            className="mt-2"
          />
        </View>
      </View>
    </LinearGradient>
  );
}