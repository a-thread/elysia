import { useRef, useEffect, useCallback } from "react";
import { useFetchRecipes } from "./hooks/useFetchRecipes";
import Loading from "@shared/components/Loading";
import EmptyState from "@shared/components/EmptyState";
import { Link } from "react-router-dom";
import ImgTitleDescription from "@shared/components/ImgTitleDescCard";
import { Recipe } from "@shared/models/Recipe";


function Home() {
  const { recipes, loading, hasMore, loadMoreRecipes } = useFetchRecipes();
  const observerRef = useRef<HTMLDivElement | null>(null);
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
    <div className="max-w-5xl mx-auto p-6 flex flex-col justify-center items-center text-center transition-all duration-300">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-leafGreen-100 mb-6">
        Explore Recipes
      </h1>

      {recipes.length === 0 && !loading ? (
        <EmptyState message="No recipes found. Add some delicious ones to get started!" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {recipes.map((recipe: Recipe) => (
            <Link key={recipe.id} to={`/recipes/${recipe.id}`}>
              <ImgTitleDescription
                key={recipe.id}
                title={recipe.title}
                description={recipe.description}
                img_url={recipe.img_url}
              />
            </Link>
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
