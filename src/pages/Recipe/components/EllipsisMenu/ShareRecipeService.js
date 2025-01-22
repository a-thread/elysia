import { supabase } from "../../../../shared/services/supabase";

const fetchSharedUsers = async (recipeId) => {
  const { data, error } = await supabase
    .from("recipe_shares")
    .select("id, user_id, permission, users(email)")
    .eq("recipe_id", recipeId);

  if (error) {
    console.error("Error fetching shared users:", error);
    return [];
  }
  return data || [];
};

const fetchRecipeVisibility = async (recipeId) => {
  const { data, error } = await supabase
    .from("recipes")
    .select("is_public")
    .eq("id", recipeId)
    .single();

  if (error) {
    console.error("Error fetching recipe visibility:", error);
    return false;
  }
  return data.is_public;
};

const togglePublicShare = async (recipeId, isPublic) => {
  const { error } = await supabase
    .from("recipes")
    .update({ is_public: !isPublic })
    .eq("id", recipeId);

  if (error) {
    throw new Error("Failed to update public status.");
  }
  return !isPublic;
};

const findUserByEmail = async (email) => {
  const { data, error } = await supabase
    .from("users")
    .select("id, display_name, profile_image")
    .eq("email", email)
    .single();

  if (error || !data?.id) {
    throw new Error("User not found.");
  }
  
  return {
    ...data,
    display_name: data.display_name || email
  };
};


const shareRecipeWithUser = async (recipeId, userId, permission) => {
  const { error } = await supabase
    .from("recipe_shares")
    .insert([{ recipe_id: recipeId, user_id: userId, permission }]);

  if (error) {
    throw new Error("Failed to share recipe.");
  }
};

const revokeUserAccess = async (shareId) => {
  const { error } = await supabase
    .from("recipe_shares")
    .delete()
    .eq("id", shareId);

  if (error) {
    throw new Error("Failed to revoke access.");
  }
};

export const ShareService = {
    fetchRecipeVisibility,
    fetchSharedUsers,
    findUserByEmail,
    revokeUserAccess,
    shareRecipeWithUser,
    togglePublicShare,
} 