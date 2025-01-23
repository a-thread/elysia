import React, { ButtonHTMLAttributes, FC } from 'react';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  attributes?: React.HTMLAttributes<HTMLButtonElement>;
  listeners?: React.DOMAttributes<HTMLButtonElement>;
}

const IconButton: FC<IconButtonProps> = ({
  icon,
  onClick = () => {},
  disabled = false,
  className = '',
  title = '',
  attributes = {},
  listeners = {},
  ...props
}) => {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick(e);
      }}
      className={`inline-flex items-center p-2 w-10 h-10 justify-center text-sm rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition focus:outline-hidden focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600 ${className}`}
      disabled={disabled}
      title={title}
      {...attributes}
      {...listeners}
      {...props}
    >
      {icon}
    </button>
  );
};

export default IconButton;
