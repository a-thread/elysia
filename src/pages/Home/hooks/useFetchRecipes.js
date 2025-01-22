import { useState } from 'react';
import RecipeService from '../../../shared/services/RecipeService';

export function useFetchRecipes() {
  const [currentSkip, setCurrentSkip] = useState(0);
  const [currentPageSize] = useState(10);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const loadMoreRecipes = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const { data, count, error } = await RecipeService.fetchRecipeList(currentSkip, currentPageSize);

      if (error) {
        throw error;
      }
      if (data.length === 0) {
        setHasMore(false);
      } else {
        setRecipes((prev) => [...prev, ...data]);
        setCurrentSkip((prevSkip) => prevSkip + data.length);
      }
      setTotalCount(count);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching Tag recipes:', error.message);
    } finally {
      setLoading(false);
    }
  };

  return { recipes, loading, totalCount, loadMoreRecipes };
}
