import React, { useRef } from 'react';
import RecipeCard from '../Home/components/RecipeCard';
import Loading from '../../shared/components/Loading';
import EmptyState from '../../shared/components/EmptyState';
import { useFetchFavoriteRecipes } from './hooks/useFetchFavoriteRecipe';
import { useDarkMode } from '../../shared/contexts/DarkModeContext';

function Favorites() {
  const { isDarkMode } = useDarkMode();
  const { recipes, loading, hasMore, loadMoreRecipes } = useFetchFavoriteRecipes();
  const containerRef = useRef(null);
  loadMoreRecipes();

  const handleScroll = () => {
    const container = containerRef.current;

    if (
      container.scrollTop + container.clientHeight >= container.scrollHeight - 200 && // Near the bottom
      hasMore
    ) {
      loadMoreRecipes();
    }
  };

  const scrollbarStyles = {
    '--scrollbar-track-color': isDarkMode ? '#2c2c2c' : '#f0f0f0',
    '--scrollbar-thumb-color': isDarkMode ? '#666' : '#ccc',
    '--scrollbar-thumb-hover-color': isDarkMode ? '#888' : '#999',
  };

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      style={{
        height: '80vh',
        overflowY: 'auto',
        ...scrollbarStyles,
      }}
      className="scrollable-container max-w-4xl mx-auto p-6 flex flex-col justify-center items-center"
    >
      <h1>Favorites</h1>

      {recipes.length === 0 && !loading ? (
        <EmptyState message="No favorites yet! Add some recipes to your favorites." />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
          {loading && <Loading />}
          {!hasMore && <div className="text-gray-500 mt-4">No more recipes to load</div>}
        </>
      )}
    </div>
  );
}

export default Favorites;
