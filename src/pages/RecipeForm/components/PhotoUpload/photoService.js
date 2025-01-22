import { supabase } from "../../../../shared/services/supabase";

// File upload helpers
const sanitizeFileName = (fileName) => {
  const extension = fileName.split(".").pop();
  const baseName = fileName
    .replace(/\.[^/.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9_\-.]/g, "")
    .replace(/\s+/g, "_");
  return `${baseName}_${Date.now()}_${Math.floor(
    Math.random() * 10000
  )}.${extension}`;
};

const addPhoto = async (file) => {
  try {
    const safeName = sanitizeFileName(file.name);
    const { error } = await supabase.storage
      .from("elysia_recipe_photo")
      .upload(safeName, file, { cacheControl: "3600", upsert: true });
    if (error) throw new Error(`Error uploading file: ${error.message}`);
    return getPhotoUrl(safeName);
  } catch (error) {
    console.error("Error in addPhoto:", error.message);
    throw error;
  }
};

const getPhotoUrl = (filePath) => {
  const { data, error } = supabase.storage
    .from("elysia_recipe_photo")
    .getPublicUrl(filePath);
  if (error) throw new Error("Failed to get public URL");
  return data.publicUrl;
};

const deletePhoto = async (imgUrl) => {
  const filePath = imgUrl.split("/").slice(-1)[0];
  return await supabase.storage.from("elysia_recipe_photo").remove([filePath]);
};

// Export recipe service
const PhotoService = {
  addPhoto,
  getPhotoUrl,
  deletePhoto,
};

export default PhotoService;
