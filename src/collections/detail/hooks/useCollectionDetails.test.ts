import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";

vi.mock("@collections/services/CollectionService", () => ({
  default: { getDetail: vi.fn() },
}));

const { default: CollectionService } = await import(
  "@collections/services/CollectionService"
);
const { useCollectionDetails } = await import("./useCollectionDetails");

// Spec convention: default/loading, success, error, empty/edge case.
describe("useCollectionDetails", () => {
  beforeEach(() => {
    vi.mocked(CollectionService.getDetail).mockReset();
  });

  it("starts in a loading state with no collection", () => {
    vi.mocked(CollectionService.getDetail).mockReturnValue(
      new Promise(() => {
        // Never resolves — asserting the hook's initial loading state.
      })
    );

    const { result } = renderHook(() => useCollectionDetails("c1", "u1"));

    expect(result.current.loading).toBe(true);
    expect(result.current.collection).toBeNull();
  });

  it("loads the collection on success", async () => {
    vi.mocked(CollectionService.getDetail).mockResolvedValue({
      id: "c1",
      title: "Weeknight dinners",
      description: "",
      img_url: "",
      is_public: true,
      user_id: "u1",
      collection_to_recipes: [],
      collection_to_tags: [],
      collection_to_users: [],
      recipes: [],
      tags: [],
      can_edit: true,
    });

    const { result } = renderHook(() => useCollectionDetails("c1", "u1"));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.collection?.title).toBe("Weeknight dinners");
  });

  it("stops loading without setting a collection when the fetch errors", async () => {
    vi.mocked(CollectionService.getDetail).mockRejectedValue(
      new Error("not found")
    );

    const { result } = renderHook(() => useCollectionDetails("missing", "u1"));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.collection).toBeNull();
  });

  it("does not fetch when id is undefined (edge case)", () => {
    renderHook(() => useCollectionDetails(undefined, "u1"));

    expect(CollectionService.getDetail).not.toHaveBeenCalled();
  });
});
