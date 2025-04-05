import { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useAuth } from "@shared/contexts/AuthContext";
import { Collection } from "@shared/models/Collection";
import RecipeService from "@shared/services/RecipeService";
import TagService from "@shared/services/TagService";

export const useCollectionForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const isEditing = !!id;
  const [loading, setLoading] = useState(false);
  const [recipeSearch, setRecipeSearch] = useState("");
  const [recipeList, setRecipeList] = useState<any[]>([]);
  const [tagSearch, setTagSearch] = useState("");
  const [tagList, setTagList] = useState<any[]>([]);

  const [originalData, setOriginalData] = useState<Partial<Collection> | null>(null);
  const [formData, setFormData] = useState<Partial<Collection>>({
    title: "",
    description: "",
    img_url: "",
    recipes: [],
    tags: [],
  });

  // Fetch existing collection when editing
  useEffect(() => {
    if (isEditing) {
      const existingCollection = location.state?.collection as Collection;
      if (existingCollection) {
        setFormData({
          title: existingCollection.title || "",
          description: existingCollection.description || "",
          img_url: existingCollection.img_url || "",
          recipes: existingCollection.recipes || [],
          tags: existingCollection.tags || [],
        });
        setOriginalData(existingCollection);
      }
    }
  }, [isEditing, location.state?.collection]);

  // Fetch Recipes
  const fetchRecipes = useCallback(async () => {
    try {
      const response = await RecipeService.getRecipeList(0, 25, recipeSearch);
      if (response?.data) {
        setRecipeList(response.data);
      }
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
  }, [recipeSearch]);

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

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  const onFormChange = (field: keyof Collection, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return {
    formData,
    originalData,
    onFormChange,
    isEditing,
    loading,
    setLoading,
    navigate,
    recipeList,
    tagList,
    setRecipeSearch,
    setTagSearch,
    userId: user?.id,
    collectionId: id,
  };
};
