import React from "react";

interface LoadingProps {
  message?: string;
  isLarge?: boolean;
  className?: string;
}

const Loading: React.FC<LoadingProps> = ({ message = '', isLarge = true, className = '' }) => {
  return (
    <div className={`flex items-center justify-center space-x-2 ${className}`}>
      <svg
        className={`animate-spin text-blue-500 ${isLarge ? "h-10 w-10" : "h-5 w-5"}`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4l-3 3 3-3z"
        ></path>
      </svg>
      <span>{message}</span>
    </div>
  );
};

export default Loading;
