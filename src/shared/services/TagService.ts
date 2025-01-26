import { IdTitle } from "../models/Tag";
import { supabaseWithAbort } from "./SupabaseWithAbort";
import { TableNames } from "./TableNames";

const getList = async (
  currentSkip: number,
  currentPageSize: number,
  searchTerm: string
) => {
  return await supabaseWithAbort.request("getList", async (client) => {
    let query = client
      .from(TableNames.TAGS)
      .select("*", { count: "exact" })
      .range(currentSkip, currentSkip + currentPageSize - 1);

    if (searchTerm) {
      query = query.or(`title.ilike.%${searchTerm}%`);
    }

    const { data, count, error } = await query;
    if (error) throw new Error("Failed to fetch tags.");
    return { data, count };
  });
};

const upsert = async (tagId: string, updatedTag: IdTitle) => {
  return await supabaseWithAbort.request(
    `upsert-${tagId || "new"}`,
    async (client) => {
      let newTagId = tagId;
      if (!tagId) {
        const { data, error: insertError } = await client
          .from(TableNames.TAGS)
          .insert([{ title: updatedTag.title }])
          .select()
          .single();

        if (insertError)
          throw new Error(`Failed to insert new tag: ${insertError.message}`);
        newTagId = data.id;
      } else {
        if (Object.keys(updatedTag.title).length > 0) {
          const { error: updateError } = await client
            .from(TableNames.TAGS)
            .update(updatedTag)
            .eq("id", tagId);

          if (updateError)
            throw new Error(`Failed to update tag: ${updateError.message}`);
        }
      }
      return { success: true, tagId: newTagId };
    }
  );
};

const deleteById = async (tagId: string) => {
  return await supabaseWithAbort.request(
    `deleteById-${tagId}`,
    async (client) => {
      const { error } = await client
        .from(TableNames.TAGS)
        .delete()
        .eq("id", tagId);
      if (error) throw new Error("Failed to delete tag.");
    }
  );
};

const addToRecipe = async (recipeId: string, tags: IdTitle[]) => {
  return await supabaseWithAbort.request(
    `addToRecipe-${recipeId}`,
    async (client) => {
      const tagsToAdd = tags.map((tag) => ({
        recipe_id: recipeId,
        tag_id: tag.id,
      }));
      const { error } = await client
        .from(TableNames.RECIPE_TO_TAGS)
        .insert(tagsToAdd);
      if (error) throw new Error("Failed to add tag to recipe.");
      return { success: true };
    }
  );
};

const addToCollection = async (collectionId: string, tags: IdTitle[]) => {
  return await supabaseWithAbort.request(
    `addToCollection-${collectionId}`,
    async (client) => {
      const tagsToAdd = tags.map((tag) => ({
        collection_id: collectionId,
        tag_id: tag.id,
      }));
      const { error } = await client
        .from(TableNames.COLLECTION_TO_TAGS)
        .insert(tagsToAdd);
      if (error) throw new Error("Failed to add tag to recipe.");
      return { success: true };
    }
  );
};

const removeFromCollection = async (collection_id: string, tags: IdTitle[]) => {
  const tagIds = tags.map((tag) => tag.id);

  return await supabaseWithAbort.request(
    `removeManyFromCollection-${collection_id}`,
    async (client) => {
      const { error } = await client
        .from(TableNames.COLLECTION_TO_RECIPES)
        .delete()
        .eq("collection_id", collection_id)
        .in("tag_id", tagIds);

      if (error) throw new Error("Failed to remove tags from collection.");
    }
  );
};

const TagService = {
  addToRecipe,
  addToCollection,
  removeFromCollection,
  getList,
  upsert,
  deleteById,
};

export default TagService;
