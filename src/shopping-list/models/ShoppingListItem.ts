export interface ShoppingListItem {
  id: string;
  user_id: string;
  value: string;
  checked: boolean;
  source_recipe_id?: string | null;
  source_recipe_title?: string | null;
  /** The recipe's ingredient group this came from (e.g. "For the sauce:"), if it had one. */
  source_group?: string | null;
  created_at: string;
}

export interface NewShoppingListItem {
  value: string;
  source_recipe_id?: string;
  source_recipe_title?: string;
  source_group?: string;
}
