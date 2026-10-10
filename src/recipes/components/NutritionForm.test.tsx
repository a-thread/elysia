import { describe, it, expect, vi, afterEach } from "vitest";
import { useState } from "react";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import NutritionForm from "./NutritionForm";
import { RecipeNutrition } from "@recipes/models/Recipe";

const saved: RecipeNutrition = { calories: 250, protein: 12, carbs: 30, fat: 8, tier: 3, source: "llm" };

/** Holds the value like the recipe form does, and records what the form reports. */
const setup = (initial: RecipeNutrition | null | undefined) => {
  const onChange = vi.fn();
  const Host = () => {
    const [nutrition, setNutrition] = useState(initial);
    return (
      <NutritionForm
        nutrition={nutrition}
        onChange={(n) => {
          onChange(n);
          setNutrition(n);
        }}
      />
    );
  };
  render(<Host />);
  return onChange;
};

const field = (label: RegExp) => screen.getByLabelText(label) as HTMLInputElement;

afterEach(cleanup); // vitest globals are off, so testing-library does not clean up on its own

describe("NutritionForm", () => {
  it("starts blank, without a warning, when the recipe has no nutrition", () => {
    setup(undefined);

    expect(field(/calories/i).value).toBe("");
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("shows saved nutrition in the fields", () => {
    setup(saved);

    expect(field(/calories/i).value).toBe("250");
    expect(field(/protein/i).value).toBe("12");
    expect(field(/carbs/i).value).toBe("30");
    expect(field(/fat/i).value).toBe("8");
    expect((screen.getByLabelText(/food type/i) as HTMLSelectElement).value).toBe("3");
  });

  it("reports manual nutrition once all four values are entered, warning until then", async () => {
    const user = userEvent.setup();
    const onChange = setup(undefined);

    await user.type(field(/calories/i), "400");
    expect(onChange).toHaveBeenLastCalledWith(undefined);
    expect(screen.getByRole("status")).toBeInTheDocument();

    await user.type(field(/protein/i), "20");
    await user.type(field(/carbs/i), "40");
    await user.type(field(/fat/i), "15");

    expect(onChange).toHaveBeenLastCalledWith({
      calories: 400,
      protein: 20,
      carbs: 40,
      fat: 15,
      tier: 3,
      source: "manual",
    });
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("keeps what was typed while the form is half-filled", async () => {
    const user = userEvent.setup();
    setup(saved);

    await user.clear(field(/fat/i));

    expect(field(/calories/i).value).toBe("250");
    expect(field(/fat/i).value).toBe("");
  });

  it("reports null once every value is cleared, to remove the nutrition", async () => {
    const user = userEvent.setup();
    const onChange = setup(saved);

    for (const label of [/calories/i, /protein/i, /carbs/i, /fat/i]) {
      await user.clear(field(label));
    }

    expect(onChange).toHaveBeenLastCalledWith(null);
  });

  it("changes the food type", async () => {
    const user = userEvent.setup();
    const onChange = setup(saved);

    await user.selectOptions(screen.getByLabelText(/food type/i), "1");

    expect(onChange).toHaveBeenLastCalledWith(expect.objectContaining({ tier: 1, source: "manual" }));
  });
});
