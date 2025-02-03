import React, { useState, FormEvent, ChangeEvent } from "react";
import { Button } from "../../Buttons";
import { parseRecipeFromHtml } from "./scrapeRecipeForDB";
import { useNavigate } from "react-router-dom";
import { useModalManager } from "@shared/components/Modals";

interface HtmlInputFormProps {
  onCancel: () => void;
}

const HtmlInputForm: React.FC<HtmlInputFormProps> = ({ onCancel }) => {
  const [htmlContent, setHtmlContent] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { closeModal } = useModalManager();

  const processRecipe = async () => {
    try {
      setIsLoading(true);
      const data = await parseRecipeFromHtml(htmlContent);
      navigate("/add-new", { state: { recipe: data } });
      onCancel();
      closeModal();
      setError("");
    } catch (error) {
      setError("Failed to process the recipe. Please check the HTML content.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!htmlContent.trim()) {
      setError("HTML content cannot be empty.");
      return;
    }
    await processRecipe();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-sm">
          {error}
        </div>
      )}
      <div className="relative z-0 w-full mb-5 group">
        <textarea
          name="htmlContent"
          id="htmlContent"
          rows={6}
          className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-hidden focus:ring-0 focus:border-blue-600 peer"
          placeholder="Paste HTML content here..."
          value={htmlContent}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
            setHtmlContent(e.target.value)
          }
        />
      </div>
      <div className="flex justify-end space-x-4">
        <Button type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading}>
          Process
        </Button>
      </div>
    </form>
  );
};

export default HtmlInputForm;
