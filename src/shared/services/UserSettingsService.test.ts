import { describe, it, expect, vi, beforeEach } from "vitest";

const maybeSingle = vi.fn();
const eq = vi.fn(() => ({ maybeSingle }));
const select = vi.fn(() => ({ eq }));
const upsert = vi.fn();
const from = vi.fn(() => ({ select, upsert }));

vi.mock("./SupabaseWithAbort", () => ({
  supabaseWithAbort: {
    request: vi.fn(async (_key: string, fn: (client: unknown) => unknown) =>
      fn({ from }),
    ),
  },
}));

const { default: UserSettingsService, DEFAULT_USER_SETTINGS } = await import(
  "./UserSettingsService"
);

describe("UserSettingsService", () => {
  beforeEach(() => {
    maybeSingle.mockReset();
    upsert.mockReset();
    from.mockClear();
    eq.mockClear();
  });

  it("loads the signed-in user's settings row", async () => {
    maybeSingle.mockResolvedValue({
      data: { tern_enabled: true, lichen_enabled: true },
      error: null,
    });

    await expect(UserSettingsService.get("u1")).resolves.toEqual({
      tern_enabled: true,
      lichen_enabled: true,
    });
    expect(from).toHaveBeenCalledWith("user_settings");
    expect(eq).toHaveBeenCalledWith("user_id", "u1");
  });

  it("returns the defaults when the user has no settings row yet", async () => {
    maybeSingle.mockResolvedValue({ data: null, error: null });

    await expect(UserSettingsService.get("u1")).resolves.toEqual(DEFAULT_USER_SETTINGS);
  });

  it("fills in defaults for settings missing from the row", async () => {
    maybeSingle.mockResolvedValue({ data: { tern_enabled: true }, error: null });

    await expect(UserSettingsService.get("u1")).resolves.toEqual({
      tern_enabled: true,
      lichen_enabled: false,
    });
  });

  it("throws when loading fails", async () => {
    maybeSingle.mockResolvedValue({ data: null, error: { message: "boom" } });

    await expect(UserSettingsService.get("u1")).rejects.toThrow("Failed to load settings.");
  });

  it("upserts only the changed settings, keyed by user", async () => {
    upsert.mockResolvedValue({ error: null });

    await UserSettingsService.update("u1", { lichen_enabled: true });

    expect(upsert).toHaveBeenCalledWith(
      expect.objectContaining({ user_id: "u1", lichen_enabled: true }),
      { onConflict: "user_id" },
    );
    expect(upsert.mock.calls[0][0]).not.toHaveProperty("tern_enabled");
  });

  it("throws when saving fails", async () => {
    upsert.mockResolvedValue({ error: { message: "boom" } });

    await expect(
      UserSettingsService.update("u1", { tern_enabled: false }),
    ).rejects.toThrow("Failed to save settings.");
  });
});
