import { useState, useCallback, useRef, useEffect } from "react";
import RecipeService from "@shared/services/RecipeService";
import TagService from "@shared/services/TagService";
import { Recipe } from "@shared/models/Recipe";
import { useAuth } from "@shared/contexts/AuthContext";
import { IdTitle } from "@shared/models/Tag";
import { useLocation } from "react-router-dom";

export function useFetchRecipes() {
  const location = useLocation();
  const { user, authHasBeenChecked } = useAuth();

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [tags, setTags] = useState<IdTitle[]>([]);
  const [selectedTags, setSelectedTags] = useState<IdTitle[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentSkip, setCurrentSkip] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);

  // Ref to prevent duplicate fetches.
  const isFetching = useRef(false);

  // Consolidated fetch function.
  const fetchRecipes = useCallback(
    async (skip: number, term: string, selected: IdTitle[]) => {
      setLoading(true);
      try {
        const response = await RecipeService.getRecipeList(skip, 10, term, user?.id, selected);
        if (!response) throw new Error("Something went wrong.");

        // Fetch and update tags.
        const tagResponse = await TagService.getList(0, 1000000, term);
        if (tagResponse?.data) {
          setTags(tagResponse.data);
        }

        // Update recipes: replace list if skip is 0; otherwise, append.
        setRecipes((prev) => (skip === 0 ? response.data : [...prev, ...response.data]));

        // Calculate new skip count and determine if more recipes are available.
        const newSkip = skip + response.data.length;
        setCurrentSkip(newSkip);
        setHasMore(response.count !== null && newSkip < response.count);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  // On location change, reset recipes if there are selected tags in location.state.
  useEffect(() => {
    const tagsFromState = location.state?.selectedTags as IdTitle[] | undefined;
    if (tagsFromState) {
      setSelectedTags(tagsFromState);
      setCurrentSkip(0);
      setRecipes([]);
      isFetching.current = true;
      fetchRecipes(0, searchTerm, tagsFromState).finally(() => {
        isFetching.current = false;
      });
    }
  }, [location.state?.selectedTags, fetchRecipes, searchTerm]);

  // Resets and loads recipes (using skip=0).
  const resetAndLoadRecipes = useCallback(async () => {
    if (isFetching.current || !authHasBeenChecked) return;
    setCurrentSkip(0);
    setRecipes([]);
    isFetching.current = true;
    await fetchRecipes(0, searchTerm, selectedTags);
    isFetching.current = false;
  }, [authHasBeenChecked, fetchRecipes, searchTerm, selectedTags]);

  // Loads more recipes based on the current skip value.
  const loadMoreRecipes = useCallback(() => {
    if (isFetching.current || !hasMore || !authHasBeenChecked) return;
    isFetching.current = true;
    fetchRecipes(currentSkip, searchTerm, selectedTags).finally(() => {
      isFetching.current = false;
    });
  }, [currentSkip, hasMore, authHasBeenChecked, fetchRecipes, searchTerm, selectedTags]);

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
