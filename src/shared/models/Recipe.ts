import { Collection } from "./Collection";
import { StepIngredient } from "./StepIngredient";
import { Tag } from "./Tag";
import { TitleDescriptionImgUrl } from "./TitleDescriptionImgUrl";

export interface Recipe extends TitleDescriptionImgUrl {
    prep_time: number;
    cook_time: number;
    servings: number;
    original_recipe_url: string;

    ingredients: StepIngredient[];
    steps: StepIngredient[];
    collections?: Collection[];
    tags?: Tag[];

    // set by FE:
    id?: string;
    total_time?: number;
    is_public?: boolean;
}