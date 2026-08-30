import React, { useEffect, useRef } from "react";
import { FaTimes } from "react-icons/fa";
import { ModalSize } from "./ModalSize";
import { BaseModalProps } from "./BaseModalProps";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

const Modal: React.FC<BaseModalProps> = ({
  size = ModalSize.Medium,
  onClose,
  children,
}) => {
  const modalRef = useRef<HTMLDivElement | null>(null);

  // Move focus into the modal on open, trap Tab within it, close on Escape,
  // and return focus to whatever triggered the modal on close.
  useEffect(() => {
    const modalEl = modalRef.current;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const firstFocusable = modalEl?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
    (firstFocusable ?? modalEl)?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab" || !modalEl) return;

      const focusableEls = Array.from(
        modalEl.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
      );
      if (focusableEls.length === 0) return;
      const first = focusableEls[0];
      const last = focusableEls[focusableEls.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previouslyFocused?.focus();
    };
  }, [onClose]);

  // Determine modal size classes. The Large variant is used by content
  // (GetCookingModal) that itself switches to a single-column mobile layout
  // at the `md` breakpoint, so it stays full-screen until `md` too instead
  // of the `sm` breakpoint the other sizes use — otherwise there's a gap
  // between `sm` and `md` where the modal shrinks but the content is still
  // rendering its mobile layout.
  const modalSize =
    size === ModalSize.Large
      ? "max-w-5xl md:max-w-[1200px] md:w-[calc(100%-64px)] md:max-h-[calc(100%-64px)]"
      : "sm:max-w-md sm:w-auto sm:h-auto";

  const roundedAndShadow =
    size === ModalSize.Large
      ? "rounded-none md:rounded-lg shadow-lg md:shadow-xl"
      : "rounded-none sm:rounded-lg shadow-lg sm:shadow-xl";

  const modalClasses = `relative bg-white dark:bg-gray-800 text-black/90 ${roundedAndShadow} transition-shadow-xs duration-300 ease-in-out flex flex-col h-screen w-screen ${modalSize} p-6`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/50"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className={modalClasses}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 p-1 rounded-full text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-leaf-green-300"
        >
          <FaTimes className="w-6 h-6" aria-hidden="true" />
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
