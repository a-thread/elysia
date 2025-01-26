import { StepIngredient } from "./StepIngredient";
import { IdTitle } from "./Tag";
import { TitleDescriptionImgUrl } from "./TitleDescriptionImgUrl";

export interface Recipe extends TitleDescriptionImgUrl {
    prep_time: number;
    cook_time: number;
    servings: number;
    original_recipe_url: string;

    ingredients: StepIngredient[];
    steps: StepIngredient[];
    collections?: IdTitle[];
    tags?: IdTitle[];
    // set by FE:
    id?: string;
    total_time?: number;
    is_public?: boolean;
}