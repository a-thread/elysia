import { useEffect, useState } from "react";
import RecipeService from "@shared/services/RecipeService";
import { Recipe } from "@shared/models/Recipe";
import { formatDetail } from "../utils/formatDetail";

export const useRecipeDetails = (
  id: string | undefined,
  userId: string | undefined
) => {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchRecipe = async () => {
    setLoading(true);
    try {
      const data = await RecipeService.getDetail(id, userId);
      setRecipe(formatDetail(data));
    } catch (error) {
      console.error("Failed to fetch recipe details", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    fetchRecipe();
  }, [id, userId]);

  return { recipe, loading, fetchRecipe };
};
