import React from 'react';

function StepsSection({ steps }) {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8 mb-4">
        Steps
      </h2>
      {steps?.length > 0 && (
        <ol className="list-decimal pl-6 mb-6 text-gray-700 dark:text-gray-300">
          {steps.map((step, index) => (
            <li
              key={index}
              className="text-gray-700 dark:text-gray-200 mb-2 p-2"
            >
              {step.instruction}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

export default StepsSection;
