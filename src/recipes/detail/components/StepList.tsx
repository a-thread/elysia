import React from "react";
import { StepIngredient } from "@recipes/models/StepIngredient";

interface StepListProps {
  steps: StepIngredient[];
  /** "detail" is the compact recipe-page rendering; "cooking" is the larger,
   * easier-to-read-at-arm's-length rendering used by GetCookingModal. */
  variant?: "detail" | "cooking";
}

const StepList: React.FC<StepListProps> = ({ steps, variant = "detail" }) => {
  const isCooking = variant === "cooking";

  return (
    <ol className={`flex flex-col ${isCooking ? "gap-5" : "gap-3.5"}`}>
      {steps.map((step, index) => (
        <li key={step.id ?? index} className="flex gap-3">
          <span
            className={`shrink-0 rounded-full bg-leaf-green-700 dark:bg-leaf-green-600 text-white font-bold flex items-center justify-center mt-0.5 ${
              isCooking ? "w-7 h-7 text-sm" : "w-6 h-6 text-xs"
            }`}
          >
            {index + 1}
          </span>
          <span
            className={
              isCooking
                ? "text-lg leading-relaxed text-gray-800 dark:text-gray-300"
                : "text-leaf-green-800 dark:text-gray-200 max-w-full break-words whitespace-pre-wrap"
            }
          >
            {step.value}
          </span>
        </li>
      ))}
    </ol>
  );
};

export default StepList;
