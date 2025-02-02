import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { IdTitle } from "@shared/models/Tag";
import React, { useState, useEffect, useRef, ChangeEvent } from "react";
import { Button, TagButton } from "./Buttons";

interface SearchDropdownProps {
  options: IdTitle[];
  selectedOptions: IdTitle[];
  placeholder?: string;
  setSelectedOptions: (options: IdTitle[]) => void;
  onSearch: (searchTerm: string) => void;
}

const SearchBar: React.FC<SearchDropdownProps> = ({
  options = [],
  selectedOptions = [],
  placeholder = "Search by title, description, ingredient or tag...",
  setSelectedOptions,
  onSearch,
}) => {
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [openUpwards, setOpenUpwards] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const listboxRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setSelectedIds(selectedOptions.map((o) => o?.id || ""));
  }, [selectedOptions]);

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

  const handleSelect = (option: IdTitle) => {
    if (option.id) {
      const updatedOptions = selectedIds.includes(option.id)
        ? selectedOptions.filter((o) => o.id !== option.id)
        : [...selectedOptions, option];
      setSelectedOptions(updatedOptions);
    }
  };

  const handleRemove = (option: IdTitle) => {
    const updatedOptions = selectedOptions.filter((o) => o.id !== option.id);
    setSelectedOptions(updatedOptions);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      e.key === "Backspace" &&
      searchTerm === "" &&
      selectedOptions.length > 0
    ) {
      handleRemove(selectedOptions[selectedOptions.length - 1]);
    }
    if (e.key === "ArrowDown") {
      setIsDropdownOpen(true);
      listboxRef.current?.focus();
    }
  };

  const handleClearSearchBar = () => {
    setSearchTerm("");
    setSelectedOptions([]);
  };

  return (
    <div className="relative w-full mb-4" ref={dropdownRef}>
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
          <TagButton
            key={option.id}
            title={option.title}
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              handleRemove(option);
            }}
          />
        ))}
        <input
          type="text"
          ref={inputRef}
          placeholder={selectedOptions.length === 0 ? placeholder : ""}
          className="flex-1 p-1 border-none outline-none bg-transparent text-gray-900 dark:text-white"
          value={searchTerm}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setSearchTerm(e.target.value)
          }
          onKeyDown={handleKeyDown}
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
          ref={listboxRef}
          role="listbox"
          aria-labelledby="multi-select-label"
          className={`absolute w-full z-10 max-w-[320px] border border-gray-300 bg-white dark:bg-gray-800 shadow-md max-h-40 overflow-y-auto focus:outline-hidden ${
            openUpwards
              ? "bottom-full pb-2 rounded-t-lg"
              : "top-full pt-2 rounded-b-lg"
          }`}
        >
          {options.map((option) => (
            <Button
              key={option.id}
              btnType="dropdown"
              className={
                option.id && selectedIds.includes(option.id)
                  ? "bg-leaf-green-100 dark:text-leaf-green-600"
                  : ""
              }
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                handleSelect(option);
              }}
              role="option"
              aria-selected={
                option.id && selectedIds.includes(option.id) ? true : undefined
              }
            >
              {option.title}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
