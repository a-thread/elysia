import { useEffect } from "react";
import { registerSW } from "virtual:pwa-register";
import { useToast } from "./Toast";

function PWAUpdateNotifier() {
  const toast = useToast();

  useEffect(() => {
    registerSW({
      immediate: true,
      onOfflineReady() {
        toast.success("Elysia is ready to work offline.");
      },
      onRegisterError(error) {
        console.error("Service worker registration failed:", error);
      },
    });
  }, [toast]);

  return null;
}

export default PWAUpdateNotifier;
