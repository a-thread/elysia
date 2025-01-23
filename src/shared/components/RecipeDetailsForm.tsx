import React, { ChangeEvent } from 'react';
import { Recipe } from '../models/Recipe';

interface RecipeDetailsFormProps {
  formData: Recipe;
  onFormChange: (key: keyof Recipe, value: number) => void;
}

const RecipeDetailsForm: React.FC<RecipeDetailsFormProps> = ({ formData, onFormChange }) => {
  return (
    <form className="w-full">
      <div className="relative z-0 w-full mb-5 group">
        <input
          type="number"
          name="servings"
          id="servings"
          className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-hidden focus:ring-0 focus:border-blue-600 peer"
          placeholder=" "
          value={formData.servings}
          onChange={(e: ChangeEvent<HTMLInputElement>) => onFormChange('servings', Number(e.target.value))}
        />
        <label
          htmlFor="servings"
          className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
        >
          Servings
        </label>
      </div>

      <div className="relative z-0 w-full mb-5 group">
        <input
          type="number"
          name="prep_time"
          id="prep_time"
          className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-hidden focus:ring-0 focus:border-blue-600 peer"
          placeholder=" "
          value={formData.prep_time}
          onChange={(e: ChangeEvent<HTMLInputElement>) => onFormChange('prep_time', Number(e.target.value))}
        />
        <label
          htmlFor="prep_time"
          className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
        >
          Prep Time (minutes)
        </label>
      </div>

      <div className="relative z-0 w-full mb-5 group">
        <input
          type="number"
          name="cook_time"
          id="cook_time"
          className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-hidden focus:ring-0 focus:border-blue-600 peer"
          placeholder=" "
          value={formData.cook_time}
          onChange={(e: ChangeEvent<HTMLInputElement>) => onFormChange('cook_time', Number(e.target.value))}
        />
        <label
          htmlFor="cook_time"
          className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
        >
          Cook Time (minutes)
        </label>
      </div>
    </form>
  );
}

export default RecipeDetailsForm;
