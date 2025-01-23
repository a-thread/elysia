import React, { ChangeEvent } from "react";
import { TitleDescriptionImgUrl } from "../models/TitleDescriptionImgUrl";

// Define prop types
interface TitleDescriptionFormProps {
  formData: TitleDescriptionImgUrl;
  onFormChange: (key: "title" | "description", value: string) => void;
}

const TitleDescriptionForm: React.FC<TitleDescriptionFormProps> = ({ formData, onFormChange }) => {
  return (
    <form className="w-full">
      {/* Title Input */}
      <div className="relative z-0 w-full mb-5 group">
        <input
          type="text"
          name="title"
          id="title"
          className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-hidden focus:ring-0 focus:border-blue-600 peer"
          placeholder=" "
          value={formData.title}
          onChange={(e: ChangeEvent<HTMLInputElement>) => onFormChange("title", e.target.value)}
          required
        />
        <label
          htmlFor="title"
          className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
        >
          Title
        </label>
      </div>

      {/* Description Input */}
      <div className="relative z-0 w-full mb-5 group">
        <textarea
          name="description"
          id="description"
          className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-hidden focus:ring-0 focus:border-blue-600 peer"
          placeholder=" "
          value={formData.description}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onFormChange("description", e.target.value)}
          required
        ></textarea>
        <label
          htmlFor="description"
          className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
        >
          Description
        </label>
      </div>
    </form>
  );
};

export default TitleDescriptionForm;
