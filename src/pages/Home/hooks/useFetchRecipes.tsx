import { useState } from 'react';
import RecipeService from '@shared/services/RecipeService';
import { Recipe } from '@shared/models/Recipe';

export function useFetchRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentSkip, setCurrentSkip] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const resetAndLoadRecipes = async () => {
    setCurrentSkip(0);
    setRecipes([]);
    await fetchRecipes(0, searchTerm);
  };

  const loadMoreRecipes = async () => {
    if (!loading && hasMore) {
      await fetchRecipes(currentSkip, searchTerm);
    }
  };

  const fetchRecipes = async (skip: number, term: string) => {
    setLoading(true);
    try {
      const response = await RecipeService.fetchRecipeList(skip, 10, term);
      if (!response) throw new Error('Something went wrong.');

      setRecipes((prev) => (skip === 0 ? response.data : [...prev, ...response.data]));
      setCurrentSkip(skip + response.data.length);
      setHasMore(response.data.length > 0);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  return { recipes, searchTerm, setSearchTerm, loading, hasMore, resetAndLoadRecipes, loadMoreRecipes };
}
