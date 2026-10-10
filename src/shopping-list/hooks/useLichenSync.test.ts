import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";

const useAuth = vi.fn();
const useUserSettings = vi.fn();
vi.mock("@shared/contexts/AuthContext", () => ({ useAuth: () => useAuth() }));
vi.mock("@shared/contexts/UserSettingsContext", () => ({
  useUserSettings: () => useUserSettings(),
}));
vi.mock("../services/ShoppingListLichenSync", () => ({
  syncShoppingListToLichen: vi.fn(),
}));

const { syncShoppingListToLichen } = await import("../services/ShoppingListLichenSync");
const { useLichenSync } = await import("./useLichenSync");

const setup = (user: { id: string } | null, lichenEnabled: boolean) => {
  useAuth.mockReturnValue({ user });
  useUserSettings.mockReturnValue({ settings: { lichen_enabled: lichenEnabled } });
  return renderHook(() => useLichenSync()).result.current;
};

describe("useLichenSync", () => {
  beforeEach(() => {
    vi.mocked(syncShoppingListToLichen).mockReset();
    vi.mocked(syncShoppingListToLichen).mockResolvedValue(undefined);
  });

  it("syncs the signed-in user's list when Lichen is connected", async () => {
    await setup({ id: "u1" }, true)();

    expect(syncShoppingListToLichen).toHaveBeenCalledWith("u1");
  });

  it("does nothing when Lichen is not connected", async () => {
    await setup({ id: "u1" }, false)();

    expect(syncShoppingListToLichen).not.toHaveBeenCalled();
  });

  it("does nothing when signed out", async () => {
    await setup(null, true)();

    expect(syncShoppingListToLichen).not.toHaveBeenCalled();
  });

  it("logs instead of throwing when the sync fails", async () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => undefined);
    vi.mocked(syncShoppingListToLichen).mockRejectedValue(new Error("boom"));

    await expect(setup({ id: "u1" }, true)()).resolves.toBeUndefined();
    expect(error).toHaveBeenCalled();
  });
});
