import React, { useEffect, useState } from "react";
import MultiSelect from "@shared/components/MultiSelect";
import { Button } from "@shared/components/Buttons";
import { useModalManager } from "@shared/components/Modals";
import { useToast } from "@shared/components/Toast";
import TagService from "@shared/services/TagService";
import { IdTitle } from "@shared/models/Tag";

interface AddTagsToRecipeModalProps {
  recipeId: string | undefined;
  tagAdded: () => void;
}

const AddTagsToRecipeModal: React.FC<AddTagsToRecipeModalProps> = ({ recipeId, tagAdded }) => {
  const { closeModal } = useModalManager();
  const toast = useToast();
  const [tags, setTags] = useState<IdTitle[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<IdTitle[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await TagService.getList(
          0,
          25,
          searchTerm
        );
        if (response && response.data) {
          setTags(response.data);
        }
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };
    fetchData();
  }, [searchTerm]);

  const handleCreateTag = async (title: string): Promise<IdTitle | null> => {
    try {
      const created = await TagService.create(title);
      if (created) {
        setTags((prev) => [...prev, created]);
      }
      return created;
    } catch (error: any) {
      console.error("Error creating tag:", error);
      toast.error(error.message || "Failed to create tag. Please try again.");
      return null;
    }
  };

  const handleSave = async () => {
    if (recipeId) {
      try {
        await TagService.addToRecipe(recipeId, selectedOptions);
        tagAdded();
        toast.success("Tags have been added to recipe!");
        closeModal();
      } catch (error: any) {
        console.error("Error associating tags:", error);
        toast.error(error.message || "Failed to add tags to recipe. Please try again.");
      }
    }
  };

  return (
    <>
      <h2 className="text-xl font-medium mb-4 text-leaf-green-900 dark:text-leaf-green-100">Add Tags</h2>
      <MultiSelect
        inputId="tags"
        options={tags}
        selectedOptions={selectedOptions}
        placeholder="Search or create a tag..."
        setSelectedOptions={(o) => setSelectedOptions(o)}
        onSearch={handleSearch}
        allowCreate
        onCreateOption={handleCreateTag}
      />
      <div className="flex justify-end mt-4">
        <Button btnType="secondary" onClick={closeModal}>
          Cancel
        </Button>
        <Button btnType="primary" onClick={handleSave} className="ml-2">
          Save
        </Button>
      </div>
    </>
  );
};

export default AddTagsToRecipeModal;
