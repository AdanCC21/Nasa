import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export interface TimePeriod {
  label: string;
  value: string; // Formato HH:mm:ss para la API
}

const TIME_PERIODS: TimePeriod[] = [
  { label: "Morning (00:00 - 05:59)", value: "00:00:00" }, // 12:00 AM - 5:59 AM
  { label: "Morning (06:00 - 11:59)", value: "06:00:00" },    // 6:00 AM - 11:59 AM
  { label: "Midday (12:00 - 12:59)", value: "12:00:00" },  // 12:00 PM - 12:59 PM
  { label: "Afternoon (13:00 - 18:59)", value: "13:00:00" },     // 1:00 PM - 6:59 PM
  { label: "Night (19:00 - 23:59)", value: "19:00:00" },     // 7:00 PM - 11:59 PM
];

interface TimeDropdownProps {
  value: string;
  onSelect: (period: TimePeriod) => void;
  placeholder?: string;
}

const TimeDropdown: React.FC<TimeDropdownProps> = ({
  value,
  onSelect,
  placeholder = "Selecciona un período",
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedPeriod = TIME_PERIODS.find((p) => p.value === value);

  return (
    <>
      <TouchableOpacity
        style={styles.container}
        onPress={() => setIsOpen(true)}
        activeOpacity={0.7}
      >
        <View style={styles.iconContainer}>
          <Ionicons name="time-outline" size={24} color="#fff" />
        </View>
        <Text style={[styles.text, !selectedPeriod && styles.placeholder]}>
          {selectedPeriod ? selectedPeriod.label : placeholder}
        </Text>
        <Ionicons
          name={isOpen ? "chevron-up" : "chevron-down"}
          size={20}
          color="#fff"
        />
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecciona el período</Text>
              <TouchableOpacity onPress={() => setIsOpen(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.optionsList}>
              {TIME_PERIODS.map((period) => (
                <TouchableOpacity
                  key={period.value}
                  style={[
                    styles.option,
                    period.value === value && styles.selectedOption,
                  ]}
                  onPress={() => {
                    onSelect(period);
                    setIsOpen(false);
                  }}
                >
                  <Text
                    style={[
                      styles.optionText,
                      period.value === value && styles.selectedOptionText,
                    ]}
                  >
                    {period.label}
                  </Text>
                  {period.value === value && (
                    <Ionicons name="checkmark" size={20} color="#4684FF" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(70, 90, 126, 0.8)",
    borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 20,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 5,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    flex: 1,
    fontSize: 16,
    color: "#fff",
    fontWeight: "500",
  },
  placeholder: {
    color: "rgba(255, 255, 255, 0.5)",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 20,
    width: "100%",
    maxWidth: 400,
    maxHeight: "70%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  optionsList: {
    maxHeight: 300,
  },
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  selectedOption: {
    backgroundColor: "#f0f7ff",
  },
  optionText: {
    fontSize: 16,
    color: "#333",
  },
  selectedOptionText: {
    color: "#4684FF",
    fontWeight: "600",
  },
});

export default TimeDropdown;
