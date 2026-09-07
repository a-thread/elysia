import { useCallback, useState } from "react";
import RecipeService from "@shared/services/RecipeService";
import generateRecipesPDF from "@shared/services/PdfGenerator";
import { useAuth } from "@shared/contexts/AuthContext";
import { useToast } from "@shared/components/Toast";
import { IdTitle } from "@shared/models/Tag";
import { RecipeSort } from "@shared/models/RecipeSort";

const ALL_RECIPES_PAGE_SIZE = 1000000;

/**
 * Exports every recipe matching the given search/filter/sort (not just the
 * currently loaded page) to one PDF. Split out from useFetchRecipes, which
 * owns pagination/search/sort state — this hook just consumes it.
 */
export function useRecipeExport(
  searchTerm: string,
  selectedTags: IdTitle[],
  sort: RecipeSort
) {
  const { user } = useAuth();
  const toast = useToast();
  const [isExporting, setIsExporting] = useState(false);

  const exportAll = useCallback(async () => {
    setIsExporting(true);
    try {
      const response = await RecipeService.getRecipeList(
        0,
        ALL_RECIPES_PAGE_SIZE,
        searchTerm,
        user?.id,
        selectedTags,
        sort,
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
  }, [searchTerm, selectedTags, sort, user?.id, toast]);

  return { isExporting, exportAll };
}
