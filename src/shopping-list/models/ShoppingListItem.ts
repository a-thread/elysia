export interface ShoppingListItem {
  id: string;
  user_id: string;
  value: string;
  checked: boolean;
  source_recipe_id?: string | null;
  source_recipe_title?: string | null;
  created_at: string;
}

export interface NewShoppingListItem {
  value: string;
  source_recipe_id?: string;
  source_recipe_title?: string;
}
