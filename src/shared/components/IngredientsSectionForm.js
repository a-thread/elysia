import React, { useState, useEffect } from 'react';
import { Button, TrashButton } from './Buttons';

function IngredientsSectionForm({ ingredients, setIngredients }) {
  const [formState, setFormState] = useState([]);

  useEffect(() => {
    setFormState(ingredients);
  }, [ingredients]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setIngredients(formState);
    }, 400);

    return () => clearTimeout(debounceTimer);
  }, [formState, setIngredients]);

  const onInputChange = (index, event) => {
    const newFormState = [...formState];
    newFormState[index] = event.target.value;
    setFormState(newFormState);
  };

  const onAddClick = () => {
    setFormState([...formState, '']);
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
                value={ingredient || ''}
                onChange={(e) => onInputChange(index, e)}
                className="border rounded px-2 py-1 w-full mr-4 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300"
              />

              {/* Delete Button */}
              <TrashButton onDelete={() => onDeleteClick(index)} />
            </li>
          ))}
        </ul>
      )}

      <Button type="submit" onClick={onAddClick}>Add Ingredient</Button>
    </div>
  );
}

export default IngredientsSectionForm;