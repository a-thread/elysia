import React, { useEffect } from "react";

function Toast({ id, message, type = "info", onClose }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose(id);
        }, 3000);

        return () => clearTimeout(timer);
    }, [id, onClose]);

    const typeClasses = {
        info: "bg-blue-500",
        success: "bg-green-500",
        warning: "bg-yellow-500",
        error: "bg-red-500",
    };

    return (
        <div className={`text-white px-4 py-2 rounded shadow-md mb-2 ${typeClasses[type]}`}>
            {message}
        </div>
    );
}

export default Toast;
