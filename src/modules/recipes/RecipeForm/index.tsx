import React, { useEffect, useState, FormEvent } from "react";
import { useNavigate, useLocation, useParams, Link } from "react-router-dom";
import PhotoUpload from "./components/PhotoUpload";
import EditableSectionForm from "./components/EditableSectionForm";
import { useAuth } from "../../auth";
import { useToast } from "@shared/components/Toast";
import { Recipe } from "@shared/models/Recipe";
import getChangedFields from "@shared/utils/getChangedFields";
import RecipeService from "@shared/services/RecipeService";
import { Button } from "@shared/components/Buttons";
import TitleDescriptionForm from "@shared/components/TitleDescriptionForm";
import RecipeDetailsForm from "@shared/components/RecipeDetailsForm";

const RecipeForm: React.FC = () => {
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
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

  const [originalData, setOriginalData] = useState<Recipe | null>(null);

  useEffect(() => {
    const existingRecipe = location.state?.recipe as Recipe;
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

  const onFormChange = (field: keyof Recipe, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEditing) {
        const updatedFields = getChangedFields(originalData, formData) as Partial<Recipe>;
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
          undefined,
          {
            ...formData,
            prep_time: parseInt(formData.prep_time.toString(), 10),
            cook_time: parseInt(formData.cook_time.toString(), 10),
          },
          user?.id
        );
        toast.success("Recipe added successfully!");
        navigate(`/recipes/${newRecipe.recipeId}`);
      }
    } catch (error: any) {
      console.error(
        `Error ${isEditing ? "updating" : "adding"} recipe:`,
        error.message
      );
      toast.error(
        `Failed to ${isEditing ? "update" : "add"} recipe. Please try again.`,
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
          !formData.img_url?.length && "rounded-t-lg"
        }`}
      >
        <TitleDescriptionForm formData={formData} onFormChange={onFormChange} />
        <RecipeDetailsForm formData={formData} onFormChange={onFormChange} />

        <EditableSectionForm
          originalFormState={formData.ingredients}
          setOriginalFormState={(e) => onFormChange("ingredients", e)}
          sectionName="Ingredient"
        />

        <EditableSectionForm
          originalFormState={formData.steps}
          setOriginalFormState={(e) => onFormChange("steps", e)}
          sectionName="Step"
        />
      </div>
    </div>
  );
};

export default RecipeForm;
