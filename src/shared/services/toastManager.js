import React, { createContext, useContext, useState } from "react";
import Toast from "../components/Toast";

const ToastContext = createContext();

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const displayToast = (message, type = "success") => {
        const id = Date.now();
        setToasts((prevToasts) => [...prevToasts, { id, message, type }]);
    };

    const removeToast = (id) => {
        setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
    };

    return (
        <ToastContext.Provider value={{ displayToast }}>
            {children}
            <div className="fixed top-5 right-5 z-50 flex flex-col items-end">
                {toasts.map((toast) => (
                    <Toast key={toast.id} {...toast} onClose={removeToast} />
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    return useContext(ToastContext);
}
