import React, { MouseEventHandler } from "react";
import { Button } from "@shared/components/Buttons";

interface FormActionBarProps {
  isEditing: boolean;
  isLoading?: boolean;
  onCancel: MouseEventHandler<HTMLButtonElement>;
  onSave: MouseEventHandler<HTMLButtonElement>;
}

const FormActionBar: React.FC<FormActionBarProps> = ({ isEditing, isLoading, onCancel, onSave }) => (
  <div className="w-full flex justify-between items-center mb-5 gap-4">
    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
      {isEditing ? "Edit Recipe" : "Add Recipe"}
    </h1>
    <div className="flex items-center gap-2.5">
      <Button btnType="dismissable" onClick={onCancel}>
        Cancel
      </Button>
      <Button onClick={onSave} isLoading={isLoading}>
        {isEditing ? "Save" : "Add"}
      </Button>
    </div>
  </div>
);

export default FormActionBar;
