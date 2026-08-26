import React, { ChangeEvent } from "react";
import { FieldLabel, fieldClasses } from "./FormField";

// Define prop types
interface TitleDescriptionFormProps {
  title: string;
  description: string;
  onFormChange: (key: "title" | "description", value: string) => void;
}

const TitleDescriptionForm: React.FC<TitleDescriptionFormProps> = ({ title, description, onFormChange }) => {
  return (
    <div className="w-full">
      <div className="mb-4">
        <FieldLabel htmlFor="title">Title</FieldLabel>
        <input
          type="text"
          name="title"
          id="title"
          className={fieldClasses}
          value={title}
          onChange={(e: ChangeEvent<HTMLInputElement>) => onFormChange("title", e.target.value)}
          required
        />
      </div>

      <div className="mb-4">
        <FieldLabel htmlFor="description">Description</FieldLabel>
        <textarea
          name="description"
          id="description"
          rows={2}
          className={`${fieldClasses} resize-none`}
          value={description}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onFormChange("description", e.target.value)}
          required
        ></textarea>
      </div>
    </div>
  );
};

export default TitleDescriptionForm;
