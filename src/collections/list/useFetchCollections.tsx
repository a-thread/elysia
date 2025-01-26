import { useState } from "react";
import { Collection } from "@shared/models/Collection";
import CollectionService from "@shared/services/CollectionService";

export function useFetchCollections() {
  const [currentSkip, setCurrentSkip] = useState<number>(0);
  const [currentPageSize] = useState<number>(10);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const loadMoreCollections = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const response =
        await CollectionService.getList(
          currentSkip,
          currentPageSize,
          searchTerm
        );

      if (!response || response.data.length === 0) {
        setHasMore(false);
      } else {
        setCollections((prev) => [...prev, ...response.data]);
        setCurrentSkip((prevSkip) => prevSkip + response.data.length);
        setTotalCount(response.count || 0);
      }
      setLoading(false);
    } catch (error: any) {
      console.error("Error fetching collections:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return { collections, searchTerm, setSearchTerm, loading, hasMore, totalCount, loadMoreCollections };
}
