import React from "react";
import { useNavigate } from "react-router-dom";
import PhotoUpload from "../../shared/components/PhotoUpload";
import EditableSectionForm from "./components/EditableSectionForm";
import TitleDescriptionForm from "@shared/components/TitleDescriptionForm";
import RecipeDetailsForm from "@shared/components/RecipeDetailsForm";
import { useRecipeForm } from "./hooks/useRecipeForm";
import { useRecipeActions } from "./hooks/useRecipeActions";
import MultiSelect from "@shared/components/MultiSelect";
import Card from "@shared/components/Card";
import { FieldLabel } from "@shared/components/FormField";
import FormActionBar from "@shared/components/FormActionBar";

const RecipeForm: React.FC = () => {
  const navigate = useNavigate();
  const {
    formData,
    onFormChange,
    isEditing,
    id,
    collectionList,
    tagList,
    setCollectionSearch,
    setTagSearch,
    createTag,
  } = useRecipeForm();
  const { handleSave, isLoading } = useRecipeActions(
    formData,
    isEditing,
    id
  );

  return (
    <div className="max-w-3xl mx-auto mt-6 mb-16 px-4">
      <FormActionBar
        isEditing={isEditing}
        isLoading={isLoading}
        onCancel={() => navigate(-1)}
        onSave={handleSave}
        resourceName="Recipe"
      />
      <PhotoUpload
        imgUrl={formData.img_url}
        onImgUrlChange={(url) => onFormChange("img_url", url)}
      />
      <Card hasImageAbove={!!formData.img_url?.length} className="p-7">
        <TitleDescriptionForm
          title={formData.title}
          description={formData.description!}
          onFormChange={onFormChange}
        />
        <RecipeDetailsForm formData={formData} onFormChange={onFormChange} />

        <EditableSectionForm
          originalFormState={formData.ingredients}
          setOriginalFormState={(e) => onFormChange("ingredients", e)}
          sectionName="Ingredient"
          enableGrouping
        />

        <EditableSectionForm
          originalFormState={formData.steps}
          setOriginalFormState={(e) => onFormChange("steps", e)}
          sectionName="Step"
        />

        <div className="mb-4">
          <FieldLabel htmlFor="Tags">Tags</FieldLabel>
          <MultiSelect
            placeholder="Search or create a tag..."
            inputId="Tags"
            options={tagList}
            selectedOptions={formData.tags || []}
            setSelectedOptions={(selectedTags) =>
              onFormChange("tags", selectedTags)
            }
            onSearch={setTagSearch}
            allowCreate
            onCreateOption={createTag}
          />
        </div>

        <div className="mb-2">
          <FieldLabel htmlFor="Collections">Collections</FieldLabel>
          <MultiSelect
            placeholder="Search for collections..."
            inputId="Collections"
            options={collectionList}
            selectedOptions={formData.collections || []}
            setSelectedOptions={(selectedCollections) =>
              onFormChange("collections", selectedCollections)
            }
            onSearch={setCollectionSearch}
          />
        </div>
      </Card>
    </div>
  );
};

export default RecipeForm;
