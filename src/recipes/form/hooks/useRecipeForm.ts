import { useCallback, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Recipe } from "@shared/models/Recipe";
import TagService from "@shared/services/TagService";
import CollectionService from "@shared/services/CollectionService";
import { IdTitle } from "@shared/models/Tag";

export const useRecipeForm = () => {
  const location = useLocation();
  const { id } = useParams<{ id: string }>();

  const isEditing = !!id;

  const [collectionSearch, setCollectionSearch] = useState("");
  const [collectionList, setCollectionList] = useState<any[]>([]);
  const [tagSearch, setTagSearch] = useState("");
  const [tagList, setTagList] = useState<IdTitle[]>([]);
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

  // Fetch Tags
  const fetchTags = useCallback(async () => {
    try {
      const response = await TagService.getList(0, 25, tagSearch);
      if (response?.data) {
        setTagList(response.data);
      }
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  }, [tagSearch]);

  // Fetch Recipes
  const fetchCollections = useCallback(async () => {
    try {
      const response = await CollectionService.getList(0, 25, collectionSearch);
      if (response?.data) {
        setCollectionList(response.data);
      }
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
  }, [collectionSearch]);

  useEffect(() => {
    fetchCollections();
  }, [collectionSearch]);

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

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
  };
};
