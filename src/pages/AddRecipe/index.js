import React, { useEffect, useState } from "react";
import RecipeDetailsForm from "../../shared/components/RecipeDetailsForm";
import EmptyState from "../../shared/components/EmptyState";
import recipeService from "../../shared/services/recipeService";
import { Button } from "../../shared/components/Buttons";
import { useAuth } from "../../shared/contexts/AuthContext";
import { useNavigate, useLocation, Link } from "react-router-dom";
import PhotoUpload from "../../shared/components/PhotoUpload";
import { useToast } from "../../shared/services/toastManager";
import EditableSectionForm from "../../shared/components/EditableSectionForm";

function AddRecipe() {
  const { user } = useAuth();
  const { displayToast } = useToast();

  const [formData, setFormData] = useState({
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
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const existingRecipe = location.state?.recipe;
    if (existingRecipe) {
      setFormData({
        title: existingRecipe.title || "",
        description: existingRecipe.description || "",
        img_url: existingRecipe.img_url || "",
        prep_time: existingRecipe.prep_time || 0,
        cook_time: existingRecipe.cook_time || 0,
        servings: existingRecipe.servings || 1,
        original_recipe_url: existingRecipe.original_recipe_url || "",
        ingredients: existingRecipe.ingredients || [],
        steps: existingRecipe.steps || [],
      });
    }
  }, [location.state?.recipe]);

  const onFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const onAddClick = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const recipe = await recipeService.updateRecipe(
        0,
        {
          ...formData,
          prep_time: parseInt(formData.prep_time, 10),
          cook_time: parseInt(formData.cook_time, 10),
        },
        user.id
      );

      displayToast("Recipe added successfully!");
      navigate(`/recipe/${recipe.recipeId}`);
    } catch (error) {
      console.error("Error adding recipe:", error.message);
      displayToast("Failed to add recipe. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="max-w-2xl mx-auto mt-4">
        <div className="w-full flex justify-end items-center mb-4 gap-4">
          <Link to={`/`}>
            <Button btnType="dismissable">Cancel</Button>
          </Link>
          <Button onClick={onAddClick} isLoading={loading}>
            Add
          </Button>
        </div>
        <PhotoUpload
          imgUrl={formData.img_url}
          onImgUrlChange={(url) => onFormChange("img_url", url)}
        />
        <div
          className={`bg-white dark:bg-gray-900 p-6 rounded-b-lg shadow-md ${
            !formData.img_url.length && "rounded-t-lg"
          }`}
        >
          <RecipeDetailsForm formData={formData} onFormChange={onFormChange} />

          <EditableSectionForm
            originalFormState={formData.ingredients}
            setOriginalFormState={(e) => onFormChange("ingredients", e)}
            sectionName="Ingredient"
          >
            {!(formData.ingredients?.length > 0) && (
              <EmptyState message="No ingredients added yet. Add some to get started!" />
            )}
          </EditableSectionForm>

          <EditableSectionForm
            originalFormState={formData.steps}
            setOriginalFormState={(e) => onFormChange("steps", e)}
            sectionName="Step"
          >
            {!(formData.ingredients?.length > 0) && (
              <EmptyState message="No steps added yet. Add some to get started!" />
            )}
          </EditableSectionForm>
        </div>
      </div>
    </>
  );
}

export default AddRecipe;
