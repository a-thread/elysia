import React, { useState, useEffect, useRef } from "react";
import { Button, Tag } from "./Buttons";

const MultiSelect = ({
  inputId = 'multi-select-search',
  options = [],
  selectedOptions = [],
  setSelectedOptions,
  onSearch,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [openUpwards, setOpenUpwards] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);
  const listboxRef = useRef(null);

  useEffect(() => {
    setSelectedIds(selectedOptions.map((o) => o.id));
  }, [selectedOptions]);

  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch(searchTerm);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchTerm, onSearch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
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
      const dropdownHeight = 200; // Estimated dropdown height
      setOpenUpwards(spaceBelow < dropdownHeight);
    }
  }, [isDropdownOpen]);

  const handleSelect = (option) => {
    const updatedOptions = selectedIds.includes(option.id)
      ? selectedOptions.filter((o) => o.id !== option.id)
      : [...selectedOptions, option];
    setSelectedOptions(updatedOptions);
  };

  const handleRemove = (option) => {
    const updatedOptions = selectedOptions.filter((o) => o.id !== option.id);
    setSelectedOptions(updatedOptions);
  };

  const handleKeyDown = (e) => {
    if (
      e.key === "Backspace" &&
      searchTerm === "" &&
      selectedOptions.length > 0
    ) {
      // Remove the last selected option if backspace is pressed when search is empty
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
          <Tag
            key={option.id}
            title={option.title}
            onClick={(e) => {
              e.stopPropagation();
              handleRemove(option);
            }}
          >
          </Tag>
        ))}
        <input
          type="text"
          id={inputId}
          ref={inputRef}
          placeholder={selectedOptions.length === 0 ? `Select ${inputId}...` : ""}
          className="flex-1 p-1 border-none outline-none bg-transparent text-gray-900 dark:text-gray-100"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          aria-labelledby="multi-select-label"
        />
      </div>

      {/* Dropdown List */}
      {isDropdownOpen && (
        <div
          ref={listboxRef}
          role="listbox"
          tabIndex="0"
          aria-labelledby="multi-select-label"
          className={`absolute w-full border border-gray-300 bg-white dark:bg-gray-800 shadow-md max-h-40 overflow-y-auto focus:outline-none ${
            openUpwards
              ? "bottom-full pb-2 rounded-t-lg"
              : "top-full pt-2 rounded-b-lg"
          }`}
        >
          {options.length > 0 ? (
            options.map((option, index) => (
              <Button
                key={option.id}
                btnType="dropdown"
                className={
                  selectedIds.includes(option.id) &&
                  "bg-leafGreen-100 dark:text-leafGreen-600"
                }
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelect(option);
                }}
                role="option"
                aria-selected={selectedIds.includes(option.id)}
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
