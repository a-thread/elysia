import { useState } from "react";
import TagService from "../../../shared/services/TagService";

export function useFetchTags() {
  const [currentSkip, setCurrentSkip] = useState(0);
  const [currentPageSize] = useState(10);
  const [searchTerm] = useState("");
  const [tags, setTags] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  const loadMoreTags = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const { data, count, error } = await TagService.fetchTagList(
        currentSkip,
        currentPageSize,
        searchTerm
      );
      if (error) {
        throw error;
      }
      if (data.length === 0) {
        setHasMore(false);
      } else {
        setTags((prev) => [...prev, ...data]);
        setCurrentSkip((prevSkip) => prevSkip + data.length);
      }

      setTotalCount(count);
    } catch (error) {
      console.error("Error fetching Tag tags:", error.message);
    } finally {
      setLoading(false);
    }
  };
  return { tags, loading, totalCount, loadMoreTags };
}
