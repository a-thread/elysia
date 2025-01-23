import React from 'react';
import ListItem from './ListItem';
import { StepIngredient } from '@shared/models/StepIngredient';

const StepsSection: React.FC<{steps: StepIngredient[]}> = ({ steps }) => {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-leaf-green-900 dark:text-leaf-green-100 mt-8 mb-2">
        Steps
      </h2>
      {steps?.length > 0 && (
        <ol className="list-decimal pl-6 mb-6 text-leaf-green-800 dark:text-gray-300">
          {steps.map((step, index) => (
            <ListItem key={index} value={step.value} index={index} />
          ))}
        </ol>
      )}
    </div>
  );
}

export default StepsSection;
