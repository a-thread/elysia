import React from "react";
import PhotoUpload from "@shared/components/PhotoUpload";
import EditableSectionForm from "../form/components/EditableSectionForm";
import TitleDescriptionForm from "@shared/components/TitleDescriptionForm";
import RecipeDetailsForm from "@shared/components/RecipeDetailsForm";
import MultiSelect from "@shared/components/MultiSelect";
import Card from "@shared/components/Card";
import { FieldLabel } from "@shared/components/FormField";
import { Button } from "@shared/components/Buttons";
import { useModalManager } from "@shared/components/Modals/ModalManager";
import DeleteConfirmationModal from "@shared/components/Modals/DeleteConfirmationModal";
import { useImportReviewForm } from "./hooks/useImportReviewForm";
import { useImportReviewActions } from "./hooks/useImportReviewActions";

const ImportReview: React.FC = () => {
  const { openModal, closeModal } = useModalManager();
  const {
    recipes,
    currentIndex,
    formData,
    onFormChange,
    advance,
    collectionList,
    tagList,
    setCollectionSearch,
    setTagSearch,
    createTag,
  } = useImportReviewForm();

  const isLast = currentIndex >= recipes.length - 1;
  const { handleSaveAndNext, handleSkip, isLoading } = useImportReviewActions(
    formData,
    isLast,
    advance
  );

  if (recipes.length === 0) {
    return (
      <div className="max-w-3xl mx-auto mt-6 px-4">
        <p className="text-gray-800 dark:text-white">No recipes to review.</p>
      </div>
    );
  }

  const confirmSkip = () => {
    openModal(
      <DeleteConfirmationModal
        label="recipe"
        onCancelDelete={closeModal}
        onDelete={async () => {
          closeModal();
          handleSkip();
        }}
      />
    );
  };

  const progressPercent = ((currentIndex + 1) / recipes.length) * 100;

  return (
    <div className="max-w-3xl mx-auto mt-6 mb-16 px-4">
      <div className="w-full flex justify-between items-start gap-4 mb-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
            Review Imported Recipes
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Recipe {currentIndex + 1} of {recipes.length}
          </p>
        </div>
        <div className="flex items-center gap-2.5 mt-0.5">
          <Button btnType="delete" onClick={confirmSkip}>
            Discard
          </Button>
          <Button onClick={handleSaveAndNext} isLoading={isLoading}>
            {isLast ? "Save" : "Save & Next"}
          </Button>
        </div>
      </div>

      <div className="w-full h-1.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden mb-6">
        <div
          className="h-full bg-leaf-green-600 rounded-full transition-all"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

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

export default ImportReview;
