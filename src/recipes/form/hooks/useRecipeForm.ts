import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Recipe } from "@shared/models/Recipe";

export const useRecipeForm = () => {
  const location = useLocation();
  const { id } = useParams<{ id: string }>();

  const isEditing = !!id;
  const [loading, setLoading] = useState(false);
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
      };
      console.log(formData)
      setFormData(formData);
      setOriginalData(formData);
    }
  }, [location.state?.recipe]);

  const onFormChange = (field: keyof Recipe, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return { formData, originalData, onFormChange, isEditing, id, loading, setLoading };
};
