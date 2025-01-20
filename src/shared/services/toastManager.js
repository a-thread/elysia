import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";
import Toast from "../components/Toast";

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  const displayToast = useCallback(
    (message, type = "success", duration = 3000) => {
      const id = Date.now();
      setToasts((prevToasts) => [...prevToasts, { id, message, type }]);

      // Auto-dismiss after the specified duration
      setTimeout(() => removeToast(id), duration);
    },
    [removeToast]
  );

  const toast = useMemo(
    () => ({
      success: (msg, duration) => displayToast(msg, "success", duration),
      error: (msg, duration) => displayToast(msg, "error", duration),
      info: (msg, duration) => displayToast(msg, "info", duration),
      warning: (msg, duration) => displayToast(msg, "warning", duration),
    }),
    [displayToast]
  );

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed top-5 right-5 z-50 flex flex-col space-y-2">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            {...toast}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
