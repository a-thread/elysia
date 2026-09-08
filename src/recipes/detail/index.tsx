import React from "react";
import IngredientsSection from "./components/IngredientsSection";
import StepsSection from "./components/StepsSection";
import RecipeTimeSection from "./components/RecipeTimeSection";
import EllipsisMenu from "./components/EllipsisMenu";
import { useRecipeDetailPage } from "./hooks/useRecipeDetailPage";
import Loading from "@shared/components/Loading";
import EmptyState from "@shared/components/EmptyState";
import TitleDescHeader from "@shared/components/TitleDescHeader";
import Card from "@shared/components/Card";
import BackLink from "@shared/components/BackLink";
import { Recipe as RecipeModel } from "@recipes/models/Recipe";

const Recipe: React.FC = () => {
  const {
    recipe,
    loading,
    canEdit,
    isOwner,
    editRecipe,
    confirmDelete,
    addTags,
    addToCollection,
    exportRecipe,
    isPublic,
    publicPermission,
    sharedUsers,
    toggleIsPublic,
    setPublicPermission,
    shareWithUser,
    revokeAccessById,
    copyLink,
  } = useRecipeDetailPage();

  if (loading) return <Loading className="mt-40" />;
  if (!recipe) return <EmptyState message="Recipe not found." />;

  return (
    <div className="max-w-4xl mx-auto mt-4">
      <div className="w-full flex justify-between items-center mb-4">
        <BackLink to="/recipes">Recipes</BackLink>
        <EllipsisMenu
          canEdit={canEdit}
          isOwner={isOwner}
          isPublic={isPublic}
          publicPermission={publicPermission}
          sharedUsers={sharedUsers}
          onEdit={editRecipe}
          onDelete={confirmDelete}
          onAddTags={addTags}
          onAddToCollection={addToCollection}
          onExport={exportRecipe}
          onTogglePublicShare={toggleIsPublic}
          onSetPublicPermission={setPublicPermission}
          shareWithUser={shareWithUser}
          onRevokeAccess={revokeAccessById}
          onCopyLink={copyLink}
        />
      </div>
      <Content recipe={recipe} />
    </div>
  );
};

const Content: React.FC<{ recipe: RecipeModel }> = ({ recipe }) => (
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
