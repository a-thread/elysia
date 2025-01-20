import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams, Link } from "react-router-dom";
import RecipeDetailsForm from "../../shared/components/RecipeDetailsForm";
import EmptyState from "../../shared/components/EmptyState";
import recipeService from "../../shared/services/recipeService";
import { Button } from "../../shared/components/Buttons";
import { useAuth } from "../../shared/contexts/AuthContext";
import { useToast } from "../../shared/services/toastManager";
import PhotoUpload from "./PhotoUpload";
import EditableSectionForm from "./EditableSectionForm";
import recipeFormUtils from "./recipeFormUtils";

function RecipeForm() {
  const { user } = useAuth();
  const { displayToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const isEditing = !!id;
  const [loading, setLoading] = useState(false);

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

  const [originalData, setOriginalData] = useState(null);

  useEffect(() => {
    if (isEditing) {
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
        setOriginalData(existingRecipe);
      }
    }
  }, [isEditing, location.state?.recipe]);

  const onFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEditing) {
        const updatedFields = recipeFormUtils.getChangedFields(
          originalData,
          formData
        );
        if (!updatedFields) {
          displayToast("No changes detected.");
          setLoading(false);
          return;
        }

        await recipeService.updateRecipe(id, updatedFields);
        displayToast("Recipe updated successfully!");
        navigate(`/recipe/${id}`);
      } else {
        const newRecipe = await recipeService.updateRecipe(
          0,
          {
            ...formData,
            prep_time: parseInt(formData.prep_time, 10),
            cook_time: parseInt(formData.cook_time, 10),
          },
          user.id
        );
        displayToast("Recipe added successfully!");
        navigate(`/recipe/${newRecipe.recipeId}`);
      }
    } catch (error) {
      console.error(
        `Error ${isEditing ? "updating" : "adding"} recipe:`,
        error.message
      );
      displayToast(
        `Failed to ${isEditing ? "update" : "add"} recipe. Please try again.`,
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-4">
      <div className="w-full flex justify-end items-center mb-4 gap-4">
        <Link to={isEditing ? `/recipe/${id}` : `/`}>
          <Button btnType="dismissable">Cancel</Button>
        </Link>
        <Button onClick={handleSave} isLoading={loading}>
          {isEditing ? "Save" : "Add"}
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
          {!(formData.steps?.length > 0) && (
            <EmptyState message="No steps added yet. Add some to get started!" />
          )}
        </EditableSectionForm>
      </div>
    </div>
  );
}

export default RecipeForm;
