import React from 'react';

function EmptyState({ message }) {
  return (
    <div className="text-center text-gray-500 p-4 border border-gray-200 rounded-lg">
      {message}
    </div>
  );
}

export default EmptyState;
