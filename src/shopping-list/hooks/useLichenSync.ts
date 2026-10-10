import { useCallback } from "react";
import { useAuth } from "@shared/contexts/AuthContext";
import { useUserSettings } from "@shared/contexts/UserSettingsContext";
import { syncShoppingListToLichen } from "../services/ShoppingListLichenSync";

/**
 * Returns a function that pushes the current shopping list to the user's Lichen note, if (and only
 * if) they have connected Lichen. It never throws: the list is already saved in Elysia, and the next
 * change resends everything, so a failed sync is logged rather than shown as an error.
 */
export const useLichenSync = () => {
  const { user } = useAuth();
  const { settings } = useUserSettings();
  const userId = user?.id;
  const enabled = settings.lichen_enabled;

  return useCallback(async () => {
    if (!userId || !enabled) return;
    try {
      await syncShoppingListToLichen(userId);
    } catch (error) {
      console.error("Failed to sync the shopping list to Lichen", error);
    }
  }, [userId, enabled]);
};
