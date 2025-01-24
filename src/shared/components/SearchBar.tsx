import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Tag } from "@shared/models/Tag";
import React, { useState, useEffect, useRef, ChangeEvent } from "react";

interface SearchDropdownProps {
  options: Tag[];
  selectedOptions: Tag[];
  placeholder?: string;
  setSelectedOptions: (options: Tag[]) => void;
  onSearch: (searchTerm: string) => void;
}

const SearchBar: React.FC<SearchDropdownProps> = ({
  options = [],
  selectedOptions = [],
  placeholder = "Filter recipes...",
  setSelectedOptions,
  onSearch,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [openUpwards, setOpenUpwards] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch(searchTerm);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm, onSearch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isDropdownOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isDropdownOpen]);

  useEffect(() => {
    if (isDropdownOpen && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      setOpenUpwards(spaceBelow < 250); // Adjust based on dropdown height
    }
  }, [isDropdownOpen]);

  const handleSelect = (option: Tag) => {
    const alreadySelected = selectedOptions.find((o) => o.id === option.id);
    setSelectedOptions(
      alreadySelected
        ? selectedOptions.filter((o) => o.id !== option.id)
        : [...selectedOptions, option]
    );
  };

  const handleRemove = (option: Tag) => {
    setSelectedOptions(selectedOptions.filter((o) => o.id !== option.id));
  };

  const handleClearSearchBar = () => {
    setSearchTerm("");
    setSelectedOptions([]);
  };

  return (
    <div className="relative w-full pb-4" ref={dropdownRef}>
      {/* Input and Selected Tags */}
      <div
        className={`border border-gray-300 p-2 cursor-text flex flex-wrap items-center gap-2 ${
          isDropdownOpen
            ? `rounded-${openUpwards ? "b" : "t"}-lg`
            : "rounded-lg"
        }`}
        onClick={() => options.length > 0 && setIsDropdownOpen(true)}
      >
        <MagnifyingGlassIcon className="w-5 h-5" />
        {selectedOptions.map((option) => (
          <span
            key={option.id}
            className="bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded flex items-center"
          >
            {option.title}
            <button
              className="ml-1 text-gray-600 hover:text-gray-800"
              onClick={(e) => {
                e.stopPropagation();
                handleRemove(option);
              }}
            >
              ×
            </button>
          </span>
        ))}
        <input
          type="text"
          ref={inputRef}
          placeholder={selectedOptions.length === 0 ? placeholder : ""}
          className="flex-1 p-1 border-none outline-none bg-transparent text-gray-900"
          value={searchTerm}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setSearchTerm(e.target.value)
          }
        />
        {(searchTerm?.length > 0 || selectedOptions?.length > 0) && (
            <XMarkIcon
              className="w-6 h-6 cursor-pointer"
              title="Clear Search Bar"
              onClick={handleClearSearchBar}
            />
          )}
      </div>

      {/* Dropdown List - Only Render If There Are Options */}
      {isDropdownOpen && options.length > 0 && (
        <div
          className={`absolute w-full max-w-[320px] border border-gray-300 bg-white shadow-md max-h-60 overflow-y-auto z-50 ${
            openUpwards
              ? "bottom-full pb-2 rounded-t-lg"
              : "top-full pt-2 rounded-b-lg"
          }`}
        >
          {options.map((option) => (
            <div
              key={option.id}
              className={`p-2 flex justify-between items-center cursor-pointer hover:bg-gray-100 ${
                selectedOptions.some((o) => o.id === option.id)
                  ? "bg-blue-50"
                  : ""
              }`}
              onClick={() => handleSelect(option)}
            >
              <span>{option.title}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
