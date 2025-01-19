import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import recipeService from "../../shared/services/recipeService";
import RecipeDetailsForm from "../../shared/components/RecipeDetailsForm";
import EmptyState from "../../shared/components/EmptyState";
import EditableSectionForm from "../../shared/components/EditableSectionForm";
import { Button } from "../../shared/components/Buttons";
import PhotoUpload from "../../shared/components/PhotoUpload";
import { useToast } from "../../shared/services/toastManager";

function EditRecipe() {
  const { id } = useParams();
  const { displayToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [originalData, setOriginalData] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    img_url: "",
    prep_time: 0,
    cook_time: 0,
    servings: 1,
    ingredients: [],
    steps: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const existingRecipe = location.state?.recipe;
    if (existingRecipe) {
      const formData = {
        title: existingRecipe.title || "",
        description: existingRecipe.description || "",
        img_url: existingRecipe.img_url || "",
        prep_time: existingRecipe.prep_time || 0,
        cook_time: existingRecipe.cook_time || 0,
        servings: existingRecipe.servings || 1,
        ingredients: existingRecipe.ingredients || [],
        steps: existingRecipe.steps || [],
      };
      setFormData(formData);
      setOriginalData(formData);
    }
  }, [location.state?.recipe]);

  const onFormChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const deepCompare = (original, updated) => {
    if (original === updated) return null; // No change for primitive values

    if (
      typeof original !== "object" ||
      typeof updated !== "object" ||
      original === null ||
      updated === null
    ) {
      return updated; // Return updated value for primitive changes
    }

    if (Array.isArray(original) && Array.isArray(updated)) {
      const changedArray = updated.reduce((acc, newItem, index) => {
        const oldItem = original[index];

        // If item is an object, check for changes in its properties
        if (typeof newItem === "object" && newItem !== null) {
          const itemChanges = deepCompare(oldItem || {}, newItem);
          if (itemChanges !== null) {
            acc.push(newItem); // Return the whole modified object if anything changed
          }
        }
        // If a primitive value changed, return it
        else if (newItem !== oldItem) {
          acc.push(newItem);
        }

        return acc;
      }, []);

      // Detect removed elements (if original array was longer)
      if (original.length > updated.length) {
        return updated; // Return entire updated array if elements were removed
      }

      return changedArray.length > 0 ? changedArray : null;
    }

    const changed = {};
    const allKeys = new Set([
      ...Object.keys(original),
      ...Object.keys(updated),
    ]);

    allKeys.forEach((key) => {
      const diff = deepCompare(original[key], updated[key]);
      if (diff !== null) {
        changed[key] = diff;
      }
    });

    return Object.keys(changed).length > 0 ? changed : null;
  };

  const getChangedFields = (original, updated) =>
    deepCompare(original, updated) || {};

  const onSave = async (e) => {
    e.preventDefault();
    setLoading(true);

    const updatedFields = getChangedFields(originalData, formData);

    console.log(updatedFields.ingredients);

    // If nothing changed, don't send the request
    if (Object.keys(updatedFields).length === 0) {
      displayToast("No changes detected.");
      setLoading(false);
      return;
    }

    try {
      await recipeService.updateRecipe(id, updatedFields);
      displayToast("Recipe updated successfully!");
      navigate(`/recipe/${id}`);
    } catch (error) {
      console.error("Error updating recipe:", error.message);
      displayToast("Failed to update recipe. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-4">
      <div className="w-full flex justify-end items-center mb-4 gap-4">
        <Link to={`/recipe/${id}`}>
          <Button btnType="dismissable">Cancel</Button>
        </Link>
        <Button isLoading={loading} onClick={onSave}>
          Save
        </Button>
      </div>
      <>
        <PhotoUpload
          imgUrl={formData.img_url}
          onImgUrlChange={(url) => onFormChange("img_url", url)}
        />
        <div
          className={`bg-white dark:bg-gray-900 p-6 rounded-b-lg shadow-md ${
            !formData.img_url?.length && "rounded-t-lg"
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
      </>
    </div>
  );
}

export default EditRecipe;
