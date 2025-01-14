import React, { useState, useEffect } from 'react';
import { TrashIcon } from "@heroicons/react/24/outline";
import Button from '../../../shared/components/Button';
import IconButton from '../../../shared/components/IconButton';

function IngredientsSectionForm({ ingredients = [{ name: '' }], setIngredients }) {
  const [formState, setFormState] = useState(ingredients);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setIngredients(formState);
    }, 400);

    return () => clearTimeout(debounceTimer);
  }, [formState, setIngredients]);

  const onInputChange = (index, event) => {
    const newFormState = [...formState];
    newFormState[index].name = event.target.value;
    setFormState(newFormState);
  };

  const onAddClick = () => {
    setFormState([...formState, { name: '' }]);
  };

  const onDeleteClick = (index) => {
    setFormState(formState.filter((_, i) => i !== index));
  };

  return (
    <div className="mb-4">
      <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
        Ingredients
      </h2>
      {formState.length > 0 && (
        <ul className="mb-4">
          {formState.map((ingredient, index) => (
            <li
              key={index}
              className="text-gray-700 dark:text-gray-300 flex items-center justify-between mb-2"
            >
              <input
                type="text"
                value={ingredient.name || ''}
                onChange={(e) => onInputChange(index, e)}
                className="border rounded px-2 py-1 w-full mr-4 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300"
              />

              {/* Delete Button */}
              <IconButton
                icon={<TrashIcon className="w-6 h-6 text-red-500 dark:text-red-600" />}
                onClick={() => onDeleteClick(index)}
                title="Delete Step"
              />
            </li>
          ))}
        </ul>
      )}

      <Button type="submit" onClick={onAddClick}>Add Ingredient</Button>
    </div>
  );
}

export default IngredientsSectionForm;