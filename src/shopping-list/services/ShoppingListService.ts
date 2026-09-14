import { supabaseWithAbort } from "@shared/services/SupabaseWithAbort";
import { TableNames } from "@shared/services/TableNames";
import { NewShoppingListItem, ShoppingListItem } from "../models/ShoppingListItem";

const getList = async (userId: string) => {
  return await supabaseWithAbort.request("shoppingList-getList", async (client) => {
    const { data, error } = await client
      .from(TableNames.SHOPPING_LIST_ITEMS)
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: true });

    if (error) throw new Error("Failed to fetch shopping list.");
    return (data ?? []) as ShoppingListItem[];
  });
};

const addItem = async (userId: string, value: string) => {
  return await supabaseWithAbort.request("shoppingList-addItem", async (client) => {
    const { data, error } = await client
      .from(TableNames.SHOPPING_LIST_ITEMS)
      .insert([{ user_id: userId, value }])
      .select()
      .single();

    if (error) throw new Error("Failed to add item to shopping list.");
    return data as ShoppingListItem;
  });
};

const addItems = async (userId: string, items: NewShoppingListItem[]) => {
  return await supabaseWithAbort.request("shoppingList-addItems", async (client) => {
    const { data, error } = await client
      .from(TableNames.SHOPPING_LIST_ITEMS)
      .insert(items.map((item) => ({ ...item, user_id: userId })))
      .select();

    if (error) throw new Error("Failed to add items to shopping list.");
    return (data ?? []) as ShoppingListItem[];
  });
};

const setChecked = async (itemId: string, checked: boolean) => {
  return await supabaseWithAbort.request(`shoppingList-setChecked-${itemId}`, async (client) => {
    const { error } = await client
      .from(TableNames.SHOPPING_LIST_ITEMS)
      .update({ checked })
      .eq("id", itemId);

    if (error) throw new Error("Failed to update item.");
  });
};

const updateValue = async (itemId: string, value: string) => {
  return await supabaseWithAbort.request(`shoppingList-updateValue-${itemId}`, async (client) => {
    const { error } = await client
      .from(TableNames.SHOPPING_LIST_ITEMS)
      .update({ value })
      .eq("id", itemId);

    if (error) throw new Error("Failed to update item.");
  });
};

const deleteById = async (itemId: string) => {
  return await supabaseWithAbort.request(`shoppingList-deleteById-${itemId}`, async (client) => {
    const { error } = await client
      .from(TableNames.SHOPPING_LIST_ITEMS)
      .delete()
      .eq("id", itemId);

    if (error) throw new Error("Failed to remove item.");
  });
};

const clearChecked = async (userId: string) => {
  return await supabaseWithAbort.request("shoppingList-clearChecked", async (client) => {
    const { error } = await client
      .from(TableNames.SHOPPING_LIST_ITEMS)
      .delete()
      .eq("user_id", userId)
      .eq("checked", true);

    if (error) throw new Error("Failed to clear checked items.");
  });
};

const clearAll = async (userId: string) => {
  return await supabaseWithAbort.request("shoppingList-clearAll", async (client) => {
    const { error } = await client
      .from(TableNames.SHOPPING_LIST_ITEMS)
      .delete()
      .eq("user_id", userId);

    if (error) throw new Error("Failed to clear shopping list.");
  });
};

const ShoppingListService = {
  getList,
  addItem,
  addItems,
  setChecked,
  updateValue,
  deleteById,
  clearChecked,
  clearAll,
};

export default ShoppingListService;
