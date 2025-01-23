import { useState } from 'react';
import RecipeService from '@shared/services/RecipeService';
import { Recipe } from '@shared/models/Recipe';

export function useFetchRecipes() {
  const [currentSkip, setCurrentSkip] = useState<number>(0);
  const [currentPageSize] = useState<number>(10);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const loadMoreRecipes = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const response = await RecipeService.fetchRecipeList(currentSkip, currentPageSize);

      if (!response) {
        throw new Error('Something went wrong. Please try again.');
      }
      if (response.data.length === 0) {
        setHasMore(false);
      } else {
        setRecipes((prev) => [...prev, ...response.data]);
        setCurrentSkip((prevSkip) => prevSkip + response.data.length);
      }
      setTotalCount(response.count || 0);
      setLoading(false);
    } catch (error: any) {
      console.error('Error fetching Tag recipes:', error.message);
    } finally {
      setLoading(false);
    }
  };

  return { recipes, loading, hasMore, totalCount, loadMoreRecipes };
}
