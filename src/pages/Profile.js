import React, { useEffect, useState } from 'react';
import { supabase } from '../shared/services/supabase';

function Profile() {
  const [user, setUser] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        console.error('Error fetching session:', sessionError);
        setLoading(false);
        return;
      }

      if (!session) {
        console.log('No user logged in');
        setLoading(false);
        return;
      }

      const userId = session.user.id;

      // Fetch user's profile and recipes
      const { data: recipesData, error: recipesError } = await supabase
        .from('recipes')
        .select('*')
        .eq('user_id', userId);

      if (recipesError) {
        console.error('Error fetching recipes:', recipesError);
      } else {
        setUser(session.user);
        setRecipes(recipesData);
      }

      setLoading(false);
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Please log in to view your profile.</div>;
  }

  return (
    <div>
      <h1>{user.email}'s Profile</h1>
      <h2>Your Recipes</h2>
      {recipes.length > 0 ? (
        <ul>
          {recipes.map((recipe) => (
            <li key={recipe.id}>
              <strong>{recipe.title}</strong>
            </li>
          ))}
        </ul>
      ) : (
        <p>You have not added any recipes yet.</p>
      )}
    </div>
  );
}

export default Profile;
