import { useState } from "react";
import { useAuth } from "@shared/contexts/AuthContext";
import { useToast } from "@shared/components/Toast";
import { useUserSettings } from "@shared/contexts/UserSettingsContext";
import { UserSettings } from "@shared/services/UserSettingsService";
import { syncShoppingListToLichen } from "@shopping-list/services/ShoppingListLichenSync";

type Connection = "tern" | "lichen";

const SETTING_KEY: Record<Connection, keyof UserSettings> = {
  tern: "tern_enabled",
  lichen: "lichen_enabled",
};
const LABEL: Record<Connection, string> = { tern: "Tern", lichen: "Lichen" };

/** Composed settings page hook: current settings plus the page's own intents. */
export const useSettingsPage = () => {
  const { user } = useAuth();
  const toast = useToast();
  const { settings, loading, updateSettings } = useUserSettings();
  const [saving, setSaving] = useState<Connection | null>(null);

  const toggle = async (connection: Connection) => {
    const key = SETTING_KEY[connection];
    const next = !settings[key];
    setSaving(connection);
    try {
      await updateSettings({ [key]: next });
      toast.success(
        next
          ? `Connected to ${LABEL[connection]}.`
          : `Disconnected from ${LABEL[connection]}.`,
      );
    } catch {
      toast.error("Failed to save your settings. Please try again.");
      setSaving(null);
      return;
    }

    // Turning Lichen on builds the "Shopping List" note from the current list right away.
    if (connection === "lichen" && next && user?.id) {
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
    ternEnabled: settings.tern_enabled,
    lichenEnabled: settings.lichen_enabled,
    loading,
    saving,
    toggleTern: () => toggle("tern"),
    toggleLichen: () => toggle("lichen"),
  };
};
