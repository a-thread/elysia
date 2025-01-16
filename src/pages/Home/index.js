import React, { useRef, useEffect, useCallback } from 'react';
import { useFetchRecipes } from './hooks/useFetchRecipes';
import RecipeCard from './components/RecipeCard';
import Loading from '../../shared/components/Loading';
import EmptyState from '../../shared/components/EmptyState';
import { useDarkMode } from '../../shared/contexts/DarkModeContext';

function Home() {
  const { isDarkMode } = useDarkMode();
  const { recipes, loading, hasMore, loadMoreRecipes } = useFetchRecipes();
  const containerRef = useRef(null);
  loadMoreRecipes(); // Load initial recipes

  // Throttle the scroll event
  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (
      container &&
      container.scrollTop + container.clientHeight >= container.scrollHeight - 200 && // Near the bottom
      hasMore &&
      !loading // Prevent duplicate calls while loading
    ) {
      loadMoreRecipes();
    }
  }, [hasMore, loading, loadMoreRecipes]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll); // Cleanup
  }, [handleScroll]);

  const scrollbarStyles = {
    '--scrollbar-track-color': isDarkMode ? '#2c2c2c' : '#f0f0f0',
    '--scrollbar-thumb-color': isDarkMode ? '#666' : '#ccc',
    '--scrollbar-thumb-hover-color': isDarkMode ? '#888' : '#999',
  };

  return (
    <div
      ref={containerRef}
      style={scrollbarStyles}
      className="scrollable-container max-w-4xl mx-auto flex flex-col justify-center items-center"
    >
      {recipes.length === 0 && !loading ? (
        <EmptyState message="No recipes found. Add some recipes to get started!" />
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

export default Home;
