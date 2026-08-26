import React from "react";
import PhotoUpload from "@shared/components/PhotoUpload";
import TitleDescriptionForm from "@shared/components/TitleDescriptionForm";
import MultiSelect from "@shared/components/MultiSelect";
import { useCollectionForm } from "./hooks/useCollectionForm";
import { useCollectionActions } from "./hooks/useCollectionActions";
import Card from "@shared/components/Card";
import { FieldLabel } from "@shared/components/FormField";
import FormActionBar from "@shared/components/FormActionBar";

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
      <FormActionBar
        isEditing={isEditing}
        isLoading={loading}
        onCancel={() => navigate(-1)}
        onSave={handleSave}
      />

      {/* Photo Upload */}
      <PhotoUpload
        imgUrl={formData.img_url}
        onImgUrlChange={(url) => onFormChange("img_url", url)}
      />

      <Card hasImageAbove={!!formData.img_url?.length}>
        <TitleDescriptionForm
          title={formData.title!}
          description={formData.description!}
          onFormChange={onFormChange}
        />

        <div className="mb-4">
          <FieldLabel htmlFor="Recipes">Recipes</FieldLabel>
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
          <FieldLabel htmlFor="Tags">Tags</FieldLabel>
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
      </Card>
    </div>
  );
};

export default CollectionForm;
