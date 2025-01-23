import { Recipe } from "@shared/models/Recipe";
import { supabase } from "./supabase";
import { Collection } from "@shared/models/Collection";
import { Tag } from "@shared/models/Tag";

const fetchCollectionDetails = async (collectionId: string, userId: string) => {
  try {
    let query = supabase
      .from("collections")
      .select(
        `
        id, title, description, img_url, is_public, user_id,
        collection_items!left(
          recipe_id,
          recipes!inner(id, title, description, img_url, user_id, is_public)
        ),
        collection_tagged_recipes!left(
          recipe_id,
          recipes!inner(id, title, description, img_url, user_id, is_public)
        ),
        collection_to_tags!left(
          tag_id,
          tags:tags!collection_to_tags_tag_id_fkey(id, title)
        ),
        collection_shares!left(permission)
        `
      )
      .eq("id", collectionId);

    if (userId) {
      query = query.or(`is_public.eq.true,user_id.eq.${userId}`);
    } else {
      query = query.eq("is_public", true);
    }

    const { data, error } = await query.maybeSingle();
    if (error) throw new Error("Failed to fetch collection details.");

    // Extract unique recipes (directly added & via tags)
    const directRecipes =
      data?.collection_items?.map((item) => item.recipes) || [];
    const taggedRecipes =
      data?.collection_tagged_recipes?.map((item) => item.recipes) || [];
      const uniqueRecipes = Array.from(
        new Map(
          [...directRecipes, ...taggedRecipes].map((r: any) => [r.id, r])
        ).values()
      );

    // Extract unique tags
    const tags: Tag[] = data?.collection_to_tags?.flatMap((item) => item.tags) || [];

    if (!data) {
      throw new Error("no data returned");
    }

    return{
      ...data,
      recipes: uniqueRecipes,
      tags, // Now includes associated tags
      can_edit:
        data.user_id === userId ||
        (data.collection_shares &&
          data.collection_shares.some(
            (share: any) => share.permission === "edit"
          )),
    } as Collection;
  } catch (error: any) {
    console.error("Error fetching collection details:", error.message);
    return null;
  }
};

const upsertCollection = async (
  collectionId: string,
  updatedCollection: Collection,
  userId?: string | undefined
) => {
  try {
    let newCollectionId = collectionId;

    if (!collectionId) {
      const { data, error: insertError } = await supabase
        .from("collections")
        .insert([
          {
            title: updatedCollection.title,
            description: updatedCollection.description,
            img_url: updatedCollection.img_url,
            is_public: updatedCollection.is_public,
            user_id: userId,
          },
        ])
        .select("*")
        .single();

      if (insertError)
        throw new Error(
          `Failed to insert new collection: ${insertError.message}`
        );
      newCollectionId = data.id;
    } else {
      const updatePayload = {} as Partial<Collection>;
      (
        ["title", "description", "img_url", "is_public"] as (keyof Collection)[]
      ).forEach((field) => {
        if (updatedCollection[field]) {
          updatePayload[field] = updatedCollection[field] as any;
        }
      });

      if (Object.keys(updatePayload).length > 0) {
        const { error: updateError } = await supabase
          .from("collections")
          .update(updatePayload)
          .eq("id", collectionId);

        if (updateError)
          throw new Error(
            `Failed to update collection: ${updateError.message}`
          );
      }
    }

    // Update associated recipes and tags
    await updateCollectionRecipes(newCollectionId, updatedCollection.recipes);
    await updateCollectionTags(newCollectionId, updatedCollection.tags);

    return { success: true, collectionId: newCollectionId };
  } catch (error: any) {
    console.error("Error updating or inserting collection:", error.message);
    throw error;
  }
};

const updateCollectionRecipes = async (
  collectionId: string,
  recipes: Recipe[]
) => {
  await supabase
    .from("collection_items")
    .delete()
    .eq("collection_id", collectionId);

  if (recipes.length > 0) {
    const recipeEntries = recipes.map((recipe) => ({
      collection_id: collectionId,
      recipe_id: recipe.id,
    }));

    await supabase.from("collection_items").insert(recipeEntries);
  }
};

const updateCollectionTags = async (collectionId: string, tags: Tag[]) => {
  await supabase
    .from("collection_to_tags")
    .delete()
    .eq("collection_id", collectionId);

  if (tags.length > 0) {
    const tagEntries = tags.map((tag) => ({
      collection_id: collectionId,
      tag_id: tag.id,
    }));

    await supabase.from("collection_to_tags").insert(tagEntries);
  }
};

const deleteCollection = async (collectionId: string) => {
  try {
    const { error } = await supabase
      .from("collections")
      .delete()
      .eq("id", collectionId);
    if (error) throw new Error("Failed to delete collection.");
  } catch (error: any) {
    console.error("Error deleting collection:", error.message);
    throw error;
  }
};

const CollectionService = {
  fetchCollectionDetails,
  upsertCollection,
  deleteCollection,
};

export default CollectionService;
