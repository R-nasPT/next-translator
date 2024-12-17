import { ERROR_SOUND_BASE64 } from "@/assets/audio/base64sound";
import { Dialog } from "@/components/ui";
import { cn } from "@/utils";
import React, { useEffect } from "react";
import {
  FiAlertCircle,
  FiCheckCircle,
  FiInfo,
  FiXCircle,
} from "react-icons/fi";

type NotificationType = "info" | "success" | "warning" | "error";

interface NotificationDialogProps {
  message: string;
  type?: NotificationType;
  open: boolean;
  onClose: () => void;
}

export default function NotificationDialog({
  open,
  type,
  onClose,
  message,
}: NotificationDialogProps) {
  // Function to play sound based on notification type
  const playNotificationSound = () => {
    if (!open) return;

    const soundMap: Record<NotificationType, string> = {
      success: "/sounds/success.mp3",
      warning: "/sounds/warning.mp3",
      error: ERROR_SOUND_BASE64,
      info: "/sounds/info.mp3",
    };

    const sound = new Audio(soundMap[type as keyof typeof soundMap]);
    sound.play();
  };

  // Play sound when dialog opens
  useEffect(() => {
    if (open) {
      playNotificationSound();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, type]);

  const getIconConfig = () => {
    switch (type) {
      case "success":
        return {
          icon: FiCheckCircle,
          color: "text-green-500",
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
          buttonColor: "bg-green-500 hover:bg-green-600 text-white",
        };
      case "warning":
        return {
          icon: FiAlertCircle,
          color: "text-yellow-500",
          bgColor: "bg-yellow-50",
          borderColor: "border-yellow-200",
          buttonColor: "bg-yellow-500 hover:bg-yellow-600 text-white",
        };
      case "error":
        return {
          icon: FiXCircle,
          color: "text-red-500",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
          buttonColor: "bg-red-500 hover:bg-red-600 text-white",
        };
      default:
        return {
          icon: FiInfo,
          color: "text-blue-500",
          bgColor: "bg-blue-50",
          borderColor: "border-blue-200",
          buttonColor: "bg-blue-500 hover:bg-blue-600 text-white",
        };
    }
  };

  const {
    icon: IconComponent,
    color,
    bgColor,
    borderColor,
    buttonColor,
  } = getIconConfig();

  const getTitle = () => {
    switch (type) {
      case "success":
        return "Success";
      case "warning":
        return "Warning";
      case "error":
        return "Error";
      default:
        return "Information";
    }
  };

  return (
    <Dialog open={open} onClose={onClose} desktop="sm">
      <div
        className={cn(
          "p-6 w-full text-center rounded-3xl border",
          bgColor,
          borderColor
        )}
      >
        <div className="flex justify-center items-center mb-4">
          <div className={`rounded-full ${bgColor} ${color} mb-2`}>
            <IconComponent className="w-16 h-16" />
          </div>
        </div>

        <h2 className={`text-2xl font-bold mb-4 ${color}`}>{getTitle()}</h2>

        <p className="mb-6 text-gray-700 text-base leading-relaxed">
          {message}
        </p>

        <div className="flex justify-center">
          <button
            onClick={onClose}
            className={`
                px-8 
                py-3 
                rounded-lg 
                ${buttonColor} 
                transition-all 
                duration-300 
                ease-in-out 
                hover:scale-105 
                shadow-md 
                focus:outline-none 
                focus:ring-2 
                focus:ring-offset-2
                ${color.replace("text-", "focus:ring-")}
              `}
          >
            Close
          </button>
        </div>
      </div>
    </Dialog>
  );
}
