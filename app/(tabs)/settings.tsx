import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FeatureCard } from "@/components/FeatureCard";
import { LocationPicker } from "@/components/LocationPicker";
import { PriceSlider } from "@/components/PriceSlider";
import Colors from "@/constants/colors";
import { useApp } from "@/context/AppContext";

function formatPrice(p: number) {
  return new Intl.NumberFormat("vi-VN").format(p) + "đ";
}

const DELAY_OPTIONS = [
  { label: "Tức thì", value: 0 },
  { label: "0.3s", value: 300 },
  { label: "0.5s", value: 500 },
  { label: "1s", value: 1000 },
];

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const {
    settings,
    updatePriceBlock,
    updateTipPriority,
    updateFakeGps,
    updateHighPricePriority,
    updateAutoSteal,
    updateAutoDelivery,
  } = useApp();

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : 0;

  return (
    <View style={[styles.root, { paddingTop: topPad, paddingBottom: bottomPad }]}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Header branding */}
        <View style={styles.brandCard}>
          <View style={styles.brandLeft}>
            <Text style={styles.brandApp}>
              <Text style={styles.brandG}>Tool </Text>Grab
            </Text>
            <Text style={styles.brandBy}>by Phú Trần Development</Text>
          </View>
          <View style={styles.brandDivider} />
          <View style={styles.brandContact}>
            <Text style={styles.brandContactLabel}>Mua app liên hệ Zalo</Text>
            <Text style={styles.brandContactVal}>0869 174 274</Text>
            <Text style={styles.brandContactNote}>⚠️ Chỉ hỗ trợ tải trên iOS</Text>
          </View>
        </View>

        <Text style={styles.pageTitle}>Cài Đặt</Text>
        <Text style={styles.pageSubtitle}>Tùy chỉnh bộ lọc tự động</Text>

        {/* ── Auto Steal ── */}
        <Text style={styles.sectionTitle}>Nâng Cao</Text>

        <FeatureCard
          icon="refresh-cw"
          iconColor="#7C3AED"
          iconBg="#F5F3FF"
          title="Auto Lấy Đơn Người Khác"
          subtitle={settings.autoSteal.enabled ? `Chế độ: ${settings.autoSteal.mode === "instant" ? "Tức thì" : "Thông minh"}` : "Tự động giành đơn đang hiển thị"}
          enabled={settings.autoSteal.enabled}
          onToggle={() => updateAutoSteal({ enabled: !settings.autoSteal.enabled })}
          badge="NEW"
          badgeColor="#7C3AED"
        >
          <View style={styles.subSection}>
            {/* Mode selector */}
            <Text style={styles.subLabel}>Chế độ lấy đơn</Text>
            <View style={styles.modeRow}>
              {(["instant", "smart"] as const).map((m) => (
                <Pressable
                  key={m}
                  style={[
                    styles.modeChip,
                    settings.autoSteal.mode === m && styles.modeChipActive,
                  ]}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    updateAutoSteal({ mode: m });
                  }}
                >
                  <Feather
                    name={m === "instant" ? "zap" : "cpu"}
                    size={14}
                    color={settings.autoSteal.mode === m ? "#fff" : Colors.light.textSecondary}
                  />
                  <Text style={[styles.modeChipText, settings.autoSteal.mode === m && styles.modeChipTextActive]}>
                    {m === "instant" ? "Tức Thì" : "Thông Minh"}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* Mode description */}
            <View style={[styles.infoBox, { backgroundColor: "#F5F3FF" }]}>
              <Feather name={settings.autoSteal.mode === "instant" ? "zap" : "cpu"} size={13} color="#7C3AED" />
              <Text style={[styles.infoText, { color: "#5B21B6" }]}>
                {settings.autoSteal.mode === "instant"
                  ? "Lấy ngay lập tức khi thấy đơn. Tốc độ cao nhất nhưng có thể lấy đơn xấu."
                  : "Kiểm tra giá & rating trước, chỉ lấy đơn thoả mãn điều kiện đã cài."}
              </Text>
            </View>

            {/* Delay */}
            <Text style={styles.subLabel}>Độ trễ phản hồi</Text>
            <View style={styles.delayRow}>
              {DELAY_OPTIONS.map((opt) => (
                <Pressable
                  key={opt.value}
                  style={[
                    styles.delayChip,
                    settings.autoSteal.delayMs === opt.value && styles.delayChipActive,
                  ]}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    updateAutoSteal({ delayMs: opt.value });
                  }}
                >
                  <Text style={[
                    styles.delayChipText,
                    settings.autoSteal.delayMs === opt.value && styles.delayChipTextActive,
                  ]}>
                    {opt.label}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* Steps */}
            <View style={styles.stepsList}>
              <Text style={styles.stepsTitle}>Cách hoạt động</Text>
              {[
                { icon: "eye" as const, text: "Bot quét màn hình liên tục để tìm đơn mới" },
                { icon: "filter" as const, text: "Lọc theo điều kiện giá & bộ lọc đã cài" },
                { icon: "mouse-pointer" as const, text: "Tự động nhấn Nhận Đơn nhanh hơn tài xế khác" },
              ].map((s, i) => (
                <View key={i} style={styles.stepRow}>
                  <View style={styles.stepIcon}>
                    <Feather name={s.icon} size={13} color="#7C3AED" />
                  </View>
                  <Text style={styles.stepText}>{s.text}</Text>
                </View>
              ))}
            </View>
          </View>
        </FeatureCard>

        {/* ── Auto Delivery ── */}
        <FeatureCard
          icon="package"
          iconColor="#0EA5E9"
          iconBg="#F0F9FF"
          title="Auto Nhận Đơn Giao Hàng"
          subtitle={settings.autoDelivery.enabled ? `Cước tối thiểu ${formatPrice(settings.autoDelivery.minPrice)}` : "Tự động nhận giao hàng cước cao"}
          enabled={settings.autoDelivery.enabled}
          onToggle={() => updateAutoDelivery({ enabled: !settings.autoDelivery.enabled })}
          badge="HOT"
          badgeColor="#0EA5E9"
        >
          <View style={styles.subSection}>
            <View style={styles.sliderHeader}>
              <Text style={styles.subLabel}>Cước tối thiểu</Text>
              <Text style={styles.sliderValue}>{formatPrice(settings.autoDelivery.minPrice)}</Text>
            </View>
            <PriceSlider
              value={settings.autoDelivery.minPrice}
              min={10000}
              max={150000}
              step={5000}
              onValueChange={(v) => updateAutoDelivery({ minPrice: v })}
              formatLabel={formatPrice}
            />

            <Text style={[styles.subLabel, { marginTop: 8 }]}>Ưu tiên loại đơn</Text>
            <View style={styles.toggleRow}>
              <Pressable
                style={[styles.toggleChip, settings.autoDelivery.prioritizeFood && styles.toggleChipActive]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  updateAutoDelivery({ prioritizeFood: !settings.autoDelivery.prioritizeFood });
                }}
              >
                <Text style={[styles.toggleChipText, settings.autoDelivery.prioritizeFood && styles.toggleChipTextActive]}>
                  🍔 Đồ ăn
                </Text>
              </Pressable>
              <Pressable
                style={[styles.toggleChip, settings.autoDelivery.prioritizeExpress && styles.toggleChipActive]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  updateAutoDelivery({ prioritizeExpress: !settings.autoDelivery.prioritizeExpress });
                }}
              >
                <Text style={[styles.toggleChipText, settings.autoDelivery.prioritizeExpress && styles.toggleChipTextActive]}>
                  ⚡ Hoả tốc
                </Text>
              </Pressable>
            </View>

            <View style={[styles.infoBox, { backgroundColor: "#F0F9FF" }]}>
              <Feather name="truck" size={13} color="#0EA5E9" />
              <Text style={[styles.infoText, { color: "#0369A1" }]}>
                Bot sẽ tự động nhận đơn giao hàng khi cước vượt ngưỡng và đúng loại ưu tiên đã chọn.
              </Text>
            </View>

            <View style={styles.stepsList}>
              <Text style={styles.stepsTitle}>Thứ tự ưu tiên</Text>
              {[
                { rank: "1", text: "Đơn Hoả Tốc cước cao (nhận ngay)", color: Colors.light.danger },
                { rank: "2", text: "Đơn Đồ Ăn cước cao (nhận sau 1s)", color: Colors.light.warning },
                { rank: "3", text: "Đơn thường đủ cước tối thiểu (nhận sau 3s)", color: Colors.light.textSecondary },
              ].map((s, i) => (
                <View key={i} style={styles.rankRow}>
                  <View style={[styles.rankBadge, { backgroundColor: s.color }]}>
                    <Text style={styles.rankText}>{s.rank}</Text>
                  </View>
                  <Text style={styles.stepText}>{s.text}</Text>
                </View>
              ))}
            </View>
          </View>
        </FeatureCard>

        {/* ── Price Block ── */}
        <Text style={styles.sectionTitle}>Bộ Lọc Giá</Text>
        <FeatureCard
          icon="shield"
          iconColor={Colors.light.danger}
          iconBg="#FFF1F0"
          title="Chặn Cuốc Giá Thấp"
          subtitle={`Từ chối cuốc < ${formatPrice(settings.priceBlock.minPrice)}`}
          enabled={settings.priceBlock.enabled}
          onToggle={() => updatePriceBlock({ enabled: !settings.priceBlock.enabled })}
          badge="HOT"
          badgeColor={Colors.light.danger}
        >
          <View style={styles.subSection}>
            <View style={styles.sliderHeader}>
              <Text style={styles.subLabel}>Giá tối thiểu</Text>
              <Text style={styles.sliderValue}>{formatPrice(settings.priceBlock.minPrice)}</Text>
            </View>
            <PriceSlider
              value={settings.priceBlock.minPrice}
              min={10000}
              max={200000}
              step={5000}
              onValueChange={(v) => updatePriceBlock({ minPrice: v })}
              formatLabel={formatPrice}
            />
          </View>
        </FeatureCard>

        <FeatureCard
          icon="trending-up"
          iconColor={Colors.light.success}
          iconBg="#F0FFF4"
          title="Ưu Tiên Cuốc Giá Cao"
          subtitle={`Ưu tiên cuốc > ${formatPrice(settings.highPricePriority.threshold)}`}
          enabled={settings.highPricePriority.enabled}
          onToggle={() => updateHighPricePriority({ enabled: !settings.highPricePriority.enabled })}
          badge="PRO"
          badgeColor={Colors.light.success}
        >
          <View style={styles.subSection}>
            <View style={styles.sliderHeader}>
              <Text style={styles.subLabel}>Ngưỡng giá cao</Text>
              <Text style={styles.sliderValue}>{formatPrice(settings.highPricePriority.threshold)}</Text>
            </View>
            <PriceSlider
              value={settings.highPricePriority.threshold}
              min={30000}
              max={500000}
              step={10000}
              onValueChange={(v) => updateHighPricePriority({ threshold: v })}
              formatLabel={formatPrice}
            />
            <View style={styles.infoBox}>
              <Feather name="info" size={13} color={Colors.light.success} />
              <Text style={styles.infoText}>
                Bot sẽ chấp nhận ngay các cuốc vượt ngưỡng này mà không cần lọc thêm.
              </Text>
            </View>
          </View>
        </FeatureCard>

        {/* ── Tip Priority ── */}
        <Text style={styles.sectionTitle}>Ưu Tiên Khách</Text>
        <FeatureCard
          icon="dollar-sign"
          iconColor="#F59E0B"
          iconBg="#FFFBEB"
          title="Ưu Tiên Khách Tip"
          subtitle="Nhận cuốc có tip trước tiên"
          enabled={settings.tipPriority.enabled}
          onToggle={() => updateTipPriority({ enabled: !settings.tipPriority.enabled })}
          badge="NEW"
          badgeColor="#F59E0B"
        >
          <View style={styles.subSection}>
            <View style={styles.tipInfo}>
              {[
                { icon: "check-circle" as const, color: Colors.light.success, text: "Khách tip: Chấp nhận ngay lập tức" },
                { icon: "clock" as const, color: Colors.light.warning, text: "Không tip: Đợi 3 giây trước khi xét" },
                { icon: "x-circle" as const, color: Colors.light.danger, text: "Khách đánh giá thấp: Bỏ qua" },
              ].map((r, i) => (
                <View key={i} style={styles.tipRow}>
                  <Feather name={r.icon} size={14} color={r.color} />
                  <Text style={styles.tipRowText}>{r.text}</Text>
                </View>
              ))}
            </View>
          </View>
        </FeatureCard>

        {/* ── Fake GPS ── */}
        <Text style={styles.sectionTitle}>GPS Ảo</Text>
        <FeatureCard
          icon="map-pin"
          iconColor="#7C3AED"
          iconBg="#F5F3FF"
          title="Fake GPS"
          subtitle={settings.fakeGps.enabled ? settings.fakeGps.locationName : "Tắt GPS ảo"}
          enabled={settings.fakeGps.enabled}
          onToggle={() => updateFakeGps({ enabled: !settings.fakeGps.enabled })}
        >
          <View style={styles.subSection}>
            <Text style={styles.subLabel}>Vị trí giả lập</Text>
            <LocationPicker
              currentName={settings.fakeGps.locationName}
              onSelect={(loc) =>
                updateFakeGps({
                  lat: loc.lat,
                  lng: loc.lng,
                  locationName: loc.name,
                })
              }
            />
            <View style={styles.coordsRow}>
              <View style={styles.coordBox}>
                <Text style={styles.coordLabel}>Vĩ độ</Text>
                <Text style={styles.coordVal}>{settings.fakeGps.lat.toFixed(4)}</Text>
              </View>
              <View style={styles.coordBox}>
                <Text style={styles.coordLabel}>Kinh độ</Text>
                <Text style={styles.coordVal}>{settings.fakeGps.lng.toFixed(4)}</Text>
              </View>
            </View>
            <View style={[styles.infoBox, { backgroundColor: "#F5F3FF" }]}>
              <Feather name="alert-triangle" size={13} color="#7C3AED" />
              <Text style={[styles.infoText, { color: "#5B21B6" }]}>
                Dùng GPS ảo để nhận cuốc từ khu vực có mật độ khách cao hơn.
              </Text>
            </View>
          </View>
        </FeatureCard>

        {/* Reset */}
        <Pressable
          style={({ pressed }) => [styles.resetBtn, pressed && { opacity: 0.7 }]}
          onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); }}
        >
          <Feather name="refresh-ccw" size={15} color={Colors.light.textSecondary} />
          <Text style={styles.resetText}>Đặt Lại Mặc Định</Text>
        </Pressable>

        <View style={styles.versionRow}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.light.background },
  content: { padding: 20, paddingBottom: 100, gap: 4 },
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
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    color: Colors.light.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginTop: 16,
    marginBottom: 8,
  },
  subSection: { gap: 12 },
  subLabel: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    color: Colors.light.textSecondary,
  },
  sliderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sliderValue: {
    fontSize: 14,
    fontFamily: "Inter_700Bold",
    color: Colors.light.primary,
  },
  infoBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    backgroundColor: Colors.light.primaryLight,
    borderRadius: 10,
    padding: 10,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: Colors.light.primary,
    lineHeight: 17,
  },
  modeRow: { flexDirection: "row", gap: 10 },
  modeChip: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: Colors.light.surfaceSecondary,
    borderWidth: 1.5,
    borderColor: Colors.light.border,
  },
  modeChipActive: {
    backgroundColor: "#7C3AED",
    borderColor: "#7C3AED",
  },
  modeChipText: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    color: Colors.light.textSecondary,
  },
  modeChipTextActive: { color: "#fff" },
  delayRow: { flexDirection: "row", gap: 8 },
  delayChip: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: Colors.light.surfaceSecondary,
    borderWidth: 1.5,
    borderColor: Colors.light.border,
  },
  delayChipActive: {
    backgroundColor: Colors.light.primaryLight,
    borderColor: Colors.light.primary,
  },
  delayChipText: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    color: Colors.light.textSecondary,
  },
  delayChipTextActive: { color: Colors.light.primary },
  stepsList: {
    backgroundColor: Colors.light.surfaceSecondary,
    borderRadius: 12,
    padding: 12,
    gap: 10,
  },
  stepsTitle: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
    color: Colors.light.textSecondary,
    marginBottom: 2,
  },
  stepRow: { flexDirection: "row", alignItems: "flex-start", gap: 8 },
  stepIcon: {
    width: 26,
    height: 26,
    borderRadius: 8,
    backgroundColor: "#EDE9FE",
    alignItems: "center",
    justifyContent: "center",
  },
  stepText: {
    flex: 1,
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: Colors.light.text,
    lineHeight: 18,
  },
  rankRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  rankBadge: {
    width: 22,
    height: 22,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  rankText: {
    fontSize: 11,
    fontFamily: "Inter_700Bold",
    color: "#fff",
  },
  toggleRow: { flexDirection: "row", gap: 10 },
  toggleChip: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: Colors.light.surfaceSecondary,
    borderWidth: 1.5,
    borderColor: Colors.light.border,
  },
  toggleChipActive: {
    backgroundColor: "#F0F9FF",
    borderColor: "#0EA5E9",
  },
  toggleChipText: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    color: Colors.light.textSecondary,
  },
  toggleChipTextActive: { color: "#0369A1" },
  tipInfo: { gap: 10 },
  tipRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  tipRowText: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: Colors.light.text,
  },
  gpsSection: { gap: 12 },
  coordsRow: { flexDirection: "row", gap: 12 },
  coordBox: {
    flex: 1,
    backgroundColor: Colors.light.surfaceSecondary,
    borderRadius: 10,
    padding: 10,
    gap: 2,
  },
  coordLabel: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    color: Colors.light.textTertiary,
  },
  coordVal: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    color: Colors.light.text,
  },
  resetBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 20,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderStyle: "dashed",
  },
  resetText: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
    color: Colors.light.textSecondary,
  },
  brandCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.primary,
    borderRadius: 16,
    padding: 16,
    marginBottom: 4,
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  brandLeft: { flex: 1, gap: 3 },
  brandApp: {
    fontSize: 20,
    fontFamily: "Inter_700Bold",
    color: "#fff",
  },
  brandG: { color: "#CCFFDD" },
  brandBy: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    color: "rgba(255,255,255,0.8)",
  },
  brandDivider: {
    width: 1,
    height: 44,
    backgroundColor: "rgba(255,255,255,0.3)",
    marginHorizontal: 16,
  },
  brandContact: { alignItems: "flex-end", gap: 3 },
  brandContactLabel: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.75)",
  },
  brandContactVal: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
    color: "#fff",
    letterSpacing: 0.5,
  },
  brandContactNote: {
    fontSize: 10,
    fontFamily: "Inter_500Medium",
    color: "rgba(255,255,255,0.85)",
    marginTop: 2,
  },
  versionRow: {
    alignItems: "center",
    paddingVertical: 16,
  },
  versionText: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: Colors.light.textTertiary,
  },
});
