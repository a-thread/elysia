import React, { useRef } from "react";
import { XMarkIcon } from "@heroicons/react/20/solid";
import PropTypes from "prop-types";

const ModalSize = {
  Small: "small",
  Large: "large",
};

const Modal = ({ size = ModalSize.Medium, onClose, children }) => {
  const modalRef = useRef(null);

  const modalSize =
    size === "large"
      ? "max-w-5xl sm:max-w-[1200px] sm:w-[calc(100%-64px)] sm:max-h-[calc(100%-64px)]"
      : "sm:max-w-md sm:w-auto sm:h-auto";

  const modalClasses = `relative bg-white text-black/90 shadow-lg sm:shadow-xl transition-shadow duration-300 ease-in-out rounded-none sm:rounded-lg flex flex-col overflow-hidden h-screen w-screen ${modalSize} p-6`;

  const handleOutsideClick = (e) => {
    const inputs = modalRef.current.querySelectorAll("input, textarea, select");

    if (!(inputs.length > 0)) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50  dark:bg-opacity-70 z-50"
      onClick={handleOutsideClick}
    >
      <div
        ref={modalRef}
        className={modalClasses}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
        >
          <XMarkIcon className="w-6 h-6" title="Close Modal" />
        </button>
        {children}
      </div>
    </div>
  );
};

Modal.propTypes = {
  size: PropTypes.oneOf(Object.keys(ModalSize)),
  onClose: PropTypes.func.isRequired,
  onOutsideClick: PropTypes.func.isRequired,
  children: PropTypes.node,
};

export default Modal;
