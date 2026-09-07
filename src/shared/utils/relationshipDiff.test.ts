import { describe, it, expect, vi } from "vitest";
import { diffByIds, syncRelationship } from "./relationshipDiff";

describe("diffByIds", () => {
  it("returns nothing to add or remove for two empty lists (default/edge case)", () => {
    expect(diffByIds([], [])).toEqual({ toAdd: [], toRemove: [] });
  });

  it("finds items present in updated but not original as toAdd", () => {
    const result = diffByIds([{ id: "1" }], [{ id: "1" }, { id: "2" }]);
    expect(result.toAdd).toEqual([{ id: "2" }]);
    expect(result.toRemove).toEqual([]);
  });

  it("finds items present in original but not updated as toRemove", () => {
    const result = diffByIds([{ id: "1" }, { id: "2" }], [{ id: "1" }]);
    expect(result.toRemove).toEqual([{ id: "2" }]);
    expect(result.toAdd).toEqual([]);
  });
});

describe("syncRelationship", () => {
  it("calls add and remove only with the changed items", async () => {
    const add = vi.fn().mockResolvedValue(undefined);
    const remove = vi.fn().mockResolvedValue(undefined);

    await syncRelationship(
      [{ id: "1" }, { id: "2" }],
      [{ id: "1" }, { id: "3" }],
      add,
      remove
    );

    expect(add).toHaveBeenCalledWith([{ id: "3" }]);
    expect(remove).toHaveBeenCalledWith([{ id: "2" }]);
  });

  it("propagates an error from the add call", async () => {
    const add = vi.fn().mockRejectedValue(new Error("insert failed"));
    const remove = vi.fn();

    await expect(
      syncRelationship([], [{ id: "1" }], add, remove)
    ).rejects.toThrow("insert failed");
  });

  it("calls neither add nor remove when nothing changed (no-op)", async () => {
    const add = vi.fn();
    const remove = vi.fn();

    await syncRelationship([{ id: "1" }], [{ id: "1" }], add, remove);

    expect(add).not.toHaveBeenCalled();
    expect(remove).not.toHaveBeenCalled();
  });
});
