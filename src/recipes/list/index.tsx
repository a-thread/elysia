import { useEffect, useCallback } from "react";
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
import InfiniteScroll from "@shared/components/InfiniteScroll";

const RecipeList: React.FC = () => {
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

  const handleAddRecipe = () => {
    openModal(<AddRecipeModal onClose={closeModal} />);
  };

  useEffect(() => {
    resetAndLoadRecipes();
  }, [searchTerm, authHasBeenChecked, selectedTags, resetAndLoadRecipes]);

  const handleInfiniteScroll = useCallback(() => {
    if (!loading && hasMore) {
      loadMoreRecipes();
    }
  }, [loading, hasMore, loadMoreRecipes]);

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

      {loading && <Loading className="mt-6" />}

      {!loading && recipes.length === 0 && (
        <EmptyState message="No recipes found. Add some to get started!" />
      )}

      {recipes.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {recipes.map((recipe: Recipe) => (
            <Link key={recipe.id} to={`/recipes/${recipe.id}`}>
              <ImgTitleDescription {...recipe} />
            </Link>
          ))}
        </div>
      )}

      {hasMore && (
        <InfiniteScroll threshold={0.1} onScrolled={handleInfiniteScroll}>
          <div className="h-1" />
        </InfiniteScroll>
      )}
    </div>
  );
}

export default RecipeList;
