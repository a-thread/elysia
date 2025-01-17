import React, { useRef, useEffect, useCallback } from 'react';
import { useFetchRecipes } from './hooks/useFetchRecipes';
import RecipeCard from './components/RecipeCard';
import Loading from '../../shared/components/Loading';
import EmptyState from '../../shared/components/EmptyState';

function Home() {
  const { recipes, loading, hasMore, loadMoreRecipes } = useFetchRecipes();
  const observerRef = useRef(null);
  loadMoreRecipes();

  // Function to load more recipes when user scrolls near bottom
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
      className="max-w-5xl mx-auto p-6 flex flex-col justify-center items-center text-center transition-all duration-300"
    >
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6">
        Explore Recipes
      </h1>

      {recipes.length === 0 && !loading ? (
        <EmptyState message="No recipes found. Add some delicious ones to get started!" />
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

export default Home;
