import React, { ChangeEvent } from "react";

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
        <label htmlFor="title" className="block text-xs font-semibold text-leaf-green-700 dark:text-leaf-green-300 mb-1.5">
          Title
        </label>
        <input
          type="text"
          name="title"
          id="title"
          className="block w-full text-sm text-gray-900 dark:text-white bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 focus:outline-hidden focus:ring-2 focus:ring-leaf-green-200 dark:focus:ring-leaf-green-800 focus:border-leaf-green-500"
          value={title}
          onChange={(e: ChangeEvent<HTMLInputElement>) => onFormChange("title", e.target.value)}
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="description" className="block text-xs font-semibold text-leaf-green-700 dark:text-leaf-green-300 mb-1.5">
          Description
        </label>
        <textarea
          name="description"
          id="description"
          rows={2}
          className="block w-full text-sm text-gray-900 dark:text-white bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 focus:outline-hidden focus:ring-2 focus:ring-leaf-green-200 dark:focus:ring-leaf-green-800 focus:border-leaf-green-500 resize-none"
          value={description}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onFormChange("description", e.target.value)}
          required
        ></textarea>
      </div>
    </div>
  );
};

export default TitleDescriptionForm;
