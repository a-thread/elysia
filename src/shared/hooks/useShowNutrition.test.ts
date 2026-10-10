import { describe, it, expect, vi } from "vitest";
import { renderHook } from "@testing-library/react";

const useUserSettings = vi.fn();
vi.mock("@shared/contexts/UserSettingsContext", () => ({
  useUserSettings: () => useUserSettings(),
}));

const { useShowNutrition } = await import("./useShowNutrition");

const show = (showNutrition: boolean, loading: boolean) => {
  useUserSettings.mockReturnValue({ settings: { show_nutrition: showNutrition }, loading });
  return renderHook(() => useShowNutrition()).result.current;
};

describe("useShowNutrition", () => {
  it("is true once settings have loaded and nutrition is on", () => {
    expect(show(true, false)).toBe(true);
  });

  it("is false when the user has hidden nutrition", () => {
    expect(show(false, false)).toBe(false);
  });

  it("is false while settings load, so hidden nutrition never flashes", () => {
    expect(show(true, true)).toBe(false);
  });
});
