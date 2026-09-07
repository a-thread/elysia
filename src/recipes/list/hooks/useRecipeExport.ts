import { useCallback, useState } from "react";
import RecipeService from "@recipes/services/RecipeService";
import generateRecipesPDF from "@recipes/utils/PdfGenerator";
import { useAuth } from "@shared/contexts/AuthContext";
import { useToast } from "@shared/components/Toast";
import { IdTitle } from "@shared/models/Tag";
import { RecipeSort } from "@recipes/models/RecipeSort";

const ALL_RECIPES_PAGE_SIZE = 1000000;

/**
 * Exports every recipe, matching the applied filters, to one PDF.
 */
export function useRecipeExport(
  searchTerm: string,
  selectedTags: IdTitle[],
  sort: RecipeSort,
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
