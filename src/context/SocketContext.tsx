"use client";
import { useMessageModal } from "@/components/modal/providers/MessageModalProvider";
import {
  useState,
  useEffect,
  useRef,
  useCallback,
  createContext,
  useContext,
} from "react";
import { io, Socket } from "socket.io-client";

interface SocketContextType {
  isConnected: boolean;
  emitEvent: <T>(event: string, data?: T) => void;
  onEvent: <T>(event: string, callback: (data: T) => void) => void;
  offEvent: (event: string) => void;
  reconnect: () => void;
}

const SocketContext = createContext<SocketContextType | null>(null);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const socketRef = useRef<Socket | null>(null);

  // to show any message popup
  const { showMessageModal } = useMessageModal();

  useEffect(() => {
    const loggedInToken = localStorage.getItem("loggedInToken"); // Moved inside useEffect

    if (!loggedInToken) {
      console.error("No loggedInToken found in localStorage.");
      return;
    }

    // console.log("socketRef.current", socketRef.current);

    if (!socketRef.current || !socketRef.current.connected) {
      // Initialize the socket connection only if it's not already created
      const newSocket = io(`${process.env.REACT_APP_BASE_URL}`, {
        transports: ["websocket"], // Use WebSocket transport
        auth: {
          token: `Bearer ${loggedInToken}`,
        },
        reconnection: true, // Enable automatic reconnection
        reconnectionAttempts: 5, // Number of reconnection attempts
        reconnectionDelay: 1000, // Delay between reconnection attempts
        reconnectionDelayMax: 5000, // Maximum delay between reconnection attempts
      });

      socketRef.current = newSocket;

      // Event: Connection established
      const handleConnect = () => {
        console.log("Connected to WebSocket server");
        setIsConnected(true);
      };

      // Event: Connection lost
      const handleDisconnect = (reason: string) => {
        console.log("Disconnected from WebSocket server, Reason:", reason);
        showMessageModal("error", reason, 5000);
        setIsConnected(false);
      };

      // Event: Connection error
      const handleMessage = (error: Error) => {
        console.error("WebSocket message:", error);
        showMessageModal("error", error.message, 5000);
      };

      // Event: Connection error
      const handleError = (error: Error) => {
        console.error("WebSocket connection error:", error);
        showMessageModal("error", error.message, 5000);
      };

      // Attach event listeners
      newSocket.on("connect", handleConnect);
      newSocket.on("disconnect", handleDisconnect);
      newSocket.on("message", handleMessage);
      newSocket.on("error", handleError);

      return () => {
        newSocket.off("connect", handleConnect);
        newSocket.off("disconnect", handleDisconnect);
        newSocket.off("message", handleMessage);
        newSocket.off("error", handleError);
        newSocket.disconnect(); // Disconnect socket when unmounting.
      };
    }
  }, [showMessageModal]);

  const emitEvent = useCallback(<T,>(event: string, data?: T) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(event, data);
    } else {
      console.error("Socket is not connected.");
    }
  }, []);

  const onEvent = useCallback(
    <T,>(event: string, callback: (data: T) => void) => {
      if (socketRef.current) {
        socketRef.current.on(event, callback);
      } else {
        console.error("Socket is not initialized.");
      }
    },
    []
  );

  const offEvent = useCallback((event: string) => {
    if (socketRef.current) {
      socketRef.current.off(event);
    } else {
      console.error("Socket is not initialized.");
    }
  }, []);

  const reconnect = useCallback(() => {
    if (socketRef.current) {
      const loggedInToken = localStorage.getItem("loggedInToken");
      if (loggedInToken) {
        socketRef.current.auth = { token: `Bearer ${loggedInToken}` };
        socketRef.current.connect();
      } else {
        console.error("No loggedInToken found in localStorage.");
      }
    }
  }, []);

  return (
    <SocketContext.Provider
      value={{ isConnected, emitEvent, onEvent, offEvent, reconnect }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};
