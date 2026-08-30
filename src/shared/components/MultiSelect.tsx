import React, { useState, useEffect, useRef, ChangeEvent } from "react";
import { FaPlus } from "react-icons/fa";
import { Button, TagButton } from "./Buttons";
import { IdTitle } from "@shared/models/Tag";

// Define MultiSelect Props
interface MultiSelectProps {
  inputId: string;
  options: IdTitle[];
  selectedOptions: IdTitle[];
  placeholder: string;
  setSelectedOptions: (options: IdTitle[]) => void;
  onSearch: (searchTerm: string) => void;
  /** When set, lets the user create a new option from their search text if nothing matches it exactly. */
  allowCreate?: boolean;
  onCreateOption?: (title: string) => Promise<IdTitle | null>;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  inputId = "",
  options = [],
  selectedOptions = [],
  placeholder = "",
  setSelectedOptions,
  onSearch,
  allowCreate = false,
  onCreateOption,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [openUpwards, setOpenUpwards] = useState<boolean>(false);
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isCreating, setIsCreating] = useState<boolean>(false);

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const listboxRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setSelectedIds(selectedOptions.map((o) => o?.id || ""));
  }, [selectedOptions]);

  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch(searchTerm);
    }, 400);
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
      setOpenUpwards(spaceBelow < 200);
    }
  }, [isDropdownOpen]);

  const handleSelect = (option: IdTitle) => {
    if (option.id) {
      if (selectedIds.includes(option.id)) {
        setSelectedOptions(selectedOptions.filter((o) => o.id !== option.id));
      } else {
        setSelectedOptions([...selectedOptions, option]);
        setSearchTerm("");
      }
    }
  };

  const handleRemove = (option: IdTitle) => {
    const updatedOptions = selectedOptions.filter((o) => o.id !== option.id);
    setSelectedOptions(updatedOptions);
  };

  const trimmedSearch = searchTerm.trim();
  const hasExactMatch = [...options, ...selectedOptions].some(
    (o) => o.title.trim().toLowerCase() === trimmedSearch.toLowerCase()
  );
  const showCreateOption =
    allowCreate && !!onCreateOption && trimmedSearch.length > 0 && !hasExactMatch;

  const handleCreateOption = async () => {
    if (!onCreateOption || isCreating) return;
    setIsCreating(true);
    try {
      const created = await onCreateOption(trimmedSearch);
      if (created) {
        setSelectedOptions([...selectedOptions, created]);
        setSearchTerm("");
      }
    } finally {
      setIsCreating(false);
    }
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

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Label for Accessibility */}
      <label id={`${inputId}-label`} htmlFor={inputId} className="sr-only">
        {placeholder || "Select options"}
      </label>

      {/* Selection and Input Container */}
      <div
        className={`border border-gray-300 dark:border-gray-600 bg-transparent min-h-9 px-3 py-1 cursor-text flex flex-wrap items-center gap-2 transition-shadow ${
          isDropdownOpen
            ? `ring-2 ring-leaf-green-200 dark:ring-leaf-green-800 border-leaf-green-500 rounded-${openUpwards ? "b" : "t"}-lg`
            : "rounded-lg"
        }`}
        onClick={() => setIsDropdownOpen(true)}
      >
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
          id={inputId}
          ref={inputRef}
          placeholder={selectedOptions.length === 0 ? placeholder : ""}
          className="flex-1 min-w-0 border-none outline-hidden bg-transparent text-sm text-gray-900 dark:text-gray-100"
          value={searchTerm}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setSearchTerm(e.target.value)
          }
          onKeyDown={handleKeyDown}
          role="combobox"
          aria-labelledby={`${inputId}-label`}
          aria-haspopup="listbox"
          aria-expanded={isDropdownOpen}
          aria-controls={`${inputId}-listbox`}
          aria-autocomplete="list"
        />
      </div>

      {/* Dropdown List */}
      {isDropdownOpen && (
        <div
          id={`${inputId}-listbox`}
          ref={listboxRef}
          role="listbox"
          aria-labelledby={`${inputId}-label`}
          className={`absolute w-full z-10 border border-gray-300 bg-white dark:bg-gray-800 shadow-md max-h-40 overflow-y-auto focus:outline-hidden ${
            openUpwards
              ? "bottom-full pb-2 rounded-t-lg"
              : "top-full pt-2 rounded-b-lg"
          }`}
        >
          {showCreateOption && (
            <button
              type="button"
              disabled={isCreating}
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                handleCreateOption();
              }}
              className="w-full flex items-center gap-2 px-4 py-2 text-left text-sm font-semibold text-leaf-green-700 dark:text-leaf-green-300 hover:bg-leaf-green-50 dark:hover:bg-leaf-green-900/30 transition disabled:opacity-50 disabled:pointer-events-none"
            >
              <FaPlus className="w-3 h-3 shrink-0" />
              {isCreating ? `Creating "${trimmedSearch}"…` : `Create "${trimmedSearch}"`}
            </button>
          )}

          {options.length > 0 ? (
            options.map((option) => (
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
                  option.id && selectedIds.includes(option.id)
                    ? true
                    : undefined
                }
              >
                {option.title}
              </Button>
            ))
          ) : (
            !showCreateOption && (
              <div className="p-2 text-gray-500 dark:text-gray-400" role="status">
                No results found
              </div>
            )
          )}

          {/* Footer for limited results message */}
          {options.length >= 25 && (
            <div className="px-4 py-2 border-t border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-900">
              <small className="text-gray-500 dark:text-gray-400">
                Search results are limited to 25 results.
              </small>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MultiSelect;
