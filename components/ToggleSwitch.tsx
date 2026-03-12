import React, { useEffect, useRef } from "react";
import { Animated, Pressable, StyleSheet, View } from "react-native";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";

interface ToggleSwitchProps {
  value: boolean;
  onToggle: () => void;
  size?: "sm" | "md";
}

export function ToggleSwitch({ value, onToggle, size = "md" }: ToggleSwitchProps) {
  const anim = useRef(new Animated.Value(value ? 1 : 0)).current;
  const isSmall = size === "sm";

  const trackW = isSmall ? 40 : 50;
  const trackH = isSmall ? 24 : 30;
  const thumbSize = isSmall ? 18 : 24;
  const thumbTravel = trackW - thumbSize - (isSmall ? 3 : 3);

  useEffect(() => {
    Animated.spring(anim, {
      toValue: value ? 1 : 0,
      useNativeDriver: true,
      tension: 200,
      friction: 20,
    }).start();
  }, [value]);

  const translateX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [isSmall ? 3 : 3, thumbTravel],
  });

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onToggle();
  };

  return (
    <Pressable onPress={handlePress} hitSlop={8}>
      <Animated.View
        style={[
          styles.track,
          {
            width: trackW,
            height: trackH,
            borderRadius: trackH / 2,
            backgroundColor: anim.interpolate({
              inputRange: [0, 1],
              outputRange: ["#D1D5DB", Colors.light.primary],
            }),
          },
        ]}
      >
        <Animated.View
          style={[
            styles.thumb,
            {
              width: thumbSize,
              height: thumbSize,
              borderRadius: thumbSize / 2,
              transform: [{ translateX }],
              top: (trackH - thumbSize) / 2,
            },
          ]}
        />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: {
    position: "relative",
  },
  thumb: {
    position: "absolute",
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
});
