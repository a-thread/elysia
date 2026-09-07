import { useCallback, useEffect, useState } from "react";

interface PagedResponse<T> {
  data: T[] | null;
}

/**
 * Search-as-you-type hook for fetching data.
 *
 * `fetchFn` should be bound to a fixed page size and depend only on
 * `searchTerm`. For example: `(term) => TagService.getList(0, 25, term)`
 */
export const useEntitySearch = <T>(
  fetchFn: (searchTerm: string) => Promise<PagedResponse<T> | null | undefined>,
  errorContext = "entities",
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
