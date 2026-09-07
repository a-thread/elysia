import { useEffect, useState } from "react";
import CollectionService from "@collections/services/CollectionService";
import { Collection } from "@collections/models/Collection";

export const useCollectionDetails = (
  id: string | undefined,
  userId: string | undefined
) => {
  const [collection, setCollection] = useState<Collection | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCollection = async () => {
    setLoading(true);
    try {
      if (!id) return;
      const data = await CollectionService.getDetail(id, userId);
      setCollection(data ?? null);
    } catch (error) {
      console.error("Failed to fetch collection details", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    fetchCollection();
  }, [id, userId]);

  return { collection, loading, fetchCollection };
};
