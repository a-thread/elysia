import React, { useState, FormEvent, ChangeEvent } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { Button } from "../../Buttons";
import { parseRecipeFromHtml } from "./scrapeRecipeForDB";
import { useNavigate } from "react-router-dom";
import { FieldLabel, fieldClasses } from "@shared/components/FormField";

interface HtmlInputFormProps {
  onClose: () => void;
  /** HTML is a fallback reached from the URL tab, not a peer tab — this returns to it. */
  onBackToUrl: () => void;
}

const HtmlInputForm: React.FC<HtmlInputFormProps> = ({
  onClose,
  onBackToUrl,
}) => {
  const [htmlContent, setHtmlContent] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const processRecipe = async () => {
    try {
      setIsLoading(true);
      const data = await parseRecipeFromHtml(htmlContent);
      navigate("/add-new", { state: { recipe: data } });
      onClose();
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
    <form
      onSubmit={handleSubmit}
      className="flex-1 flex flex-col gap-4 sm:gap-0 sm:space-y-4"
    >
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-sm">
          {error}
        </div>
      )}
      <button
        type="button"
        onClick={onBackToUrl}
        className="flex items-center gap-1.5 text-xs font-semibold text-leaf-green-700 dark:text-leaf-green-300 hover:underline w-fit"
      >
        <FaArrowLeft className="w-2.5 h-2.5" />
        Back to URL
      </button>
      <p className="text-gray-800 dark:text-white">
        Paste the complete HTML source of a recipe page below. Copy it from your
        browser&apos;s page source, not the URL or plain-text recipe.
        You&apos;ll review it before saving.
      </p>
      <div>
        <FieldLabel htmlFor="htmlContent">HTML Content</FieldLabel>
        <textarea
          name="htmlContent"
          id="htmlContent"
          rows={6}
          className={`${fieldClasses} resize-none min-w-0`}
          placeholder="Paste HTML content here..."
          value={htmlContent}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
            setHtmlContent(e.target.value)
          }
        />
      </div>
      <div className="flex justify-end space-x-4 mt-auto">
        <Button type="button" onClick={onClose}>
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
