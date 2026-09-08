import React from 'react';
import { StepIngredient } from '@recipes/models/StepIngredient';
import StepList from './StepList';

const StepsSection: React.FC<{ steps: StepIngredient[] }> = ({ steps }) => {
  if (!steps?.length) return null;

  return (
    <div>
      <h2 className="text-xl md:text-2xl font-semibold text-leaf-green-900 dark:text-leaf-green-100 mt-6 md:mt-8 mb-3 md:mb-4">
        Steps
      </h2>
      <div className="mb-4 md:mb-6">
        <StepList steps={steps} variant="detail" />
      </div>
    </div>
  );
};

export default StepsSection;
