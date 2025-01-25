import { useToast } from "@shared/components/Toast";
import React, { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@shared/contexts/AuthContext";
import { Collection } from "@shared/models/Collection";
import RecipeService from "@shared/services/RecipeService";
import TagService from "@shared/services/TagService";
import getChangedFields from "@shared/utils/getChangedFields";
import CollectionService from "@shared/services/CollectionService";
import { Button } from "@shared/components/Buttons";
import PhotoUpload from "@shared/components/PhotoUpload";
import TitleDescriptionForm from "@shared/components/TitleDescriptionForm";
import MultiSelect from "@shared/components/MultiSelect";

const CollectionForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  const { id } = useParams<{ id: string }>(); // Check if editing
  const { user } = useAuth();

  const isEditing = !!id;

  const [loading, setLoading] = useState(false);
  const [recipeSearch, setRecipeSearch] = useState("");
  const [recipeList, setRecipeList] = useState<any[]>([]);
  const [tagSearch, setTagSearch] = useState("");
  const [tagList, setTagList] = useState<any[]>([]);
  const [originalData, setOriginalData] = useState<Collection | null>(null);

  const [formData, setFormData] = useState<Collection>({
    title: "",
    description: "",
    img_url: "",
    recipes: [],
    tags: [],
  });

  const onFormChange = (field: keyof Collection, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const fetchRecipes = useCallback(async () => {
    try {
      const response = await RecipeService.fetchRecipeList(0, 25, recipeSearch);
      if (response?.data) {
        setRecipeList(response.data);
      }
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
  }, [recipeSearch]);

  const fetchTags = useCallback(async () => {
    try {
      const response = await TagService.fetchTagList(0, 25, tagSearch);
      if (response?.data) {
        setTagList(response.data);
      }
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  }, [tagSearch]);

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

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!isEditing && !user?.id) {
      return;
    }

    try {
      if (isEditing) {
        const updatedFields = getChangedFields(
          originalData,
          formData
        ) as unknown as Collection;
        if (!updatedFields) {
          toast.success("No changes detected.");
          setLoading(false);
          return;
        }

        await CollectionService.upsertCollection(id!, updatedFields);
        toast.success("Collection updated successfully!");
        navigate(`/collections/${id}`);
      } else {
        const newCollection = await CollectionService.upsertCollection(
          "",
          formData,
          user?.id
        );
        toast.success("Collection added successfully!");
        navigate(`/collections/${newCollection.collectionId}`);
      }
    } catch (error: any) {
      console.error(
        `Error ${isEditing ? "updating" : "adding"} collection:`,
        error.message
      );
      toast.error(
        `Failed to ${
          isEditing ? "update" : "add"
        } collection. Please try again.`
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
        onImgUrlChange={(url: string) => onFormChange("img_url", url)}
      />

      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
        <TitleDescriptionForm formData={formData} onFormChange={onFormChange} />

        <div className="mb-2">
          <label
            htmlFor="Recipes"
            className="peer-focus:font-medium text-sm text-gray-500 dark:text-gray-400 mb-2"
          >
            Recipes
          </label>
          <MultiSelect
            placeholder="Search for recipes..."
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
            htmlFor="Tags"
            className="peer-focus:font-medium text-sm text-gray-500 dark:text-gray-400 mb-2"
          >
            Tags
          </label>
          <MultiSelect
            placeholder="Search for tags..."
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
