import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@shared/components/Toast";
import { Recipe } from "@recipes/models/Recipe";
import RecipeService from "@recipes/services/RecipeService";
import { useAuth } from "@shared/contexts/AuthContext";
import TagService from "@shared/services/TagService";
import { syncRelationship } from "@shared/utils/relationshipDiff";

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
      let recipeId = id;

      if (isEditing && recipeId) {
        await RecipeService.upsert(recipeId, formData);
      } else {
        const response = await RecipeService.upsert(undefined, formData, user?.id);
        recipeId = response?.recipeId || "";
      }

      // Relationship updates (Tags & Collections) — a new recipe has no
      // originalData, so this simply adds everything selected.
      await syncRelationship(
        originalData?.tags || [],
        formData.tags || [],
        (tags) => TagService.addToRecipe(recipeId!, tags),
        (tags) => TagService.removeFromRecipe(recipeId!, tags)
      );

      await syncRelationship(
        originalData?.collections || [],
        formData.collections || [],
        (collections) =>
          RecipeService.addOneToManyCollections(
            recipeId!,
            collections.map((c) => c.id)
          ),
        (collections) =>
          RecipeService.removeManyFromManyCollections(
            collections.map((c) => c.id!),
            [recipeId!]
          )
      );

      toast.success(`Recipe ${isEditing ? "updated" : "added"} successfully!`);
      navigate(`/recipes/${recipeId}`);
    } catch (error: any) {
      toast.error(error.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return { handleSave, isLoading };
};
