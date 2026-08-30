import React, { useState, FormEvent, ChangeEvent } from "react";
import { Button } from "../../Buttons";
import { parseRecipeFromHtml } from "./scrapeRecipeForDB";
import { useNavigate } from "react-router-dom";
import { useModalManager } from "@shared/components/Modals";
import { FieldLabel, fieldClasses } from "@shared/components/FormField";

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
      const data = await parseRecipeFromHtml(htmlContent, '');
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
      <div>
        <FieldLabel htmlFor="htmlContent">HTML Content</FieldLabel>
        <textarea
          name="htmlContent"
          id="htmlContent"
          rows={6}
          className={`${fieldClasses} resize-none`}
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
