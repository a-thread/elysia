import React, { useState, FormEvent, ChangeEvent } from "react";
import { Button } from "../../Buttons";
import { getRecipeFromScraper } from "./scrapeRecipeForDB";
import { useNavigate } from "react-router-dom";
import { useModalManager } from "../ModalManager";

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
      <div className="relative z-0 w-full mb-5 group">
        <input
          type="text"
          name="url"
          id="url"
          className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-hidden focus:ring-0 focus:border-blue-600 peer"
          placeholder=" "
          value={url}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setUrl(e.target.value)
          }
        />
        <label
          htmlFor="url"
          className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:rtl:translate-x-1/4 peer-focus:rtl:left-auto peer-focus:text-blue-600 dark:peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
        >
          Recipe URL
        </label>
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
