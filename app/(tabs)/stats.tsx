import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  Animated,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatCard } from "@/components/StatCard";
import Colors from "@/constants/colors";
import { useApp } from "@/context/AppContext";

function formatPrice(p: number) {
  if (p >= 1000000) return (p / 1000000).toFixed(1) + "M";
  if (p >= 1000) return (p / 1000).toFixed(0) + "K";
  return p.toFixed(0);
}

function formatPriceFull(p: number) {
  return new Intl.NumberFormat("vi-VN").format(Math.round(p)) + "đ";
}

const SIMULATED_RIDES = [
  { time: "08:32", from: "Quận 1", to: "Bình Thạnh", price: 125000, tip: true, blocked: false },
  { time: "09:15", from: "Gò Vấp", to: "Tân Bình", price: 18000, tip: false, blocked: true },
  { time: "10:02", from: "Quận 3", to: "Quận 7", price: 87000, tip: true, blocked: false },
  { time: "11:20", from: "Tân Bình", to: "Quận 12", price: 22000, tip: false, blocked: true },
  { time: "12:45", from: "Quận 1", to: "Quận 4", price: 54000, tip: false, blocked: false },
  { time: "14:10", from: "Bình Thạnh", to: "Quận 2", price: 193000, tip: true, blocked: false },
  { time: "15:30", from: "Quận 7", to: "Quận 1", price: 15000, tip: false, blocked: true },
  { time: "16:55", from: "Tân Bình", to: "Gò Vấp", price: 68000, tip: false, blocked: false },
];

