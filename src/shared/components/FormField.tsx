import React from "react";

export const fieldClasses =
  "block w-full text-sm text-gray-900 dark:text-white bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 focus:outline-hidden focus:ring-2 focus:ring-leaf-green-200 dark:focus:ring-leaf-green-800 focus:border-leaf-green-500";

interface FieldLabelProps {
  htmlFor: string;
  children: React.ReactNode;
  className?: string;
}

export const FieldLabel: React.FC<FieldLabelProps> = ({ htmlFor, children, className = "" }) => (
  <label
    htmlFor={htmlFor}
    className={`block text-xs font-semibold text-leaf-green-700 dark:text-leaf-green-300 mb-1.5 ${className}`}
  >
    {children}
  </label>
);
