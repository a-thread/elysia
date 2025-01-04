import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../services/supabase';
import AddIngredientForm from '../components/AddIngredientForm';

function Recipe() {
  const { id } = useParams(); // Recipe ID from the URL
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch recipe details
  useEffect(() => {
    const fetchRecipeDetails = async () => {
      try {
        setLoading(true);

        const { data, error } = await supabase
          .from('recipes')
          .select(`
            *,
            recipe_to_ingredients_map (
              quantity,
              unit,
              ingredients (name)
            ),
            steps (*)
          `)
          .eq('id', id)
          .single();

        if (error) throw error;

        setRecipe(data);
      } catch (error) {
        console.error('Error fetching recipe details:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipeDetails();
  }, [id]);

  // Handle loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  // Handle not found state
  if (!recipe) {
    return <div>Recipe not found.</div>;
  }

  // Refresh ingredients list after adding a new ingredient
  const handleIngredientAdded = async () => {
    const { data, error } = await supabase
      .from('recipes')
      .select(`
        recipe_to_ingredients_map (
          quantity,
          unit,
          ingredients (name)
        )
      `)
      .eq('id', id)
      .single();

    if (!error && data) {
      setRecipe((prev) => ({
        ...prev,
        recipe_to_ingredients_map: data.recipe_to_ingredients_map,
      }));
    }
  };

  // Add a new step
  const handleAddStep = async (instruction) => {
    const stepNumber = recipe.steps.length + 1;

    const { data, error } = await supabase.from('steps').insert([
      {
        recipe_id: id,
        step_number: stepNumber,
        instruction,
      },
    ]);

    if (!error && data) {
      setRecipe((prev) => ({
        ...prev,
        steps: [...prev.steps, ...data],
      }));
    } else {
      console.error('Error adding step:', error.message);
    }
  };

  return (
    <div>
      {/* Recipe Details */}
      <h1>{recipe.title}</h1>
      <p>{recipe.description}</p>
      <div>
        <strong>Prep Time:</strong> {recipe.prep_time} minutes
      </div>
      <div>
        <strong>Cook Time:</strong> {recipe.cook_time} minutes
      </div>

      {/* Ingredients */}
      <h2>Ingredients</h2>
      <ul>
        {recipe.recipe_to_ingredients_map.map((ingredient, index) => (
          <li key={index}>
            {ingredient.quantity} {ingredient.unit} {ingredient.ingredients.name}
          </li>
        ))}
      </ul>

      {/* Add Ingredient Form */}
      <h3>Add Ingredient</h3>
      <AddIngredientForm
        recipeId={id}
        onIngredientAdded={handleIngredientAdded}
      />

      {/* Steps */}
      <h2>Steps</h2>
      <ol>
        {recipe.steps.map((step) => (
          <li key={step.id}>
            Step {step.step_number}: {step.instruction}
          </li>
        ))}
      </ol>

      {/* Add Step Form */}
      <h3>Add Step</h3>
      <AddStepForm onAddStep={handleAddStep} />
    </div>
  );
}

function AddStepForm({ onAddStep }) {
  const [instruction, setInstruction] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onAddStep(instruction);
    setInstruction('');
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={instruction}
        onChange={(e) => setInstruction(e.target.value)}
        placeholder="Enter step instruction"
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Adding...' : 'Add Step'}
      </button>
    </form>
  );
}

export default Recipe;
