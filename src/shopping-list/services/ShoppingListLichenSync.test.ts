import { describe, it, expect, vi, beforeEach } from "vitest";
import { ShoppingListItem } from "../models/ShoppingListItem";

vi.mock("./ShoppingListService", () => ({ default: { getList: vi.fn() } }));
vi.mock("./LichenService", () => ({ default: { saveShoppingListNote: vi.fn() } }));

const { default: ShoppingListService } = await import("./ShoppingListService");
const { default: LichenService } = await import("./LichenService");
const { syncShoppingListToLichen } = await import("./ShoppingListLichenSync");

const item = (value: string, checked = false): ShoppingListItem => ({
  id: value,
  user_id: "u1",
  value,
  checked,
  created_at: "2026-01-01T00:00:00Z",
});

describe("syncShoppingListToLichen", () => {
  beforeEach(() => {
    vi.mocked(ShoppingListService.getList).mockReset();
    vi.mocked(LichenService.saveShoppingListNote).mockReset();
    vi.mocked(LichenService.saveShoppingListNote).mockResolvedValue("n1");
  });

  it("writes the current list as checklist lines, unchecked items first", async () => {
    vi.mocked(ShoppingListService.getList).mockResolvedValue([
      item("Eggs", true),
      item("Milk"),
      item("Flour"),
    ]);

    await syncShoppingListToLichen("u1");

    expect(ShoppingListService.getList).toHaveBeenCalledWith("u1");
    expect(LichenService.saveShoppingListNote).toHaveBeenCalledWith(
      "u1",
      "- [ ] Milk\n- [ ] Flour\n- [x] Eggs",
    );
  });

  it("writes an empty note when the list is empty", async () => {
    vi.mocked(ShoppingListService.getList).mockResolvedValue([]);

    await syncShoppingListToLichen("u1");

    expect(LichenService.saveShoppingListNote).toHaveBeenCalledWith("u1", "");
  });

  it("does not touch the note when the list read was aborted", async () => {
    vi.mocked(ShoppingListService.getList).mockResolvedValue(null);

    await syncShoppingListToLichen("u1");

    expect(LichenService.saveShoppingListNote).not.toHaveBeenCalled();
  });

  it("coalesces calls made while a sync runs into one follow-up with the latest list", async () => {
    let releaseFirstWrite: () => void = () => undefined;
    vi.mocked(ShoppingListService.getList)
      .mockResolvedValueOnce([item("Milk")])
      .mockResolvedValueOnce([item("Milk"), item("Eggs")]);
    vi.mocked(LichenService.saveShoppingListNote).mockImplementationOnce(
      () => new Promise((resolve) => (releaseFirstWrite = () => resolve("n1"))),
    );

    const first = syncShoppingListToLichen("u1");
    await vi.waitFor(() => expect(LichenService.saveShoppingListNote).toHaveBeenCalledTimes(1));
    const second = syncShoppingListToLichen("u1");
    const third = syncShoppingListToLichen("u1");
    releaseFirstWrite();
    await Promise.all([first, second, third]);

    expect(LichenService.saveShoppingListNote).toHaveBeenCalledTimes(2);
    expect(LichenService.saveShoppingListNote).toHaveBeenLastCalledWith(
      "u1",
      "- [ ] Milk\n- [ ] Eggs",
    );
  });

  it("rejects when the note cannot be saved, and allows a later sync to run", async () => {
    vi.mocked(ShoppingListService.getList).mockResolvedValue([item("Milk")]);
    vi.mocked(LichenService.saveShoppingListNote).mockRejectedValueOnce(new Error("boom"));

    await expect(syncShoppingListToLichen("u1")).rejects.toThrow("boom");
    await expect(syncShoppingListToLichen("u1")).resolves.toBeUndefined();
  });
});
