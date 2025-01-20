import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import RecipeDetails from "./components/RecipeDetails";
import IngredientsSection from "./components/IngredientsSection";
import StepsSection from "./components/StepsSection";
import recipeService from "../../shared/services/recipeService";
import Loading from "../../shared/components/Loading";
import EmptyState from "../../shared/components/EmptyState";
import { FavoriteButton } from "../../shared/components/Buttons";
import { useAuth } from "../../shared/contexts/AuthContext";
import { useToast } from "../../shared/services/toastManager";
import { ChevronLeftIcon } from "@heroicons/react/20/solid";
import RecipeTimeSection from "./components/RecipeTimeSection";
import EllipsisMenu from "./components/EllipsisMenu";

function Recipe() {
  const { id } = useParams();
  const { user } = useAuth();
  const toast = useToast();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch recipe details
  useEffect(() => {
    const loadRecipe = async () => {
      setLoading(true);
      try {
        const recipeData = await recipeService.fetchRecipeDetails(id, user?.id);
        setRecipe(recipeData);
      } finally {
        setLoading(false);
      }
    };

    loadRecipe();
  }, [id, user?.id]);

  const toggleFavorite = async () => {
    try {
      await recipeService.toggleFavorite(id, recipe.is_favorited, user?.id);
      setRecipe((prevRecipe) => ({
        ...prevRecipe,
        is_favorited: !prevRecipe.is_favorited,
      }));
      toast.succcess("Favorite toggled successfully!");
    } catch (error) {
      console.error("Error toggling favorite:", error.message);
      toast.error("Failed to toggle favorite. Please try again.");
    }
  };

  if (loading) {
    return <Loading className="mt-40"></Loading>;
  }

  if (!recipe) {
    return <EmptyState message="Recipe not found." />;
  }

  return (
    <div className="max-w-4xl mx-auto mt-4">
      <div className="w-full flex justify-between items-center mb-4">
        <Link to="/">
          <div className="flex justify-center items-center font-medium text-center text-leafGreen-600 dark:text-leafGreen-100">
            <ChevronLeftIcon aria-hidden="true" className="size-6" />
            <p>Recipes</p>
          </div>
        </Link>
        <div className="flex justify-end gap-2">
          {(!!user?.id) && (
            <>
              <FavoriteButton
                onToggle={toggleFavorite}
                isFavorited={recipe?.is_favorited}
              />
              <EllipsisMenu recipe={recipe} />
            </>
          )}
        </div>
      </div>

      <div className="flex flex-col-reverse md:flex-row gap-6">
        <div className="w-full md:w-3/4">
          {!!recipe?.img_url?.length && (
            <div className="relative">
              <img
                src={recipe.img_url}
                alt={recipe.title}
                className="w-full h-64 object-cover rounded-t-lg"
              />
            </div>
          )}
          <div
            className={`bg-white dark:bg-gray-900 rounded-b-lg p-6 ${
              !recipe?.img_url && "rounded-t-lg"
            }`}
          >
            <RecipeDetails recipe={recipe} />
            <IngredientsSection ingredients={recipe.ingredients} />
            <StepsSection steps={recipe.steps} />

            {recipe.original_recipe_url && (
              <div className="mx-2">
                <small>
                  source:
                  <a className="pl-1 italic" href={recipe.original_recipe_url}>
                    {recipe.original_recipe_url}
                  </a>
                </small>
              </div>
            )}
          </div>
        </div>
        <div className="w-full md:w-1/4">
          <RecipeTimeSection recipe={recipe}></RecipeTimeSection>
        </div>
      </div>
    </div>
  );
}

export default Recipe;
