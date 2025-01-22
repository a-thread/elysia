import { supabase } from "./supabase";

const fetchTagList = async (currentSkip, currentPageSize, searchTerm) => {
  try {
    let query = supabase
      .from("tags")
      .select("*", { count: "exact" })
      .range(currentSkip, currentSkip + currentPageSize - 1);

    if (searchTerm) {
      query = query.or(`name.ilike.%${searchTerm}%`);
    }

    const { data, count, error } = await query;

    if (error) throw new Error("Failed to fetch tags.");

    return { data, count };
  } catch (error) {
    console.error("Error fetching tag list:", error.message);
    return null;
  }
};

const upsertTag = async (tagId, updatedTag, userId = null) => {
  try {
    let newTagId = tagId;
    if (!tagId || tagId === 0) {
      const { data, error: insertError } = await supabase
        .from("tags")
        .insert([
          {
            name: updatedTag.name,
          },
        ])
        .select()
        .single();

      if (insertError)
        throw new Error(`Failed to insert new tag: ${insertError.message}`);
      newTagId = data.id;
    } else {
      if (Object.keys(updatedTag.name).length > 0) {
        const { error: updateError } = await supabase
          .from("tags")
          .update(updatedTag)
          .eq("id", tagId);

        if (updateError)
          throw new Error(`Failed to update tag: ${updateError.message}`);
      }
    }
    return { success: true, tagId: newTagId };
  } catch (error) {
    console.error("Error updating or inserting tag:", error.message);
    throw error;
  }
};

// Delete a tag
const deleteTag = async (tagId) => {
  try {
    const { error } = await supabase.from("tags").delete().eq("id", tagId);
    if (error) throw new Error("Failed to delete tag.");
  } catch (error) {
    console.error("Error deleting tag:", error.message);
    throw error;
  }
};

const TagService = {
  fetchTagList,
  upsertTag,
  deleteTag,
};

export default TagService;
