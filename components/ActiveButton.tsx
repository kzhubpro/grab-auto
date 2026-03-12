import * as Haptics from "expo-haptics";
import React, { useEffect, useRef } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import Colors from "@/constants/colors";

interface ActiveButtonProps {
  isActive: boolean;
  onToggle: () => void;
}

export function ActiveButton({ isActive, onToggle }: ActiveButtonProps) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isActive) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.12, duration: 900, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 900, useNativeDriver: true }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isActive]);

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.93, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
    ]).start();
    onToggle();
  };

  return (
    <View style={styles.wrapper}>
      {isActive && (
        <Animated.View
          style={[
            styles.pulse,
            { transform: [{ scale: pulseAnim }], opacity: 0.2 },
          ]}
        />
      )}
      <Pressable onPress={handlePress}>
        <Animated.View
          style={[
            styles.btn,
            isActive ? styles.btnActive : styles.btnInactive,
            { transform: [{ scale: scaleAnim }] },
          ]}
        >
          <Feather
            name={isActive ? "zap" : "zap-off"}
            size={28}
            color={isActive ? "#fff" : Colors.light.textSecondary}
          />
          <Text style={[styles.label, isActive ? styles.labelActive : styles.labelInactive]}>
            {isActive ? "ĐANG CHẠY" : "ĐÃ TẮT"}
          </Text>
        </Animated.View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    justifyContent: "center",
    width: 140,
    height: 140,
  },
  pulse: {
    position: "absolute",
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: Colors.light.primary,
  },
  btn: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 8,
  },
  btnActive: {
    backgroundColor: Colors.light.primary,
  },
  btnInactive: {
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: Colors.light.border,
  },
  label: {
    fontSize: 11,
    fontFamily: "Inter_700Bold",
    letterSpacing: 0.5,
  },
  labelActive: { color: "#fff" },
  labelInactive: { color: Colors.light.textSecondary },
});
