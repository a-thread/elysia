import { useCallback, useEffect, useState } from "react";
import ShoppingListService from "../services/ShoppingListService";
import { ShoppingListItem } from "../models/ShoppingListItem";

export const useShoppingListItems = (userId: string | undefined) => {
  const [items, setItems] = useState<ShoppingListItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = useCallback(async () => {
    if (!userId) {
      setItems([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await ShoppingListService.getList(userId);
      setItems(data ?? []);
    } catch (error) {
      console.error("Failed to fetch shopping list items", error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return { items, loading, fetchItems, setItems };
};
