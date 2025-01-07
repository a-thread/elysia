import React from 'react';
import { useModalManager } from '../../../shared/components/modalManager';
import AddIngredientForm from '../../../shared/components/AddIngredientForm';
import { PencilIcon } from "@heroicons/react/20/solid";
import { TrashIcon } from "@heroicons/react/24/outline";
import Button from '../../../shared/components/Button';

function IngredientsSectionForm({ ingredients, setIngredients }) {
  const { openModal, closeModal } = useModalManager();

  const handleIngredientAdded = (newIngredient) => {
    setIngredients((prevIngredients) => [...prevIngredients, newIngredient]);
    closeModal();
  };

  const handleIngredientEdited = (updatedIngredient) => {
    setIngredients((prevIngredients) => {
      const newIngredients = [...prevIngredients];
      const index = newIngredients.findIndex((i) => i.id === updatedIngredient.id);
      newIngredients[index] = updatedIngredient;
      return newIngredients;
    });
    closeModal();
  };

  const handleAddIngredientClick = () => {
    openModal(<AddIngredientForm onIngredientAdded={handleIngredientAdded} />)
  };

  const handleEditIngredientClick = (ingredient) => {
    openModal(
      <AddIngredientForm
        ingredient={ingredient}
        onIngredientAdded={(updatedIngredient) =>
          handleIngredientEdited(updatedIngredient)
        }
      />
    )
  };

  const handleDeleteIngredient = (ingredient) => {
    const newIngredients = ingredients.filter((i) => i.id !== ingredient.id);
    setIngredients(newIngredients);
  };

  return (
    <div className="mb-4">
      <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
        Ingredients
      </h2>
      {ingredients.length > 0 && (
        <ul className="list-disc mb-4">
          {ingredients.map((ingredient, index) => (
            <li
              key={index}
              className="text-gray-700 dark:text-gray-300 flex items-center justify-between mb-2"
            >
              <span>
                {ingredient.quantity} {ingredient.unit} {ingredient.name}
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditIngredientClick(ingredient)}
                  className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600"
                >
                  <span className="sr-only">Edit Ingredient</span>
                  <PencilIcon className="w-6 h-6 text-yellow-400 dark:text-yellow-500" />
                </button>
                <button
                  onClick={() => handleDeleteIngredient(ingredient)}
                  className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600"
                >
                  <span className="sr-only">Delete Ingredient</span>
                  <TrashIcon className="w-6 h-6 text-red-500 dark:text-red-600" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Button onClick={handleAddIngredientClick}>Add Ingredient</Button>
    </div>
  );
}

export default IngredientsSectionForm;
