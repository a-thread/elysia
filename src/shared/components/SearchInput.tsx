import React, { useState, useEffect, ChangeEvent } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";

interface SearchInputProps {
  placeholder?: string;
  onSearch: (term: string) => void;
  className?: string;
  /** Hide the leading search icon, e.g. when an external toggle button already shows one. */
  showIcon?: boolean;
  autoFocus?: boolean;
}

const SearchInput: React.FC<SearchInputProps> = ({
  placeholder = "Search...",
  onSearch,
  className = "",
  showIcon = true,
  autoFocus = false,
}) => {
  const [term, setTerm] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => onSearch(term), 500);
    return () => clearTimeout(handler);
  }, [term, onSearch]);

  return (
    <div
      className={`flex items-center gap-2 h-9 border border-gray-300 dark:border-gray-600 rounded-lg px-3 bg-transparent focus-within:ring-2 focus-within:ring-leaf-green-200 dark:focus-within:ring-leaf-green-800 focus-within:border-leaf-green-500 transition-shadow ${className}`}
    >
      {showIcon && (
        <FaSearch className="w-4 h-4 text-gray-400 shrink-0" aria-hidden="true" />
      )}
      <input
        type="text"
        value={term}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setTerm(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        autoFocus={autoFocus}
        className="flex-1 min-w-0 bg-transparent border-none outline-hidden text-sm text-gray-900 dark:text-white placeholder:text-gray-400"
      />
      {term.length > 0 && (
        <button
          type="button"
          onClick={() => setTerm("")}
          aria-label="Clear search"
          className="shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-leaf-green-400 rounded-sm"
        >
          <FaTimes className="w-4 h-4" aria-hidden="true" />
        </button>
      )}
    </div>
  );
};

export default SearchInput;
