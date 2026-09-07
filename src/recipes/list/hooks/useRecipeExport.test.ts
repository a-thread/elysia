import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { RecipeSort } from "@recipes/models/RecipeSort";

const toast = {
  success: vi.fn(),
  error: vi.fn(),
  info: vi.fn(),
  warning: vi.fn(),
};

vi.mock("@shared/components/Toast", () => ({ useToast: () => toast }));
vi.mock("@shared/contexts/AuthContext", () => ({
  useAuth: () => ({ user: { id: "u1" } }),
}));
vi.mock("@recipes/services/RecipeService", () => ({
  default: { getRecipeList: vi.fn() },
}));
vi.mock("@recipes/utils/PdfGenerator", () => ({ default: vi.fn() }));

const { default: RecipeService } =
  await import("@recipes/services/RecipeService");
const { default: generateRecipesPDF } =
  await import("@recipes/utils/PdfGenerator");
const { useRecipeExport } = await import("./useRecipeExport");

describe("useRecipeExport", () => {
  beforeEach(() => {
    toast.error.mockReset();
    vi.mocked(RecipeService.getRecipeList).mockReset();
    vi.mocked(generateRecipesPDF).mockReset();
  });

  it("starts with isExporting false", () => {
    const { result } = renderHook(() =>
      useRecipeExport("", [], RecipeSort.DateNewest),
    );
    expect(result.current.isExporting).toBe(false);
  });

  it("fetches every matching recipe and generates a PDF on success", async () => {
    vi.mocked(RecipeService.getRecipeList).mockResolvedValue({
      data: [{ id: "r1", title: "Soup" }],
      count: 1,
    } as never);

    const { result } = renderHook(() =>
      useRecipeExport("soup", [], RecipeSort.DateNewest),
    );
    await act(() => result.current.exportAll());

    expect(generateRecipesPDF).toHaveBeenCalledWith([
      { id: "r1", title: "Soup" },
    ]);
    expect(result.current.isExporting).toBe(false);
  });

  it("shows an error toast when the fetch rejects", async () => {
    vi.mocked(RecipeService.getRecipeList).mockRejectedValue(new Error("boom"));

    const { result } = renderHook(() =>
      useRecipeExport("", [], RecipeSort.DateNewest),
    );
    await act(() => result.current.exportAll());

    expect(toast.error).toHaveBeenCalledWith(
      "Failed to export recipes. Please try again.",
    );
    expect(generateRecipesPDF).not.toHaveBeenCalled();
  });

  it("shows an error toast instead of exporting when there are no matching recipes (edge case)", async () => {
    vi.mocked(RecipeService.getRecipeList).mockResolvedValue({
      data: [],
      count: 0,
    } as never);

    const { result } = renderHook(() =>
      useRecipeExport("", [], RecipeSort.DateNewest),
    );
    await act(() => result.current.exportAll());

    expect(toast.error).toHaveBeenCalledWith("No recipes to export.");
    expect(generateRecipesPDF).not.toHaveBeenCalled();
  });
});
