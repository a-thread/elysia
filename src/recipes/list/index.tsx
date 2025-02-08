import { useRef, useEffect, useCallback } from "react";
import { useFetchRecipes } from "./hooks/useFetchRecipes";
import Loading from "@shared/components/Loading";
import EmptyState from "@shared/components/EmptyState";
import { Link } from "react-router-dom";
import ImgTitleDescription from "@shared/components/ImgTitleDescCard";
import { Recipe } from "@shared/models/Recipe";
import SearchBar from "@shared/components/SearchBar";
import TitleDescHeader from "@shared/components/TitleDescHeader";
import { AddRecipeModal, useModalManager } from "@shared/components/Modals";
import { useAuth } from "@shared/contexts/AuthContext";

function RecipeList() {
  const {
    recipes,
    tags,
    selectedTags,
    setSelectedTags,
    loading,
    hasMore,
    searchTerm,
    setSearchTerm,
    resetAndLoadRecipes,
    loadMoreRecipes,
  } = useFetchRecipes();
  
  const { openModal, closeModal } = useModalManager();
  const { authHasBeenChecked } = useAuth();
  const observerRef = useRef<HTMLDivElement | null>(null);
  const observerInstance = useRef<IntersectionObserver | null>(null);

  const handleAddRecipe = () => {
    openModal(<AddRecipeModal onClose={closeModal} />);
  };

  // Reset and load recipes when search term changes OR when auth changes
  useEffect(() => {
    resetAndLoadRecipes();
  }, [searchTerm, authHasBeenChecked, selectedTags]);

  // Stable reference to avoid unnecessary effect re-runs
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && !loading && hasMore) {
        loadMoreRecipes();
      }
    },
    [loading, hasMore, loadMoreRecipes]
  );

  useEffect(() => {
    if (!observerRef.current || !hasMore || loading) return;

    if (observerInstance.current) {
      observerInstance.current.disconnect(); // Prevent duplicate observers
    }

    observerInstance.current = new IntersectionObserver(handleObserver, {
      rootMargin: "100px",
      threshold: 0.1,
    });

    observerInstance.current.observe(observerRef.current);

    return () => {
      observerInstance.current?.disconnect();
    };
  }, [hasMore, loading]);

  return (
    <div className="max-w-5xl mx-auto p-6 flex flex-col justify-center items-center text-center transition-all duration-300">
      <TitleDescHeader
        classes="mb-4"
        title="Recipes"
        actionName="+ New Recipe"
        onAction={handleAddRecipe}
      />

      <SearchBar
        options={tags}
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
      {!hasMore && !loading && (
        <div className="text-gray-500 mt-6 animate-fade-in">
          You’ve reached the end! No more recipes to load.
        </div>
      )}
      {hasMore && <div ref={observerRef} className="h-1"></div>}
    </div>
  );
}

export default RecipeList;
