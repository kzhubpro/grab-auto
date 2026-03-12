import React, { useCallback, useRef } from "react";
import { PanResponder, StyleSheet, Text, View } from "react-native";
import Colors from "@/constants/colors";

interface PriceSliderProps {
  value: number;
  min: number;
  max: number;
  step: number;
  onValueChange: (v: number) => void;
  formatLabel?: (v: number) => string;
}

export function PriceSlider({
  value,
  min,
  max,
  step,
  onValueChange,
  formatLabel,
}: PriceSliderProps) {
  const trackWidth = useRef(0);
  const pct = (value - min) / (max - min);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (e) => {
        updateValue(e.nativeEvent.locationX);
      },
      onPanResponderMove: (e) => {
        updateValue(e.nativeEvent.locationX);
      },
    })
  ).current;

  const updateValue = useCallback(
    (x: number) => {
      if (trackWidth.current === 0) return;
      const ratio = Math.max(0, Math.min(1, x / trackWidth.current));
      const raw = min + ratio * (max - min);
      const stepped = Math.round(raw / step) * step;
      onValueChange(Math.max(min, Math.min(max, stepped)));
    },
    [min, max, step, onValueChange]
  );

  const label = formatLabel ? formatLabel(value) : String(value);
  const minLabel = formatLabel ? formatLabel(min) : String(min);
  const maxLabel = formatLabel ? formatLabel(max) : String(max);

  return (
    <View style={styles.container}>
      <View
        style={styles.track}
        onLayout={(e) => {
          trackWidth.current = e.nativeEvent.layout.width;
        }}
        {...panResponder.panHandlers}
      >
        <View style={[styles.fill, { width: `${pct * 100}%` }]} />
        <View style={[styles.thumb, { left: `${pct * 100}%` }]}>
          <View style={styles.thumbInner} />
        </View>
      </View>
      <View style={styles.labels}>
        <Text style={styles.labelSm}>{minLabel}</Text>
        <Text style={styles.labelVal}>{label}</Text>
        <Text style={styles.labelSm}>{maxLabel}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 12 },
  track: {
    height: 6,
    backgroundColor: Colors.light.borderLight,
    borderRadius: 3,
    marginHorizontal: 10,
    position: "relative",
    justifyContent: "center",
  },
  fill: {
    height: 6,
    backgroundColor: Colors.light.primary,
    borderRadius: 3,
  },
  thumb: {
    position: "absolute",
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: -12,
    top: -9,
  },
  thumbInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.light.primary,
  },
  labels: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  labelSm: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    color: Colors.light.textTertiary,
  },
  labelVal: {
    fontSize: 15,
    fontFamily: "Inter_700Bold",
    color: Colors.light.primary,
  },
});
