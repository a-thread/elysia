import { useState, useCallback, useRef, useEffect } from "react";
import RecipeService from "@shared/services/RecipeService";
import TagService from "@shared/services/TagService";
import { Recipe } from "@shared/models/Recipe";
import { useAuth } from "@shared/contexts/AuthContext";
import { IdTitle } from "@shared/models/Tag";
import { useLocation } from "react-router-dom";

export function useFetchRecipes() {
  const location = useLocation();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [tags, setTags] = useState<IdTitle[]>([]);
  const [selectedTags, setSelectedTags] = useState<IdTitle[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentSkip, setCurrentSkip] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const { user, authHasBeenChecked } = useAuth();
  const isFetching = useRef<boolean>(false); // Prevents multiple fetch calls

  useEffect(() => {
    const tagsToSet = location.state?.selectedTags as IdTitle[];
    console.log(tagsToSet)
    if (tagsToSet) {
      setSelectedTags(tagsToSet);
      setCurrentSkip(0);
      setRecipes([]);
      isFetching.current = true;
      fetchRecipes(currentSkip, searchTerm, tagsToSet).finally(() => {
        isFetching.current = false; // Reset after API call completes
      });
    }
  }, [location.state?.selectedTags]);

  const resetAndLoadRecipes = async () => {
    if (isFetching.current || !authHasBeenChecked) return;
    setCurrentSkip(0);
    setRecipes([]);
    isFetching.current = true;
    fetchRecipes(currentSkip, searchTerm, selectedTags).finally(() => {
      isFetching.current = false; // Reset after API call completes
    });
  };

  const loadMoreRecipes = useCallback(() => {
    if (isFetching.current || !hasMore || !authHasBeenChecked) return; // Prevent multiple calls
    isFetching.current = true;

    fetchRecipes(currentSkip, searchTerm, selectedTags).finally(() => {
      isFetching.current = false; // Reset after API call completes
    });
  }, [hasMore, currentSkip, searchTerm, selectedTags]);

  const fetchRecipes = async (skip: number, term: string, selectedTags: IdTitle[]) => {
    setLoading(true);
    try {
      const response = await RecipeService.getList(skip, 10, term, user?.id, selectedTags);
      if (!response) throw new Error("Something went wrong.");
      const tagResponse = await TagService.getList(0, 1000000, term);

      if (tagResponse?.data) {
        setTags(tagResponse.data);
      }

      setRecipes((prev) =>
        skip === 0 ? response.data : [...prev, ...response.data]
      );
      setCurrentSkip(skip + response.data.length);
      if (response?.count) {
        const hasMore = response.count - recipes.length > 0;
        setHasMore(hasMore);
      }
    } catch (error) {
      console.error("Error fetching recipes:", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    tags,
    selectedTags,
    setSelectedTags,
    recipes,
    searchTerm,
    setSearchTerm,
    loading,
    hasMore,
    resetAndLoadRecipes,
    loadMoreRecipes,
  };
}
