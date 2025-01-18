import React, { useState } from "react";
import Loading from "./Loading";

function DeleteConfirmationModal({ onCancelDelete, onDelete }) {

  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await onDelete(); // Execute the delete action
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="text-center">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
          Are you sure you want to delete this recipe?
        </h2>
        <div className="flex justify-center space-x-4">
          <button
            onClick={onCancelDelete}
            className="px-4 py-2 border border-gray-300 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className={`flex items-center gap-2 px-4 py-2 font-semibold rounded-lg transition ${
              loading
                ? "bg-red-400 cursor-not-allowed"
                : "bg-red-500 text-white hover:bg-red-600"
            }`}
          >
            { loading && <Loading isLarge={false}  /> }
            Delete
          </button>
        </div>
      </div>
  );
}

export default DeleteConfirmationModal;