import { Button } from "@shared/components/Buttons";
import { useToast } from "@shared/components/Toast";
import { IdTitle } from "@shared/models/Tag";
import TagService from "@shared/services/TagService";
import RecipeService from "@shared/services/RecipeService";
import React, { ChangeEvent, useState } from "react";

interface AddTagModalProps {
  onCancel: () => void;
  onAddTag: () => void;
}

const AddTagModal: React.FC<AddTagModalProps> = ({ onCancel, onAddTag }) => {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const toast = useToast();

  const onTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleAddTag = async () => {
    setLoading(true);
    try {
      const newTag: IdTitle = { id: Date.now().toString(), title: title };
      const response = await TagService.upsert("", newTag);
      if (response?.success) {
        await RecipeService.refreshRecipeSearch();
        toast.success("Tag added successfully!")
        onAddTag();
      }
    } catch (error) {
      console.error("Add tag failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-center text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
        Add New Tag
      </h2>
      <form className="w-full">
        {/* Title Input */}
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="text"
            name="title"
            id="title"
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-hidden focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            value={title}
            onChange={onTitleChange}
            required
          />
          <label
            htmlFor="title"
            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:rtl:translate-x-1/4 peer-focus:rtl:left-auto peer-focus:text-blue-600 dark:peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Title
          </label>
        </div>
      </form>
      <div className="flex justify-end space-x-4 pt-2">
        <Button btnType="dismissable" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button onClick={handleAddTag} disabled={loading}>
          Add Tag
        </Button>
      </div>
    </div>
  );
};

export default AddTagModal;
