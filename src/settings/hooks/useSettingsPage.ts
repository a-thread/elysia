import { useState } from "react";
import { useAuth } from "@shared/contexts/AuthContext";
import { useToast } from "@shared/components/Toast";
import { useUserSettings } from "@shared/contexts/UserSettingsContext";
import { UserSettings } from "@shared/services/UserSettingsService";
import { syncShoppingListToLichen } from "@shopping-list/services/ShoppingListLichenSync";

type Toggle = "nutrition" | "tern" | "lichen";

const SETTING_KEY: Record<Toggle, keyof UserSettings> = {
  nutrition: "show_nutrition",
  tern: "tern_enabled",
  lichen: "lichen_enabled",
};

const message = (toggle: Toggle, on: boolean): string => {
  if (toggle === "nutrition") return on ? "Nutrition facts shown." : "Nutrition facts hidden.";
  const name = toggle === "tern" ? "Tern" : "Lichen";
  return on ? `Connected to ${name}.` : `Disconnected from ${name}.`;
};

/** Composed settings page hook: current settings plus the page's own intents. */
export const useSettingsPage = () => {
  const { user } = useAuth();
  const toast = useToast();
  const { settings, loading, updateSettings } = useUserSettings();
  const [saving, setSaving] = useState<Toggle | null>(null);

  const toggle = async (which: Toggle) => {
    const key = SETTING_KEY[which];
    const next = !settings[key];
    setSaving(which);
    try {
      await updateSettings({ [key]: next });
      toast.success(message(which, next));
    } catch {
      toast.error("Failed to save your settings. Please try again.");
      setSaving(null);
      return;
    }

    // Turning Lichen on builds the "Shopping List" note from the current list right away.
    if (which === "lichen" && next && user?.id) {
      try {
        await syncShoppingListToLichen(user.id);
      } catch (error) {
        console.error("Failed to build the Lichen shopping list note", error);
        toast.error(
          "Connected, but the Shopping List note couldn't be created yet. It will update the next time your list changes.",
        );
      }
    }
    setSaving(null);
  };

  return {
    showNutrition: settings.show_nutrition,
    ternEnabled: settings.tern_enabled,
    lichenEnabled: settings.lichen_enabled,
    loading,
    saving,
    toggleNutrition: () => toggle("nutrition"),
    toggleTern: () => toggle("tern"),
    toggleLichen: () => toggle("lichen"),
  };
};
