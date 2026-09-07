export enum RecipeSort {
  DateNewest = "date-newest",
  DateOldest = "date-oldest",
  TitleAsc = "title-asc",
  TitleDesc = "title-desc",
}

export const RECIPE_SORT_LABELS: Record<RecipeSort, string> = {
  [RecipeSort.DateNewest]: "Newest first",
  [RecipeSort.DateOldest]: "Oldest first",
  [RecipeSort.TitleAsc]: "Title A-Z",
  [RecipeSort.TitleDesc]: "Title Z-A",
};

export function recipeSortToOrder(sort: RecipeSort): {
  column: string;
  ascending: boolean;
} {
  switch (sort) {
    case RecipeSort.DateOldest:
      return { column: "created_at", ascending: true };
    case RecipeSort.TitleAsc:
      return { column: "title", ascending: true };
    case RecipeSort.TitleDesc:
      return { column: "title", ascending: false };
    case RecipeSort.DateNewest:
    default:
      return { column: "created_at", ascending: false };
  }
}
