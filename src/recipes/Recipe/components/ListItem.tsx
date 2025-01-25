import React from "react";

const ListItem: React.FC<{ value: string, index: number }> = ({ value, index }) => {
  return (
    <li key={index} className="text-leaf-green-800 dark:text-gray-200 p-2">
      {value}
    </li>
  );
};

export default ListItem;
