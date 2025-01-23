import { ButtonHTMLAttributes, FC } from "react";
import Loading from "../Loading";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  btnType?: "primary" | "secondary" | "delete" | "dismissable" | "dropdown";
  isLoading?: boolean;
}

const Button: FC<ButtonProps> = ({
  type = "button",
  btnType = "primary",
  onClick,
  children,
  isLoading = false,
  className = "",
  disabled = false,
  ...props
}) => {
  const baseClasses =
    "flex gap-2 justify-center items-center font-medium px-4 py-2 text-center transition focus:outline-hidden";

  const buttonTypes = {
    primary:
      "text-white bg-leaf-green-700 dark:bg-leaf-green-600 hover:bg-leaf-green-800 dark:hover:bg-leaf-green-800 rounded-lg",
    secondary:
      "text-leaf-green-600 dark:text-leaf-green-100 border border-leaf-green-600 dark:border-leaf-green-100 hover:bg-leaf-green-100 dark:hover:text-leaf-green-600 rounded-lg",
    delete:
      "text-red-500 border border-red-500 hover:text-white hover:bg-red-500 rounded-lg",
    dismissable:
      "text-gray-800 border border-gray-300 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg",
    dropdown:
      "w-full text-leaf-green-600 dark:text-leaf-green-100 px-4 py-2 text-center hover:bg-leaf-green-100 dark:hover:text-leaf-green-600 transition focus:outline-hidden rounded-none",
  };

  const buttonClasses = `${baseClasses} ${buttonTypes[btnType] || ""} ${
    disabled || isLoading ? "opacity-50 cursor-not-allowed" : ""
  } ${className}`;

  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={disabled || isLoading}
      onClick={
        !disabled && !isLoading
          ? onClick
          : undefined
      }
      {...props}
    >
      {isLoading && <Loading isLarge={false} />}
      {children}
    </button>
  );
};

export default Button;
