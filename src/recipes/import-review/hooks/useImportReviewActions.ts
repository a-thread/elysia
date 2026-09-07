import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@shared/components/Toast";
import { Recipe } from "@shared/models/Recipe";
import RecipeService from "@shared/services/RecipeService";
import TagService from "@shared/services/TagService";
import { useAuth } from "@shared/contexts/AuthContext";
import { syncRelationship } from "@shared/utils/relationshipDiff";

export const useImportReviewActions = (
  formData: Recipe,
  isLast: boolean,
  advance: () => void
) => {
  const toast = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const finishOrAdvance = () => {
    if (isLast) {
      navigate("/recipes");
    } else {
      advance();
    }
  };

  const handleSaveAndNext = async () => {
    setIsLoading(true);
    try {
      const response = await RecipeService.upsert(undefined, formData, user?.id);
      const recipeId = response?.recipeId || "";

      // A newly imported recipe has no existing relationships, so this
      // simply adds everything selected.
      await syncRelationship(
        [],
        formData.tags || [],
        (tags) => TagService.addToRecipe(recipeId, tags),
        (tags) => TagService.removeFromRecipe(recipeId, tags)
      );

      await syncRelationship(
        [],
        formData.collections || [],
        (collections) =>
          RecipeService.addOneToManyCollections(
            recipeId,
            collections.map((c) => c.id)
          ),
        (collections) =>
          RecipeService.removeManyFromManyCollections(
            collections.map((c) => c.id!),
            [recipeId]
          )
      );

      toast.success("Recipe saved!");
      finishOrAdvance();
    } catch (error: any) {
      toast.error(error.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    finishOrAdvance();
  };

  return { handleSaveAndNext, handleSkip, isLoading };
};
