import { useEffect, useState } from "react";
import RecipeService from "@shared/services/RecipeService";
import { Recipe } from "@shared/models/Recipe";
import { useAuth } from "@shared/contexts/AuthContext";
import Loading from "@shared/components/Loading";
import EmptyState from "@shared/components/EmptyState";
import Hero from "./components/Hero";
import MoreToExplore from "./components/MoreToExplore";
import CtaBand from "./components/CtaBand";

const Home: React.FC = () => {
  const { user, authHasBeenChecked } = useAuth();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authHasBeenChecked) return;

    let cancelled = false;
    setLoading(true);
    RecipeService.getRecipeList(0, 4, "", user?.id)
      .then((response) => {
        if (!cancelled) setRecipes(response?.data || []);
      })
      .catch((error) => console.error("Error fetching featured recipes:", error))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [authHasBeenChecked, user?.id]);

  if (loading) {
    return <Loading className="mt-6" />;
  }

  if (!recipes.length) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <EmptyState message="No recipes yet. Add one to get started!" />
      </div>
    );
  }

  const [featured, ...rest] = recipes;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <Hero recipe={featured} />
      <MoreToExplore recipes={rest} />
      <CtaBand />
    </div>
  );
};

export default Home;
