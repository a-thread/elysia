import React, { useState, FormEvent, ChangeEvent } from "react";
import { Button } from "../../Buttons";
import { getRecipeFromScraper } from "./scrapeRecipeForDB";
import { useNavigate } from "react-router-dom";
import { useModalManager } from "../ModalManager";
import { FieldLabel, fieldClasses } from "@shared/components/FormField";

interface UrlInputFormProps {
  onCancel: () => void;
  onHtmlImportClick: () => void;
}

const UrlInputForm: React.FC<UrlInputFormProps> = ({
  onCancel,
  onHtmlImportClick,
}) => {
  const [url, setUrl] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { closeModal } = useModalManager();

  const fetchRecipe = async (recipeUrl: string) => {
    try {
      setIsLoading(true);
      const data = await getRecipeFromScraper(recipeUrl);
      navigate("/add-new", { state: { recipe: data } });
      closeModal();
      onCancel();
      setError(""); // Clear any previous error
    } catch (error) {
      setError(
        "Failed to fetch the recipe. Please check the URL and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      setError("URL cannot be empty.");
      return;
    }
    await fetchRecipe(url);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-sm">
          {error}
        </div>
      )}
      <p className="text-gray-800 dark:text-white">
        Import via URL supports many recipe sites, but not all. To import from
        non-supported sites, you can use the{" "}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onHtmlImportClick();
          }}
          className="text-blue-600 dark:text-blue-400 underline"
        >
          import via html
        </a>
        {" "}option.
      </p>
      <div>
        <FieldLabel htmlFor="url">Recipe URL</FieldLabel>
        <input
          type="text"
          name="url"
          id="url"
          className={fieldClasses}
          value={url}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setUrl(e.target.value)
          }
        />
      </div>
      <div className="flex justify-end space-x-4">
        <Button type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading}>
          Import
        </Button>
      </div>
    </form>
  );
};

export default UrlInputForm;
