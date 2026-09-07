import { describe, it, expect, vi } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { useEntitySearch } from "./useEntitySearch";

// Spec convention: default/loading, success, error, empty/edge case.
describe("useEntitySearch", () => {
  it("starts with an empty search term and list", () => {
    const { result } = renderHook(() =>
      useEntitySearch<{ id: string }>(
        () =>
          new Promise(() => {
            // Never resolves — asserting the hook's initial state.
          })
      )
    );

    expect(result.current.searchTerm).toBe("");
    expect(result.current.list).toEqual([]);
  });

  it("fetches and stores the results on success, refetching when the term changes", async () => {
    const fetchFn = vi.fn().mockResolvedValue({ data: [{ id: "1" }] });
    const { result } = renderHook(() => useEntitySearch(fetchFn));

    await waitFor(() => expect(result.current.list).toEqual([{ id: "1" }]));

    fetchFn.mockResolvedValue({ data: [{ id: "2" }] });
    act(() => result.current.setSearchTerm("kale"));

    await waitFor(() => expect(result.current.list).toEqual([{ id: "2" }]));
    expect(fetchFn).toHaveBeenLastCalledWith("kale");
  });

  it("leaves the list untouched when the fetch errors", async () => {
    const fetchFn = vi.fn().mockRejectedValue(new Error("network down"));
    const { result } = renderHook(() => useEntitySearch(fetchFn));

    await waitFor(() => expect(fetchFn).toHaveBeenCalled());
    expect(result.current.list).toEqual([]);
  });

  it("leaves the list untouched when the response has no data (edge case)", async () => {
    const fetchFn = vi.fn().mockResolvedValue({ data: null });
    const { result } = renderHook(() => useEntitySearch(fetchFn));

    await waitFor(() => expect(fetchFn).toHaveBeenCalled());
    expect(result.current.list).toEqual([]);
  });
});
