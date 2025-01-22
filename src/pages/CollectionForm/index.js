import React, { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Button } from "../../shared/components/Buttons";
import CollectionService from "../../shared/services/CollectionService";
import { useAuth } from "../../shared/contexts/AuthContext";
import getChangedFields from "../../shared/utils/getChangedFields";
import { useToast } from "../../shared/services/toastManager";
import PhotoUpload from "../RecipeForm/components/PhotoUpload";
import NameDescriptionForm from "../../shared/components/TitleDescriptionForm";
import MultiSelect from "../../shared/components/MultiSelect";
import RecipeService from "../../shared/services/RecipeService";
import TagService from "../../shared/services/TagService";

const CollectionForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  const { id } = useParams(); // Check if editing
  const { user } = useAuth();

  const isEditing = !!id;

  const [loading, setLoading] = useState(false);
  const [recipeSearch, setRecipeSearch] = useState("");
  const [recipeList, setRecipeList] = useState([]);
  const [tagSearch, setTagSearch] = useState("");
  const [tagList, setTagList] = useState([]);
  const [originalData, setOriginalData] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    img_url: "",
    recipes: [],
    tags: [],
  });

  const onFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const fetchRecipes = useCallback(async () => {
    try {
      const { data } = await RecipeService.fetchRecipeList(0, 25, recipeSearch);
      console.log(data)
      setRecipeList(data);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
  }, [recipeSearch]);

  const fetchTags = useCallback(async () => {
    try {
      const { data } = await TagService.fetchTagList(0, 25, tagSearch);
      console.log(data)

      setTagList(data);
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  }, [tagSearch]);

  useEffect(() => {
    if (isEditing) {
      const existingCollection = location.state?.collection;
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

  useEffect(() => {
    fetchRecipes(recipeSearch);
  }, [fetchRecipes, recipeSearch]);

  useEffect(() => {
    fetchTags(tagSearch);
  }, [fetchTags, tagSearch]);

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

        await CollectionService.upsertCollection(id, updatedFields);
        toast.success("Collection updated successfully!");
        navigate(`/collections/${id}`);
      } else {
        const newCollection = await CollectionService.upsertCollection(
          0,
          formData,
          user.id
        );
        toast.success("Collection added successfully!");
        navigate(`/collections/${newCollection.id}`);
      }
    } catch (error) {
      console.error(
        `Error ${isEditing ? "updating" : "adding"} collection:`,
        error.message
      );
      toast.error(
        `Failed to ${
          isEditing ? "update" : "add"
        } collection. Please try again.`,
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-4">
      <div className="w-full flex justify-end items-center mb-4 gap-4">
        <Button btnType="dismissable" onClick={() => navigate("/collections")}>
          Cancel
        </Button>
        <Button onClick={handleSave} isLoading={loading}>
          {isEditing ? "Save" : "Add"}
        </Button>
      </div>

      {/* Photo Upload */}
      <PhotoUpload
        imgUrl={formData.img_url}
        onImgUrlChange={(url) => onFormChange("img_url", url)}
      />

      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
        <NameDescriptionForm formData={formData} onFormChange={onFormChange} />

        <div className="mb-2">
          <label
            htmlFor="Recipes"
            className="peer-focus:font-medium text-sm text-gray-500 dark:text-gray-400 mb-2"
          >
            Recipes
          </label>
          <MultiSelect
            inputId="Recipes"
            options={recipeList}
            selectedOptions={formData.recipes}
            setSelectedOptions={(selectedRecipes) =>
              onFormChange("recipes", selectedRecipes)
            }
            onSearch={setRecipeSearch}
          />
        </div>

        <div className="mb-2">
          <label
            htmlFor="Recipes"
            className="peer-focus:font-medium text-sm text-gray-500 dark:text-gray-400 mb-2"
          >
            Tags
          </label>
          <MultiSelect
            inputId="Tags"
            options={tagList}
            selectedOptions={formData.tags}
            setSelectedOptions={(selectedTags) =>
              onFormChange("tags", selectedTags)
            }
            onSearch={setTagSearch}
          />
        </div>
      </div>
    </div>
  );
};

export default CollectionForm;
