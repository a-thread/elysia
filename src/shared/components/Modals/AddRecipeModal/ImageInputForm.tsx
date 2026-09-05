import React, { useState, FormEvent, ChangeEvent } from "react";
import { Button } from "../../Buttons";
import { importRecipeFromImages } from "./scrapeRecipeForDB";
import { useNavigate } from "react-router-dom";
import { FieldLabel } from "@shared/components/FormField";

interface ImageInputFormProps {
  onClose: () => void;
}

const MAX_IMAGES = 6;

const ImageInputForm: React.FC<ImageInputFormProps> = ({ onClose }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleFilesChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);
    setError(
      selected.length > MAX_IMAGES ? `You can import up to ${MAX_IMAGES} photos at a time.` : ""
    );
    setFiles(selected.slice(0, MAX_IMAGES));
  };

  const processRecipe = async () => {
    try {
      setIsLoading(true);
      const data = await importRecipeFromImages(files);
      navigate("/add-new", { state: { recipe: data } });
      onClose();
    } catch (error) {
      setError(
        "Failed to read the recipe from those photos. Please check the images and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (files.length === 0) {
      setError("Choose at least one photo of the recipe.");
      return;
    }
    await processRecipe();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex-1 flex flex-col gap-4 sm:gap-0 sm:space-y-4"
    >
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-sm">
          {error}
        </div>
      )}
      <p className="text-gray-800 dark:text-white">
        Import from photos of a handwritten or printed recipe — like a page from a family
        cookbook. Add more than one photo if the recipe spans multiple pages.
      </p>
      <div>
        <FieldLabel htmlFor="images">Recipe Photo(s)</FieldLabel>
        <input
          type="file"
          name="images"
          id="images"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={handleFilesChange}
          className="block w-full text-sm text-gray-800 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-leaf-green-100 file:text-leaf-green-700 hover:file:bg-leaf-green-200 dark:file:bg-leaf-green-900 dark:file:text-leaf-green-200"
        />
        {files.length > 0 && (
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            {files.length} photo{files.length > 1 ? "s" : ""} selected
          </p>
        )}
      </div>
      <div className="flex justify-end space-x-4 mt-auto">
        <Button type="button" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading}>
          Import
        </Button>
      </div>
    </form>
  );
};

export default ImageInputForm;
