import { describe, it, expect } from "vitest";
import { fromDraft, isIncomplete, toDraft } from "./nutritionDraft";

const filled = { calories: "300", protein: "20", carbs: "30.5", fat: "10", tier: 2 as const };
const blank = { calories: "", protein: "", carbs: "", fat: "", tier: 3 as const };

describe("toDraft", () => {
  it("shows saved nutrition as text, or blanks with the default tier when there is none", () => {
    expect(
      toDraft({ calories: 250, protein: 12.5, carbs: 30, fat: 8, tier: 1, source: "llm" }),
    ).toEqual({ calories: "250", protein: "12.5", carbs: "30", fat: "8", tier: 1 });
    expect(toDraft(null)).toEqual(blank);
    expect(toDraft(undefined)).toEqual(blank);
  });
});

describe("fromDraft", () => {
  it("returns manual nutrition when all four values are filled in", () => {
    expect(fromDraft(filled)).toEqual({
      calories: 300,
      protein: 20,
      carbs: 30.5,
      fat: 10,
      tier: 2,
      source: "manual",
    });
  });

  it("returns null (remove it) when all four are blank, whatever the tier", () => {
    expect(fromDraft({ ...blank, tier: 1 })).toBeNull();
    expect(fromDraft({ ...blank, calories: "   " })).toBeNull();
  });

  it("returns undefined (leave it alone) when partly filled or invalid", () => {
    expect(fromDraft({ ...filled, fat: "" })).toBeUndefined();
    expect(fromDraft({ ...filled, protein: "abc" })).toBeUndefined();
    expect(fromDraft({ ...filled, carbs: "-5" })).toBeUndefined();
    expect(fromDraft({ ...filled, calories: "0" })).toBeUndefined();
  });

  it("accepts zero for the macros", () => {
    expect(fromDraft({ ...filled, protein: "0", fat: "0" })).toMatchObject({ protein: 0, fat: 0 });
  });
});

describe("isIncomplete", () => {
  it("is true only for a half-filled or invalid form", () => {
    expect(isIncomplete(filled)).toBe(false);
    expect(isIncomplete(blank)).toBe(false);
    expect(isIncomplete({ ...filled, fat: "" })).toBe(true);
  });
});
