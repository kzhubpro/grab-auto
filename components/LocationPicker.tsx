import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";

interface Location {
  lat: number;
  lng: number;
  name: string;
}

const POPULAR_LOCATIONS: Location[] = [
  { lat: 10.7769, lng: 106.7009, name: "Quận 1, TP.HCM" },
  { lat: 10.7988, lng: 106.6676, name: "Tân Bình, TP.HCM" },
  { lat: 10.8416, lng: 106.7099, name: "Gò Vấp, TP.HCM" },
  { lat: 10.7288, lng: 106.6984, name: "Quận 7, TP.HCM" },
  { lat: 10.7753, lng: 106.6644, name: "Quận 3, TP.HCM" },
  { lat: 10.8231, lng: 106.6297, name: "Bình Tân, TP.HCM" },
  { lat: 21.0285, lng: 105.8542, name: "Hoàn Kiếm, Hà Nội" },
  { lat: 21.0468, lng: 105.8412, name: "Cầu Giấy, Hà Nội" },
  { lat: 16.0544, lng: 108.2022, name: "Hải Châu, Đà Nẵng" },
  { lat: 10.0452, lng: 105.7469, name: "Ninh Kiều, Cần Thơ" },
];

interface LocationPickerProps {
  currentName: string;
  onSelect: (loc: Location) => void;
}

export function LocationPicker({ currentName, onSelect }: LocationPickerProps) {
  const [visible, setVisible] = useState(false);
  const [search, setSearch] = useState("");
  const insets = useSafeAreaInsets();

  const filtered = POPULAR_LOCATIONS.filter((l) =>
    l.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (loc: Location) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSelect(loc);
    setVisible(false);
    setSearch("");
  };

  return (
    <>
      <Pressable
        style={({ pressed }) => [styles.trigger, pressed && { opacity: 0.7 }]}
        onPress={() => setVisible(true)}
      >
        <Feather name="map-pin" size={14} color={Colors.light.primary} />
        <Text style={styles.triggerText} numberOfLines={1}>{currentName}</Text>
        <Feather name="chevron-down" size={14} color={Colors.light.textSecondary} />
      </Pressable>

      <Modal visible={visible} animationType="slide" transparent presentationStyle="pageSheet">
        <View style={[styles.modal, { paddingBottom: insets.bottom + 16 }]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Chọn Vị Trí</Text>
            <Pressable onPress={() => setVisible(false)} hitSlop={12}>
              <Feather name="x" size={22} color={Colors.light.text} />
            </Pressable>
          </View>

          <View style={styles.searchWrap}>
            <Feather name="search" size={16} color={Colors.light.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Tìm khu vực..."
              placeholderTextColor={Colors.light.textTertiary}
              value={search}
              onChangeText={setSearch}
              autoFocus
            />
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={styles.list}>
            {filtered.map((loc) => (
              <Pressable
                key={loc.name}
                style={({ pressed }) => [styles.locItem, pressed && { opacity: 0.7 }]}
                onPress={() => handleSelect(loc)}
              >
                <View style={styles.locIcon}>
                  <Feather name="map-pin" size={16} color={Colors.light.primary} />
                </View>
                <View style={styles.locInfo}>
                  <Text style={styles.locName}>{loc.name}</Text>
                  <Text style={styles.locCoords}>
                    {loc.lat.toFixed(4)}, {loc.lng.toFixed(4)}
                  </Text>
                </View>
                {currentName === loc.name && (
                  <Feather name="check" size={16} color={Colors.light.primary} />
                )}
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: Colors.light.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  triggerText: {
    flex: 1,
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    color: Colors.light.primary,
  },
  modal: {
    flex: 1,
    backgroundColor: Colors.light.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: 80,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
    color: Colors.light.text,
  },
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: Colors.light.surfaceSecondary,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    color: Colors.light.text,
  },
  list: { flex: 1 },
  locItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.borderLight,
  },
  locIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.light.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  locInfo: { flex: 1 },
  locName: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
    color: Colors.light.text,
  },
  locCoords: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: Colors.light.textTertiary,
    marginTop: 2,
  },
});
