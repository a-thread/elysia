import { useEffect, useState } from "react";
import RecipeService from "@shared/services/RecipeService";
import { Recipe } from "@shared/models/Recipe";

export const useRecipeDetails = (
  id: string | undefined,
  userId: string | undefined
) => {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchRecipe = async () => {
      setLoading(true);
      try {
        const data = await RecipeService.getDetail(id, userId);
        const formattedData: Recipe = {
          id: data?.id || "",
          title: data?.title || "",
          description: data?.description || "",
          img_url: data?.img_url || "",
          original_recipe_url: data?.original_recipe_url || "",
          prep_time: data?.prep_time || 0,
          cook_time: data?.cook_time || 0,
          servings: data?.servings || 1,
          is_public: data?.is_public || false,
          total_time: data?.prep_time + data?.cook_time || 0,
          steps: (data?.steps || []).sort(
            (a, b) => a.sort_number - b.sort_number
          ),
          ingredients: (data?.ingredients || []).sort(
            (a, b) => a.sort_number - b.sort_number
          ),
          collections: (data?.collection_to_recipes || []).flatMap(
            (item) => item.collections
          ),
          tags: (data?.recipe_to_tags || []).flatMap((item) => item.tags),
        };
        setRecipe(formattedData);
      } catch (error) {
        console.error("Failed to fetch recipe details", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id, userId]);

  return { recipe, loading };
};
