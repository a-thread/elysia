import { useRef, useEffect, useCallback, useState } from "react";
import { useFetchRecipes } from "./hooks/useFetchRecipes";
import Loading from "@shared/components/Loading";
import EmptyState from "@shared/components/EmptyState";
import { Link } from "react-router-dom";
import ImgTitleDescription from "@shared/components/ImgTitleDescCard";
import { Recipe } from "@shared/models/Recipe";
import { Tag } from "@shared/models/Tag";
import SearchBar from "@shared/components/SearchBar";

function Home() {
  const { recipes, loading, hasMore, searchTerm, setSearchTerm, resetAndLoadRecipes, loadMoreRecipes } = useFetchRecipes();
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const observerRef = useRef<HTMLDivElement | null>(null);

  // Load more recipes when user scrolls
  const handleLoadMore = useCallback(() => {
    if (!loading && hasMore) {
      loadMoreRecipes();
    }
  }, [hasMore, loading, loadMoreRecipes]);

  // Reset and load recipes when search term changes
  useEffect(() => {
    resetAndLoadRecipes();
  }, [searchTerm]);

  // Observe the bottom of the list for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && handleLoadMore(),
      { rootMargin: "100px", threshold: 0.1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }
    return () => observer.disconnect();
  }, [handleLoadMore]);

  return (
    <div className="max-w-5xl mx-auto p-6 flex flex-col justify-center items-center text-center transition-all duration-300">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-leaf-green-100 mb-6">Explore Recipes</h1>

      <SearchBar
        options={[]}
        selectedOptions={selectedTags}
        setSelectedOptions={setSelectedTags}
        onSearch={setSearchTerm}
      />

      {recipes.length === 0 && !loading ? (
        <EmptyState message="No recipes found. Add some delicious ones to get started!" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {recipes.map((recipe: Recipe) => (
            <Link key={recipe.id} to={`/recipes/${recipe.id}`}>
              <ImgTitleDescription {...recipe} />
            </Link>
          ))}
        </div>
      )}

      {loading && <Loading className="mt-6" />}
      {!hasMore && !loading && <div className="text-gray-500 mt-6 animate-fade-in">You’ve reached the end! No more recipes to load.</div>}
      {hasMore && <div ref={observerRef} className="h-1"></div>}
    </div>
  );
}

export default Home;
