import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Recipe } from "@recipes/models/Recipe";
import TagService from "@shared/services/TagService";
import CollectionService from "@collections/services/CollectionService";
import { IdTitle } from "@shared/models/Tag";
import { useEntitySearch } from "@shared/hooks/useEntitySearch";

export const useRecipeForm = () => {
  const location = useLocation();
  const { id } = useParams<{ id: string }>();

  const isEditing = !!id;

  const { setSearchTerm: setCollectionSearch, list: collectionList } =
    useEntitySearch((term) => CollectionService.getList(0, 25, term), "collections");
  const {
    setSearchTerm: setTagSearch,
    list: tagList,
    setList: setTagList,
  } = useEntitySearch((term) => TagService.getList(0, 25, term), "tags");

  const [formData, setFormData] = useState<Recipe>({
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
  const [originalData, setOriginalData] = useState<Recipe | null>({
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

  useEffect(() => {
    const existingRecipe = location.state?.recipe as Recipe;
    if (existingRecipe) {
      const formData = {
        title: existingRecipe.title || "",
        description: existingRecipe.description || "",
        img_url: existingRecipe.img_url || "",
        prep_time: existingRecipe.prep_time || 0,
        cook_time: existingRecipe.cook_time || 0,
        servings: existingRecipe.servings || 1,
        original_recipe_url: existingRecipe.original_recipe_url || "",
        ingredients: existingRecipe.ingredients || [],
        steps: existingRecipe.steps || [],
        tags: existingRecipe.tags ? [...existingRecipe.tags] : [],
        collections: existingRecipe.collections ? [...existingRecipe.collections] : [],
      };
      setFormData(formData);
      setOriginalData(formData);
    }
  }, [location.state?.recipe]);

  const onFormChange = (field: keyof Recipe, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const createTag = async (title: string): Promise<IdTitle | null> => {
    try {
      const created = await TagService.create(title);
      if (created) {
        setTagList((prev) => [...prev, created]);
      }
      return created;
    } catch (error) {
      console.error("Error creating tag:", error);
      return null;
    }
  };

  return {
    formData,
    originalData,
    onFormChange,
    isEditing,
    id,
    collectionList,
    tagList,
    setCollectionSearch,
    setTagSearch,
    createTag,
  };
};
