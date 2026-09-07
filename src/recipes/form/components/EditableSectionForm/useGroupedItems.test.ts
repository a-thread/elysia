import { describe, it, expect, vi } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useGroupedItems } from "./useGroupedItems";
import { StepIngredient } from "@recipes/models/StepIngredient";

const item = (id: string, value: string, group?: string): StepIngredient => ({
  id,
  value,
  group,
});

describe("useGroupedItems", () => {
  it("chunks consecutive items by their shared group, splitting on group boundaries", () => {
    const items = [
      item("1", "Flour", "Cake"),
      item("2", "Sugar", "Cake"),
      item("3", "Frosting", "Topping"),
      item("4", "Sprinkles"),
    ];
    const { result } = renderHook(() =>
      useGroupedItems(items, vi.fn(), true)
    );

    expect(result.current.chunks?.map((c) => ({ group: c.group, ids: c.items.map((i) => i.id) }))).toEqual([
      { group: "Cake", ids: ["1", "2"] },
      { group: "Topping", ids: ["3"] },
      { group: undefined, ids: ["4"] },
    ]);
  });

  it("renames a group across all of its items and emits the change after the debounce", async () => {
    const setOriginalFormState = vi.fn();
    const items = [item("1", "Flour", "Cake"), item("2", "Sugar", "Cake")];
    const { result } = renderHook(() =>
      useGroupedItems(items, setOriginalFormState, true)
    );

    act(() => result.current.onRenameGroup(["1", "2"], "Sponge"));

    expect(result.current.formState.every((i) => i.group === "Sponge")).toBe(true);
    await waitFor(() =>
      expect(setOriginalFormState).toHaveBeenCalledWith(
        expect.arrayContaining([expect.objectContaining({ group: "Sponge" })])
      )
    );
  });

  it("deletes every item in a group", () => {
    const items = [
      item("1", "Flour", "Cake"),
      item("2", "Sugar", "Cake"),
      item("3", "Sprinkles"),
    ];
    const { result } = renderHook(() => useGroupedItems(items, vi.fn(), true));

    act(() => result.current.onDeleteGroup(["1", "2"]));

    expect(result.current.formState.map((i) => i.id)).toEqual(["3"]);
  });

  it("has the moved item inherit the group of the item it lands after on drag (edge case: drop at top ungroups)", () => {
    const items = [
      item("1", "Flour", "Cake"),
      item("2", "Sugar", "Cake"),
      item("3", "Sprinkles"),
    ];
    const { result } = renderHook(() => useGroupedItems(items, vi.fn(), true));

    act(() =>
      result.current.handleDragEnd({
        active: { id: "3" },
        over: { id: "2" },
      } as never)
    );

    const moved = result.current.formState.find((i) => i.id === "3");
    expect(moved?.group).toBe("Cake");
  });
});
