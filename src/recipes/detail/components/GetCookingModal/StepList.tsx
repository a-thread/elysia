import { StepIngredient } from "@shared/models/StepIngredient";
import React from "react";

const StepList: React.FC<{ steps: StepIngredient[] }> = ({ steps }) => {
  return (
    <ol className="flex flex-col gap-5">
      {steps.map((step, index) => (
        <li key={step.id ?? index} className="flex gap-3">
          <span className="shrink-0 w-7 h-7 rounded-full bg-leaf-green-700 dark:bg-leaf-green-600 text-white text-sm font-bold flex items-center justify-center mt-0.5">
            {index + 1}
          </span>
          <span className="text-lg leading-relaxed text-gray-800 dark:text-gray-300">
            {step.value}
          </span>
        </li>
      ))}
    </ol>
  );
};

export default StepList;
