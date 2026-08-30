import React, { useState } from "react";
import { Button } from "../Buttons";
import { useToast } from "../Toast";

interface DeleteConfirmationModalProps {
  label: string;
  onCancelDelete: () => void;
  onDelete: () => Promise<void>;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  label = "recipe",
  onCancelDelete,
  onDelete,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const toast = useToast();

  const handleDelete = async () => {
    setLoading(true);
    try {
      await onDelete();
    } catch (error: any) {
      console.error("Delete failed:", error);
      toast.error(error.message || `Failed to delete ${label}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-center p-4">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
        Are you sure you want to delete this {label}?
      </h2>
      <div className="flex justify-center space-x-4 pt-2">
        <Button btnType="dismissable" onClick={onCancelDelete} disabled={loading}>
          Cancel
        </Button>
        <Button btnType="delete" onClick={handleDelete} isLoading={loading}>
          Delete
        </Button>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
