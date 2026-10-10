import { Recipe } from "@recipes/models/Recipe";
import { recipeToTernMeal } from "@recipes/utils/recipeToTernMeal";
import { supabaseWithAbort } from "@shared/services/SupabaseWithAbort";

/**
 * Tern (the health tracker) keeps its data in the `tern` schema of the same Supabase
 * project, so a signed-in user's session already works there. Saved meals are
 * row-level-secured to the signed-in user.
 */
export type TernSendFailure = "no-nutrition" | "name-taken" | "unavailable" | "failed";

export class TernSendError extends Error {
  constructor(public reason: TernSendFailure) {
    super(reason);
    this.name = "TernSendError";
  }
}

const sendRecipe = async (
  recipe: Pick<Recipe, "id" | "title" | "nutrition">,
) => {
  const meal = recipeToTernMeal(recipe);
  if (!meal) throw new TernSendError("no-nutrition");

  return await supabaseWithAbort.request(
    `sendToTern-${meal.id}`,
    async (client) => {
      const { error } = await client
        .schema("tern")
        .from("saved_meals")
        .upsert(
          {
            id: meal.id,
            name: meal.name,
            items: meal.items,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "id" },
        );

      if (!error) return meal;

      // Tern allows one saved meal per name, case-insensitively.
      if (error.code === "23505") throw new TernSendError("name-taken");
      // Schema not exposed, or the user has no access to Tern's tables.
      if (error.code === "PGRST106" || error.code === "42501" || error.code === "42P01") {
        throw new TernSendError("unavailable");
      }
      throw new TernSendError("failed");
    },
  );
};

const TernService = { sendRecipe };

export default TernService;
