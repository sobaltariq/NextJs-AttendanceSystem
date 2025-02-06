"use client";
import React, { createContext, useContext, useState } from "react";

interface ModalContextType {
  showMessageModal: (
    type: "success" | "warning" | "error",
    message: string,
    duration?: number
  ) => Promise<void>;
}

const MessageModalContext = createContext<ModalContextType | undefined>(
  undefined
);

export const MessageModalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [modalData, setModalData] = useState<{
    type: "success" | "warning" | "error";
    message: string;
    duration: number;
  } | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Show modal and resolve the promise after the duration
  const showMessageModal = (
    type: "success" | "warning" | "error",
    message: string,
    duration: number = type === "success" ? 3000 : 5000
  ): Promise<void> => {
    return new Promise((resolve) => {
      setModalData({ type, message, duration });
      setIsVisible(true);

      // Hide the modal after the specified duration
      setTimeout(() => {
        setIsVisible(false);
        setModalData(null); // Optionally clear the modal data
        resolve(); // Resolve the promise once the modal has been hidden
      }, duration);
    });
  };

  return (
    <MessageModalContext.Provider value={{ showMessageModal }}>
      {children}
      {modalData && (
        <div
          className={`error-modal ${isVisible ? "show" : ""} alert-${
            modalData.type
          }`}
        >
          <div className="error-modal-wrapper">
            <p>{modalData.message}</p>
          </div>
        </div>
      )}
    </MessageModalContext.Provider>
  );
};

// Custom hook to access the modal functionality
export const useMessageModal = (): ModalContextType => {
  const context = useContext(MessageModalContext);
  if (!context) {
    throw new Error(
      "useMessageModal must be used within a MessageModalProvider"
    );
  }
  return context;
};
