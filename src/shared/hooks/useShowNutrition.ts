import { useUserSettings } from "@shared/contexts/UserSettingsContext";

/**
 * Whether nutrition facts should be shown. Waits for the signed-in user's settings to load, so
 * someone who has hidden nutrition never sees it flash up first. Signed-out visitors, who have no
 * settings, see it.
 */
export const useShowNutrition = (): boolean => {
  const { settings, loading } = useUserSettings();
  return !loading && settings.show_nutrition;
};
