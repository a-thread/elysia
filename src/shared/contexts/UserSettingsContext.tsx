import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useAuth } from "@shared/contexts/AuthContext";
import UserSettingsService, {
  DEFAULT_USER_SETTINGS,
  UserSettings,
} from "@shared/services/UserSettingsService";

interface UserSettingsContextType {
  settings: UserSettings;
  /** True until the signed-in user's settings have been loaded (or failed to). */
  loading: boolean;
  /** Save changes to the settings (e.g. connect or disconnect Tern or Lichen). Throws if it could not be saved. */
  updateSettings: (changes: Partial<UserSettings>) => Promise<void>;
}

const UserSettingsContext = createContext<UserSettingsContextType | undefined>(
  undefined,
);

export const UserSettingsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const userId = user?.id;
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_USER_SETTINGS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Signed out: every setting is back at its default.
    if (!userId) {
      setSettings(DEFAULT_USER_SETTINGS);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    UserSettingsService.get(userId)
      .then((loaded) => !cancelled && setSettings(loaded))
      .catch((error) => console.error("Error loading settings:", error))
      .finally(() => !cancelled && setLoading(false));

    return () => {
      cancelled = true;
    };
  }, [userId]);

  const updateSettings = useCallback(
    async (changes: Partial<UserSettings>) => {
      if (!userId) throw new Error("Sign in to change settings.");
      await UserSettingsService.update(userId, changes);
      setSettings((prev) => ({ ...prev, ...changes }));
    },
    [userId],
  );

  return (
    <UserSettingsContext.Provider value={{ settings, loading, updateSettings }}>
      {children}
    </UserSettingsContext.Provider>
  );
};

export const useUserSettings = (): UserSettingsContextType => {
  const context = useContext(UserSettingsContext);
  if (!context) {
    throw new Error("useUserSettings must be used within a UserSettingsProvider");
  }
  return context;
};
