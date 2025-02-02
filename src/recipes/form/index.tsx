import React from "react";
import { useNavigate } from "react-router-dom";
import PhotoUpload from "../../shared/components/PhotoUpload";
import EditableSectionForm from "./components/EditableSectionForm";
import { Button } from "@shared/components/Buttons";
import TitleDescriptionForm from "@shared/components/TitleDescriptionForm";
import RecipeDetailsForm from "@shared/components/RecipeDetailsForm";
import { useRecipeForm } from "./hooks/useRecipeForm";
import { useRecipeActions } from "./hooks/useRecipeActions";
import MultiSelect from "@shared/components/MultiSelect";

const RecipeForm: React.FC = () => {
  const navigate = useNavigate();
  const {
    formData,
    originalData,
    onFormChange,
    isEditing,
    id,
    collectionList,
    tagList,
    setCollectionSearch,
    setTagSearch,
  } = useRecipeForm();
  const { handleSave, isLoading } = useRecipeActions(
    formData,
    originalData,
    isEditing,
    id
  );

  return (
    <div className="max-w-2xl mx-auto mt-4">
      <div className="w-full flex justify-end items-center mb-4 gap-4">
        <Button btnType="dismissable" onClick={() => navigate(-1)}>
          Cancel
        </Button>
        <Button onClick={handleSave} isLoading={isLoading}>
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
        />

        <EditableSectionForm
          originalFormState={formData.steps}
          setOriginalFormState={(e) => onFormChange("steps", e)}
          sectionName="Step"
        />

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
            selectedOptions={formData.tags || []}
            setSelectedOptions={(selectedTags) =>
              onFormChange("tags", selectedTags)
            }
            onSearch={setTagSearch}
          />
        </div>

        <div className="mb-2">
          <label
            htmlFor="Collections"
            className="peer-focus:font-medium text-sm text-gray-500 dark:text-gray-400 mb-2"
          >
            Collections
          </label>
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
      </div>
    </div>
  );
};

export default RecipeForm;
