import React from "react";
import { Link, useParams } from "react-router-dom";
import IngredientsSection from "./components/IngredientsSection";
import StepsSection from "./components/StepsSection";
import { ChevronLeftIcon, PlusIcon } from "@heroicons/react/20/solid";
import RecipeTimeSection from "./components/RecipeTimeSection";
import EllipsisMenu from "./components/EllipsisMenu";
import { useRecipeDetails } from "./hooks/useRecipeDetails";
import Loading from "@shared/components/Loading";
import EmptyState from "@shared/components/EmptyState";
import TitleDescHeader from "@shared/components/TitleDescHeader";
import { useAuth } from "@shared/contexts/AuthContext";
import { DropdownButton } from "@shared/components/Buttons";
import { useModalManager } from "@shared/components/Modals";
import AddRecipeToCollectionsModal from "./components/AddRecipeToCollections";
import { DropdownOption } from "@shared/components/Buttons/DropdownButton";
import AddTagsToRecipeModal from "./components/AddTagsToRecipeModal";

const Recipe: React.FC = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { openModal } = useModalManager();

  const { recipe, loading, fetchRecipe } = useRecipeDetails(id, user?.id);

  if (loading) return <Loading className="mt-40" />;
  if (!recipe) return <EmptyState message="Recipe not found." />;

  const options: DropdownOption[] = [
    {
      label: "Add Tags",
      onClick: () =>
        openModal(
          <AddTagsToRecipeModal recipeId={recipe.id} tagAdded={fetchRecipe} />
        ),
    },
    {
      label: "Add to Collection",
      onClick: () =>
        openModal(
          <AddRecipeToCollectionsModal
            recipeId={recipe.id}
            collectionAdded={fetchRecipe}
          />
        ),
    },
  ];

  return (
    <div className="max-w-4xl mx-auto mt-4">
      <Header user={user} options={options} recipe={recipe} />
      <Content recipe={recipe} />
    </div>
  );
};

const Header: React.FC<{
  user: any;
  options: DropdownOption[];
  recipe: any;
}> = ({ user, options, recipe }) => (
  <div className="w-full flex justify-between items-center mb-4">
    <Link to="/">
      <div className="flex items-center font-medium text-leaf-green-600 dark:text-leaf-green-100">
        <ChevronLeftIcon className="size-6" />
        <p>Recipes</p>
      </div>
    </Link>
    <div className="flex gap-2">
      {user?.id && (
        <DropdownButton
          options={options}
          icon={
            <PlusIcon className="w-6 h-6 dark:text-leaf-green-300 text-leaf-green-500" />
          }
        />
      )}
      <EllipsisMenu recipe={recipe} />
    </div>
  </div>
);

const Content: React.FC<{ recipe: any }> = ({ recipe }) => (
  <div className="flex flex-col-reverse md:flex-row gap-6">
    <div className="w-full md:w-3/4">
      {recipe.img_url && (
        <img
          src={recipe.img_url}
          alt={recipe.title}
          className="w-full h-64 object-cover rounded-t-lg"
        />
      )}
      <div
        className={`bg-white dark:bg-gray-900 p-6 ${!recipe.img_url && "rounded-lg"
          }`}
      >
        <TitleDescHeader
          title={recipe.title}
          description={recipe.description}
        />
        <IngredientsSection ingredients={recipe.ingredients} />
        <StepsSection steps={recipe.steps} />
        {recipe.original_recipe_url && (
          <SourceLink url={recipe.original_recipe_url} />
        )}
      </div>
    </div>
    <div className="w-full md:w-1/4">
      <RecipeTimeSection recipe={recipe} />
    </div>
  </div>
);

const SourceLink: React.FC<{ url: string }> = ({ url }) => (
  <div className="mx-2">
    <small>
      source:{" "}
      <a className="pl-1 italic" href={url}>
        {url}
      </a>
    </small>
  </div>
);

export default Recipe;
