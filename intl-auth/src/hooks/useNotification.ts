import { useState } from "react";

type NotificationType = "info" | "success" | "warning" | "error";

interface Notification {
  message: string;
  type?: NotificationType;
  isOpen: boolean;
}

const useNotification = () => {
  const [notification, setNotification] = useState<Notification | null>(null);

  const showNotification = (
    message: string,
    type: NotificationType = "info",
    duration?: number
  ) => {
    setNotification({ message, type, isOpen: true });

    // Optional: Auto-close notification after specified duration
    if (duration !== undefined && duration > 0) {
      setTimeout(() => {
        setNotification((prev) => (prev ? { ...prev, isOpen: false } : null));
      }, duration);
    }
  };

  const hideNotification = () => {
    setNotification((prev) => (prev ? { ...prev, isOpen: false } : null));
  };

  return {
    notification,
    showNotification,
    hideNotification,
  };
};

export default useNotification;
