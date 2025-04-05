import { StepIngredient } from "@shared/models/StepIngredient";
import React from "react";


const StepList: React.FC<{steps: StepIngredient[]}> = ({ steps }) => {
  return (
    <ol className="list-decimal space-y-4 ml-5 text-gray-800 dark:text-gray-300">
      {steps.map((step, index) => (
        <li key={index} className="text-lg p-2 leading-relaxed">
          {step.value}  
        </li>
      ))}
    </ol>
  );
};

export default StepList;
