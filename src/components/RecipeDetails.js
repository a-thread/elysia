import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';

function RecipeDetails({ recipeId }) {
  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('id', recipeId)
        .single();
      if (error) console.error(error);
      else setRecipe(data);
    };
    fetchRecipe();
  }, [recipeId]);

  if (!recipe) return <div>Loading...</div>;

  return (
    <div>
      <h1>{recipe.title}</h1>
      <p>{recipe.description}</p>
    </div>
  );
}

export default RecipeDetails;
