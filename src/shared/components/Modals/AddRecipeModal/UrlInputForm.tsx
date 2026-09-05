import React, { useState, FormEvent, ChangeEvent } from "react";
import { Button } from "../../Buttons";
import { getRecipeFromScraper } from "./scrapeRecipeForDB";
import { useNavigate } from "react-router-dom";
import { FieldLabel, fieldClasses } from "@shared/components/FormField";

interface UrlInputFormProps {
  onClose: () => void;
  onSwitchToHtml: () => void;
}

const UrlInputForm: React.FC<UrlInputFormProps> = ({
  onClose,
  onSwitchToHtml,
}) => {
  const [url, setUrl] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const fetchRecipe = async (recipeUrl: string) => {
    try {
      setIsLoading(true);
      const data = await getRecipeFromScraper(recipeUrl);
      navigate("/add-new", { state: { recipe: data } });
      onClose();
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
        Import via URL supports many recipe sites, but not all. To import from
        non-supported sites, you can use the{" "}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onSwitchToHtml();
          }}
          className="text-blue-600 dark:text-blue-400 underline"
        >
          import via html
        </a>{" "}
        option.
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

export default UrlInputForm;
