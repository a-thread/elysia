import React, { ChangeEvent } from 'react';
import { Recipe } from '../models/Recipe';
import { FieldLabel, fieldClasses } from './FormField';

interface RecipeDetailsFormProps {
  formData: Recipe;
  onFormChange: (key: keyof Recipe, value: number) => void;
}

const RecipeDetailsForm: React.FC<RecipeDetailsFormProps> = ({ formData, onFormChange }) => {
  return (
    <div className="grid grid-cols-3 gap-3 w-full mb-4">
      <div>
        <FieldLabel htmlFor="servings">Servings</FieldLabel>
        <input
          type="number"
          name="servings"
          id="servings"
          className={fieldClasses}
          value={formData.servings}
          onChange={(e: ChangeEvent<HTMLInputElement>) => onFormChange('servings', Number(e.target.value))}
        />
      </div>

      <div>
        <FieldLabel htmlFor="prep_time">Prep Time (min)</FieldLabel>
        <input
          type="number"
          name="prep_time"
          id="prep_time"
          className={fieldClasses}
          value={formData.prep_time}
          onChange={(e: ChangeEvent<HTMLInputElement>) => onFormChange('prep_time', Number(e.target.value))}
        />
      </div>

      <div>
        <FieldLabel htmlFor="cook_time">Cook Time (min)</FieldLabel>
        <input
          type="number"
          name="cook_time"
          id="cook_time"
          className={fieldClasses}
          value={formData.cook_time}
          onChange={(e: ChangeEvent<HTMLInputElement>) => onFormChange('cook_time', Number(e.target.value))}
        />
      </div>
    </div>
  );
}

export default RecipeDetailsForm;
