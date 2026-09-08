import { describe, it, expect } from "vitest";
import { formatDetail } from "./formatDetail";

describe("formatDetail", () => {
  it("returns a fully-populated recipe on success", () => {
    const result = formatDetail({
      id: "r1",
      title: "Soup",
      description: "Warm and cozy",
      img_url: "img.jpg",
      original_recipe_url: "https://example.com",
      prep_time: 5,
      cook_time: 10,
      servings: 4,
      is_public: true,
      public_permission: "edit",
      can_edit: true,
      is_owner: true,
      steps: [{ name: "Boil" }],
      ingredients: [{ name: "Water" }],
      collection_to_recipes: [{ collections: { id: "c1", title: "Soups" } }],
      recipe_to_tags: [{ tags: { id: "t1", title: "Quick" } }],
    });

    expect(result.can_edit).toBe(true);
    expect(result.is_owner).toBe(true);
    expect(result.public_permission).toBe("edit");
    expect(result.total_time).toBe(15);
  });

  it("defaults permission fields when absent from the row (edge case)", () => {
    const result = formatDetail({ id: "r1", title: "Soup" });

    expect(result.can_edit).toBe(false);
    expect(result.is_owner).toBe(false);
    expect(result.public_permission).toBe("read");
  });

  it("defaults everything sensibly for an empty/undefined row", () => {
    const result = formatDetail(undefined);

    expect(result.title).toBe("");
    expect(result.can_edit).toBe(false);
    expect(result.is_owner).toBe(false);
    expect(result.public_permission).toBe("read");
  });
});
