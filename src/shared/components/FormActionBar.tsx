import React, { MouseEventHandler } from "react";
import { Button } from "@shared/components/Buttons";

interface FormActionBarProps {
  isEditing: boolean;
  isLoading?: boolean;
  onCancel: MouseEventHandler<HTMLButtonElement>;
  onSave: MouseEventHandler<HTMLButtonElement>;
}

const FormActionBar: React.FC<FormActionBarProps> = ({ isEditing, isLoading, onCancel, onSave }) => (
  <div className="w-full flex justify-end items-center mb-4 gap-4">
    <Button btnType="dismissable" onClick={onCancel}>
      Cancel
    </Button>
    <Button onClick={onSave} isLoading={isLoading}>
      {isEditing ? "Save" : "Add"}
    </Button>
  </div>
);

export default FormActionBar;
