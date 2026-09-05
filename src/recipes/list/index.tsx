import { useEffect, useCallback, useState } from "react";
import { useFetchRecipes } from "./hooks/useFetchRecipes";
import Loading from "@shared/components/Loading";
import EmptyState from "@shared/components/EmptyState";
import { Link } from "react-router-dom";
import ImgTitleDescription from "@shared/components/ImgTitleDescCard";
import { Recipe } from "@shared/models/Recipe";
import SearchInput from "@shared/components/SearchInput";
import MultiSelect from "@shared/components/MultiSelect";
import TitleDescHeader from "@shared/components/TitleDescHeader";
import { AddRecipeModal, useModalManager } from "@shared/components/Modals";
import { useAuth } from "@shared/contexts/AuthContext";
import InfiniteScroll from "@shared/components/InfiniteScroll";
import DropdownButton, {
  DropdownOption,
} from "@shared/components/Buttons/DropdownButton";
import { FaDownload, FaEllipsisV, FaFilter, FaSearch } from "react-icons/fa";
import { RecipeSort, RECIPE_SORT_LABELS } from "@shared/models/RecipeSort";

const iconButtonClasses = (active: boolean) =>
  `relative inline-flex items-center justify-center w-9 h-9 rounded-full transition-colors cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-leaf-green-400 ${
    active
      ? "bg-leaf-green-100 text-leaf-green-700 dark:bg-leaf-green-900/40 dark:text-leaf-green-300"
      : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
  }`;

const RecipeList: React.FC = () => {
  const {
    recipes,
    tags,
    selectedTags,
    setSelectedTags,
    setTagSearchTerm,
    loading,
    hasMore,
    searchTerm,
    setSearchTerm,
    sort,
    setSort,
    resetAndLoadRecipes,
    loadMoreRecipes,
    isExporting,
    exportAll,
  } = useFetchRecipes();

  const { openModal, closeModal } = useModalManager();
  const { authHasBeenChecked } = useAuth();

  const [showSearch, setShowSearch] = useState(false);
  const [showFilter, setShowFilter] = useState(false);

  const handleAddRecipe = () => {
    openModal(<AddRecipeModal onClose={closeModal} />);
  };

  const actionOptions: DropdownOption[] = [
    ...Object.values(RecipeSort).map((value, index) => ({
      label: RECIPE_SORT_LABELS[value],
      selected: sort === value,
      onClick: () => setSort(value),
      ...(index === 0 ? { sectionLabel: "Sort by" } : {}),
    })),
    {
      label: isExporting ? "Exporting..." : "Export All",
      icon: <FaDownload aria-hidden="true" />,
      dividerBefore: true,
      disabled: !recipes.length || isExporting,
      onClick: exportAll,
    },
  ];

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
        title="Recipes"
        actionName="New Recipe"
        actionVariant="solid"
        onAction={handleAddRecipe}
      />

      <div className="w-full mb-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowSearch((prev) => !prev)}
            aria-label={showSearch ? "Close search" : "Search recipes"}
            aria-expanded={showSearch}
            aria-controls="recipe-search-field"
            className={`shrink-0 ${iconButtonClasses(showSearch || searchTerm.length > 0)}`}
          >
            <FaSearch className="w-4 h-4" aria-hidden="true" />
            {!showSearch && searchTerm.length > 0 && (
              <span
                aria-hidden="true"
                className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-leaf-green-600"
              />
            )}
          </button>

          <button
            type="button"
            onClick={() => setShowFilter((prev) => !prev)}
            aria-label={showFilter ? "Close tag filter" : "Filter by tag"}
            aria-expanded={showFilter}
            aria-controls="recipe-filter-field"
            className={`shrink-0 ${iconButtonClasses(showFilter || selectedTags.length > 0)}`}
          >
            <FaFilter className="w-4 h-4" aria-hidden="true" />
            {!showFilter && selectedTags.length > 0 && (
              <span
                aria-hidden="true"
                className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-leaf-green-600 text-white text-[10px] font-bold flex items-center justify-center"
              >
                {selectedTags.length}
              </span>
            )}
          </button>

          <div className="ml-auto shrink-0">
            <DropdownButton
              options={actionOptions}
              triggerLabel="Recipe list actions"
              trigger={({ onClick, isOpen, menuId }) => (
                <button
                  type="button"
                  onClick={onClick}
                  aria-label="Recipe list actions"
                  aria-haspopup="menu"
                  aria-expanded={isOpen}
                  aria-controls={menuId}
                  className={`shrink-0 ${iconButtonClasses(isOpen)}`}
                >
                  <FaEllipsisV className="w-4 h-4" aria-hidden="true" />
                </button>
              )}
            />
          </div>
        </div>

        {showSearch && (
          <div id="recipe-search-field" className="mt-2 text-left">
            <SearchInput
              className="w-full"
              placeholder="Search by title, description or ingredient..."
              onSearch={setSearchTerm}
              showIcon={false}
              autoFocus
            />
          </div>
        )}

        {showFilter && (
          <div id="recipe-filter-field" className="mt-2 text-left">
            <MultiSelect
              inputId="recipe-tag-filter"
              placeholder="Filter by tag..."
              options={tags}
              selectedOptions={selectedTags}
              setSelectedOptions={setSelectedTags}
              onSearch={setTagSearchTerm}
            />
          </div>
        )}
      </div>

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
};

export default RecipeList;
