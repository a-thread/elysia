import { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@shared/components/Toast";
import { Recipe } from "@shared/models/Recipe";
import RecipeService from "@shared/services/RecipeService";
import FormUtils from "@shared/utils/form-field-helpers";
import { getStepIngredientDto } from "@shared/models/StepIngredientDto";
import { useAuth } from "@shared/contexts/AuthContext";

export const useRecipeActions = (
  formData: Recipe,
  originalData: Recipe | null,
  isEditing: boolean,
  id?: string
) => {
  const toast = useToast();
  const { user } = useAuth();

  const navigate = useNavigate();

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();

    try {
      if (isEditing && id) {
        const updatedFields = FormUtils.getChangedFields(
          originalData,
          formData
        ) as Partial<Recipe>;
        if (!updatedFields) {
          toast.success("No changes detected.");
          return;
        }
        const simpleObject = FormUtils.extractSimpleValues(updatedFields);
        await RecipeService.upsert(id, simpleObject);
        toast.success("Recipe updated successfully!");
        navigate(`/recipes/${id}`);

        const ingredientsToUpsert = getStepIngredientDto(
          id,
          updatedFields.ingredients
        );
        if (ingredientsToUpsert.length)
          await RecipeService.upsertIngredients(ingredientsToUpsert);

        const stepsToUpsert = getStepIngredientDto(id, updatedFields.steps);
        if (stepsToUpsert.length)
          await RecipeService.upsertSteps(stepsToUpsert);
      } else {
        const simpleObject = FormUtils.extractSimpleValues(formData);
        const response = await RecipeService.upsert(
          undefined,
          simpleObject,
          user?.id
        );

        const ingredientsToUpsert = getStepIngredientDto(
          response?.recipeId!,
          formData.ingredients
        );
        if (ingredientsToUpsert.length)
          await RecipeService.upsertIngredients(ingredientsToUpsert);

        const stepsToUpsert = getStepIngredientDto(
          response?.recipeId!,
          formData.steps
        );
        if (stepsToUpsert.length)
          await RecipeService.upsertSteps(stepsToUpsert);

        toast.success("Recipe added successfully!");
        navigate(`/recipes/${response?.recipeId!}`);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return { handleSave };
};
