import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../services/supabase';

function Home() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipes = async () => {
      const { data, error } = await supabase.from('recipes').select('*');
      if (error) {
        console.error('Error fetching recipes:', error.message);
      } else {
        setRecipes(data);
      }
      setLoading(false);
    };

    fetchRecipes();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (recipes.length === 0) {
    return <div>No recipes found. Add some recipes to get started!</div>;
  }

  return (
    <div>
      <h1>Recipes</h1>
      <ul>
        {recipes.map((recipe) => (
          <li key={recipe.id}>
            <Link to={`/recipe/${recipe.id}`}>
              <h2>{recipe.title}</h2>
              <p>{recipe.description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Home;
