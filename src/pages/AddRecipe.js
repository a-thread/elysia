import React, { useState } from 'react';
import { supabase } from '../services/supabase';

function AddRecipe() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [prepTime, setPrepTime] = useState('');
  const [cookTime, setCookTime] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddRecipe = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Fetch the current user ID
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      alert('You need to be logged in to add a recipe.');
      setLoading(false);
      return;
    }

    const userId = session.user.id;

    const { error } = await supabase.from('recipes').insert([
      {
        title,
        description,
        prep_time: parseInt(prepTime, 10),
        cook_time: parseInt(cookTime, 10),
        user_id: userId,
      },
    ]);

    if (error) {
      console.error('Error adding recipe:', error.message);
      alert('Failed to add recipe. Please try again.');
    } else {
      alert('Recipe added successfully!');
      setTitle('');
      setDescription('');
      setPrepTime('');
      setCookTime('');
    }

    setLoading(false);
  };

  return (
    <div>
      <h1>Add a New Recipe</h1>
      <form onSubmit={handleAddRecipe}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Prep Time (minutes):</label>
          <input
            type="number"
            value={prepTime}
            onChange={(e) => setPrepTime(e.target.value)}
          />
        </div>
        <div>
          <label>Cook Time (minutes):</label>
          <input
            type="number"
            value={cookTime}
            onChange={(e) => setCookTime(e.target.value)}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Recipe'}
        </button>
      </form>
    </div>
  );
}

export default AddRecipe;
