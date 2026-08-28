import React from "react";
import { Link, useParams } from "react-router-dom";
import IngredientsSection from "./components/IngredientsSection";
import StepsSection from "./components/StepsSection";
import { FaArrowLeft } from "react-icons/fa";
import RecipeTimeSection from "./components/RecipeTimeSection";
import EllipsisMenu from "./components/EllipsisMenu";
import { useRecipeDetails } from "./hooks/useRecipeDetails";
import Loading from "@shared/components/Loading";
import EmptyState from "@shared/components/EmptyState";
import TitleDescHeader from "@shared/components/TitleDescHeader";
import { useAuth } from "@shared/contexts/AuthContext";
import Card from "@shared/components/Card";

const Recipe: React.FC = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const { recipe, loading, fetchRecipe } = useRecipeDetails(id, user?.id);

  if (loading) return <Loading className="mt-40" />;
  if (!recipe) return <EmptyState message="Recipe not found." />;

  return (
    <div className="max-w-4xl mx-auto mt-4">
      <Header recipe={recipe} onRecipeUpdated={fetchRecipe} />
      <Content recipe={recipe} />
    </div>
  );
};

const Header: React.FC<{
  recipe: any;
  onRecipeUpdated: () => void;
}> = ({ recipe, onRecipeUpdated }) => (
  <div className="w-full flex justify-between items-center mb-4">
    <Link
      to="/recipes"
      className="inline-flex items-center gap-1.5 text-sm font-semibold text-leaf-green-700 dark:text-leaf-green-300 transition-opacity hover:opacity-70"
    >
      <FaArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
      Recipes
    </Link>
    <EllipsisMenu recipe={recipe} onRecipeUpdated={onRecipeUpdated} />
  </div>
);

const Content: React.FC<{ recipe: any }> = ({ recipe }) => (
  <div className="flex flex-col-reverse md:flex-row gap-6">
    <div className="w-full md:w-3/4">
      {recipe.img_url && (
        <img
          src={recipe.img_url}
          alt={recipe.title}
          className="w-full h-64 object-cover rounded-t-xl"
        />
      )}
      <Card hasImageAbove={!!recipe.img_url}>
        <TitleDescHeader
          title={recipe.title}
          description={recipe.description}
        />
        <IngredientsSection ingredients={recipe.ingredients} />
        <StepsSection steps={recipe.steps} />
        {recipe.original_recipe_url && (
          <SourceLink url={recipe.original_recipe_url} />
        )}
      </Card>
    </div>
    <div className="w-full md:w-1/4 md:sticky md:top-20 md:self-start">
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
