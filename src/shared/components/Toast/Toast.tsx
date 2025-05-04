import React, { JSX } from "react";
import { FaTimes } from "react-icons/fa";
import { 
  FaCheckCircle, 
  FaExclamationCircle, 
  FaTimesCircle, 
  FaInfoCircle 
} from "react-icons/fa";

// Define Toast types
type ToastType = "success" | "error" | "info" | "warning";

// Define prop types
interface ToastProps {
  id: string | number;
  message: string;
  type: ToastType;
  onClose: (id: string | number) => void;
}

// Define icon mappings with proper typing
const icons: { [key in ToastType]: JSX.Element } = {
  success: <FaCheckCircle className="w-6 h-6 text-green-500" />,
  error: <FaTimesCircle className="w-6 h-6 text-red-500" />,
  info: <FaInfoCircle className="w-6 h-6 text-blue-500" />,
  warning: <FaExclamationCircle className="w-6 h-6 text-yellow-500" />,
};

const Toast: React.FC<ToastProps> = ({ id, message, type, onClose }) => {
  return (
    <div
      className={`flex items-center space-x-3 p-4 rounded-lg shadow-md border-l-4
                transition-all duration-300
                dark:bg-gray-800 dark:text-gray-200 bg-white text-gray-800
                ${
                  {
                    success: "border-green-500",
                    error: "border-red-500",
                    info: "border-blue-500",
                    warning: "border-yellow-500",
                  }[type]
                }
            `}
    >
      {icons[type]}
      <span>{message}</span>
      <button onClick={() => onClose(id)} className="ml-auto">
        <FaTimes className="w-5 h-5 dark:text-gray-400 dark:hover:text-gray-200 text-gray-500 hover:text-gray-700" />
      </button>
    </div>
  );
};

export default Toast;
