import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Colors from "@/constants/colors";
import { ToggleSwitch } from "./ToggleSwitch";

interface FeatureCardProps {
  icon: keyof typeof Feather.glyphMap;
  iconColor?: string;
  iconBg?: string;
  title: string;
  subtitle: string;
  enabled: boolean;
  onToggle: () => void;
  onPress?: () => void;
  badge?: string;
  badgeColor?: string;
  children?: React.ReactNode;
}

export function FeatureCard({
  icon,
  iconColor,
  iconBg,
  title,
  subtitle,
  enabled,
  onToggle,
  onPress,
  badge,
  badgeColor,
  children,
}: FeatureCardProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && onPress ? styles.pressed : {}]}
      onPress={onPress}
    >
      <View style={styles.header}>
        <View style={[styles.iconWrap, { backgroundColor: iconBg || Colors.light.primaryLight }]}>
          <Feather name={icon} size={20} color={iconColor || Colors.light.primary} />
        </View>
        <View style={styles.titleWrap}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{title}</Text>
            {badge && (
              <View style={[styles.badge, { backgroundColor: badgeColor || Colors.light.primary }]}>
                <Text style={styles.badgeText}>{badge}</Text>
              </View>
            )}
          </View>
          <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text>
        </View>
        <ToggleSwitch value={enabled} onToggle={onToggle} size="sm" />
      </View>
      {children && enabled && <View style={styles.body}>{children}</View>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.light.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: Colors.light.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  pressed: { opacity: 0.92 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  titleWrap: {
    flex: 1,
    gap: 2,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    color: Colors.light.text,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: Colors.light.textSecondary,
  },
  badge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 10,
    fontFamily: "Inter_600SemiBold",
    color: "#fff",
  },
  body: {
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: Colors.light.borderLight,
  },
});
