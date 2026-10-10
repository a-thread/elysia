import { supabaseWithAbort } from "./SupabaseWithAbort";
import { TableNames } from "./TableNames";

export interface UserSettings {
  /** Show "Send to Tern" on recipes with nutrition. */
  tern_enabled: boolean;
  /** Keep the shopping list in a "Shopping List" note in Lichen. */
  lichen_enabled: boolean;
}

export const DEFAULT_USER_SETTINGS: UserSettings = {
  tern_enabled: false,
  lichen_enabled: false,
};

/** A user with no settings row yet has every setting at its default. */
const get = async (userId: string): Promise<UserSettings> => {
  const result = await supabaseWithAbort.request(
    "userSettings-get",
    async (client) => {
      const { data, error } = await client
        .from(TableNames.USER_SETTINGS)
        .select("tern_enabled, lichen_enabled")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) throw new Error("Failed to load settings.");
      return { ...DEFAULT_USER_SETTINGS, ...data } as UserSettings;
    },
  );
  return result ?? DEFAULT_USER_SETTINGS;
};

/** Saves only the given settings; the others keep their stored (or default) values. */
const update = async (userId: string, changes: Partial<UserSettings>) => {
  return await supabaseWithAbort.request(
    "userSettings-update",
    async (client) => {
      const { error } = await client.from(TableNames.USER_SETTINGS).upsert(
        {
          user_id: userId,
          ...changes,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" },
      );

      if (error) throw new Error("Failed to save settings.");
      return changes;
    },
  );
};

const UserSettingsService = { get, update };

export default UserSettingsService;
