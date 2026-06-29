import { create } from "zustand";
import { UIConfig } from "../types/uiConfig";
import { defaultUIConfig } from "../config/defaultUIConfig";
import credupeApi from "../lib/credupe-api";

type UIConfigState = {
  config: UIConfig;
  setConfig: (config: UIConfig) => void;
  fetchConfig: () => Promise<void>;
  updateFlag: (key: string, value: boolean) => Promise<void>;
};

const getInitialConfig = (): UIConfig => {
  if (typeof window !== "undefined") {
    try {
      const cached = window.localStorage.getItem("credupe_ui_config");
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (error) {
      console.error("Failed to parse cached UI config", error);
    }
  }
  return defaultUIConfig;
};

export const useUIConfigStore = create<UIConfigState>()((set, get) => ({
  config: getInitialConfig(),
  setConfig: (config: UIConfig) => {
    set({ config });
    if (typeof window !== "undefined") {
      window.localStorage.setItem("credupe_ui_config", JSON.stringify(config));
    }
  },
  fetchConfig: async () => {
    try {
      const res = await credupeApi.uiConfig.get();
      set({ config: res });
      if (typeof window !== "undefined") {
        window.localStorage.setItem("credupe_ui_config", JSON.stringify(res));
      }
    } catch (error) {
      console.error("Failed to fetch UI config, falling back to default", error);
    }
  },
  updateFlag: async (key: string, value: boolean) => {
    try {
      // Optimistic update
      const currentConfig = get().config;
      const parts = key.split(".");
      const newConfig = JSON.parse(JSON.stringify(currentConfig));
      let current = newConfig;
      for (let i = 0; i < parts.length - 1; i++) {
        current = current[parts[i]];
      }
      current[parts[parts.length - 1]] = value;
      set({ config: newConfig });
      if (typeof window !== "undefined") {
        window.localStorage.setItem("credupe_ui_config", JSON.stringify(newConfig));
      }

      // API Call
      const updatedConfig = await credupeApi.uiConfig.patch(key, value);
      set({ config: updatedConfig });
      if (typeof window !== "undefined") {
        window.localStorage.setItem("credupe_ui_config", JSON.stringify(updatedConfig));
      }
    } catch (error) {
      console.error("Failed to update UI config flag", error);
      // Revert to latest DB state
      try {
        const oldConfig = await credupeApi.uiConfig.get();
        set({ config: oldConfig });
        if (typeof window !== "undefined") {
          window.localStorage.setItem("credupe_ui_config", JSON.stringify(oldConfig));
        }
      } catch {
        // Fallback to default
        set({ config: defaultUIConfig });
      }
    }
  },
}));
