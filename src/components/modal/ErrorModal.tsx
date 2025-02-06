"use client";
import React, { useEffect, useState } from "react";

interface ModalProps {
  type?: "success" | "warning" | "error";
  message?: string;
  duration?: number;
  onClose?: () => void;
}

const ErrorModal: React.FC<ModalProps> = ({
  type = "error",
  message = "An error occurred!",
  duration = 3000,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  const alertClass = {
    success: "alert-success",
    warning: "alert-warning",
    error: "alert-error",
  }[type];

  return (
    <div className="error-modal">
      <div className="error-modal-wrapper">
        <p className={alertClass}>{message}</p>
      </div>
    </div>
  );
};

export default ErrorModal;
