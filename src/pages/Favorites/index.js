import React, { useRef, useEffect, useCallback } from 'react';
import RecipeCard from '../Home/components/RecipeCard';
import Loading from '../../shared/components/Loading';
import EmptyState from '../../shared/components/EmptyState';
import { useFetchFavoriteRecipes } from './hooks/useFetchFavoriteRecipe';
import { useDarkMode } from '../../shared/contexts/DarkModeContext';

function Favorites() {
  const { isDarkMode } = useDarkMode();
  const { recipes, loading, hasMore, loadMoreRecipes } = useFetchFavoriteRecipes();
  const containerRef = useRef(null);
  const observerRef = useRef(null);

  loadMoreRecipes();

  const handleLoadMore = useCallback(() => {
    if (hasMore && !loading) {
      loadMoreRecipes();
    }
  }, [hasMore, loading, loadMoreRecipes]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          handleLoadMore();
        }
      },
      { threshold: 0.5 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [handleLoadMore]);

  return (
    <div
      ref={containerRef}
      style={{
        height: '80vh',
        overflowY: 'auto',
        scrollbarColor: isDarkMode ? '#666 #2c2c2c' : '#ccc #f0f0f0',
      }}
      className="max-w-5xl mx-auto p-6 flex flex-col items-center text-center transition-all duration-300"
    >
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6">
        Your Favorite Recipes
      </h1>

      {recipes.length === 0 && !loading ? (
        <EmptyState message="No favorites yet! Save some delicious recipes to see them here." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}

      {loading && <Loading className="mt-6" />}

      {!hasMore && !loading && (
        <div className="text-gray-500 mt-6 animate-fade-in">
          You’ve reached the end! No more recipes to load.
        </div>
      )}

      {hasMore && <div ref={observerRef} className="h-1"></div>}
    </div>
  );
}

export default Favorites;
