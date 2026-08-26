import React, { ChangeEvent } from 'react';
import { Recipe } from '../models/Recipe';

interface RecipeDetailsFormProps {
  formData: Recipe;
  onFormChange: (key: keyof Recipe, value: number) => void;
}

const fieldClasses = "block w-full text-sm text-gray-900 dark:text-white bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 focus:outline-hidden focus:ring-2 focus:ring-leaf-green-200 dark:focus:ring-leaf-green-800 focus:border-leaf-green-500";
const labelClasses = "block text-xs font-semibold text-leaf-green-700 dark:text-leaf-green-300 mb-1.5";

const RecipeDetailsForm: React.FC<RecipeDetailsFormProps> = ({ formData, onFormChange }) => {
  return (
    <div className="grid grid-cols-3 gap-3 w-full mb-4">
      <div>
        <label htmlFor="servings" className={labelClasses}>
          Servings
        </label>
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
        <label htmlFor="prep_time" className={labelClasses}>
          Prep Time (min)
        </label>
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
        <label htmlFor="cook_time" className={labelClasses}>
          Cook Time (min)
        </label>
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
