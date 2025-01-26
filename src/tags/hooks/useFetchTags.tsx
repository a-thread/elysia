import { useState } from "react";
import TagService from "@shared/services/TagService";
import { IdTitle } from "@shared/models/Tag";

export function useFetchTags() {
  const [currentSkip, setCurrentSkip] = useState<number>(0);
  const [currentPageSize] = useState<number>(10);
  const [searchTerm] = useState<string>("");
  const [tags, setTags] = useState<IdTitle[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const [loading, setLoading] = useState<boolean>(false);
  const [totalCount, setTotalCount] = useState<number>(0);

  const loadMoreTags = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const response = await TagService.getList(
        currentSkip,
        currentPageSize,
        searchTerm
      );
      if (!response) {
        throw new Error("Something went wrong. Please try again.");
      }
      if (response.data.length === 0) {
        setHasMore(false);
      } else {
        setTags((prev) => [...prev, ...response.data]);
        setCurrentSkip((prevSkip) => prevSkip + response.data.length);
      }

      setTotalCount(response.count || 0);
    } catch (error) {
      console.error("Error fetching Tag tags:", (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return { tags, loading, totalCount, hasMore, loadMoreTags };
}
