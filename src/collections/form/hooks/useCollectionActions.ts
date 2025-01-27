import { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@shared/components/Toast";
import { Collection } from "@shared/models/Collection";
import CollectionService from "@shared/services/CollectionService";
import TagService from "@shared/services/TagService";
import RecipeService from "@shared/services/RecipeService";
import FormUtils from "@shared/utils/form-field-helpers";

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

        // Handle relationship updates (Tags & Recipes)
        await handleTagChanges(collectionId, originalData.tags || [], formData.tags || []);
        await handleRecipeChanges(collectionId, originalData.recipes || [], formData.recipes || []);
      } else {
        // Adding new collection
        const simpleObject = FormUtils.extractSimpleValues(formData);
        const response = await CollectionService.upsert("", simpleObject, userId);

        if (!response?.collectionId) {
          throw new Error("Failed to create collection.");
        }
        collectionId = response.collectionId;

        // Since this is a new collection, just add all selected tags & recipes
        if (formData.tags && formData.tags.length > 0) {
          await TagService.addToCollection(collectionId, formData.tags);
        }

        if (formData.recipes && formData.recipes.length > 0) {
          await RecipeService.addManyToOneCollection(collectionId, formData.recipes);
        }

        toast.success("Collection added successfully!");
      }

      navigate(`/collections/${collectionId}`);
    } catch (error: any) {
      console.error(`Error ${isEditing ? "updating" : "adding"} collection:`, error.message);
      toast.error(`Failed to ${isEditing ? "update" : "add"} collection. Please try again.`);
    }
  };

  return { handleSave };
};

/**
 * Handles changes in Tags (adds new ones, removes deleted ones).
 */
const handleTagChanges = async (collectionId: string, originalTags: any[], updatedTags: any[]) => {
  const tagsToAdd = updatedTags.filter(tag => !originalTags.some((origTag) => origTag.id === tag.id));
  const tagsToRemove = originalTags.filter(origTag => !updatedTags.some(tag => tag.id === origTag.id));

  if (tagsToAdd.length > 0) {
    await TagService.addToCollection(collectionId, tagsToAdd);
  }

  if (tagsToRemove.length > 0) {
    await TagService.removeFromCollection(collectionId, tagsToRemove);
  }
};

/**
 * Handles changes in Recipes (adds new ones, removes deleted ones).
 */
const handleRecipeChanges = async (collectionId: string, originalRecipes: any[], updatedRecipes: any[]) => {
  const recipesToAdd = updatedRecipes.filter(recipe => !originalRecipes.some(origRecipe => origRecipe.id === recipe.id));
  const recipesToRemove = originalRecipes.filter(origRecipe => !updatedRecipes.some(recipe => recipe.id === origRecipe.id));

  if (recipesToAdd.length > 0) {
    await RecipeService.addManyToOneCollection(collectionId, recipesToAdd);
  }

  if (recipesToRemove.length > 0) {
    await RecipeService.removeManyFromManyCollections([collectionId], recipesToRemove);
  }
};
