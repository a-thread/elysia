import React, { useState, useEffect, useRef, ChangeEvent } from "react";
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
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  inputId = "",
  options = [],
  selectedOptions = [],
  placeholder = '',
  setSelectedOptions,
  onSearch,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [openUpwards, setOpenUpwards] = useState<boolean>(false);
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

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

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Label for Accessibility */}
      <label id="multi-select-label" className="sr-only">
        Select options
      </label>

      {/* Selection and Input Container */}
      <div
        className={`border border-gray-300 p-2 cursor-text flex flex-wrap items-center gap-2 ${
          isDropdownOpen
            ? `rounded-${openUpwards ? "b" : "t"}-lg`
            : "rounded-lg"
        }`}
        onClick={() => setIsDropdownOpen(true)}
        aria-haspopup="listbox"
        aria-expanded={isDropdownOpen}
        role="combobox"
        aria-controls="multi-select-listbox"
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
            placeholder={
              selectedOptions.length === 0 ? placeholder : ""
            }
            className="flex-1 p-1 border-none outline-hidden bg-transparent text-gray-900 dark:text-gray-100"
            value={searchTerm}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setSearchTerm(e.target.value)
            }
            onKeyDown={handleKeyDown}
            aria-labelledby="multi-select-label"
          />
      </div>

      {/* Dropdown List */}
      {isDropdownOpen && (
        <div
          ref={listboxRef}
          role="listbox"
          tabIndex={0}
          aria-labelledby="multi-select-label"
          className={`absolute w-full z-10 border border-gray-300 bg-white dark:bg-gray-800 shadow-md max-h-40 overflow-y-auto focus:outline-hidden ${
            openUpwards
              ? "bottom-full pb-2 rounded-t-lg"
              : "top-full pt-2 rounded-b-lg"
          }`}
        >
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
            <div className="p-2 text-gray-500 dark:text-gray-400" role="status">
              No results found
            </div>
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
