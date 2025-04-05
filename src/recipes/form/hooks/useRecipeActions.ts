import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@shared/components/Toast";
import { Recipe } from "@shared/models/Recipe";
import RecipeService from "@shared/services/RecipeService";
import { useAuth } from "@shared/contexts/AuthContext";
import TagService from "@shared/services/TagService";

export const useRecipeActions = (
  formData: Recipe,
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
        await RecipeService.upsert(id, formData);

        if (formData.tags?.length) {
          await TagService.addToRecipe(id, formData.tags);
        }

        if (formData.collections?.length) {
          await RecipeService.addOneToManyCollections(
            id,
            formData.collections.map((i) => i.id)
          );
        }

        toast.success("Recipe updated successfully!");
        navigate(`/recipes/${id}`);
      } else {
        const response = await RecipeService.upsert(
          undefined,
          formData,
          user?.id
        );

        const recipeId = response?.recipeId || "";

        if (formData.tags?.length) {
          await TagService.addToRecipe(recipeId, formData.tags);
        }

        if (formData.collections?.length) {
          await RecipeService.addOneToManyCollections(
            recipeId,
            formData.collections.map((i) => i.id)
          );
        }

        toast.success("Recipe added successfully!");
        navigate(`/recipes/${recipeId}`);
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return { handleSave, isLoading };
};
