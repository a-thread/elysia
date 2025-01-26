import { supabaseWithAbort } from "@shared/services/SupabaseWithAbort";

// File upload helpers
const sanitizeFileName = (fileName: string) => {
  const extension = fileName.split(".").pop();
  const baseName = fileName
    .replace(/\.[^/.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9_\-.]/g, "")
    .replace(/\s+/g, "_");
  return `${baseName}_${Date.now()}_${Math.floor(Math.random() * 10000)}.${extension}`;
};

const addPhoto = async (file: File) => {
  return await supabaseWithAbort.request("addPhoto", async (client) => {
    try {
      const safeName = sanitizeFileName(file.name);
      const { error } = await client.storage
        .from("elysia_recipe_photo")
        .upload(safeName, file, { cacheControl: "3600", upsert: true });
      if (error) throw new Error(`Error uploading file: ${error.message}`);
      return getPhotoUrl(safeName);
    } catch (error: any) {
      console.error("Error in addPhoto:", error.message);
      throw error;
    }
  });
};

const getPhotoUrl = (filePath: string) => {
  return supabaseWithAbort.request("getPhotoUrl", async (client) => {
    const { data } = client.storage.from("elysia_recipe_photo").getPublicUrl(filePath);
    if (!data) throw new Error("Failed to get public URL");
    return data.publicUrl;
  });
};

const deletePhoto = async (imgUrl: string) => {
  return await supabaseWithAbort.request("deletePhoto", async (client) => {
    const filePath = imgUrl.split("/").slice(-1)[0];
    return await client.storage.from("elysia_recipe_photo").remove([filePath]);
  });
};

// Export photo service
const PhotoService = {
  addPhoto,
  getPhotoUrl,
  deletePhoto,
};

export default PhotoService;
