import React from "react";
import { FaPlus } from "react-icons/fa6";

interface FabProps {
  onClick: () => void;
  label: string;
}

const Fab: React.FC<FabProps> = ({ onClick, label }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={label}
    title={label}
    className="sm:hidden fixed right-5 bottom-6 z-30 flex items-center justify-center w-14 h-14 rounded-full bg-leaf-green-700 dark:bg-leaf-green-600 text-white shadow-lg shadow-leaf-green-900/30 hover:bg-leaf-green-800 dark:hover:bg-leaf-green-800 transition focus:outline-hidden focus-visible:ring-2 focus-visible:ring-leaf-green-400"
  >
    <FaPlus className="w-5 h-5" aria-hidden="true" />
  </button>
);

export default Fab;
