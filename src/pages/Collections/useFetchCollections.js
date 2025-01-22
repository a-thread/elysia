import { useState } from "react";
import { supabase } from "../../shared/services/supabase";

export function useFetchCollections() {
  const [currentSkip, setCurrentSkip] = useState(0);
  const [currentPageSize] = useState(10);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(true);

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
      setTotalCount(count);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching collections:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return { collections, loading, totalCount, loadMoreCollections };
}
