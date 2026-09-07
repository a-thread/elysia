import { useCallback, useEffect, useState } from "react";

interface PagedResponse<T> {
  data: T[] | null;
}

/**
 * Search-as-you-type + fetched candidate list — the pattern duplicated across
 * the tag/collection/recipe pickers in the recipe, import-review, and
 * collection form hooks. `fetchFn` should be a service call bound to a fixed
 * page size, e.g. `(term) => TagService.getList(0, 25, term)`; it's expected
 * to only vary its results by `searchTerm`, not by any other reactive value,
 * so its identity is intentionally left out of the effect dependencies below
 * (a fresh inline binding every render would otherwise refetch every render).
 */
export const useEntitySearch = <T>(
  fetchFn: (searchTerm: string) => Promise<PagedResponse<T> | null | undefined>,
  errorContext = "entities"
) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [list, setList] = useState<T[]>([]);

  const fetchList = useCallback(async () => {
    try {
      const response = await fetchFn(searchTerm);
      if (response?.data) setList(response.data);
    } catch (error) {
      console.error(`Error fetching ${errorContext}:`, error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  return { searchTerm, setSearchTerm, list, setList };
};
