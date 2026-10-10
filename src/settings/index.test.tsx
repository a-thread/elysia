import { describe, it, expect, vi, afterEach } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const useSettingsPage = vi.fn();
vi.mock("./hooks/useSettingsPage", () => ({ useSettingsPage: () => useSettingsPage() }));

const { default: Settings } = await import("./index");

const page = (overrides: Record<string, unknown> = {}) => ({
  showNutrition: true,
  ternEnabled: false,
  lichenEnabled: false,
  loading: false,
  saving: null,
  toggleNutrition: vi.fn(),
  toggleTern: vi.fn(),
  toggleLichen: vi.fn(),
  ...overrides,
});

afterEach(cleanup); // vitest globals are off, so testing-library does not clean up on its own

describe("Settings page", () => {
  it("shows the nutrition, Tern and Lichen switches when nutrition is on", () => {
    useSettingsPage.mockReturnValue(page());
    render(<Settings />);

    expect(screen.getByRole("switch", { name: "Show nutrition facts" })).toBeChecked();
    expect(screen.getByRole("switch", { name: "Connect to Tern" })).not.toBeChecked();
    expect(screen.getByRole("switch", { name: "Connect to Lichen" })).toBeInTheDocument();
  });

  it("hides the Tern connection when nutrition is hidden, but keeps Lichen", () => {
    useSettingsPage.mockReturnValue(page({ showNutrition: false, ternEnabled: true }));
    render(<Settings />);

    expect(screen.getByRole("switch", { name: "Show nutrition facts" })).not.toBeChecked();
    expect(screen.queryByRole("switch", { name: "Connect to Tern" })).not.toBeInTheDocument();
    expect(screen.getByRole("switch", { name: "Connect to Lichen" })).toBeInTheDocument();
  });

  it("toggles the matching setting", async () => {
    const user = userEvent.setup();
    const state = page();
    useSettingsPage.mockReturnValue(state);
    render(<Settings />);

    await user.click(screen.getByRole("switch", { name: "Show nutrition facts" }));
    await user.click(screen.getByRole("switch", { name: "Connect to Lichen" }));

    expect(state.toggleNutrition).toHaveBeenCalledTimes(1);
    expect(state.toggleLichen).toHaveBeenCalledTimes(1);
    expect(state.toggleTern).not.toHaveBeenCalled();
  });

  it("disables every switch while one is saving", () => {
    useSettingsPage.mockReturnValue(page({ saving: "nutrition" }));
    render(<Settings />);

    screen.getAllByRole("switch").forEach((toggle) => expect(toggle).toBeDisabled());
  });

  it("shows only a loading indicator while settings load", () => {
    useSettingsPage.mockReturnValue(page({ loading: true }));
    render(<Settings />);

    expect(screen.queryByRole("switch")).not.toBeInTheDocument();
  });
});
