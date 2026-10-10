import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { RecipeNutrition } from "@recipes/models/Recipe";
import { FieldLabel, fieldClasses } from "@shared/components/FormField";
import {
  NutritionDraft,
  fromDraft,
  isIncomplete,
  toDraft,
} from "@recipes/utils/nutritionDraft";

interface NutritionFormProps {
  nutrition: RecipeNutrition | null | undefined;
  /** A complete nutrition, `null` to remove it, or `undefined` while the form is half-filled. */
  onChange: (nutrition: RecipeNutrition | null | undefined) => void;
}

const NUMBER_FIELDS: { key: "calories" | "protein" | "carbs" | "fat"; label: string }[] = [
  { key: "calories", label: "Calories (kcal)" },
  { key: "protein", label: "Protein (g)" },
  { key: "carbs", label: "Carbs (g)" },
  { key: "fat", label: "Fat (g)" },
];

const TIERS: { value: RecipeNutrition["tier"]; label: string }[] = [
  { value: 1, label: "1 · Whole or minimally processed foods" },
  { value: 2, label: "2 · Mostly culinary ingredients (oils, butter, flour)" },
  { value: 3, label: "3 · Includes processed foods (cheese, bread, canned)" },
  { value: 4, label: "4 · Mostly ultra-processed" },
];

const NutritionForm: React.FC<NutritionFormProps> = ({ nutrition, onChange }) => {
  const [draft, setDraft] = useState<NutritionDraft>(() => toDraft(nutrition));
  // What this form last reported, so a change coming back in as a prop is not mistaken for a
  // new recipe loading (which should replace what is typed).
  const reported = useRef(nutrition);

  useEffect(() => {
    if (nutrition !== reported.current) {
      reported.current = nutrition;
      setDraft(toDraft(nutrition));
    }
  }, [nutrition]);

  const update = (next: NutritionDraft) => {
    setDraft(next);
    const result = fromDraft(next);
    reported.current = result;
    onChange(result);
  };

  return (
    <div className="mb-4">
      <h2 className="text-sm font-semibold text-leaf-green-700 dark:text-leaf-green-300 mb-1">
        Nutrition (per serving)
      </h2>
      <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
        Optional. Used by Tern. Fill in all four values, or clear them all to remove
        nutrition.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
        {NUMBER_FIELDS.map(({ key, label }) => (
          <div key={key}>
            <FieldLabel htmlFor={`nutrition-${key}`}>{label}</FieldLabel>
            <input
              type="number"
              inputMode="decimal"
              min={0}
              step="any"
              id={`nutrition-${key}`}
              name={`nutrition-${key}`}
              className={fieldClasses}
              value={draft[key]}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                update({ ...draft, [key]: e.target.value })
              }
            />
          </div>
        ))}
      </div>
      <div>
        <FieldLabel htmlFor="nutrition-tier">Food type (NOVA)</FieldLabel>
        <select
          id="nutrition-tier"
          name="nutrition-tier"
          className={fieldClasses}
          value={draft.tier}
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            update({ ...draft, tier: Number(e.target.value) as RecipeNutrition["tier"] })
          }
        >
          {TIERS.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
      {isIncomplete(draft) && (
        <p role="status" className="mt-2 text-xs text-amber-700 dark:text-amber-400">
          Nutrition won&apos;t be saved until all four values are filled in with numbers
          (and calories is above 0). The saved nutrition stays as it was.
        </p>
      )}
    </div>
  );
};

export default NutritionForm;
