import { useState, useRef, useEffect, useId } from "react";
import { FaCheck } from "react-icons/fa";
import IconButton from "./IconButton";

export interface DropdownOption {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
  /** Renders a section label above this item, e.g. "Sort by". */
  sectionLabel?: string;
  /** Renders a divider line above this item. */
  dividerBefore?: boolean;
  /** Presence of this field renders the item as a checkable radio-style option. */
  selected?: boolean;
  disabled?: boolean;
}

interface DropdownProps {
  options: DropdownOption[];
  icon?: React.ReactNode;
  /** Overrides the default circular icon button trigger entirely. */
  trigger?: (args: {
    onClick: () => void;
    isOpen: boolean;
    menuId: string;
  }) => React.ReactNode;
  triggerLabel?: string;
}

const DropdownButton: React.FC<DropdownProps> = ({
  options,
  icon,
  trigger,
  triggerLabel = "More options",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  const toggleOpen = () => setIsOpen((prev) => !prev);

  return (
    <div className="relative inline-block" ref={menuRef}>
      {trigger ? (
        trigger({ onClick: toggleOpen, isOpen, menuId })
      ) : (
        <IconButton
          icon={icon}
          onClick={toggleOpen}
          title={triggerLabel}
          aria-label={triggerLabel}
          aria-haspopup="menu"
          aria-expanded={isOpen}
          aria-controls={menuId}
        />
      )}

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40 sm:hidden"
            aria-hidden="true"
            onClick={() => setIsOpen(false)}
          />
          <div
            id={menuId}
            role="menu"
            className="fixed sm:absolute inset-x-0 sm:inset-x-auto bottom-0 sm:bottom-auto right-0 sm:right-0 top-auto sm:top-full sm:mt-2 z-50 sm:z-20 flex flex-col w-full sm:w-auto sm:min-w-[230px] max-h-[75vh] sm:max-h-none overflow-y-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-t-2xl sm:rounded-xl shadow-xl p-1.5"
          >
            <div
              className="sm:hidden mx-auto mt-1 mb-2 h-1 w-9 shrink-0 rounded-full bg-gray-300 dark:bg-gray-600"
              aria-hidden="true"
            />

            {options.map((option, index) => (
              <div key={index}>
                {option.dividerBefore && (
                  <div
                    className="my-1.5 mx-2 h-px bg-gray-200 dark:bg-gray-700"
                    role="separator"
                  />
                )}
                {option.sectionLabel && (
                  <div className="px-3 pt-2 pb-1 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
                    {option.sectionLabel}
                  </div>
                )}
                <button
                  type="button"
                  role={option.selected !== undefined ? "menuitemradio" : "menuitem"}
                  aria-checked={option.selected !== undefined ? option.selected : undefined}
                  disabled={option.disabled}
                  className={`flex items-center gap-3 w-full text-left px-3 py-2.5 sm:py-2 rounded-lg text-sm transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-leaf-green-400 disabled:opacity-50 disabled:pointer-events-none ${
                    option.selected
                      ? "text-leaf-green-600 dark:text-leaf-green-400 font-medium"
                      : "text-gray-700 dark:text-gray-200"
                  } hover:bg-gray-100 dark:hover:bg-gray-700`}
                  onClick={() => {
                    option.onClick();
                    setIsOpen(false);
                  }}
                >
                  {option.icon && (
                    <span
                      className="shrink-0 w-4 h-4 text-gray-400 dark:text-gray-500"
                      aria-hidden="true"
                    >
                      {option.icon}
                    </span>
                  )}
                  <span className="flex-1">{option.label}</span>
                  {option.selected && (
                    <FaCheck
                      className="w-3.5 h-3.5 shrink-0 text-leaf-green-600 dark:text-leaf-green-400"
                      aria-hidden="true"
                    />
                  )}
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default DropdownButton;
