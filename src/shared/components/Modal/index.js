import React from "react";
import { XMarkIcon } from "@heroicons/react/20/solid";
import "./style.css";

function Modal({ children, onClose, size = "small" }) {
  // Define modal width based on the "size" prop
  const modalSize =
    size === "large"
      ? "large-modal max-w-5xl"
      : "max-w-md";

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 dark:bg-opacity-70 z-50">
      <div
        className={`bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full ${modalSize} relative
          sm:w-auto sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-5xl 
          xs:w-screen xs:h-screen xs:rounded-none`}
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
}

export default Modal;
