import { supabase } from "./supabase";

const fetchCollectionDetails = async (collectionId, userId) => {
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
          tags:tags!collection_to_tags_tag_id_fkey(id, name)
        ),
        collection_shares!left(permission)
        `
      )
      .eq("id", collectionId)
      .maybeSingle();

    if (userId) {
      query = query.or(`is_public.eq.true,user_id.eq.${userId}`);
    } else {
      query = query.eq("is_public", true);
    }

    const { data, error } = await query;
    if (error) throw new Error("Failed to fetch collection details.");

    // Extract unique recipes (directly added & via tags)
    let directRecipes = data?.collection_items?.map((item) => item.recipes) || [];
    let taggedRecipes = data?.collection_tagged_recipes?.map((item) => item.recipes) || [];

    // Extract unique tags
    let tags = data?.collection_to_tags?.map((item) => item.tags) || [];

    // Remove duplicate recipes
    let uniqueRecipes = Array.from(
      new Map([...directRecipes, ...taggedRecipes].map((r) => [r.id, r])).values()
    );

    return {
      ...data,
      recipes: uniqueRecipes,
      tags, // Now includes associated tags
      can_edit:
        data.user_id === userId ||
        (data.collection_shares && data.collection_shares.permission === "edit"),
    };
  } catch (error) {
    console.error("Error fetching collection details:", error.message);
    return null;
  }
};

const upsertCollection = async (collectionId, updatedCollection, userId = null) => {
  try {
    let newCollectionId = collectionId;

    if (!collectionId || collectionId === 0) {
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

      if (insertError) throw new Error(`Failed to insert new collection: ${insertError.message}`);
      newCollectionId = data.id;
    } else {
      const updatePayload = {};
      ["title", "description", "img_url", "is_public"].forEach((field) => {
        if (updatedCollection[field]) updatePayload[field] = updatedCollection[field];
      });

      if (Object.keys(updatePayload).length > 0) {
        const { error: updateError } = await supabase
          .from("collections")
          .update(updatePayload)
          .eq("id", collectionId);

        if (updateError) throw new Error(`Failed to update collection: ${updateError.message}`);
      }
    }

    // Update associated recipes and tags
    await updateCollectionRecipes(newCollectionId, updatedCollection.recipes);
    await updateCollectionTags(newCollectionId, updatedCollection.tags);

    return { success: true, collectionId: newCollectionId };
  } catch (error) {
    console.error("Error updating or inserting collection:", error.message);
    throw error;
  }
};

const updateCollectionRecipes = async (collectionId, recipes) => {
  await supabase.from("collection_items").delete().eq("collection_id", collectionId);

  if (recipes.length > 0) {
    const recipeEntries = recipes.map((recipe) => ({
      collection_id: collectionId,
      recipe_id: recipe.id,
    }));

    await supabase.from("collection_items").insert(recipeEntries);
  }
};

const updateCollectionTags = async (collectionId, tags) => {
  await supabase.from("collection_to_tags").delete().eq("collection_id", collectionId);

  if (tags.length > 0) {
    const tagEntries = tags.map((tag) => ({
      collection_id: collectionId,
      tag_id: tag.id,
    }));

    await supabase.from("collection_to_tags").insert(tagEntries);
  }
};

const deleteCollection = async (collectionId) => {
  try {
    const { error } = await supabase
      .from("collections")
      .delete()
      .eq("id", collectionId);
    if (error) throw new Error("Failed to delete collection.");
  } catch (error) {
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
