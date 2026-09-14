import { useState } from "react";
import { useAuth } from "@shared/contexts/AuthContext";
import { useToast } from "@shared/components/Toast";
import { useModalManager, DeleteConfirmationModal } from "@shared/components/Modals";
import ShoppingListService from "../services/ShoppingListService";
import { useShoppingListItems } from "./useShoppingListItems";
import { toMarkdownChecklist } from "../utils/toMarkdownChecklist";
import { ShoppingListItem } from "../models/ShoppingListItem";

/**
 * Composed shopping list page hook.
 * Centralizes shopping list data and actions for the page.
 */
export const useShoppingListPage = () => {
  const { user } = useAuth();
  const toast = useToast();
  const { openModal, closeModal } = useModalManager();
  const { items, loading, fetchItems, setItems } = useShoppingListItems(user?.id);
  const [newItemValue, setNewItemValue] = useState("");

  const addItem = async () => {
    const value = newItemValue.trim();
    if (!value || !user?.id) return;
    setNewItemValue("");
    try {
      const created = await ShoppingListService.addItem(user.id, value);
      if (created) setItems((prev) => [...prev, created]);
    } catch (error) {
      console.error("Failed to add item", error);
      toast.error("Failed to add item. Please try again.");
    }
  };

  const toggleChecked = async (item: ShoppingListItem) => {
    const nextChecked = !item.checked;
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, checked: nextChecked } : i)),
    );
    try {
      await ShoppingListService.setChecked(item.id, nextChecked);
    } catch (error) {
      console.error("Failed to update item", error);
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, checked: item.checked } : i)),
      );
      toast.error("Failed to update item. Please try again.");
    }
  };

  const removeItem = async (itemId: string) => {
    const removed = items.find((i) => i.id === itemId);
    setItems((prev) => prev.filter((i) => i.id !== itemId));
    try {
      await ShoppingListService.deleteById(itemId);
    } catch (error) {
      console.error("Failed to remove item", error);
      if (removed) setItems((prev) => [...prev, removed]);
      toast.error("Failed to remove item. Please try again.");
    }
  };

  const clearChecked = async () => {
    if (!user?.id) return;
    try {
      await ShoppingListService.clearChecked(user.id);
      toast.success("Checked items cleared.");
      closeModal();
      await fetchItems();
    } catch (error) {
      console.error("Failed to clear checked items", error);
      toast.error("Failed to clear checked items. Please try again.");
    }
  };

  const clearAll = async () => {
    if (!user?.id) return;
    try {
      await ShoppingListService.clearAll(user.id);
      toast.success("Shopping list cleared.");
      closeModal();
      await fetchItems();
    } catch (error) {
      console.error("Failed to clear shopping list", error);
      toast.error("Failed to clear shopping list. Please try again.");
    }
  };

  const confirmClearChecked = () =>
    openModal(
      <DeleteConfirmationModal
        label="checked items"
        onCancelDelete={closeModal}
        onDelete={clearChecked}
      />,
    );

  const confirmClearAll = () =>
    openModal(
      <DeleteConfirmationModal
        label="entire shopping list"
        onCancelDelete={closeModal}
        onDelete={clearAll}
      />,
    );

  const copyAsMarkdown = async () => {
    if (items.length === 0) {
      toast.error("Your shopping list is empty.");
      return;
    }
    try {
      await navigator.clipboard.writeText(toMarkdownChecklist(items));
      toast.success("Copied as markdown!");
    } catch (error) {
      console.error("Failed to copy shopping list", error);
      toast.error("Failed to copy. Please try again.");
    }
  };

  return {
    items,
    loading,
    newItemValue,
    setNewItemValue,
    addItem,
    toggleChecked,
    removeItem,
    confirmClearChecked,
    confirmClearAll,
    copyAsMarkdown,
  };
};
