import React from "react";

const ListItem: React.FC<{ value: string }> = ({ value }) => {
  return (
    <li className="flex items-start gap-2.5 text-leaf-green-800 dark:text-gray-200 py-1">
      <span className="w-1.5 h-1.5 rounded-full bg-leaf-green-400 shrink-0 mt-2.5" />
      <span className="max-w-full break-word whitespace-pre-wrap">{value}</span>
    </li>
  );
};

export default ListItem;
