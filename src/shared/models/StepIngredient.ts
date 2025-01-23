export interface StepIngredient {
    id: string;
    value: string;
    sort_number: number;
    
    // set by us
    recipe_id?: string;
    isActive?: boolean;
}