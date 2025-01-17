import React from "react";
import PropTypes from "prop-types";
import Loading from "../Loading";

const Button = ({
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
        "flex gap-2 justify-center items-center font-medium rounded-lg px-4 py-2 text-center transition focus:outline-none";

    const buttonTypes = {
        primary: "text-white bg-blue-700 hover:bg-blue-800 dark:bg-blue-600",
        secondary:
            "text-blue-500 border border-blue-500 hover:text-white hover:bg-blue-500",
        delete:
            "text-red-500 border border-red-500 hover:text-white hover:bg-red-500",
        dismissable:
            "text-gray-800 border border-gray-300 dark:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700",
    };

    const buttonClasses = `${baseClasses} ${buttonTypes[btnType] || ""} ${disabled || isLoading ? "opacity-50 cursor-not-allowed" : ""
        } ${className}`;

    return (
        <button
            type={type}
            className={buttonClasses}
            onClick={!disabled && !isLoading ? onClick : undefined}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading && <Loading isLarge={false} />}
            {children}
        </button>
    );
};

Button.propTypes = {
    type: PropTypes.oneOf(["primary", "secondary", "delete", "dismissable"]),
    onClick: PropTypes.func,
    children: PropTypes.node.isRequired,
    isLoading: PropTypes.bool,
    className: PropTypes.string,
    disabled: PropTypes.bool,
};

export default Button;