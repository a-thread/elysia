import { StepIngredient } from "./StepIngredient";

export interface StepIngredientDto {
  id: string;
  value: string;
  sort_number: number;
  recipe_id: string;
}

export const getStepIngredientDto = (
  recipeId: string,
  stepIngredients: StepIngredient[] | undefined
) =>
  stepIngredients
    ?.filter((i) => i.isActive)
    .map((stepIngredient, index) => ({
      id: stepIngredient.id,
      recipe_id: recipeId,
      sort_number: index + 1,
      value: stepIngredient.value,
    })) || [];
