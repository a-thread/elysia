import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  ReactNode,
} from "react";
import Toast from "./Toast";

interface ToastType {
  id: number;
  message: string;
  type: "success" | "error" | "info" | "warning";
}

interface ToastContextType {
  success: (msg: string, duration?: number) => void;
  error: (msg?: string, duration?: number) => void;
  info: (msg: string, duration?: number) => void;
  warning: (msg: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastType[]>([]);

  const removeToast = useCallback((id: number) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  const displayToast = useCallback(
    (
      message: string = "Something went wrong. Please try again.",
      type: ToastType["type"] = "success",
      duration = 3000
    ) => {
      const id = Date.now();
      setToasts((prevToasts) => [...prevToasts, { id, message, type }]);

      // Auto-dismiss after the specified duration
      setTimeout(() => removeToast(id), duration);
    },
    [removeToast]
  );

  const toast: ToastContextType = useMemo(
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

export function useToast(): ToastContextType {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
