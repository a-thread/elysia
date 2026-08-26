import React from "react";
import { Link } from "react-router-dom";

const CtaBand: React.FC = () => {
  return (
    <div className="mt-10 bg-leaf-green-800 dark:bg-leaf-green-900 rounded-2xl px-6 py-7 sm:px-9 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <div className="text-white text-lg font-bold mb-1">
          Looking for something specific?
        </div>
        <div className="text-leaf-green-100 text-sm">
          Search and filter the full recipe collection.
        </div>
      </div>
      <Link
        to="/recipes"
        className="shrink-0 border border-white/60 text-white font-medium text-sm px-5 py-2.5 rounded-lg hover:bg-white/10 transition"
      >
        Browse All Recipes
      </Link>
    </div>
  );
};

export default CtaBand;
