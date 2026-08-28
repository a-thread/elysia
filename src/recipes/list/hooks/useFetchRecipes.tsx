import { useState, useCallback, useRef, useEffect } from "react";
import RecipeService from "@shared/services/RecipeService";
import TagService from "@shared/services/TagService";
import generateRecipesPDF from "@shared/services/PdfGenerator";
import { Recipe } from "@shared/models/Recipe";
import { useAuth } from "@shared/contexts/AuthContext";
import { useToast } from "@shared/components/Toast";
import { IdTitle } from "@shared/models/Tag";
import { RecipeSort } from "@shared/models/RecipeSort";
import { useLocation } from "react-router-dom";

const ALL_RECIPES_PAGE_SIZE = 1000000;

export function useFetchRecipes() {
  const location = useLocation();
  const { user, authHasBeenChecked } = useAuth();
  const toast = useToast();

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [tags, setTags] = useState<IdTitle[]>([]);
  const [selectedTags, setSelectedTags] = useState<IdTitle[]>([]);
  const [tagSearchTerm, setTagSearchTerm] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sort, setSort] = useState<RecipeSort>(RecipeSort.DateNewest);
  const [currentSkip, setCurrentSkip] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Ref to prevent duplicate fetches.
  const isFetching = useRef(false);

  // Consolidated fetch function.
  const fetchRecipes = useCallback(
    async (skip: number, term: string, selected: IdTitle[], sortBy: RecipeSort) => {
      setLoading(true);
      try {
        const response = await RecipeService.getRecipeList(skip, 10, term, user?.id, selected, sortBy);
        if (!response) throw new Error("Something went wrong.");

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

  // The tag filter's own option list is independent of the recipe search term,
  // so it gets its own search text and fetch.
  useEffect(() => {
    TagService.getList(0, ALL_RECIPES_PAGE_SIZE, tagSearchTerm).then((response) => {
      if (response?.data) setTags(response.data);
    });
  }, [tagSearchTerm]);

  // On location change, reset recipes if there are selected tags in location.state.
  useEffect(() => {
    const tagsFromState = location.state?.selectedTags as IdTitle[] | undefined;
    if (tagsFromState) {
      setSelectedTags(tagsFromState);
      setCurrentSkip(0);
      setRecipes([]);
      isFetching.current = true;
      fetchRecipes(0, searchTerm, tagsFromState, sort).finally(() => {
        isFetching.current = false;
      });
    }
  }, [location.state?.selectedTags, fetchRecipes, searchTerm, sort]);

  // Resets and loads recipes (using skip=0).
  const resetAndLoadRecipes = useCallback(async () => {
    if (isFetching.current || !authHasBeenChecked) return;
    setCurrentSkip(0);
    setRecipes([]);
    isFetching.current = true;
    await fetchRecipes(0, searchTerm, selectedTags, sort);
    isFetching.current = false;
  }, [authHasBeenChecked, fetchRecipes, searchTerm, selectedTags, sort]);

  // Loads more recipes based on the current skip value.
  const loadMoreRecipes = useCallback(() => {
    if (isFetching.current || !hasMore || !authHasBeenChecked) return;
    isFetching.current = true;
    fetchRecipes(currentSkip, searchTerm, selectedTags, sort).finally(() => {
      isFetching.current = false;
    });
  }, [currentSkip, hasMore, authHasBeenChecked, fetchRecipes, searchTerm, selectedTags, sort]);

  // Exports every recipe matching the current search/filter/sort (not just the loaded page) to one PDF.
  const exportAll = useCallback(async () => {
    setIsExporting(true);
    try {
      const response = await RecipeService.getRecipeList(
        0,
        ALL_RECIPES_PAGE_SIZE,
        searchTerm,
        user?.id,
        selectedTags,
        sort
      );
      if (!response?.data?.length) {
        toast.error("No recipes to export.");
        return;
      }
      await generateRecipesPDF(response.data);
    } catch (error) {
      console.error("Error exporting recipes:", error);
      toast.error("Failed to export recipes. Please try again.");
    } finally {
      setIsExporting(false);
    }
  }, [searchTerm, selectedTags, sort, user, toast]);

  return {
    tags,
    selectedTags,
    setSelectedTags,
    tagSearchTerm,
    setTagSearchTerm,
    recipes,
    searchTerm,
    setSearchTerm,
    sort,
    setSort,
    loading,
    hasMore,
    resetAndLoadRecipes,
    loadMoreRecipes,
    isExporting,
    exportAll,
  };
}
