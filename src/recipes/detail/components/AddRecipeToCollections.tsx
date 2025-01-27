import React, { useEffect, useState } from "react";
import MultiSelect from "@shared/components/MultiSelect";
import { Button } from "@shared/components/Buttons";
import { useModalManager } from "@shared/components/Modals";
import { useToast } from "@shared/components/Toast";
import CollectionService from "@shared/services/CollectionService";
import RecipeService from "@shared/services/RecipeService";
import { IdTitle } from "@shared/models/Tag";

interface AddRecipeToCollectionsModalProps {
  recipeId: string | undefined;
  collectionAdded: () => void;
}

const AddRecipeToCollectionsModal: React.FC<AddRecipeToCollectionsModalProps> = ({ recipeId, collectionAdded }) => {
  const { closeModal } = useModalManager();
  const toast = useToast();
  const [collections, setCollections] = useState<IdTitle[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<IdTitle[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await CollectionService.getList(
          0,
          25,
          searchTerm
        );
        if (response && response.data) {
          setCollections(response.data);
        }
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };
    fetchData();
  }, [searchTerm]);

  const handleSave = async () => {
    const idsToInsert = selectedOptions.map(o => o.id);
    if (recipeId && idsToInsert.length > 0) {
      try {
        await RecipeService.addOneToManyCollections(recipeId, idsToInsert);
        collectionAdded();
        toast.success("Recipe has been added to selected collection(s)!");
        closeModal();
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    }
  };

  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Save Recipe</h2>
      <MultiSelect
        inputId="collections"
        options={collections}
        selectedOptions={selectedOptions}
        placeholder="Select collections"
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

export default AddRecipeToCollectionsModal;
