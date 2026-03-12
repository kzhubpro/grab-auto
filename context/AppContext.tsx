import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

export interface AppSettings {
  isActive: boolean;
  priceBlock: {
    enabled: boolean;
    minPrice: number;
  };
  tipPriority: {
    enabled: boolean;
  };
  fakeGps: {
    enabled: boolean;
    lat: number;
    lng: number;
    locationName: string;
  };
  highPricePriority: {
    enabled: boolean;
    threshold: number;
  };
  autoSteal: {
    enabled: boolean;
    delayMs: number;
    mode: "instant" | "smart";
  };
  autoDelivery: {
    enabled: boolean;
    minPrice: number;
    prioritizeFood: boolean;
    prioritizeExpress: boolean;
  };
}

export interface RideStats {
  totalRides: number;
  blockedRides: number;
  totalEarnings: number;
  avgPrice: number;
}

interface AppContextType {
  settings: AppSettings;
  stats: RideStats;
  updateSettings: (updates: Partial<AppSettings>) => void;
  updatePriceBlock: (updates: Partial<AppSettings["priceBlock"]>) => void;
  updateTipPriority: (updates: Partial<AppSettings["tipPriority"]>) => void;
  updateFakeGps: (updates: Partial<AppSettings["fakeGps"]>) => void;
  updateHighPricePriority: (updates: Partial<AppSettings["highPricePriority"]>) => void;
  updateAutoSteal: (updates: Partial<AppSettings["autoSteal"]>) => void;
  updateAutoDelivery: (updates: Partial<AppSettings["autoDelivery"]>) => void;
  toggleActive: () => void;
  addRide: (price: number, hasTip: boolean, blocked: boolean) => void;
}

const defaultSettings: AppSettings = {
  isActive: false,
  priceBlock: {
    enabled: true,
    minPrice: 30000,
  },
  tipPriority: {
    enabled: true,
  },
  fakeGps: {
    enabled: false,
    lat: 10.7769,
    lng: 106.7009,
    locationName: "Quận 1, TP.HCM",
  },
  highPricePriority: {
    enabled: true,
    threshold: 80000,
  },
  autoSteal: {
    enabled: false,
    delayMs: 500,
    mode: "smart",
  },
  autoDelivery: {
    enabled: false,
    minPrice: 25000,
    prioritizeFood: true,
    prioritizeExpress: true,
  },
};

const defaultStats: RideStats = {
  totalRides: 0,
  blockedRides: 0,
  totalEarnings: 0,
  avgPrice: 0,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [stats, setStats] = useState<RideStats>(defaultStats);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [savedSettings, savedStats] = await Promise.all([
        AsyncStorage.getItem("grab_auto_settings"),
        AsyncStorage.getItem("grab_auto_stats"),
      ]);
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...defaultSettings, ...parsed });
      }
      if (savedStats) setStats(JSON.parse(savedStats));
    } catch {}
  };

  const saveSettings = useCallback(async (newSettings: AppSettings) => {
    try {
      await AsyncStorage.setItem("grab_auto_settings", JSON.stringify(newSettings));
    } catch {}
  }, []);

  const saveStats = useCallback(async (newStats: RideStats) => {
    try {
      await AsyncStorage.setItem("grab_auto_stats", JSON.stringify(newStats));
    } catch {}
  }, []);

  const updateSettings = useCallback((updates: Partial<AppSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...updates };
      saveSettings(next);
      return next;
    });
  }, [saveSettings]);

  const updatePriceBlock = useCallback((updates: Partial<AppSettings["priceBlock"]>) => {
    setSettings((prev) => {
      const next = { ...prev, priceBlock: { ...prev.priceBlock, ...updates } };
      saveSettings(next);
      return next;
    });
  }, [saveSettings]);

  const updateTipPriority = useCallback((updates: Partial<AppSettings["tipPriority"]>) => {
    setSettings((prev) => {
      const next = { ...prev, tipPriority: { ...prev.tipPriority, ...updates } };
      saveSettings(next);
      return next;
    });
  }, [saveSettings]);

  const updateFakeGps = useCallback((updates: Partial<AppSettings["fakeGps"]>) => {
    setSettings((prev) => {
      const next = { ...prev, fakeGps: { ...prev.fakeGps, ...updates } };
      saveSettings(next);
      return next;
    });
  }, [saveSettings]);

  const updateHighPricePriority = useCallback((updates: Partial<AppSettings["highPricePriority"]>) => {
    setSettings((prev) => {
      const next = { ...prev, highPricePriority: { ...prev.highPricePriority, ...updates } };
      saveSettings(next);
      return next;
    });
  }, [saveSettings]);

  const updateAutoSteal = useCallback((updates: Partial<AppSettings["autoSteal"]>) => {
    setSettings((prev) => {
      const next = { ...prev, autoSteal: { ...prev.autoSteal, ...updates } };
      saveSettings(next);
      return next;
    });
  }, [saveSettings]);

  const updateAutoDelivery = useCallback((updates: Partial<AppSettings["autoDelivery"]>) => {
    setSettings((prev) => {
      const next = { ...prev, autoDelivery: { ...prev.autoDelivery, ...updates } };
      saveSettings(next);
      return next;
    });
  }, [saveSettings]);

  const toggleActive = useCallback(() => {
    setSettings((prev) => {
      const next = { ...prev, isActive: !prev.isActive };
      saveSettings(next);
      return next;
    });
  }, [saveSettings]);

  const addRide = useCallback((price: number, hasTip: boolean, blocked: boolean) => {
    setStats((prev) => {
      const newTotal = prev.totalRides + 1;
      const newBlocked = blocked ? prev.blockedRides + 1 : prev.blockedRides;
      const newEarnings = blocked ? prev.totalEarnings : prev.totalEarnings + price;
      const acceptedCount = newTotal - newBlocked;
      const newAvg = acceptedCount > 0 ? newEarnings / acceptedCount : 0;
      const next = {
        totalRides: newTotal,
        blockedRides: newBlocked,
        totalEarnings: newEarnings,
        avgPrice: newAvg,
      };
      saveStats(next);
      return next;
    });
  }, [saveStats]);

  return (
    <AppContext.Provider value={{
      settings,
      stats,
      updateSettings,
      updatePriceBlock,
      updateTipPriority,
      updateFakeGps,
      updateHighPricePriority,
      updateAutoSteal,
      updateAutoDelivery,
      toggleActive,
      addRide,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
