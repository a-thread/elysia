import React from "react";

const ListItem: React.FC<{ value: string, index: number }> = ({ value, index }) => {
  return (
    <li key={index} className="text-leaf-green-800 dark:text-gray-200 p-2">
      <span className="max-w-full break-word whitespace-pre-wrap">{value}</span>
    </li>
  );
};

export default ListItem;