export default function StatsScreen() {
  const insets = useSafeAreaInsets();
  const { stats, addRide } = useApp();
  const [filter, setFilter] = useState<"all" | "blocked" | "tip">("all");

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : 0;

  const acceptedRides = stats.totalRides - stats.blockedRides;
  const blockRate =
    stats.totalRides > 0
      ? ((stats.blockedRides / stats.totalRides) * 100).toFixed(0)
      : "0";

  const filteredRides = SIMULATED_RIDES.filter((r) => {
    if (filter === "blocked") return r.blocked;
    if (filter === "tip") return r.tip;
    return true;
  });

  const handleSimulate = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const ride = SIMULATED_RIDES[Math.floor(Math.random() * SIMULATED_RIDES.length)];
    addRide(ride.price, ride.tip, ride.blocked);
  };

  return (
    <View style={[styles.root, { paddingTop: topPad, paddingBottom: bottomPad }]}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.pageTitle}>Thống Kê</Text>
        <Text style={styles.pageSubtitle}>Tổng quan hoạt động bot</Text>

        {/* Main Stats */}
        <View style={styles.statsRow}>
          <StatCard
            label="Tổng Cuốc"
            value={String(stats.totalRides)}
            color={Colors.light.text}
          />
          <StatCard
            label="Chấp Nhận"
            value={String(acceptedRides)}
            color={Colors.light.primary}
          />
          <StatCard
            label="Bị Chặn"
            value={String(stats.blockedRides)}
            color={Colors.light.danger}
          />
        </View>

        {/* Earnings */}
        <View style={styles.earningsSection}>
          <View style={styles.earningsBig}>
            <Text style={styles.earningsMiniLabel}>Tổng Thu Nhập</Text>
            <Text style={styles.earningsBigVal}>
              {formatPriceFull(stats.totalEarnings)}
            </Text>
            <Text style={styles.earningsMiniSub}>
              TB {formatPriceFull(Math.round(stats.avgPrice))} / cuốc
            </Text>
          </View>

          <View style={styles.earningsCards}>
            <View style={styles.earningsSmCard}>
              <Text style={styles.earningsSmLabel}>Tỉ lệ chặn</Text>
              <Text style={[styles.earningsSmVal, { color: Colors.light.danger }]}>
                {blockRate}%
              </Text>
            </View>
            <View style={[styles.earningsSmCard, styles.earningsSmCardRight]}>
              <Text style={styles.earningsSmLabel}>Hiệu quả</Text>
              <Text style={[styles.earningsSmVal, { color: Colors.light.primary }]}>
                {100 - Number(blockRate)}%
              </Text>
            </View>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Phân Phối Cuốc</Text>
            <Text style={styles.progressSub}>{stats.totalRides} tổng</Text>
          </View>
          <View style={styles.progressTrack}>
            {stats.totalRides > 0 && (
              <>
                <View
                  style={[
                    styles.progressFill,
                    {
                      flex: acceptedRides,
                      backgroundColor: Colors.light.primary,
                    },
                  ]}
                />
                <View
                  style={[
                    styles.progressFill,
                    {
                      flex: stats.blockedRides,
                      backgroundColor: Colors.light.danger,
                    },
                  ]}
                />
              </>
            )}
            {stats.totalRides === 0 && (
              <View style={[styles.progressFill, { flex: 1, backgroundColor: Colors.light.border }]} />
            )}
          </View>
          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: Colors.light.primary }]} />
              <Text style={styles.legendText}>Chấp nhận ({acceptedRides})</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: Colors.light.danger }]} />
              <Text style={styles.legendText}>Bị chặn ({stats.blockedRides})</Text>
            </View>
          </View>
        </View>

        {/* Simulate Button */}
        <Pressable
          style={({ pressed }) => [styles.simulateBtn, pressed && { opacity: 0.8 }]}
          onPress={handleSimulate}
        >
          <Feather name="play-circle" size={18} color="#fff" />
          <Text style={styles.simulateBtnText}>Mô Phỏng Cuốc Xe</Text>
        </Pressable>

        {/* Recent Rides */}
        <View style={styles.recentSection}>
          <Text style={styles.sectionTitle}>Lịch Sử Gần Đây</Text>
          <View style={styles.filterRow}>
            {(["all", "blocked", "tip"] as const).map((f) => (
              <Pressable
                key={f}
                style={[styles.filterChip, filter === f && styles.filterChipActive]}
                onPress={() => setFilter(f)}
              >
                <Text
                  style={[styles.filterChipText, filter === f && styles.filterChipTextActive]}
                >
                  {f === "all" ? "Tất cả" : f === "blocked" ? "Bị chặn" : "Có tip"}
                </Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.ridesList}>
            {filteredRides.map((ride, i) => (
              <View key={i} style={styles.rideRow}>
                <View
                  style={[
                    styles.rideStatus,
                    { backgroundColor: ride.blocked ? "#FFF1F0" : Colors.light.primaryLight },
                  ]}
                >
                  <Feather
                    name={ride.blocked ? "x" : "check"}
                    size={14}
                    color={ride.blocked ? Colors.light.danger : Colors.light.primary}
                  />
                </View>
                <View style={styles.rideInfo}>
                  <View style={styles.rideRoute}>
                    <Text style={styles.rideFrom}>{ride.from}</Text>
                    <Feather name="arrow-right" size={12} color={Colors.light.textTertiary} />
                    <Text style={styles.rideTo}>{ride.to}</Text>
                  </View>
                  <Text style={styles.rideTime}>{ride.time}</Text>
                </View>
                <View style={styles.rideRight}>
                  <Text
                    style={[
                      styles.ridePrice,
                      { color: ride.blocked ? Colors.light.textTertiary : Colors.light.text },
                    ]}
                  >
                    {formatPrice(ride.price)}đ
                  </Text>
                  {ride.tip && (
                    <View style={styles.tipBadge}>
                      <Text style={styles.tipBadgeText}>TIP</Text>
                    </View>
                  )}
                  {ride.blocked && (
                    <View style={styles.blockedBadge}>
                      <Text style={styles.blockedBadgeText}>CHẶN</Text>
                    </View>
                  )}
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.light.background },
  content: { padding: 20, paddingBottom: 100, gap: 16 },
  pageTitle: {
    fontSize: 26,
    fontFamily: "Inter_700Bold",
    color: Colors.light.text,
    marginBottom: 4,
  },
  pageSubtitle: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: Colors.light.textSecondary,
    marginBottom: 4,
  },
  statsRow: { flexDirection: "row", gap: 10 },
  earningsSection: {
    backgroundColor: Colors.light.surface,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: Colors.light.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  earningsBig: {
    padding: 20,
    backgroundColor: Colors.light.primary,
    gap: 4,
  },
  earningsMiniLabel: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.75)",
  },
  earningsBigVal: {
    fontSize: 32,
    fontFamily: "Inter_700Bold",
    color: "#fff",
  },
  earningsMiniSub: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.8)",
  },
  earningsCards: {
    flexDirection: "row",
  },
  earningsSmCard: {
    flex: 1,
    padding: 16,
    gap: 4,
    alignItems: "center",
  },
  earningsSmCardRight: {
    borderLeftWidth: 1,
    borderLeftColor: Colors.light.borderLight,
  },
  earningsSmLabel: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: Colors.light.textSecondary,
  },
  earningsSmVal: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
  },
  progressCard: {
    backgroundColor: Colors.light.surface,
    borderRadius: 16,
    padding: 16,
    gap: 12,
    shadowColor: Colors.light.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressTitle: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    color: Colors.light.text,
  },
  progressSub: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: Colors.light.textSecondary,
  },
  progressTrack: {
    height: 10,
    flexDirection: "row",
    borderRadius: 5,
    overflow: "hidden",
    backgroundColor: Colors.light.borderLight,
  },
  progressFill: { height: 10 },
  legendRow: { flexDirection: "row", gap: 16 },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: Colors.light.textSecondary,
  },
  simulateBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: Colors.light.primary,
    borderRadius: 14,
    paddingVertical: 16,
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  simulateBtnText: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    color: "#fff",
  },
  recentSection: { gap: 12 },
  sectionTitle: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    color: Colors.light.text,
  },
  filterRow: { flexDirection: "row", gap: 8 },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.light.surfaceSecondary,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  filterChipActive: {
    backgroundColor: Colors.light.primaryLight,
    borderColor: Colors.light.primary,
  },
  filterChipText: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    color: Colors.light.textSecondary,
  },
  filterChipTextActive: {
    color: Colors.light.primary,
  },
  ridesList: {
    backgroundColor: Colors.light.surface,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: Colors.light.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  rideRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.borderLight,
  },
  rideStatus: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  rideInfo: { flex: 1, gap: 3 },
  rideRoute: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  rideFrom: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    color: Colors.light.text,
  },
  rideTo: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    color: Colors.light.text,
  },
  rideTime: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    color: Colors.light.textTertiary,
  },
  rideRight: {
    alignItems: "flex-end",
    gap: 4,
  },
  ridePrice: {
    fontSize: 14,
    fontFamily: "Inter_700Bold",
  },
  tipBadge: {
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  tipBadgeText: {
    fontSize: 9,
    fontFamily: "Inter_700Bold",
    color: "#D97706",
    letterSpacing: 0.3,
  },
  blockedBadge: {
    backgroundColor: "#FFF1F0",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  blockedBadgeText: {
    fontSize: 9,
    fontFamily: "Inter_700Bold",
    color: Colors.light.danger,
    letterSpacing: 0.3,
  },
});
