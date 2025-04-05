import { Recipe } from "@shared/models/Recipe";

export const formatDetail = (data: any) => {
  const formattedData: Recipe = {
    id: data?.id || "",
    title: data?.title || "",
    description: data?.description || "",
    img_url: data?.img_url || "",
    original_recipe_url: data?.original_recipe_url || "",
    prep_time: data?.prep_time || 0,
    cook_time: data?.cook_time || 0,
    servings: data?.servings || 1,
    is_public: data?.is_public || false,
    total_time: data?.prep_time + data?.cook_time || 0,
    steps: data?.steps || [],
    ingredients: data?.ingredients || [],
    collections: (data?.collection_to_recipes || []).flatMap(
      (item: any) => item.collections
    ),
    tags: (data?.recipe_to_tags || []).flatMap((item: any) => item.tags),
  };
  return formattedData;
};
