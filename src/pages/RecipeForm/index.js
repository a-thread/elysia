import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams, Link } from "react-router-dom";
import RecipeDetailsForm from "../../shared/components/RecipeDetailsForm";
import EmptyState from "../../shared/components/EmptyState";
import RecipeService from "../../shared/services/RecipeService";
import { Button } from "../../shared/components/Buttons";
import { useAuth } from "../../shared/contexts/AuthContext";
import { useToast } from "../../shared/services/toastManager";
import PhotoUpload from "./components/PhotoUpload";
import EditableSectionForm from "./components/EditableSectionForm";
import getChangedFields from "../../shared/utils/getChangedFields";
import NameDescriptionForm from "../../shared/components/TitleDescriptionForm";

function RecipeForm() {
  const { user } = useAuth();
  const toast = useToast();
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
  }, [location.state?.recipe]);

  const onFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEditing) {
        const updatedFields = getChangedFields(originalData, formData);
        if (!updatedFields) {
          toast.success("No changes detected.");
          setLoading(false);
          return;
        }

        await RecipeService.upsertRecipe(id, updatedFields);
        toast.success("Recipe updated successfully!");
        navigate(`/recipes/${id}`);
      } else {
        const newRecipe = await RecipeService.upsertRecipe(
          0,
          {
            ...formData,
            prep_time: parseInt(formData.prep_time, 10),
            cook_time: parseInt(formData.cook_time, 10),
          },
          user.id
        );
        toast.success("Recipe added successfully!");
        navigate(`/recipes/${newRecipe.recipeId}`);
      }
    } catch (error) {
      console.error(
        `Error ${isEditing ? "updating" : "adding"} recipe:`,
        error.message
      );
      toast.error(
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
        <Link to={isEditing ? `/recipes/${id}` : `/`}>
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
        <NameDescriptionForm formData={formData} onFormChange={onFormChange} />
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
