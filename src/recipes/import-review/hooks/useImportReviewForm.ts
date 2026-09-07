import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Recipe } from "@recipes/models/Recipe";
import TagService from "@shared/services/TagService";
import CollectionService from "@collections/services/CollectionService";
import { IdTitle } from "@shared/models/Tag";
import { useEntitySearch } from "@shared/hooks/useEntitySearch";

const emptyRecipe = (): Recipe => ({
  title: "",
  description: "",
  img_url: "",
  prep_time: 0,
  cook_time: 0,
  servings: 1,
  original_recipe_url: "",
  ingredients: [],
  steps: [],
  collections: [],
  tags: [],
});

const normalize = (recipe: Recipe): Recipe => ({
  ...emptyRecipe(),
  ...recipe,
  tags: recipe.tags ? [...recipe.tags] : [],
  collections: recipe.collections ? [...recipe.collections] : [],
});

export const useImportReviewForm = () => {
  const location = useLocation();
  const recipes = (location.state?.recipes as Recipe[]) || [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [formData, setFormData] = useState<Recipe>(
    recipes[0] ? normalize(recipes[0]) : emptyRecipe()
  );

  const { setSearchTerm: setCollectionSearch, list: collectionList } =
    useEntitySearch((term) => CollectionService.getList(0, 25, term), "collections");
  const {
    setSearchTerm: setTagSearch,
    list: tagList,
    setList: setTagList,
  } = useEntitySearch((term) => TagService.getList(0, 25, term), "tags");

  const onFormChange = (field: keyof Recipe, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const advance = () => {
    const nextIndex = currentIndex + 1;
    if (recipes[nextIndex]) {
      setFormData(normalize(recipes[nextIndex]));
      setCurrentIndex(nextIndex);
    }
  };

  const createTag = async (title: string): Promise<IdTitle | null> => {
    try {
      const created = await TagService.create(title);
      if (created) setTagList((prev) => [...prev, created]);
      return created;
    } catch (error) {
      console.error("Error creating tag:", error);
      return null;
    }
  };

  return {
    recipes,
    currentIndex,
    formData,
    onFormChange,
    advance,
    collectionList,
    tagList,
    setCollectionSearch,
    setTagSearch,
    createTag,
  };
};
