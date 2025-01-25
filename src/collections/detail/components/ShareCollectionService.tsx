import { supabase } from "@shared/services/supabase";

const fetchSharedUsers = async (collectionId: string) => {
  const { data, error } = await supabase
    .from("collection_to_users")
    .select("id, user_id, permission, users(email)")
    .eq("collection_id", collectionId);

  if (error) {
    console.error("Error fetching shared users:", error);
    return [];
  }
  return data || [];
};

const fetchCollectionVisibility = async (collectionId: string) => {
  const { data, error } = await supabase
    .from("collections")
    .select("is_public")
    .eq("id", collectionId)
    .single();

  if (error) {
    console.error("Error fetching collection visibility:", error);
    return false;
  }
  return data.is_public;
};

const togglePublicShare = async (collectionId: string, isPublic: boolean) => {
  const { error } = await supabase
    .from("collections")
    .update({ is_public: !isPublic })
    .eq("id", collectionId);

  if (error) {
    throw new Error("Failed to update public status.");
  }
  return !isPublic;
};

const findUserByEmail = async (email: string) => {
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


const shareCollectionWithUser = async (collectionId: string, userId: string, permission: string) => {
  const { error } = await supabase
    .from("collection_to_users")
    .insert([{ collection_id: collectionId, user_id: userId, permission }]);

  if (error) {
    throw new Error("Failed to share collection.");
  }
};

const revokeUserAccess = async (shareId: string) => {
  const { error } = await supabase
    .from("collection_to_users")
    .delete()
    .eq("id", shareId);

  if (error) {
    throw new Error("Failed to revoke access.");
  }
};

export const ShareCollectionService = {
    fetchCollectionVisibility,
    fetchSharedUsers,
    findUserByEmail,
    revokeUserAccess,
    shareCollectionWithUser,
    togglePublicShare,
} 