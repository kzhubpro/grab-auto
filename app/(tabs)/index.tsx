import { Feather } from "@expo/vector-icons";
import React from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ActiveButton } from "@/components/ActiveButton";
import Colors from "@/constants/colors";
import { useApp } from "@/context/AppContext";

function formatPrice(p: number) {
  return new Intl.NumberFormat("vi-VN").format(p) + "đ";
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { settings, stats, toggleActive } = useApp();

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : 0;

  const enabledFeatures = [
    settings.autoSteal.enabled && `Auto lấy đơn (${settings.autoSteal.mode === "instant" ? "Tức thì" : "Thông minh"})`,
    settings.autoDelivery.enabled && `Giao hàng ≥ ${formatPrice(settings.autoDelivery.minPrice)}`,
    settings.priceBlock.enabled && `Chặn < ${formatPrice(settings.priceBlock.minPrice)}`,
    settings.highPricePriority.enabled && `Ưu tiên > ${formatPrice(settings.highPricePriority.threshold)}`,
    settings.tipPriority.enabled && "Ưu tiên có tip",
    settings.fakeGps.enabled && `GPS: ${settings.fakeGps.locationName}`,
  ].filter(Boolean) as string[];

  return (
    <View style={[styles.root, { paddingTop: topPad, paddingBottom: bottomPad }]}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.logo}>
              <Text style={styles.logoG}>Tool </Text>Grab
            </Text>
            <Text style={styles.tagline}>Tự động tối ưu cuốc xe</Text>
          </View>
          <View style={[styles.statusDot, settings.isActive ? styles.dotActive : styles.dotOff]}>
            <Text style={styles.dotText}>{settings.isActive ? "ON" : "OFF"}</Text>
          </View>
        </View>

        {/* Main Active Button */}
        <View style={styles.btnSection}>
          <ActiveButton isActive={settings.isActive} onToggle={toggleActive} />
          <Text style={styles.btnHint}>
            {settings.isActive
              ? "Bot đang hoạt động. Nhấn để dừng."
              : "Nhấn để kích hoạt tự động"}
          </Text>
        </View>

        {/* Status Card */}
        <View style={[styles.statusCard, settings.isActive ? styles.statusCardActive : {}]}>
          <View style={styles.statusRow}>
            <Feather
              name="activity"
              size={16}
              color={settings.isActive ? Colors.light.primary : Colors.light.textTertiary}
            />
            <Text style={[styles.statusTitle, settings.isActive ? styles.statusTitleActive : {}]}>
              {settings.isActive ? "Đang theo dõi cuốc xe..." : "Bot chưa kích hoạt"}
            </Text>
          </View>

          {enabledFeatures.length > 0 ? (
            <View style={styles.featureList}>
              {enabledFeatures.map((f, i) => (
                <View key={i} style={styles.featureChip}>
                  <Feather name="check-circle" size={12} color={Colors.light.primary} />
                  <Text style={styles.featureChipText}>{f}</Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.noFeature}>Chưa bật tính năng nào. Vào Cài Đặt.</Text>
          )}
        </View>

        {/* Quick Stats */}
        <Text style={styles.sectionTitle}>Hôm Nay</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statVal}>{stats.totalRides}</Text>
            <Text style={styles.statLabel}>Tổng cuốc</Text>
          </View>
          <View style={[styles.statBox, styles.statBoxMid]}>
            <Text style={[styles.statVal, { color: Colors.light.danger }]}>{stats.blockedRides}</Text>
            <Text style={styles.statLabel}>Bị chặn</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statVal, { color: Colors.light.primary }]}>
              {stats.totalRides - stats.blockedRides}
            </Text>
            <Text style={styles.statLabel}>Chấp nhận</Text>
          </View>
        </View>

        {/* Earnings Card */}
        <View style={styles.earningsCard}>
          <View style={styles.earningsLeft}>
            <Text style={styles.earningsLabel}>Tổng Thu Nhập</Text>
            <Text style={styles.earningsVal}>{formatPrice(stats.totalEarnings)}</Text>
          </View>
          <View style={styles.earningsDivider} />
          <View style={styles.earningsRight}>
            <Text style={styles.earningsLabel}>Giá TB / Cuốc</Text>
            <Text style={styles.earningsVal2}>{formatPrice(Math.round(stats.avgPrice))}</Text>
          </View>
        </View>

        {/* Tips */}
        <View style={styles.tipCard}>
          <Feather name="info" size={14} color={Colors.light.info} />
          <Text style={styles.tipText}>
            Cấu hình chi tiết trong tab <Text style={styles.tipBold}>Cài Đặt</Text>. Xem kết quả trong <Text style={styles.tipBold}>Thống Kê</Text>.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  content: {
    padding: 20,
    paddingBottom: 100,
    gap: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  logo: {
    fontSize: 26,
    fontFamily: "Inter_700Bold",
    color: Colors.light.text,
  },
  logoG: {
    color: Colors.light.primary,
  },
  tagline: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  statusDot: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  dotActive: {
    backgroundColor: Colors.light.primaryLight,
  },
  dotOff: {
    backgroundColor: Colors.light.surfaceSecondary,
  },
  dotText: {
    fontSize: 12,
    fontFamily: "Inter_700Bold",
    color: Colors.light.primary,
    letterSpacing: 1,
  },
  btnSection: {
    alignItems: "center",
    paddingVertical: 8,
    gap: 16,
  },
  btnHint: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: Colors.light.textSecondary,
    textAlign: "center",
  },
  statusCard: {
    backgroundColor: Colors.light.surface,
    borderRadius: 16,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
    shadowColor: Colors.light.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  statusCardActive: {
    borderColor: Colors.light.primary,
    borderWidth: 1.5,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statusTitle: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
    color: Colors.light.textSecondary,
  },
  statusTitleActive: {
    color: Colors.light.primary,
  },
  featureList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  featureChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: Colors.light.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  featureChipText: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    color: Colors.light.primary,
  },
  noFeature: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: Colors.light.textTertiary,
    fontStyle: "italic",
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    color: Colors.light.text,
    marginBottom: -4,
  },
  statsGrid: {
    flexDirection: "row",
    backgroundColor: Colors.light.surface,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: Colors.light.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  statBox: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 16,
    gap: 4,
  },
  statBoxMid: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: Colors.light.borderLight,
  },
  statVal: {
    fontSize: 24,
    fontFamily: "Inter_700Bold",
    color: Colors.light.text,
  },
  statLabel: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    color: Colors.light.textSecondary,
  },
  earningsCard: {
    backgroundColor: Colors.light.primary,
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  earningsLeft: { flex: 1, gap: 4 },
  earningsDivider: {
    width: 1,
    height: 44,
    backgroundColor: "rgba(255,255,255,0.3)",
    marginHorizontal: 16,
  },
  earningsRight: { flex: 1, gap: 4, alignItems: "flex-end" },
  earningsLabel: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.75)",
  },
  earningsVal: {
    fontSize: 20,
    fontFamily: "Inter_700Bold",
    color: "#fff",
  },
  earningsVal2: {
    fontSize: 20,
    fontFamily: "Inter_700Bold",
    color: "#fff",
    textAlign: "right",
  },
  tipCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    backgroundColor: "#EFF6FF",
    borderRadius: 12,
    padding: 12,
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: "#1D4ED8",
    lineHeight: 18,
  },
  tipBold: {
    fontFamily: "Inter_600SemiBold",
  },
});
