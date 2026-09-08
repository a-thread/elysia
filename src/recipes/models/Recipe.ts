import { StepIngredient } from "./StepIngredient";
import { IdTitle } from "@shared/models/Tag";
import { TitleDescriptionImgUrl } from "@shared/models/TitleDescriptionImgUrl";
import { Permission } from "@shared/models/Permission";

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
    public_permission?: Permission;
    can_edit?: boolean;
    is_owner?: boolean;
}