import React, { useState, FormEvent, ChangeEvent } from "react";
import { Button } from "../../Buttons";
import { importRecipesFromPdf } from "./RecipeScraperService";
import { useNavigate } from "react-router-dom";
import { FieldLabel } from "@shared/components/FormField";

interface PdfInputFormProps {
  onClose: () => void;
}

const PdfInputForm: React.FC<PdfInputFormProps> = ({ onClose }) => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setError("");
    setFile(e.target.files?.[0] ?? null);
  };

  const processCookbook = async () => {
    if (!file) return;
    try {
      setIsLoading(true);
      const recipes = await importRecipesFromPdf(file);
      if (recipes.length === 0) {
        setError("No recipes were found in that PDF.");
        return;
      }
      navigate("/import-review", { state: { recipes } });
      onClose();
    } catch (error) {
      setError(
        "Failed to read recipes from that PDF. Please check the file and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Choose a cookbook PDF to import.");
      return;
    }
    await processCookbook();
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
        Import all recipes from a cookbook PDF. For best results, use a PDF with selectable text
        rather than a scan. You&apos;ll review the recipes before saving them.
      </p>
      <div>
        <FieldLabel htmlFor="cookbookPdf">Cookbook PDF</FieldLabel>
        <input
          type="file"
          name="cookbookPdf"
          id="cookbookPdf"
          accept="application/pdf"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-800 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-leaf-green-100 file:text-leaf-green-700 hover:file:bg-leaf-green-200 dark:file:bg-leaf-green-900 dark:file:text-leaf-green-200"
        />
        {file && (
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">{file.name} selected</p>
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

export default PdfInputForm;
