import { describe, it, expect, vi, beforeEach } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import { ReactNode } from "react";

const useAuth = vi.fn();
vi.mock("@shared/contexts/AuthContext", () => ({ useAuth: () => useAuth() }));
vi.mock("@shared/services/UserSettingsService", () => ({
  DEFAULT_USER_SETTINGS: { tern_enabled: false, lichen_enabled: false },
  default: { get: vi.fn(), update: vi.fn() },
}));

const { default: UserSettingsService } = await import("@shared/services/UserSettingsService");
const { UserSettingsProvider, useUserSettings } = await import("./UserSettingsContext");

const wrapper = ({ children }: { children: ReactNode }) => (
  <UserSettingsProvider>{children}</UserSettingsProvider>
);

describe("UserSettingsContext", () => {
  beforeEach(() => {
    useAuth.mockReset();
    vi.mocked(UserSettingsService.get).mockReset();
    vi.mocked(UserSettingsService.update).mockReset();
  });

  it("stays at the defaults, without loading, when signed out", () => {
    useAuth.mockReturnValue({ user: null });

    const { result } = renderHook(() => useUserSettings(), { wrapper });

    expect(result.current.settings).toEqual({ tern_enabled: false, lichen_enabled: false });
    expect(result.current.loading).toBe(false);
    expect(UserSettingsService.get).not.toHaveBeenCalled();
  });

  it("loads the signed-in user's settings", async () => {
    useAuth.mockReturnValue({ user: { id: "u1" } });
    vi.mocked(UserSettingsService.get).mockResolvedValue({
      tern_enabled: true,
      lichen_enabled: false,
    });

    const { result } = renderHook(() => useUserSettings(), { wrapper });

    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.settings.tern_enabled).toBe(true);
    expect(result.current.settings.lichen_enabled).toBe(false);
  });

  it("keeps the defaults when loading fails", async () => {
    useAuth.mockReturnValue({ user: { id: "u1" } });
    vi.mocked(UserSettingsService.get).mockRejectedValue(new Error("boom"));
    vi.spyOn(console, "error").mockImplementation(() => undefined);

    const { result } = renderHook(() => useUserSettings(), { wrapper });

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.settings.tern_enabled).toBe(false);
  });

  it("saves a change, updating only that setting; a failed save leaves settings alone", async () => {
    useAuth.mockReturnValue({ user: { id: "u1" } });
    vi.mocked(UserSettingsService.get).mockResolvedValue({
      tern_enabled: true,
      lichen_enabled: false,
    });
    vi.mocked(UserSettingsService.update).mockResolvedValueOnce({ lichen_enabled: true });

    const { result } = renderHook(() => useUserSettings(), { wrapper });
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(() => result.current.updateSettings({ lichen_enabled: true }));
    expect(UserSettingsService.update).toHaveBeenCalledWith("u1", { lichen_enabled: true });
    expect(result.current.settings).toEqual({ tern_enabled: true, lichen_enabled: true });

    vi.mocked(UserSettingsService.update).mockRejectedValueOnce(new Error("boom"));
    await expect(act(() => result.current.updateSettings({ tern_enabled: false }))).rejects.toThrow(
      "boom",
    );
    expect(result.current.settings.tern_enabled).toBe(true);
  });
});
