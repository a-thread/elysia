import { Recipe } from "@recipes/models/Recipe";
import axios from "axios";

const API = import.meta.env.VITE_RECIPE_SCRAPER_API || "";

export async function getRecipeFromScraper(url: string): Promise<Recipe> {
  const res = await axios.get(`${API}?url=${encodeURIComponent(url)}`);
  return res.data;
}

export async function importRecipeFromImages(images: File[]): Promise<Recipe> {
  const formData = new FormData();
  images.forEach((image) => formData.append("images", image));
  const res = await axios.post(`${API}/import/images`, formData);
  return res.data;
}

export async function importRecipesFromPdf(file: File): Promise<Recipe[]> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await axios.post(`${API}/import/pdf/bulk`, formData);
  return res.data;
}
