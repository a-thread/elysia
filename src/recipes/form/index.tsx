import React from "react";
import { Link } from "react-router-dom";
import PhotoUpload from "../../shared/components/PhotoUpload";
import EditableSectionForm from "./components/EditableSectionForm";
import { Button } from "@shared/components/Buttons";
import TitleDescriptionForm from "@shared/components/TitleDescriptionForm";
import RecipeDetailsForm from "@shared/components/RecipeDetailsForm";
import { useRecipeForm } from "./hooks/useRecipeForm";
import { useRecipeActions } from "./hooks/useRecipeActions";

const RecipeForm: React.FC = () => {
  const { formData, originalData, onFormChange, isEditing, id, loading } =
    useRecipeForm();
  const { handleSave } = useRecipeActions(
    formData,
    originalData,
    isEditing,
    id
  );

  return (
    <div className="max-w-2xl mx-auto mt-4">
      <div className="w-full flex justify-end items-center mb-4 gap-4">
        <Link to={isEditing ? `/recipes/${id}` : "/"}>
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
      </div>
    </div>
  );
};

export default RecipeForm;
