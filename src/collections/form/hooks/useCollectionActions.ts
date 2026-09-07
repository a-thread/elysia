import { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@shared/components/Toast";
import { Collection } from "@shared/models/Collection";
import CollectionService from "@shared/services/CollectionService";
import TagService from "@shared/services/TagService";
import RecipeService from "@shared/services/RecipeService";
import FormUtils from "@shared/utils/form-field-helpers";
import { syncRelationship } from "@shared/utils/relationshipDiff";

export const useCollectionActions = (
  formData: Partial<Collection>,
  isEditing: boolean,
  originalData: Partial<Collection> | null,
  id?: string,
  userId?: string
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

      let collectionId: string | null = id || ""; // Use ID if editing; empty if adding

      if (isEditing && collectionId && originalData) {
        // Compare to detect changes
        const updatedFields = FormUtils.getChangedFields(originalData, formData) as Partial<Collection>;

        if (!updatedFields || Object.keys(updatedFields).length === 0) {
          toast.info("No changes detected.");
          return;
        }

        const simpleObject = FormUtils.extractSimpleValues(updatedFields);
        await CollectionService.upsert(collectionId, simpleObject);
        toast.success("Collection updated successfully!");
      } else {
        // Adding new collection
        const simpleObject = FormUtils.extractSimpleValues(formData);
        const response = await CollectionService.upsert("", simpleObject, userId);

        if (!response?.collectionId) {
          throw new Error("Failed to create collection.");
        }
        collectionId = response.collectionId;
        toast.success("Collection added successfully!");
      }

      // Relationship updates (Tags & Recipes) — a fresh collection has no
      // originalData, so this simply adds everything selected.
      await syncRelationship(
        originalData?.tags || [],
        formData.tags || [],
        (tags) => TagService.addToCollection(collectionId!, tags),
        (tags) => TagService.removeFromCollection(collectionId!, tags)
      );

      await syncRelationship(
        originalData?.recipes || [],
        formData.recipes || [],
        (recipes) => RecipeService.addManyToOneCollection(collectionId!, recipes),
        (recipes) =>
          RecipeService.removeManyFromManyCollections(
            [collectionId!],
            recipes.map((r) => r.id!)
          )
      );

      navigate(`/collections/${collectionId}`);
    } catch (error: any) {
      console.error(`Error ${isEditing ? "updating" : "adding"} collection:`, error.message);
      toast.error(`Failed to ${isEditing ? "update" : "add"} collection. Please try again.`);
    }
  };

  return { handleSave };
};
