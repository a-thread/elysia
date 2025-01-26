import { StepIngredient } from "@shared/models/StepIngredient";

type Primitive = string | number | boolean | null | undefined;
type DeepObject = Record<string, unknown> | Primitive | unknown[];

const deepCompare = (
  original: DeepObject | unknown,
  updated: DeepObject | object
): object | DeepObject | null => {
  if (original === updated) return null; // No change for primitive values

  if (
    typeof original !== "object" ||
    typeof updated !== "object" ||
    original === null ||
    updated === null
  ) {
    return updated; // Return updated value for primitive changes
  }

  if (Array.isArray(original) && Array.isArray(updated)) {
    const changedArray = updated.reduce((acc, newItem, index) => {
      const oldItem = original[index];

      if (typeof newItem === "object" && newItem !== null) {
        const itemChanges = deepCompare(oldItem, newItem);
        if (itemChanges !== null) {
          acc.push(newItem); // Push changed object
        }
      } else if (newItem !== oldItem) {
        acc.push(newItem); // Push changed primitive value
      }

      return acc;
    }, []);

    // Detect removed elements (if original array was longer)
    if (original.length > updated.length) {
      return updated; // Return entire updated array if elements were removed
    }

    return changedArray.length > 0 ? changedArray : null;
  }

  const changed: Record<string, unknown> = {};
  const allKeys = new Set([...Object.keys(original), ...Object.keys(updated)]);

  allKeys.forEach((key) => {
    const diff = deepCompare(
      (original as Record<string, unknown>)[key],
      (updated as Record<string, any>)[key]
    );
    if (diff !== null) {
      changed[key] = diff;
    }
  });

  return Object.keys(changed).length > 0 ? changed : null;
};

const getChangedFields = (
  original: any,
  updated: any
): Record<string, unknown> =>
  (deepCompare(original, updated) as Record<string, unknown>) || {};

const extractSimpleValues = <T extends Record<string, any>>(
  formData: T
): Partial<T> => {
  return Object.keys(formData).reduce((acc, key) => {
    const value = formData[key as keyof T];
    if (
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean"
    ) {
      acc[key as keyof T] = value;
    }
    return acc;
  }, {} as Partial<T>);
};

const getStepIngredientsToDelete = (
  stepIngredients: StepIngredient[] | undefined
) =>
  stepIngredients
    ?.filter((i) => i.isActive)
    .map((stepIngredient) => stepIngredient.id) || [];

const FormUtils = {
  getChangedFields,
  extractSimpleValues,
  getStepIngredientsToDelete
};
export default FormUtils;
