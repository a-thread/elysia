import { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@shared/components/Toast";
import { Collection } from "@collections/models/Collection";
import CollectionService from "@collections/services/CollectionService";
import TagService from "@shared/services/TagService";
import RecipeService from "@recipes/services/RecipeService";
import FormUtils from "@shared/utils/form-field-helpers";
import { syncRelationship } from "@shared/utils/relationshipDiff";

export const useCollectionActions = (
  formData: Partial<Collection>,
  isEditing: boolean,
  originalData: Partial<Collection> | null,
  id?: string,
  userId?: string,
) => {
  const toast = useToast();
  const navigate = useNavigate();

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();

    try {
      if (!userId) {
        toast.error("User is not authenticated.");
        return;
      }

      // Use ID if editing; empty if adding
      let collectionId: string | null = id || "";

      // If editing, check for changes and update
      if (isEditing && collectionId && originalData) {
        const updatedFields = FormUtils.getChangedFields(
          originalData,
          formData,
        ) as Partial<Collection>;

        if (!updatedFields || Object.keys(updatedFields).length === 0) {
          toast.info("No changes detected.");
          return;
        }

        const simpleObject = FormUtils.extractSimpleValues(updatedFields);
        await CollectionService.upsert(collectionId, simpleObject);
        toast.success("Collection updated successfully!");
      } else {
        // if adding, create new collection
        const simpleObject = FormUtils.extractSimpleValues(formData);
        const response = await CollectionService.upsert(
          "",
          simpleObject,
          userId,
        );

        if (!response?.collectionId) {
          throw new Error("Failed to create collection.");
        }
        collectionId = response.collectionId;
        toast.success("Collection added successfully!");
      }

      // Sync tags
      await syncRelationship(
        originalData?.tags || [],
        formData.tags || [],
        (tags) => TagService.addToCollection(collectionId!, tags),
        (tags) => TagService.removeFromCollection(collectionId!, tags),
      );

      // Sync recipes
      await syncRelationship(
        originalData?.recipes || [],
        formData.recipes || [],
        (recipes) =>
          RecipeService.addManyToOneCollection(collectionId!, recipes),
        (recipes) =>
          RecipeService.removeManyFromManyCollections(
            [collectionId!],
            recipes.map((r) => r.id!),
          ),
      );

      // Navigate to the collection detail page after saving
      navigate(`/collections/${collectionId}`);
    } catch (error: any) {
      console.error(
        `Error ${isEditing ? "updating" : "adding"} collection:`,
        error.message,
      );
      toast.error(
        `Failed to ${isEditing ? "update" : "add"} collection. Please try again.`,
      );
    }
  };

  return { handleSave };
};
