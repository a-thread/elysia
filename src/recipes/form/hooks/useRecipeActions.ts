import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@shared/components/Toast";
import { Recipe } from "@shared/models/Recipe";
import RecipeService from "@shared/services/RecipeService";
import FormUtils from "@shared/utils/form-field-helpers";
import { getStepIngredientDto } from "@shared/models/StepIngredientDto";
import { useAuth } from "@shared/contexts/AuthContext";
import TagService from "@shared/services/TagService";

export const useRecipeActions = (
  formData: Recipe,
  originalData: Recipe | null,
  isEditing: boolean,
  id?: string
) => {
  const toast = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
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
        if (Object.keys(simpleObject).length > 0) {
          await RecipeService.upsert(id, simpleObject);
        }

        await handleIngredientChanges(id, updatedFields.ingredients || []);
        await handleStepChanges(id, updatedFields.steps || []);
        await handleTagChanges(
          id,
          updatedFields.tags || [],
          originalData?.tags || []
        );
        await handleCollectionChanges(
          id,
          updatedFields.collections || [],
          originalData?.collections || []
        );

        toast.success("Recipe updated successfully!");
        navigate(`/recipes/${id}`);
      } else {
        const simpleObject = FormUtils.extractSimpleValues(formData);
        const response = await RecipeService.upsert(
          undefined,
          simpleObject,
          user?.id
        );
        const recipeId = response?.recipeId || "";

        // Ingredients
        const ingredientsToUpsert = getStepIngredientDto(
          recipeId,
          formData.ingredients
        );
        if (ingredientsToUpsert.length > 0) {
          await RecipeService.upsertIngredients(ingredientsToUpsert);
        }
        const stepsToUpsert = getStepIngredientDto(recipeId, formData.steps);

        // Steps
        if (stepsToUpsert.length > 0) {
          await RecipeService.upsertSteps(stepsToUpsert);
        }

        // Tags
        if (formData.tags && formData.tags.length > 0) {
          await TagService.addToRecipe(recipeId, formData.tags);
        }

        // Collections
        if (formData.collections && formData.collections.length > 0) {
          await RecipeService.addOneToManyCollections(
            recipeId,
            formData.collections.map((i) => i.id)
          );
        }

        await RecipeService.refreshRecipeSearch();

        toast.success("Recipe added successfully!");
        navigate(`/recipes/${response?.recipeId!}`);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return { handleSave, isLoading };
};

/**
 * Handles changes in Ingredients (adds new ones, removes deleted ones).
 */
const handleIngredientChanges = async (
  recipeId: string,
  ingredients: any[]
) => {
  const ingredientsToUpsert = getStepIngredientDto(recipeId, ingredients);
  const ingredientsToRemove = ingredients
    .filter((i) => !i.isActive)
    .map((i) => i.id);

  if (ingredientsToUpsert.length > 0) {
    await RecipeService.upsertIngredients(ingredientsToUpsert);
  }

  if (ingredientsToRemove.length > 0) {
    await RecipeService.deleteIngredients(ingredientsToRemove);
  }
};

/**
 * Handles changes in Steps (adds new ones, removes deleted ones).
 */
const handleStepChanges = async (recipeId: string, steps: any[]) => {
  const stepsToUpsert = getStepIngredientDto(recipeId, steps);
  const stepsToRemove = steps.filter((i) => !i.isActive).map((i) => i.id);

  if (stepsToUpsert.length > 0) {
    await RecipeService.upsertSteps(stepsToUpsert);
  }

  if (stepsToRemove.length > 0) {
    await RecipeService.deleteSteps(stepsToRemove);
  }
};

/**
 * Handles changes in Tags (adds new ones, removes deleted ones).
 */
const handleTagChanges = async (
  recipeId: string,
  updatedTags: any[],
  originalTags: any[]
) => {
  const tagsToAdd = updatedTags.filter(
    (tag) => !originalTags.some((origTag) => origTag.id === tag.id)
  );
  const tagsToRemove = originalTags.filter(
    (origTag) => !updatedTags.some((tag) => tag.id === origTag.id)
  );
  if (tagsToAdd.length > 0) {
    await TagService.addToRecipe(recipeId, tagsToAdd);
  }

  if (tagsToRemove.length > 0) {
    await TagService.removeFromRecipe(recipeId, tagsToRemove);
  }
};

/**
 * Handles changes in Collections (adds new ones, removes deleted ones).
 */
const handleCollectionChanges = async (
  recipeId: string,
  updatedColl: any[],
  originalColl: any[]
) => {
  const collectionsToUpsert = updatedColl.filter(
    (updatedColl) =>
      !originalColl.some((originColl) => originColl.id === updatedColl.id)
  );
  const collectionsToRemove = originalColl.filter(
    (originalColl) =>
      !updatedColl.some((updatedColl) => updatedColl.id === originalColl.id)
  );

  if (collectionsToUpsert.length > 0) {
    await RecipeService.addOneToManyCollections(recipeId, collectionsToUpsert);
  }

  if (collectionsToRemove.length > 0) {
    await RecipeService.removeManyFromManyCollections(
      [recipeId],
      collectionsToRemove
    );
  }
};
