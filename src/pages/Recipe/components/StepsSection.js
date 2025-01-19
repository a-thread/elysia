import React from 'react';
import ListItem from './ListItem';

function StepsSection({ steps }) {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-leafGreen-900 dark:text-leafGreen-100 mt-8 mb-2">
        Steps
      </h2>
      {steps?.length > 0 && (
        <ol className="list-decimal pl-6 mb-6 text-leafGreen-800 dark:text-gray-300">
          {steps.map((step, index) => (
            <ListItem value={step.value} index={index} />
          ))}
        </ol>
      )}
    </div>
  );
}

export default StepsSection;
