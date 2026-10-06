import { IdTitle } from "../models/Tag";
import { supabaseWithAbort } from "./SupabaseWithAbort";
import { TableNames } from "./TableNames";

const getList = async (
  currentSkip: number,
  currentPageSize: number,
  searchTerm: string
) => {
  return await supabaseWithAbort.request("tags-getList", async (client) => {
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

const create = async (title: string): Promise<IdTitle | null> => {
  const trimmedTitle = title.trim();
  if (!trimmedTitle) return null;

  return await supabaseWithAbort.request("tags-create", async (client) => {
    const { data, error } = await client
      .from(TableNames.TAGS)
      .insert([{ title: trimmedTitle }])
      .select()
      .single();

    if (error) throw new Error(`Failed to insert new tag: ${error.message}`);
    return { id: data.id, title: trimmedTitle };
  });
};

const addToRecipe = async (recipeId: string, tags: IdTitle[]) => {
  return await supabaseWithAbort.request(
    `addTagsToRecipe-${recipeId}`,
    async (client) => {
      const tagsToAdd = tags.map((tag) => ({
        recipe_id: recipeId,
        tag_id: tag.id,
      }));
      const { error } = await client
        .from(TableNames.RECIPE_TO_TAGS)
        .upsert(tagsToAdd, {
          onConflict: "recipe_id,tag_id",
          ignoreDuplicates: true,
        });
      if (error) throw new Error("Failed to add tags to recipe.");
      return { success: true };
    }
  );
};

const removeFromRecipe = async (recipe_id: string, tags: IdTitle[]) => {
  const tagIds = tags.map((tag) => tag.id);
  return await supabaseWithAbort.request(
    `removeTagsFromRecipe-${recipe_id}`,
    async (client) => {
      const { error } = await client
        .from(TableNames.RECIPE_TO_TAGS)
        .delete()
        .eq("recipe_id", recipe_id)
        .in("tag_id", tagIds);

      if (error) throw new Error("Failed to remove tags from recipe.");
    }
  );
};

const addToCollection = async (collectionId: string, tags: IdTitle[]) => {
  return await supabaseWithAbort.request(
    `addTagsToCollection-${collectionId}`,
    async (client) => {
      const tagsToAdd = tags.map((tag) => ({
        collection_id: collectionId,
        tag_id: tag.id,
      }));
      const { error } = await client
        .from(TableNames.COLLECTION_TO_TAGS)
        .upsert(tagsToAdd, {
          onConflict: "collection_id,tag_id",
          ignoreDuplicates: true,
        });
      if (error) throw new Error("Failed to add tags to collection.");
      return { success: true };
    }
  );
};

const removeFromCollection = async (collection_id: string, tags: IdTitle[]) => {
  const tagIds = tags.map((tag) => tag.id);

  return await supabaseWithAbort.request(
    `removeTagsFromCollection-${collection_id}`,
    async (client) => {
      const { error } = await client
        .from(TableNames.COLLECTION_TO_TAGS)
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
  removeFromRecipe,
  getList,
  create,
};

export default TagService;
