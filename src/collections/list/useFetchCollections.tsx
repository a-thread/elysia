import { useState } from "react";
import { Collection } from "@shared/models/Collection";
import { supabase } from "@shared/services/supabase";

export function useFetchCollections() {
  const [currentSkip, setCurrentSkip] = useState<number>(0);
  const [currentPageSize] = useState<number>(10);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const loadMoreCollections = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const { data, count, error } = await supabase
        .from("collections")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false })
        .range(currentSkip, currentSkip + currentPageSize - 1);

      if (error) {
        throw error;
      }
      if (data.length === 0) {
        setHasMore(false);
      } else {
        setCollections((prev) => [...prev, ...data]);
        setCurrentSkip((prevSkip) => prevSkip + data.length);
      }
      setTotalCount(count || 0);
      setLoading(false);
    } catch (error: any) {
      console.error("Error fetching collections:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return { collections, loading, hasMore, totalCount, loadMoreCollections };
}
