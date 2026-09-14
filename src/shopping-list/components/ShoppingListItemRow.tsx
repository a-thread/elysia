import React from "react";
import { FaCheck } from "react-icons/fa";
import { RemoveButton } from "@shared/components/Buttons";
import { ShoppingListItem } from "../models/ShoppingListItem";

interface ShoppingListItemRowProps {
  item: ShoppingListItem;
  onToggle: (item: ShoppingListItem) => void;
  onRemove: (itemId: string) => void;
}

const ShoppingListItemRow: React.FC<ShoppingListItemRowProps> = ({
  item,
  onToggle,
  onRemove,
}) => {
  const isChecked = item.checked;

  return (
    <div className="flex items-start gap-3 py-2 group">
      <div
        className="flex items-start gap-3 flex-1 cursor-pointer"
        onClick={() => onToggle(item)}
      >
        <input
          type="checkbox"
          checked={isChecked}
          onChange={() => onToggle(item)}
          className="peer sr-only"
          id={`shopping-item-${item.id}`}
        />
        <label
          htmlFor={`shopping-item-${item.id}`}
          className="shrink-0 w-5 h-5 mt-0.5 flex items-center justify-center border-2 border-gray-300 rounded-sm cursor-pointer transition-all
            peer-checked:bg-leaf-green-500 peer-checked:border-leaf-green-500
            dark:border-gray-600 dark:peer-checked:bg-leaf-green-400 dark:peer-checked:border-leaf-green-400
            peer-focus-visible:ring-2 peer-focus-visible:ring-leaf-green-300 peer-focus-visible:ring-offset-1"
        >
          <FaCheck
            className={`w-3 h-3 text-white ${!isChecked && "hidden"}`}
            aria-hidden="true"
          />
        </label>
        <div className="flex-1">
          <span
            className={`text-base leading-6 transition-all ${
              isChecked
                ? "text-gray-400 dark:text-gray-500 line-through"
                : "text-gray-800 dark:text-gray-200"
            }`}
          >
            {item.value}
          </span>
          {item.source_recipe_title && (
            <div className="text-xs text-leaf-green-700 dark:text-leaf-green-300">
              from {item.source_recipe_title}
            </div>
          )}
        </div>
      </div>
      <RemoveButton
        onClick={() => onRemove(item.id)}
        label="Remove item"
        className="opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
      />
    </div>
  );
};

export default ShoppingListItemRow;
