import { StepIngredient } from "./StepIngredient";
import { IdTitle } from "@shared/models/Tag";
import { TitleDescriptionImgUrl } from "@shared/models/TitleDescriptionImgUrl";
import { Permission } from "@shared/models/Permission";

/** Per-serving nutrition; `tier` is the NOVA food class (1-4) that Tern uses. */
export interface RecipeNutrition {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    tier: 1 | 2 | 3 | 4;
    source?: "llm" | "manual" | "scraped";
    estimated_at?: string;
}

export interface Recipe extends TitleDescriptionImgUrl {
    prep_time: number;
    cook_time: number;
    servings: number;
    original_recipe_url: string;
    nutrition?: RecipeNutrition | null;

    ingredients: StepIngredient[];
    steps: StepIngredient[];
    collections?: IdTitle[];
    tags?: IdTitle[];
    // set by FE:
    id?: string;
    total_time?: number;
    is_public?: boolean;
    public_permission?: Permission;
    can_edit?: boolean;
    is_owner?: boolean;
}