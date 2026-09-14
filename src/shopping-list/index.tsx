import React from "react";
import { FaBroom, FaClipboard, FaEllipsisV, FaTrash } from "react-icons/fa";
import Loading from "@shared/components/Loading";
import EmptyState from "@shared/components/EmptyState";
import { Button } from "@shared/components/Buttons";
import DropdownButton, { DropdownOption } from "@shared/components/Buttons/DropdownButton";
import { useShoppingListPage } from "./hooks/useShoppingListPage";
import ShoppingListItemRow from "./components/ShoppingListItemRow";

const ShoppingList: React.FC = () => {
  const {
    items,
    loading,
    newItemValue,
    setNewItemValue,
    addItem,
    toggleChecked,
    removeItem,
    confirmClearChecked,
    confirmClearAll,
    copyAsMarkdown,
  } = useShoppingListPage();

  const uncheckedItems = items.filter((item) => !item.checked);
  const checkedItems = items.filter((item) => item.checked);

  const menuOptions: DropdownOption[] = [
    {
      label: "Copy as Markdown",
      icon: <FaClipboard aria-hidden="true" />,
      onClick: copyAsMarkdown,
    },
    {
      label: "Clear checked",
      icon: <FaBroom aria-hidden="true" />,
      onClick: confirmClearChecked,
      dividerBefore: true,
      disabled: checkedItems.length === 0,
    },
    {
      label: "Clear all",
      icon: <FaTrash aria-hidden="true" />,
      onClick: confirmClearAll,
      destructive: true,
      disabled: items.length === 0,
    },
  ];

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-3xl font-medium text-leaf-green-900 dark:text-leaf-green-100">
          Shopping List
        </h1>
        <DropdownButton
          options={menuOptions}
          icon={<FaEllipsisV className="w-5 h-5 text-gray-600 dark:text-gray-300" />}
        />
      </div>
      <p className="text-leaf-green-800 dark:text-gray-300 mt-4 mb-6">
        Add items yourself, or use{" "}
        <span className="font-medium">Add to Shopping List</span> from any
        recipe to pull in its ingredients.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          addItem();
        }}
        className="flex gap-2 mb-6"
      >
        <input
          type="text"
          value={newItemValue}
          onChange={(e) => setNewItemValue(e.target.value)}
          placeholder="Add an item..."
          className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-gray-800 dark:text-gray-100 focus:outline-hidden focus:ring-2 focus:ring-leaf-green-400"
        />
        <Button type="submit" btnType="primary" disabled={!newItemValue.trim()}>
          Add
        </Button>
      </form>

      {loading && <Loading className="mt-6" />}

      {!loading && items.length === 0 && (
        <EmptyState message="Your shopping list is empty. Add an item above, or add ingredients from a recipe." />
      )}

      {!loading && items.length > 0 && (
        <div className="flex flex-col divide-y divide-gray-100 dark:divide-gray-800">
          {uncheckedItems.map((item) => (
            <ShoppingListItemRow
              key={item.id}
              item={item}
              onToggle={toggleChecked}
              onRemove={removeItem}
            />
          ))}
          {checkedItems.length > 0 && (
            <div className="pt-4">
              <div className="text-xs font-bold uppercase tracking-wide text-gray-400 dark:text-gray-500 mb-1">
                Checked
              </div>
              {checkedItems.map((item) => (
                <ShoppingListItemRow
                  key={item.id}
                  item={item}
                  onToggle={toggleChecked}
                  onRemove={removeItem}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ShoppingList;
