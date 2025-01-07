import React, { useState, useEffect } from 'react';
import Button from './Button';

function AddIngredientForm({ ingredient, onIngredientAdded }) {
  const [ingredientName, setIngredientName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('');

  // Populate form fields if editing an existing ingredient
  useEffect(() => {
    if (ingredient) {
      setIngredientName(ingredient.name || '');
      setQuantity(ingredient.quantity || '');
      setUnit(ingredient.unit || '');
    }
  }, [ingredient]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Emit the ingredient data to the parent
    onIngredientAdded({
      name: ingredientName.trim(),
      quantity: parseFloat(quantity),
      unit: unit.trim(),
    });

    // Reset the form fields (only for adding new ingredients, not editing)
    if (!ingredient) {
      setIngredientName('');
      setQuantity('');
      setUnit('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">
        {ingredient ? 'Edit Ingredient' : 'Add Ingredient'}
      </h3>
      <div className="relative z-0 w-full mb-5 group">
        <input
          type="text"
          name="ingredientName"
          id="ingredientName"
          value={ingredientName}
          onChange={(e) => setIngredientName(e.target.value)}
          required
          className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          placeholder=" "
        />
        <label
          htmlFor="ingredientName"
          className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
        >
          Ingredient Name
        </label>
      </div>
      <div className="relative z-0 w-full mb-5 group">
        <input
          type="number"
          name="quantity"
          id="quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
          className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          placeholder=" "
        />
        <label
          htmlFor="quantity"
          className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
        >
          Quantity
        </label>
      </div>
      <div className="relative z-0 w-full mb-5 group">
        <input
          type="text"
          name="unit"
          id="unit"
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          placeholder="e.g., grams, cups"
          required
          className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
        />
        <label
          htmlFor="unit"
          className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
        >
          Unit
        </label>
      </div>
      <Button type="submit" onClick={handleSubmit}>        {ingredient ? 'Save Changes' : 'Add Ingredient'}
      </Button>

    </form>
  );
}

export default AddIngredientForm;
