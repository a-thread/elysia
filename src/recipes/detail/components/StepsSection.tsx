import React from 'react';
import { StepIngredient } from '@shared/models/StepIngredient';

const StepsSection: React.FC<{ steps: StepIngredient[] }> = ({ steps }) => {
  if (!steps?.length) return null;

  return (
    <div>
      <h2 className="text-2xl font-semibold text-leaf-green-900 dark:text-leaf-green-100 mt-8 mb-4">
        Steps
      </h2>
      <ol className="flex flex-col gap-3.5 mb-6">
        {steps.map((step, index) => (
          <li key={step.id} className="flex gap-3">
            <span className="shrink-0 w-6 h-6 rounded-full bg-leaf-green-700 dark:bg-leaf-green-600 text-white text-xs font-bold flex items-center justify-center mt-0.5">
              {index + 1}
            </span>
            <span className="text-leaf-green-800 dark:text-gray-200 max-w-full break-words whitespace-pre-wrap">
              {step.value}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default StepsSection;
