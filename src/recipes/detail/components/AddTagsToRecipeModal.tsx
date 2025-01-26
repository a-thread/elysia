import React, { useEffect, useState } from "react";
import MultiSelect from "@shared/components/MultiSelect";
import { Button } from "@shared/components/Buttons";
import { useModalManager } from "@shared/components/Modals";
import { useToast } from "@shared/components/Toast";
import TagService from "@shared/services/TagService";
import { Tag } from "@shared/models/Tag";

interface AddTagsToRecipeModalProps {
  recipeId: string | undefined;
}

const AddTagsToRecipeModal: React.FC<AddTagsToRecipeModalProps> = ({ recipeId }) => {
  const { closeModal } = useModalManager();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<Tag[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
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
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [searchTerm]);

  const handleSave = async () => {
    if (recipeId) {
      try {
        await TagService.addToRecipe(recipeId, selectedOptions);
        toast.success("Tags have been added to recipe!");
        closeModal();
      } catch (error) {
        console.error("Error associating tags:", error);
      }
    }
  };

  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Save Recipe</h2>
      <MultiSelect
        isLoading={isLoading}
        inputId="tags"
        options={tags}
        selectedOptions={selectedOptions}
        placeholder="Select tags"
        setSelectedOptions={(o) => setSelectedOptions(o)}
        onSearch={handleSearch}
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
