import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import UrlInputForm from "./UrlInputForm";
import HtmlInputForm from "./HtmlInputForm";
import { BaseModalProps } from "../BaseModal/BaseModalProps";

type AddRecipeModalProps = BaseModalProps;

type AddMethod = "url" | "html";

const tabClasses = (active: boolean) =>
  `flex-1 pb-2.5 text-sm font-semibold border-b-2 -mb-px transition-colors ${
    active
      ? "border-leaf-green-700 dark:border-leaf-green-400 text-leaf-green-700 dark:text-leaf-green-300"
      : "border-transparent text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
  }`;

const AddRecipeModal: React.FC<AddRecipeModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<AddMethod>("url");
  const navigate = useNavigate();

  const onManualInputClick = () => {
    navigate("/add-new");
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-labelledby="modal-title"
      className="p-4 flex flex-col h-full sm:h-auto"
    >
      <h2
        id="modal-title"
        className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4"
      >
        Add Recipe
      </h2>

      <div
        className="flex border-b border-gray-200 dark:border-gray-700 mb-4"
        role="tablist"
        aria-label="Add recipe method"
      >
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "url"}
          className={tabClasses(activeTab === "url")}
          onClick={() => setActiveTab("url")}
        >
          Import URL
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "html"}
          className={tabClasses(activeTab === "html")}
          onClick={() => setActiveTab("html")}
        >
          Paste HTML
        </button>
      </div>

      {activeTab === "url" ? (
        <UrlInputForm
          onClose={onClose}
          onSwitchToHtml={() => setActiveTab("html")}
        />
      ) : (
        <HtmlInputForm onClose={onClose} />
      )}

      <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700 flex items-baseline justify-between text-sm text-gray-500 dark:text-gray-400">
        <span>Prefer to enter it yourself?</span>
        <button
          type="button"
          className="font-semibold text-leaf-green-700 dark:text-leaf-green-300 hover:underline"
          onClick={onManualInputClick}
        >
          Manual Input &rarr;
        </button>
      </div>
    </div>
  );
};

export default AddRecipeModal;
