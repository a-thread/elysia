import React from "react";
import { Button } from "@shared/components/Buttons";
import PhotoUpload from "@shared/components/PhotoUpload";
import TitleDescriptionForm from "@shared/components/TitleDescriptionForm";
import MultiSelect from "@shared/components/MultiSelect";
import { useCollectionForm } from "./hooks/useCollectionForm";
import { useCollectionActions } from "./hooks/useCollectionActions";

const CollectionForm: React.FC = () => {
  const {
    formData,
    originalData,
    onFormChange,
    isEditing,
    loading,
    navigate,
    recipeList,
    tagList,
    setRecipeSearch,
    setTagSearch,
    userId,
    collectionId,
  } = useCollectionForm();

  const { handleSave } = useCollectionActions(
    formData,
    isEditing,
    originalData,
    collectionId,
    userId
  );

  return (
    <div className="max-w-2xl mx-auto mt-4">
      <div className="w-full flex justify-end items-center mb-4 gap-4">
        <Button btnType="dismissable" onClick={() => navigate(-1)}>
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

      <div
        className={`bg-white dark:bg-gray-900 p-6 rounded-b-xl shadow-md ${
          !formData.img_url?.length && "rounded-t-xl"
        }`}
      >
        <TitleDescriptionForm
          title={formData.title!}
          description={formData.description!}
          onFormChange={onFormChange}
        />

        <div className="mb-4">
          <label
            htmlFor="Recipes"
            className="block text-xs font-semibold text-leaf-green-700 dark:text-leaf-green-300 mb-1.5"
          >
            Recipes
          </label>
          <MultiSelect
            placeholder="Search for recipes..."
            inputId="Recipes"
            options={recipeList}
            selectedOptions={formData.recipes!}
            setSelectedOptions={(selectedRecipes) =>
              onFormChange("recipes", selectedRecipes)
            }
            onSearch={setRecipeSearch}
          />
        </div>

        <div className="mb-2">
          <label
            htmlFor="Tags"
            className="block text-xs font-semibold text-leaf-green-700 dark:text-leaf-green-300 mb-1.5"
          >
            Tags
          </label>
          <MultiSelect
            placeholder="Search for tags..."
            inputId="Tags"
            options={tagList}
            selectedOptions={formData.tags!}
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
