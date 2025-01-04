import React, { useState } from 'react';
import { supabase } from '../services/supabase';

function AddIngredientForm({ recipeId, onIngredientAdded }) {
  const [ingredientName, setIngredientName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddIngredient = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Step 1: Check if the ingredient exists in the database
      let { data: existingIngredient, error: fetchError } = await supabase
        .from('ingredients')
        .select('id')
        .eq('name', ingredientName.toLowerCase())
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError; // If it's not a "not found" error, throw it
      }

      // Step 2: If the ingredient doesn't exist, create it
      if (!existingIngredient) {
        const { data: newIngredient, error: insertError } = await supabase
          .from('ingredients')
          .insert([{ name: ingredientName.toLowerCase() }])
          .select()
          .single();

        if (insertError) throw insertError;

        existingIngredient = newIngredient;
      }

      // Step 3: Add the ingredient to the recipe
      const { error: mapError } = await supabase
        .from('recipe_to_ingredients_map')
        .insert([
          {
            recipe_id: recipeId,
            ingredient_id: existingIngredient.id,
            quantity: parseFloat(quantity),
            unit,
          },
        ]);

      if (mapError) throw mapError;

      // Step 4: Notify the parent component to refresh the ingredient list
      onIngredientAdded();
      setIngredientName('');
      setQuantity('');
      setUnit('');
    } catch (error) {
      console.error('Error adding ingredient:', error.message);
      alert('Failed to add ingredient. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleAddIngredient}>
      <div>
        <label>Ingredient Name:</label>
        <input
          type="text"
          value={ingredientName}
          onChange={(e) => setIngredientName(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Quantity:</label>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Unit:</label>
        <input
          type="text"
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          placeholder="e.g., grams, cups"
          required
        />
      </div>
      <button type="submit" disabled={loading}>
        {loading ? 'Adding...' : 'Add Ingredient'}
      </button>
    </form>
  );
}

export default AddIngredientForm;
